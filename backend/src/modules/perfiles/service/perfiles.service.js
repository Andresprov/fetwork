const repository = require("../repository/perfiles.repository");
// Acceso a otro modulo solo a traves de su service (seccion 5 de CLAUDE.md).
const proyectosService = require("../../proyectos/service/proyectos.service");
const { ErrorPeticion } = require("../../../lib/errores");
const { crearValidadores, idEntero } = require("../../../lib/validacion");
const almacenamiento = require("../../../lib/almacenamiento");
const { normalizarFoto } = require("../../../lib/imagen");

// Campos del estudiante que el propio estudiante puede editar. Nombres,
// apellidos, programa y semestre vienen sincronizados de Q10 y son de solo
// lectura en FETWork. La foto no va aqui: se sube como archivo (subirFoto).
const CAMPOS_EDITABLES = ["telefono", "hoja_vida_url", "portafolio_url", "github_url"];
const CAMPOS_URL = ["hoja_vida_url", "portafolio_url", "github_url"];
const CAMPOS_VISIBILIDAD = ["mostrar_experiencia", "mostrar_certificaciones", "mostrar_proyectos", "mostrar_contacto"];
const NIVELES_HABILIDAD = ["basico", "intermedio", "avanzado"];

const ETIQUETAS = {
  telefono: "El teléfono",
  hoja_vida_url: "La URL de la hoja de vida",
  portafolio_url: "La URL del portafolio",
  github_url: "La URL de GitHub",
  cargo: "El cargo",
  entidad: "La entidad",
  direccion: "La dirección",
  jefe_inmediato: "El jefe inmediato",
  dedicacion: "La dedicación",
  descripcion: "La descripción",
  nombre: "El nombre",
  entidad_emisora: "La entidad emisora",
  duracion: "La duración",
  modalidad: "La modalidad",
};

const { texto, url, telefono, fecha } = crearValidadores(ETIQUETAS);

// ---------- Perfil ----------

async function obtenerEstudianteAutenticado(id_usuario) {
  const estudiante = await repository.findEstudiantePorUsuario(id_usuario);
  if (!estudiante) {
    throw new ErrorPeticion(404, "No se encontró un perfil de estudiante asociado a esta cuenta.");
  }
  return estudiante;
}

function serializarPerfil(e) {
  return {
    id_estudiante: e.id_estudiante,
    nombres: e.nombres,
    apellidos: e.apellidos,
    correo: e.usuario.correo,
    codigo_institucional_q10: e.usuario.codigo_institucional_q10,
    programa: { id_programa: e.programa.id_programa, nombre: e.programa.nombre },
    semestre: e.semestre,
    telefono: e.telefono,
    foto_url: almacenamiento.urlPublica(e.foto_url),
    hoja_vida_url: e.hoja_vida_url,
    portafolio_url: e.portafolio_url,
    github_url: e.github_url,
    visibilidad: {
      mostrar_experiencia: e.mostrar_experiencia,
      mostrar_certificaciones: e.mostrar_certificaciones,
      mostrar_proyectos: e.mostrar_proyectos,
      mostrar_contacto: e.mostrar_contacto,
    },
    resumen: {
      habilidades: e._count.habilidades,
      experiencias: e._count.experiencias,
      certificaciones: e._count.certificaciones,
      proyectos: e._count.proyectos,
    },
  };
}

// Interfaz para otros modulos (proyectos, hoja de vida): resuelve el
// estudiante dueño de la sesion sin que accedan a su tabla directamente.
async function obtenerIdEstudiante(id_usuario) {
  return (await obtenerEstudianteAutenticado(id_usuario)).id_estudiante;
}

async function obtenerMiPerfil(id_usuario) {
  return serializarPerfil(await obtenerEstudianteAutenticado(id_usuario));
}

async function actualizarMiPerfil(id_usuario, body) {
  const noEditables = Object.keys(body).filter((k) => !CAMPOS_EDITABLES.includes(k));
  if (noEditables.length) {
    throw new ErrorPeticion(
      400,
      `Estos campos no se pueden editar desde FETWork: ${noEditables.join(", ")}. Los datos académicos se sincronizan desde Q10.`
    );
  }

  const data = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (!(campo in body)) continue;
    data[campo] = CAMPOS_URL.includes(campo) ? url(body[campo], campo) : telefono(body[campo]);
  }

  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  const actualizado = await repository.actualizarEstudiante(estudiante.id_estudiante, data);
  return serializarPerfil(actualizado);
}

// ---------- Foto de perfil ----------

const MAX_FOTO_BYTES = 2 * 1024 * 1024;

// El tipo se decide por la firma del archivo, no por el nombre ni por el
// Content-Type que manda el navegador. Se guarda siempre como JPEG
// normalizado (lib/imagen.js).
function esImagenPermitida(buffer) {
  const jpg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  return jpg || png || webp;
}

async function subirFoto(id_usuario, archivo) {
  if (!archivo?.buffer?.length) {
    throw new ErrorPeticion(400, "Selecciona una imagen para tu foto de perfil.");
  }
  if (archivo.buffer.length > MAX_FOTO_BYTES) {
    throw new ErrorPeticion(400, "La foto no puede pesar más de 2 MB.");
  }
  if (!esImagenPermitida(archivo.buffer)) {
    throw new ErrorPeticion(400, "La foto debe ser una imagen JPG, PNG o WEBP.");
  }
  let foto;
  try {
    foto = await normalizarFoto(archivo.buffer);
  } catch {
    throw new ErrorPeticion(400, "No fue posible leer la imagen. Prueba con otra foto.");
  }

  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  const referencia = await almacenamiento.guardar(foto.buffer, { carpeta: "fotos", extension: "jpg" });
  let actualizado;
  try {
    actualizado = await repository.actualizarEstudiante(estudiante.id_estudiante, { foto_url: referencia });
  } catch (err) {
    await almacenamiento.eliminar(referencia);
    throw err;
  }
  await almacenamiento.eliminar(estudiante.foto_url).catch(() => {});
  return serializarPerfil(actualizado);
}

async function eliminarFoto(id_usuario) {
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  const actualizado = await repository.actualizarEstudiante(estudiante.id_estudiante, { foto_url: null });
  await almacenamiento.eliminar(estudiante.foto_url).catch(() => {});
  return serializarPerfil(actualizado);
}

async function actualizarVisibilidad(id_usuario, body) {
  const data = {};
  for (const campo of CAMPOS_VISIBILIDAD) {
    if (!(campo in body)) continue;
    if (typeof body[campo] !== "boolean") {
      throw new ErrorPeticion(400, "Los valores de visibilidad deben ser verdadero o falso.");
    }
    data[campo] = body[campo];
  }
  if (Object.keys(data).length === 0) {
    throw new ErrorPeticion(400, "Debes enviar al menos una opción de visibilidad.");
  }

  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  const actualizado = await repository.actualizarEstudiante(estudiante.id_estudiante, data);
  return serializarPerfil(actualizado).visibilidad;
}

// ---------- Habilidades ----------

function serializarHabilidadEstudiante(eh) {
  return {
    id_habilidad: eh.id_habilidad,
    nombre: eh.habilidad.nombre,
    nivel: eh.nivel,
    categoria: { id_categoria: eh.habilidad.categoria.id_categoria, nombre: eh.habilidad.categoria.nombre },
  };
}

async function obtenerCatalogoHabilidades() {
  const categorias = await repository.listarCatalogoHabilidades();
  return categorias.map((c) => ({
    id_categoria: c.id_categoria,
    nombre: c.nombre,
    habilidades: c.habilidades.map((h) => ({ id_habilidad: h.id_habilidad, nombre: h.nombre })),
  }));
}

async function listarMisHabilidades(id_usuario) {
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  const filas = await repository.listarHabilidadesEstudiante(estudiante.id_estudiante);
  return filas.map(serializarHabilidadEstudiante);
}

async function agregarHabilidad(id_usuario, { id_habilidad, nivel } = {}) {
  const idHabilidad = idEntero(id_habilidad, "La habilidad seleccionada");
  let nivelLimpio = null;
  if (nivel !== undefined && nivel !== null && nivel !== "") {
    if (!NIVELES_HABILIDAD.includes(nivel)) {
      throw new ErrorPeticion(400, "El nivel debe ser básico, intermedio o avanzado.");
    }
    nivelLimpio = nivel;
  }

  if (!(await repository.findHabilidad(idHabilidad))) {
    throw new ErrorPeticion(404, "La habilidad seleccionada no existe en el catálogo.");
  }

  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  const fila = await repository.guardarHabilidadEstudiante(estudiante.id_estudiante, idHabilidad, nivelLimpio);
  return serializarHabilidadEstudiante(fila);
}

async function quitarHabilidad(id_usuario, idHabilidadParam) {
  const idHabilidad = idEntero(idHabilidadParam, "La habilidad");
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  const eliminadas = await repository.eliminarHabilidadEstudiante(estudiante.id_estudiante, idHabilidad);
  if (!eliminadas) throw new ErrorPeticion(404, "Esa habilidad no está registrada en tu perfil.");
}

// ---------- Experiencias ----------

function validarExperiencia(body = {}) {
  const data = {
    cargo: texto(body.cargo, "cargo", { requerido: true, max: 150 }),
    entidad: texto(body.entidad, "entidad", { requerido: true, max: 150 }),
    direccion: texto(body.direccion, "direccion", { max: 200 }),
    telefono: telefono(body.telefono),
    jefe_inmediato: texto(body.jefe_inmediato, "jefe_inmediato", { max: 150 }),
    dedicacion: texto(body.dedicacion, "dedicacion", { max: 100 }),
    fecha_inicio: fecha(body.fecha_inicio, "La fecha de inicio"),
    fecha_fin: fecha(body.fecha_fin, "La fecha de finalización"),
    descripcion: texto(body.descripcion, "descripcion", { max: 2000 }),
  };
  if (data.fecha_inicio && data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
    throw new ErrorPeticion(400, "La fecha de finalización no puede ser anterior a la fecha de inicio.");
  }
  return data;
}

async function listarMisExperiencias(id_usuario) {
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  return repository.listarExperiencias(estudiante.id_estudiante);
}

async function crearExperiencia(id_usuario, body) {
  const data = validarExperiencia(body);
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  return repository.crearExperiencia(estudiante.id_estudiante, data);
}

async function actualizarExperiencia(id_usuario, idParam, body) {
  const id = idEntero(idParam, "La experiencia");
  const data = validarExperiencia(body);
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  if (!(await repository.findExperiencia(estudiante.id_estudiante, id))) {
    throw new ErrorPeticion(404, "La experiencia no existe o no pertenece a tu perfil.");
  }
  return repository.actualizarExperiencia(id, data);
}

async function eliminarExperiencia(id_usuario, idParam) {
  const id = idEntero(idParam, "La experiencia");
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  if (!(await repository.eliminarExperiencia(estudiante.id_estudiante, id))) {
    throw new ErrorPeticion(404, "La experiencia no existe o no pertenece a tu perfil.");
  }
}

// ---------- Certificaciones ----------

function validarCertificacion(body = {}) {
  return {
    nombre: texto(body.nombre, "nombre", { requerido: true, max: 200 }),
    entidad_emisora: texto(body.entidad_emisora, "entidad_emisora", { max: 150 }),
    fecha: fecha(body.fecha, "La fecha"),
    duracion: texto(body.duracion, "duracion", { max: 50 }),
    modalidad: texto(body.modalidad, "modalidad", { max: 50 }),
  };
}

async function listarMisCertificaciones(id_usuario) {
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  return repository.listarCertificaciones(estudiante.id_estudiante);
}

async function crearCertificacion(id_usuario, body) {
  const data = validarCertificacion(body);
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  return repository.crearCertificacion(estudiante.id_estudiante, data);
}

async function actualizarCertificacion(id_usuario, idParam, body) {
  const id = idEntero(idParam, "La certificación");
  const data = validarCertificacion(body);
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  if (!(await repository.findCertificacion(estudiante.id_estudiante, id))) {
    throw new ErrorPeticion(404, "La certificación no existe o no pertenece a tu perfil.");
  }
  return repository.actualizarCertificacion(id, data);
}

async function eliminarCertificacion(id_usuario, idParam) {
  const id = idEntero(idParam, "La certificación");
  const estudiante = await obtenerEstudianteAutenticado(id_usuario);
  if (!(await repository.eliminarCertificacion(estudiante.id_estudiante, id))) {
    throw new ErrorPeticion(404, "La certificación no existe o no pertenece a tu perfil.");
  }
}

// ---------- Vista publica (CU-07; reutilizada por empresa en CU-16/CU-17) ----------
//
// Se arma con una lista blanca explicita de campos. datos_personales_cv,
// titulos_academicos, actividades_investigativas y referencias nunca se
// consultan aqui: son privados sin importar la configuracion de visibilidad.
// De las experiencias tampoco se exponen datos de terceros (telefono,
// direccion, jefe inmediato).
async function obtenerPerfilPublico(idEstudianteParam) {
  const id = idEntero(idEstudianteParam, "El perfil solicitado");
  const e = await repository.findEstudiantePorId(id);
  if (!e || !e.usuario.activo) {
    throw new ErrorPeticion(404, "El perfil solicitado no existe o no está disponible.");
  }

  const habilidades = (await repository.listarHabilidadesEstudiante(e.id_estudiante)).map(serializarHabilidadEstudiante);

  const perfil = {
    id_estudiante: e.id_estudiante,
    nombres: e.nombres,
    apellidos: e.apellidos,
    programa: e.programa.nombre,
    semestre: e.semestre,
    foto_url: almacenamiento.urlPublica(e.foto_url),
    habilidades,
    secciones: {
      experiencia: e.mostrar_experiencia,
      certificaciones: e.mostrar_certificaciones,
      proyectos: e.mostrar_proyectos,
      contacto: e.mostrar_contacto,
    },
    experiencias: null,
    certificaciones: null,
    proyectos: null,
    enlaces: null,
    contacto: null,
  };

  if (e.mostrar_experiencia) {
    const experiencias = await repository.listarExperiencias(e.id_estudiante);
    perfil.experiencias = experiencias.map((x) => ({
      id_experiencia: x.id_experiencia,
      cargo: x.cargo,
      entidad: x.entidad,
      dedicacion: x.dedicacion,
      fecha_inicio: x.fecha_inicio,
      fecha_fin: x.fecha_fin,
      descripcion: x.descripcion,
    }));
  }

  if (e.mostrar_certificaciones) {
    const certificaciones = await repository.listarCertificaciones(e.id_estudiante);
    perfil.certificaciones = certificaciones.map((c) => ({
      id_certificacion: c.id_certificacion,
      nombre: c.nombre,
      entidad_emisora: c.entidad_emisora,
      fecha: c.fecha,
      duracion: c.duracion,
      modalidad: c.modalidad,
    }));
  }

  if (e.mostrar_proyectos) {
    perfil.proyectos = await proyectosService.listarPublicosPorEstudiante(e.id_estudiante);
    perfil.enlaces = { github_url: e.github_url, portafolio_url: e.portafolio_url };
  }

  if (e.mostrar_contacto) {
    perfil.contacto = { correo: e.usuario.correo, telefono: e.telefono, hoja_vida_url: e.hoja_vida_url };
  }

  return perfil;
}

module.exports = {
  obtenerIdEstudiante,
  obtenerEstudianteAutenticado,
  serializarHabilidadEstudiante,
  obtenerMiPerfil,
  actualizarMiPerfil,
  subirFoto,
  eliminarFoto,
  actualizarVisibilidad,
  obtenerCatalogoHabilidades,
  listarMisHabilidades,
  agregarHabilidad,
  quitarHabilidad,
  listarMisExperiencias,
  crearExperiencia,
  actualizarExperiencia,
  eliminarExperiencia,
  listarMisCertificaciones,
  crearCertificacion,
  actualizarCertificacion,
  eliminarCertificacion,
  obtenerPerfilPublico,
};

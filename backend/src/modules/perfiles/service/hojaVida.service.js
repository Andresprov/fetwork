// Hoja de vida institucional PA-GTH-F-10: CU-08 (diligenciar) y CU-09
// (exportar). Seccion 7.3 de la arquitectura: datos personales, formacion
// academica, experiencia investigativa y referencias viven en tablas propias;
// la experiencia laboral y los cursos reutilizan experiencias y
// certificaciones del perfil.
//
// Todo lo de este service es PRIVADO: no se expone en el perfil publico ni en
// busquedas de empresas, sin importar la configuracion de visibilidad.
const repository = require("../repository/hojaVida.repository");
const perfilesRepository = require("../repository/perfiles.repository");
const perfilesService = require("./perfiles.service");
const { ErrorPeticion } = require("../../../lib/errores");
const { crearValidadores, idEntero } = require("../../../lib/validacion");

const NIVELES_TITULO = ["tecnico", "tecnologo", "pregrado", "especializacion", "maestria"];
const TIPOS_ACTIVIDAD = ["grupo_investigacion", "proyecto", "tutoria", "jurado", "publicacion", "ponencia", "organizacion"];
const TIPOS_REFERENCIA = ["familiar", "personal"];
const ESTADOS_CIVILES = ["Soltero(a)", "Casado(a)", "Unión libre", "Separado(a)", "Divorciado(a)", "Viudo(a)"];
const GRUPOS_RH = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const MODALIDADES_ESTUDIO = ["Presencial", "Virtual", "A distancia", "Híbrida"];

const CAMPOS_DATOS_PERSONALES = [
  "documento_identidad",
  "fecha_nacimiento",
  "lugar_nacimiento",
  "estado_civil",
  "lugar_residencia",
  "direccion",
  "rh",
  "contacto_emergencia_nombre",
  "contacto_emergencia_telefono",
];

const ETIQUETAS = {
  documento_identidad: "El documento de identidad",
  lugar_nacimiento: "El lugar de nacimiento",
  estado_civil: "El estado civil",
  lugar_residencia: "La ciudad de residencia",
  direccion: "La dirección",
  rh: "El grupo sanguíneo",
  contacto_emergencia_nombre: "El nombre del contacto de emergencia",
  contacto_emergencia_telefono: "El teléfono del contacto de emergencia",
  nivel: "El nivel del título",
  titulo_obtenido: "El título obtenido",
  institucion: "La institución",
  pais_ciudad: "El país y ciudad",
  modalidad_estudio: "La modalidad de estudio",
  tipo_actividad: "El tipo de actividad",
  descripcion: "La descripción",
  periodo: "El periodo",
  tipo_referencia: "El tipo de referencia",
  nombre_completo: "El nombre completo",
  profesion_ocupacion: "La profesión u ocupación",
  parentesco: "El parentesco",
  telefono: "El teléfono",
};

const { texto, telefono, fecha, opcion } = crearValidadores(ETIQUETAS);

// ---------- Validaciones ----------

function validarDatosPersonales(body = {}) {
  const desconocidos = Object.keys(body).filter((k) => !CAMPOS_DATOS_PERSONALES.includes(k));
  if (desconocidos.length) {
    throw new ErrorPeticion(400, `Campos no reconocidos: ${desconocidos.join(", ")}.`);
  }

  const validadores = {
    documento_identidad: (v) => {
      const limpio = texto(v, "documento_identidad", { max: 20 });
      if (limpio !== null && !/^[0-9A-Za-z.-]{5,20}$/.test(limpio)) {
        throw new ErrorPeticion(400, "El documento de identidad solo puede contener números, letras, puntos y guiones.");
      }
      return limpio;
    },
    fecha_nacimiento: (v) => {
      const d = fecha(v, "La fecha de nacimiento");
      if (d) {
        const limite = new Date();
        limite.setUTCFullYear(limite.getUTCFullYear() - 14);
        if (d > limite) throw new ErrorPeticion(400, "La fecha de nacimiento no es válida: debes tener al menos 14 años.");
        if (d.getUTCFullYear() < 1900) throw new ErrorPeticion(400, "La fecha de nacimiento no es válida.");
      }
      return d;
    },
    lugar_nacimiento: (v) => texto(v, "lugar_nacimiento", { max: 120 }),
    estado_civil: (v) => opcion(v, "estado_civil", ESTADOS_CIVILES),
    lugar_residencia: (v) => texto(v, "lugar_residencia", { max: 120 }),
    direccion: (v) => texto(v, "direccion", { max: 200 }),
    rh: (v) => opcion(v, "rh", GRUPOS_RH),
    contacto_emergencia_nombre: (v) => texto(v, "contacto_emergencia_nombre", { max: 150 }),
    contacto_emergencia_telefono: (v) => telefono(v, "contacto_emergencia_telefono"),
  };

  const data = {};
  for (const campo of CAMPOS_DATOS_PERSONALES) {
    if (campo in body) data[campo] = validadores[campo](body[campo]);
  }
  return data;
}

function validarTitulo(body = {}) {
  return {
    nivel: opcion(body.nivel, "nivel", NIVELES_TITULO, { requerido: true }),
    titulo_obtenido: texto(body.titulo_obtenido, "titulo_obtenido", { requerido: true, max: 200 }),
    institucion: texto(body.institucion, "institucion", { requerido: true, max: 200 }),
    pais_ciudad: texto(body.pais_ciudad, "pais_ciudad", { max: 120 }),
    fecha_grado: fecha(body.fecha_grado, "La fecha de grado"),
    modalidad_estudio: opcion(body.modalidad_estudio, "modalidad_estudio", MODALIDADES_ESTUDIO),
  };
}

function validarActividad(body = {}) {
  return {
    tipo: opcion(body.tipo, "tipo_actividad", TIPOS_ACTIVIDAD, { requerido: true }),
    descripcion: texto(body.descripcion, "descripcion", { requerido: true, max: 1000 }),
    periodo: texto(body.periodo, "periodo", { max: 60 }),
  };
}

function validarReferencia(body = {}) {
  const tipo = opcion(body.tipo, "tipo_referencia", TIPOS_REFERENCIA, { requerido: true });
  return {
    tipo,
    nombre_completo: texto(body.nombre_completo, "nombre_completo", { requerido: true, max: 150 }),
    profesion_ocupacion: texto(body.profesion_ocupacion, "profesion_ocupacion", { max: 120 }),
    // El parentesco solo aplica a referencias familiares (diccionario de datos 7.2).
    parentesco: tipo === "familiar" ? texto(body.parentesco, "parentesco", { requerido: true, max: 60 }) : null,
    telefono: (() => {
      const t = telefono(body.telefono);
      if (!t) throw new ErrorPeticion(400, "El teléfono de la referencia es obligatorio.");
      return t;
    })(),
  };
}

const VALIDADORES = { titulos: validarTitulo, actividades: validarActividad, referencias: validarReferencia };

const NO_ENCONTRADO = {
  titulos: "El título no existe o no pertenece a tu hoja de vida.",
  actividades: "La actividad no existe o no pertenece a tu hoja de vida.",
  referencias: "La referencia no existe o no pertenece a tu hoja de vida.",
};

// ---------- Completitud por paso del formulario ----------
//
// 1. Datos personales: campos del bloque 1 diligenciados (+ teléfono del perfil).
// 2. Formación: el programa en curso viene de Q10 (50 %); se completa con al
//    menos un título previo o un curso/certificación.
// 3. Experiencia laboral: promedio de campos exigidos por el formato en cada
//    experiencia registrada.
// 4. Experiencia investigativa: al menos una actividad registrada.
// 5. Referencias: al menos una familiar y una personal.
const CAMPOS_EXPERIENCIA_FORMATO = ["cargo", "entidad", "direccion", "telefono", "jefe_inmediato", "dedicacion", "fecha_inicio", "descripcion"];

function calcularCompletitud({ estudiante, datos, titulos, experiencias, certificaciones, actividades, referencias }) {
  const camposPersonales = [...CAMPOS_DATOS_PERSONALES.map((c) => datos?.[c]), estudiante.telefono];
  const personales = Math.round((camposPersonales.filter(Boolean).length / camposPersonales.length) * 100);

  const formacion = titulos.length > 0 || certificaciones.length > 0 ? 100 : 50;

  let experiencia = 0;
  if (experiencias.length) {
    const llenos = experiencias.reduce(
      (acc, e) => acc + CAMPOS_EXPERIENCIA_FORMATO.filter((c) => Boolean(e[c])).length,
      0
    );
    experiencia = Math.round((llenos / (experiencias.length * CAMPOS_EXPERIENCIA_FORMATO.length)) * 100);
  }

  const investigativa = actividades.length > 0 ? 100 : 0;

  const referenciasPct =
    (referencias.some((r) => r.tipo === "familiar") ? 50 : 0) + (referencias.some((r) => r.tipo === "personal") ? 50 : 0);

  const pasos = { datos_personales: personales, formacion, experiencia, investigativa, referencias: referenciasPct };
  const valores = Object.values(pasos);
  return { pasos, total: Math.round(valores.reduce((a, b) => a + b, 0) / valores.length) };
}

// ---------- Lectura consolidada ----------

async function cargarTodo(id_usuario) {
  const estudiante = await perfilesService.obtenerEstudianteAutenticado(id_usuario);
  const id = estudiante.id_estudiante;
  const [datos, titulos, actividades, referencias, experiencias, certificaciones, habilidades] = await Promise.all([
    repository.findDatosPersonales(id),
    repository.listar("titulos", id),
    repository.listar("actividades", id),
    repository.listar("referencias", id),
    perfilesRepository.listarExperiencias(id),
    perfilesRepository.listarCertificaciones(id),
    perfilesRepository.listarHabilidadesEstudiante(id),
  ]);
  return {
    estudiante,
    datos,
    titulos,
    actividades,
    referencias,
    experiencias,
    certificaciones,
    habilidades: habilidades.map(perfilesService.serializarHabilidadEstudiante),
  };
}

function serializarDatosPersonales(datos) {
  return Object.fromEntries(CAMPOS_DATOS_PERSONALES.map((c) => [c, datos?.[c] ?? null]));
}

async function obtenerHojaVida(id_usuario) {
  const todo = await cargarTodo(id_usuario);
  return {
    datos_personales: serializarDatosPersonales(todo.datos),
    titulos: todo.titulos,
    actividades: todo.actividades,
    referencias: todo.referencias,
    experiencias: todo.experiencias,
    certificaciones: todo.certificaciones,
    habilidades: todo.habilidades,
    completitud: calcularCompletitud(todo),
  };
}

// ---------- Escritura ----------

async function guardarDatosPersonales(id_usuario, body) {
  const data = validarDatosPersonales(body);
  const idEstudiante = await perfilesService.obtenerIdEstudiante(id_usuario);
  return serializarDatosPersonales(await repository.guardarDatosPersonales(idEstudiante, data));
}

async function listarRecurso(recurso, id_usuario) {
  const idEstudiante = await perfilesService.obtenerIdEstudiante(id_usuario);
  return repository.listar(recurso, idEstudiante);
}

async function crearRecurso(recurso, id_usuario, body) {
  const data = VALIDADORES[recurso](body);
  const idEstudiante = await perfilesService.obtenerIdEstudiante(id_usuario);
  return repository.crear(recurso, idEstudiante, data);
}

async function actualizarRecurso(recurso, id_usuario, idParam, body) {
  const id = idEntero(idParam, "El registro");
  const data = VALIDADORES[recurso](body);
  const idEstudiante = await perfilesService.obtenerIdEstudiante(id_usuario);
  if (!(await repository.buscar(recurso, idEstudiante, id))) throw new ErrorPeticion(404, NO_ENCONTRADO[recurso]);
  return repository.actualizar(recurso, id, data);
}

async function eliminarRecurso(recurso, id_usuario, idParam) {
  const id = idEntero(idParam, "El registro");
  const idEstudiante = await perfilesService.obtenerIdEstudiante(id_usuario);
  if (!(await repository.eliminar(recurso, idEstudiante, id))) throw new ErrorPeticion(404, NO_ENCONTRADO[recurso]);
}

module.exports = {
  cargarTodo,
  obtenerHojaVida,
  guardarDatosPersonales,
  listarRecurso,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
};

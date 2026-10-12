// Modulo proyectos: CU-04 (gestionar proyectos y portafolio) y CU-05
// (vincular repositorio de GitHub a cada proyecto). La lectura publica la
// consume el modulo perfiles para la vista publica (CU-07/CU-16/CU-17).
const repository = require("../repository/proyectos.repository");
const { ErrorPeticion } = require("../../../lib/errores");
const { crearValidadores, idEntero } = require("../../../lib/validacion");

const TIPOS_ENLACE = ["demo", "video", "documentacion", "articulo", "otro"];
const MAX_TECNOLOGIAS = 20;
const MAX_ENLACES = 10;

const ETIQUETAS = {
  nombre: "El nombre del proyecto",
  descripcion: "La descripción",
  repositorio_github_url: "El enlace del repositorio",
  tecnologia: "Cada tecnología",
  enlace_url: "El enlace",
  enlace_tipo: "El tipo de enlace",
};

const { texto, url, fecha, opcion } = crearValidadores(ETIQUETAS);

// Se requiere en tiempo de ejecucion para evitar la dependencia circular
// perfiles.service <-> proyectos.service al cargar los modulos.
function perfilesService() {
  return require("../../perfiles/service/perfiles.service");
}

function serializar(p) {
  return {
    id_proyecto: p.id_proyecto,
    nombre: p.nombre,
    descripcion: p.descripcion,
    fecha: p.fecha,
    repositorio_github_url: p.repositorio_github_url,
    tecnologias: p.tecnologias.map((t) => t.tecnologia),
    enlaces: p.enlaces.map((e) => ({ url: e.url, tipo: e.tipo })),
  };
}

function urlGithub(valor) {
  const limpio = url(valor, "repositorio_github_url");
  if (limpio === null) return null;
  const host = new URL(limpio).hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") {
    throw new ErrorPeticion(400, "El enlace del repositorio debe apuntar a github.com.");
  }
  return limpio;
}

function validarTecnologias(valor) {
  if (valor === undefined || valor === null) return [];
  if (!Array.isArray(valor)) throw new ErrorPeticion(400, "Las tecnologías deben enviarse como una lista.");
  const vistas = new Set();
  const resultado = [];
  for (const item of valor) {
    const limpio = texto(item, "tecnologia", { max: 50 });
    if (limpio === null) continue;
    const clave = limpio.toLowerCase();
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    resultado.push(limpio);
  }
  if (resultado.length > MAX_TECNOLOGIAS) {
    throw new ErrorPeticion(400, `Puedes registrar máximo ${MAX_TECNOLOGIAS} tecnologías por proyecto.`);
  }
  return resultado;
}

function validarEnlaces(valor) {
  if (valor === undefined || valor === null) return [];
  if (!Array.isArray(valor)) throw new ErrorPeticion(400, "Los enlaces deben enviarse como una lista.");
  if (valor.length > MAX_ENLACES) {
    throw new ErrorPeticion(400, `Puedes registrar máximo ${MAX_ENLACES} enlaces por proyecto.`);
  }
  return valor
    .filter((e) => e && String(e.url || "").trim() !== "")
    .map((e) => ({
      url: url(e.url, "enlace_url", { requerido: true }),
      tipo: opcion(e.tipo, "enlace_tipo", TIPOS_ENLACE) || "otro",
    }));
}

function validarProyecto(body = {}) {
  return {
    nombre: texto(body.nombre, "nombre", { requerido: true, max: 150 }),
    descripcion: texto(body.descripcion, "descripcion", { max: 3000 }),
    fecha: fecha(body.fecha, "La fecha del proyecto"),
    repositorio_github_url: urlGithub(body.repositorio_github_url),
    tecnologias: validarTecnologias(body.tecnologias),
    enlaces: validarEnlaces(body.enlaces),
  };
}

const NO_ENCONTRADO = "El proyecto no existe o no pertenece a tu perfil.";

async function listarMisProyectos(id_usuario) {
  const idEstudiante = await perfilesService().obtenerIdEstudiante(id_usuario);
  return (await repository.listarPorEstudiante(idEstudiante)).map(serializar);
}

async function obtenerMiProyecto(id_usuario, idParam) {
  const id = idEntero(idParam, "El proyecto");
  const idEstudiante = await perfilesService().obtenerIdEstudiante(id_usuario);
  const proyecto = await repository.findProyecto(idEstudiante, id);
  if (!proyecto) throw new ErrorPeticion(404, NO_ENCONTRADO);
  return serializar(proyecto);
}

async function crearProyecto(id_usuario, body) {
  const data = validarProyecto(body);
  const idEstudiante = await perfilesService().obtenerIdEstudiante(id_usuario);
  return serializar(await repository.crearProyecto(idEstudiante, data));
}

async function actualizarProyecto(id_usuario, idParam, body) {
  const id = idEntero(idParam, "El proyecto");
  const data = validarProyecto(body);
  const idEstudiante = await perfilesService().obtenerIdEstudiante(id_usuario);
  if (!(await repository.findProyecto(idEstudiante, id))) throw new ErrorPeticion(404, NO_ENCONTRADO);
  return serializar(await repository.actualizarProyecto(id, data));
}

async function eliminarProyecto(id_usuario, idParam) {
  const id = idEntero(idParam, "El proyecto");
  const idEstudiante = await perfilesService().obtenerIdEstudiante(id_usuario);
  if (!(await repository.eliminarProyecto(idEstudiante, id))) throw new ErrorPeticion(404, NO_ENCONTRADO);
}

// Interfaz hacia otros modulos: lectura usada por la vista publica del perfil.
async function listarPublicosPorEstudiante(id_estudiante) {
  return (await repository.listarPorEstudiante(id_estudiante)).map(serializar);
}

module.exports = {
  TIPOS_ENLACE,
  listarMisProyectos,
  obtenerMiProyecto,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  listarPublicosPorEstudiante,
};

// Interfaz publica del modulo proyectos hacia otros modulos. Por ahora solo
// expone la lectura que necesita la vista publica del perfil; el CRUD de
// proyectos se implementa junto con sus rutas.
const repository = require("../repository/proyectos.repository");

async function listarPublicosPorEstudiante(id_estudiante) {
  const proyectos = await repository.listarPorEstudiante(id_estudiante);
  return proyectos.map((p) => ({
    id_proyecto: p.id_proyecto,
    nombre: p.nombre,
    descripcion: p.descripcion,
    fecha: p.fecha,
    repositorio_github_url: p.repositorio_github_url,
    tecnologias: p.tecnologias.map((t) => t.tecnologia),
    enlaces: p.enlaces.map((e) => ({ url: e.url, tipo: e.tipo })),
  }));
}

module.exports = { listarPublicosPorEstudiante };

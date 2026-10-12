const service = require("../service/proyectos.service");

async function getMisProyectos(req, res) {
  res.json({ proyectos: await service.listarMisProyectos(req.usuario.id_usuario) });
}

async function getMiProyecto(req, res) {
  res.json(await service.obtenerMiProyecto(req.usuario.id_usuario, req.params.id));
}

async function postProyecto(req, res) {
  res.status(201).json(await service.crearProyecto(req.usuario.id_usuario, req.body || {}));
}

async function putProyecto(req, res) {
  res.json(await service.actualizarProyecto(req.usuario.id_usuario, req.params.id, req.body || {}));
}

async function deleteProyecto(req, res) {
  await service.eliminarProyecto(req.usuario.id_usuario, req.params.id);
  res.status(204).end();
}

module.exports = { getMisProyectos, getMiProyecto, postProyecto, putProyecto, deleteProyecto };

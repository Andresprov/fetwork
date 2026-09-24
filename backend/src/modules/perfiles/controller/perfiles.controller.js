const service = require("../service/perfiles.service");

async function getMiPerfil(req, res) {
  res.json(await service.obtenerMiPerfil(req.usuario.id_usuario));
}

async function putMiPerfil(req, res) {
  res.json(await service.actualizarMiPerfil(req.usuario.id_usuario, req.body || {}));
}

async function putVisibilidad(req, res) {
  res.json(await service.actualizarVisibilidad(req.usuario.id_usuario, req.body || {}));
}

async function getCatalogoHabilidades(req, res) {
  res.json({ categorias: await service.obtenerCatalogoHabilidades() });
}

async function getMisHabilidades(req, res) {
  res.json({ habilidades: await service.listarMisHabilidades(req.usuario.id_usuario) });
}

async function postHabilidad(req, res) {
  res.status(201).json(await service.agregarHabilidad(req.usuario.id_usuario, req.body || {}));
}

async function deleteHabilidad(req, res) {
  await service.quitarHabilidad(req.usuario.id_usuario, req.params.idHabilidad);
  res.status(204).end();
}

async function getExperiencias(req, res) {
  res.json({ experiencias: await service.listarMisExperiencias(req.usuario.id_usuario) });
}

async function postExperiencia(req, res) {
  res.status(201).json(await service.crearExperiencia(req.usuario.id_usuario, req.body || {}));
}

async function putExperiencia(req, res) {
  res.json(await service.actualizarExperiencia(req.usuario.id_usuario, req.params.id, req.body || {}));
}

async function deleteExperiencia(req, res) {
  await service.eliminarExperiencia(req.usuario.id_usuario, req.params.id);
  res.status(204).end();
}

async function getCertificaciones(req, res) {
  res.json({ certificaciones: await service.listarMisCertificaciones(req.usuario.id_usuario) });
}

async function postCertificacion(req, res) {
  res.status(201).json(await service.crearCertificacion(req.usuario.id_usuario, req.body || {}));
}

async function putCertificacion(req, res) {
  res.json(await service.actualizarCertificacion(req.usuario.id_usuario, req.params.id, req.body || {}));
}

async function deleteCertificacion(req, res) {
  await service.eliminarCertificacion(req.usuario.id_usuario, req.params.id);
  res.status(204).end();
}

async function getPerfilPublico(req, res) {
  res.json(await service.obtenerPerfilPublico(req.params.idEstudiante));
}

module.exports = {
  getMiPerfil,
  putMiPerfil,
  putVisibilidad,
  getCatalogoHabilidades,
  getMisHabilidades,
  postHabilidad,
  deleteHabilidad,
  getExperiencias,
  postExperiencia,
  putExperiencia,
  deleteExperiencia,
  getCertificaciones,
  postCertificacion,
  putCertificacion,
  deleteCertificacion,
  getPerfilPublico,
};

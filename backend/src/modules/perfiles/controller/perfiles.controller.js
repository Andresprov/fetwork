const service = require("../service/perfiles.service");

async function getMiPerfil(req, res) {
  res.json(await service.obtenerMiPerfil(req.usuario.id_usuario));
}

async function putMiPerfil(req, res) {
  res.json(await service.actualizarMiPerfil(req.usuario.id_usuario, req.body || {}));
}

async function putFoto(req, res) {
  res.json(await service.subirFoto(req.usuario.id_usuario, req.file));
}

async function deleteFoto(req, res) {
  res.json(await service.eliminarFoto(req.usuario.id_usuario));
}

async function putHojaVidaArchivo(req, res) {
  res.json(await service.subirHojaVida(req.usuario.id_usuario, req.file));
}

async function deleteHojaVidaArchivo(req, res) {
  res.json(await service.eliminarHojaVida(req.usuario.id_usuario));
}

function enviarPdf(res, { buffer, nombreArchivo }) {
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="hoja-vida.pdf"; filename*=UTF-8''${encodeURIComponent(nombreArchivo)}`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.send(buffer);
}

async function getMiHojaVidaArchivo(req, res) {
  enviarPdf(res, await service.descargarMiHojaVida(req.usuario.id_usuario));
}

async function getHojaVidaArchivoPublica(req, res) {
  enviarPdf(res, await service.descargarHojaVidaPublica(req.params.idEstudiante));
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
  putFoto,
  deleteFoto,
  putHojaVidaArchivo,
  deleteHojaVidaArchivo,
  getMiHojaVidaArchivo,
  getHojaVidaArchivoPublica,
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

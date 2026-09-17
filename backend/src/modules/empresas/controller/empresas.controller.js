const service = require("../service/empresas.service");

async function postRegistro(req, res) {
  const resultado = await service.registrar(req.body || {});
  res.status(201).json(resultado);
}

async function postLogin(req, res) {
  const resultado = await service.login(req.body || {});
  res.json(resultado);
}

async function postRecuperarContrasena(req, res) {
  const { correo } = req.body || {};
  const resultado = await service.solicitarRecuperacion(correo);
  res.json(resultado);
}

async function postResetearContrasena(req, res) {
  const resultado = await service.resetearContrasena(req.body || {});
  res.json(resultado);
}

module.exports = { postRegistro, postLogin, postRecuperarContrasena, postResetearContrasena };

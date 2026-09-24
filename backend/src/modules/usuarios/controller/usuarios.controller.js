const service = require("../service/usuarios.service");

async function getRosterQ10(req, res) {
  const roster = await service.obtenerRosterQ10();
  res.json({ roster });
}

async function postLoginQ10(req, res) {
  const { codigo_institucional_q10 } = req.body || {};
  if (!codigo_institucional_q10) {
    return res.status(400).json({ error: "El código institucional Q10 es obligatorio." });
  }

  const resultado = await service.loginConQ10(codigo_institucional_q10);
  res.json(resultado);
}

module.exports = { getRosterQ10, postLoginQ10 };

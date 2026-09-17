// El service solo conoce la interfaz Q10Provider; para cambiar al proveedor
// real basta con cambiar este import (ver q10Provider.interface.js).
const q10Provider = require("../providers/q10Provider.mock");
const repository = require("../repository/usuarios.repository");
const { signToken } = require("../../../lib/jwt");

class CredencialesQ10InvalidasError extends Error {
  constructor() {
    super("Codigo institucional Q10 no reconocido.");
    this.status = 401;
    this.publicMessage = "Codigo institucional Q10 no reconocido.";
  }
}

async function obtenerRosterQ10() {
  const roster = await q10Provider.getRoster();
  // No se expone el correo institucional completo en el roster publico simulado
  // del selector de cuentas; solo lo minimo para que el frontend pueda listarlas.
  return roster.map((cuenta) => ({
    codigo_institucional_q10: cuenta.codigo_institucional_q10,
    nombres: cuenta.nombres,
    apellidos: cuenta.apellidos,
    rol: cuenta.rol,
  }));
}

async function loginConQ10(codigoInstitucional) {
  const cuenta = await q10Provider.findByCodigo(codigoInstitucional);
  if (!cuenta) {
    throw new CredencialesQ10InvalidasError();
  }

  const { usuario, estudiante } = await repository.upsertCuentaQ10(cuenta);

  const token = signToken({
    id_usuario: usuario.id_usuario,
    rol: usuario.rol,
    origen_autenticacion: usuario.origen_autenticacion,
  });

  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol,
      codigo_institucional_q10: usuario.codigo_institucional_q10,
      nombres: cuenta.nombres,
      apellidos: cuenta.apellidos,
      id_estudiante: estudiante ? estudiante.id_estudiante : null,
    },
  };
}

module.exports = { obtenerRosterQ10, loginConQ10 };

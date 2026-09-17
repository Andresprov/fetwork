const prisma = require("../../../lib/prisma");

async function findUsuarioPorCorreo(correo) {
  return prisma.usuario.findUnique({
    where: { correo },
    include: { empresa: true },
  });
}

async function crearEmpresaPendiente({ correo, contrasena_hash, nombre_empresa, sector, sitio_web, telefono, descripcion }) {
  return prisma.usuario.create({
    data: {
      correo,
      contrasena_hash,
      rol: "empresa",
      origen_autenticacion: "local",
      activo: true,
      empresa: {
        create: {
          nombre_empresa,
          sector,
          sitio_web,
          telefono,
          descripcion,
          estado_validacion: "pendiente",
        },
      },
    },
    include: { empresa: true },
  });
}

async function crearTokenRecuperacion({ id_usuario, token_hash, expires_at }) {
  return prisma.passwordResetToken.create({
    data: { id_usuario, token_hash, expires_at },
  });
}

async function buscarTokenValido(token_hash) {
  return prisma.passwordResetToken.findFirst({
    where: {
      token_hash,
      used: false,
      expires_at: { gt: new Date() },
    },
  });
}

async function marcarTokenUsado(id) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { used: true },
  });
}

async function actualizarContrasena(id_usuario, contrasena_hash) {
  return prisma.usuario.update({
    where: { id_usuario },
    data: { contrasena_hash },
  });
}

module.exports = {
  findUsuarioPorCorreo,
  crearEmpresaPendiente,
  crearTokenRecuperacion,
  buscarTokenValido,
  marcarTokenUsado,
  actualizarContrasena,
};

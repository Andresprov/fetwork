const bcrypt = require("bcrypt");
const crypto = require("crypto");
const repository = require("../repository/empresas.repository");
const { validarContrasena } = require("../../../lib/passwordPolicy");
const { signToken } = require("../../../lib/jwt");

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MINUTOS = 60;

class ErrorPeticion extends Error {
  constructor(status, publicMessage, extra = {}) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
    Object.assign(this, extra);
  }
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function registrar(datos) {
  const { correo, contrasena, nombre_empresa } = datos;

  if (!correo || !contrasena || !nombre_empresa) {
    throw new ErrorPeticion(400, "El correo, la contraseña y el nombre de la empresa son obligatorios.");
  }

  const { valida, errores } = validarContrasena(contrasena);
  if (!valida) {
    throw new ErrorPeticion(400, "La contraseña no cumple los requisitos mínimos.", { errores });
  }

  const existente = await repository.findUsuarioPorCorreo(correo);
  if (existente) {
    throw new ErrorPeticion(409, "Ya existe una cuenta registrada con ese correo.");
  }

  const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

  const usuario = await repository.crearEmpresaPendiente({
    correo,
    contrasena_hash,
    nombre_empresa,
    sector: datos.sector || null,
    sitio_web: datos.sitio_web || null,
    telefono: datos.telefono || null,
    descripcion: datos.descripcion || null,
  });

  return {
    id_usuario: usuario.id_usuario,
    correo: usuario.correo,
    estado_validacion: usuario.empresa.estado_validacion,
  };
}

async function login({ correo, contrasena }) {
  if (!correo || !contrasena) {
    throw new ErrorPeticion(400, "El correo y la contraseña son obligatorios.");
  }

  const usuario = await repository.findUsuarioPorCorreo(correo);
  if (!usuario || !usuario.empresa || !usuario.contrasena_hash) {
    throw new ErrorPeticion(401, "Credenciales inválidas.");
  }

  const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
  if (!coincide) {
    throw new ErrorPeticion(401, "Credenciales inválidas.");
  }

  const { estado_validacion, comentario_validacion } = usuario.empresa;

  if (estado_validacion !== "aprobada") {
    return {
      estado: estado_validacion,
      comentario_validacion: comentario_validacion || null,
    };
  }

  const token = signToken({
    id_usuario: usuario.id_usuario,
    rol: usuario.rol,
    id_empresa: usuario.empresa.id_empresa,
  });

  return {
    estado: "aprobada",
    token,
    empresa: {
      id_usuario: usuario.id_usuario,
      id_empresa: usuario.empresa.id_empresa,
      correo: usuario.correo,
      nombre_empresa: usuario.empresa.nombre_empresa,
    },
  };
}

async function solicitarRecuperacion(correo) {
  if (!correo) {
    throw new ErrorPeticion(400, "El correo es obligatorio.");
  }

  const usuario = await repository.findUsuarioPorCorreo(correo);

  // No revelamos si el correo existe o no (evita enumeracion de cuentas);
  // siempre respondemos igual, pero solo generamos token si la cuenta existe.
  if (usuario && usuario.empresa) {
    const tokenPlano = crypto.randomBytes(32).toString("hex");
    const token_hash = hashToken(tokenPlano);
    const expires_at = new Date(Date.now() + RESET_TOKEN_TTL_MINUTOS * 60 * 1000);

    await repository.crearTokenRecuperacion({
      id_usuario: usuario.id_usuario,
      token_hash,
      expires_at,
    });

    // Simulacion del envio de correo (CU-13): aun no hay servicio de
    // correo real, se deja evidencia en consola con el enlace que se enviaria.
    console.log(
      `[empresas] Enlace de recuperacion de contrasena para ${correo}: ` +
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/empresas/resetear-contrasena?token=${tokenPlano}`
    );
  }

  return { mensaje: "Si el correo está registrado, se enviaron instrucciones de recuperación." };
}

async function resetearContrasena({ token, nueva_contrasena }) {
  if (!token || !nueva_contrasena) {
    throw new ErrorPeticion(400, "El token y la nueva contraseña son obligatorios.");
  }

  const { valida, errores } = validarContrasena(nueva_contrasena);
  if (!valida) {
    throw new ErrorPeticion(400, "La contraseña no cumple los requisitos mínimos.", { errores });
  }

  const token_hash = hashToken(token);
  const registro = await repository.buscarTokenValido(token_hash);
  if (!registro) {
    throw new ErrorPeticion(400, "El enlace de recuperación es inválido o expiró.");
  }

  const contrasena_hash = await bcrypt.hash(nueva_contrasena, SALT_ROUNDS);
  await repository.actualizarContrasena(registro.id_usuario, contrasena_hash);
  await repository.marcarTokenUsado(registro.id);

  return { mensaje: "Contraseña actualizada correctamente." };
}

module.exports = { registrar, login, solicitarRecuperacion, resetearContrasena };

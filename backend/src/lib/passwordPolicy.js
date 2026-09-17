// Politica de fuerza de contrasena para cuentas de empresa (JWT + bcrypt).
// Se valida tanto en frontend (feedback inmediato) como aqui en backend
// (nunca confiar solo en la validacion del cliente).
// Mismas 4 reglas que muestra el checklist de RegistroEmpresa.jsx (mockup CU-11):
// minimo 8 caracteres, 1 mayuscula, 1 numero, 1 simbolo.
const REGLAS = [
  { test: (p) => p.length >= 8, mensaje: "Debe tener al menos 8 caracteres." },
  { test: (p) => /[A-Z]/.test(p), mensaje: "Debe incluir al menos una mayuscula." },
  { test: (p) => /[0-9]/.test(p), mensaje: "Debe incluir al menos un numero." },
  { test: (p) => /[^A-Za-z0-9]/.test(p), mensaje: "Debe incluir al menos un caracter especial." },
];

function validarContrasena(password) {
  const errores = REGLAS.filter((r) => !r.test(password || "")).map((r) => r.mensaje);
  return { valida: errores.length === 0, errores };
}

module.exports = { validarContrasena };

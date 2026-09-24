const { verifyToken } = require("../lib/jwt");

// Valida el JWT emitido por FETWork (login Q10 o login de empresa) y deja el
// payload en req.usuario. Cualquier token ausente, invalido o expirado -> 401.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [esquema, token] = header.split(" ");

  if (esquema !== "Bearer" || !token) {
    return res.status(401).json({ error: "Debes iniciar sesión para continuar." });
  }

  try {
    req.usuario = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Tu sesión expiró o no es válida. Inicia sesión nuevamente." });
  }
}

// Debe usarse despues de requireAuth.
function requireRol(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: "No tienes permisos para realizar esta acción." });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRol };

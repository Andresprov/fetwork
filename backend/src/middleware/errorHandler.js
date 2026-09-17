// Manejador de errores global de ultima instancia. Cada router de modulo puede
// capturar sus propios errores especificos, pero cualquier error no controlado
// que llegue hasta aqui se responde como JSON sin tumbar el proceso, de forma
// que una falla en un modulo no afecte a los demas (seccion 5 de CLAUDE.md).
function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.originalUrl}:`, err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.publicMessage || "Error interno del servidor.",
  });
}

module.exports = errorHandler;

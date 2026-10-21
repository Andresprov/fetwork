// URL publica del backend (PUBLIC_URL), sin barra final. Se antepone a los
// archivos servidos por la propia API (fotos en disco local, hojas de vida).
function urlBackend() {
  return (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, "");
}

module.exports = { urlBackend };

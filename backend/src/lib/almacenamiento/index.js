// Fachada de almacenamiento (ver almacenamiento.interface.js). Guarda con el
// proveedor activo y despacha el resto segun quien sea dueño de la referencia.
const local = require("./almacenamiento.local");
const cloudinary = require("./almacenamiento.cloudinary");

const PROVEEDORES = [local, cloudinary];

function activo() {
  const nombre = (process.env.ALMACENAMIENTO || "local").toLowerCase();
  if (nombre === "cloudinary") return cloudinary;
  if (nombre !== "local") throw new Error(`ALMACENAMIENTO="${nombre}" no es valido (usa local o cloudinary).`);
  return local;
}

const duenoDe = (referencia) => PROVEEDORES.find((p) => p.esPropia(referencia)) || null;

// true si la referencia es un archivo guardado por FETWork (y no un enlace
// externo escrito por el usuario, como las fotos u hojas de vida antiguas).
function esArchivo(referencia) {
  return duenoDe(referencia) !== null;
}

function guardar(buffer, opciones) {
  return activo().guardar(buffer, opciones);
}

async function leer(referencia) {
  return (await duenoDe(referencia)?.leer(referencia)) ?? null;
}

async function eliminar(referencia) {
  await duenoDe(referencia)?.eliminar(referencia);
}

// Los enlaces externos se devuelven tal cual.
function urlPublica(referencia) {
  if (!referencia) return null;
  const dueno = duenoDe(referencia);
  return dueno ? dueno.urlPublica(referencia) : referencia;
}

module.exports = { activo, esArchivo, guardar, leer, eliminar, urlPublica };

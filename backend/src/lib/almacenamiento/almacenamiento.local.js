// Proveedor de almacenamiento en el disco del backend (desarrollo / instancia
// unica). Los archivos quedan en backend/uploads/<carpeta>/. Los publicos se
// sirven estaticos en /uploads/<carpeta> (ver CARPETAS_PUBLICAS en app.js);
// los privados (hojas de vida) quedan en una carpeta que no se sirve. La
// referencia guardada en la BD es la ruta relativa ("/uploads/fotos/abc.jpg");
// urlPublica le antepone PUBLIC_URL.
//
// Ojo: en Render/Railway el disco se borra en cada despliegue; en produccion
// se debe usar Cloudinary (ALMACENAMIENTO=cloudinary).
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { urlBackend } = require("../urlBackend");

const PREFIJO = "/uploads/";
const DIR_UPLOADS = path.join(__dirname, "..", "..", "..", "uploads");
// Carpetas que se sirven sin autenticacion en /uploads.
const CARPETAS_PUBLICAS = ["fotos"];

function esPropia(referencia) {
  return Boolean(referencia?.startsWith(PREFIJO));
}

async function guardar(buffer, { carpeta, extension, privado = false }) {
  if (!privado && !CARPETAS_PUBLICAS.includes(carpeta)) {
    throw new Error(`La carpeta "${carpeta}" no se sirve publicamente.`);
  }
  if (privado && CARPETAS_PUBLICAS.includes(carpeta)) {
    throw new Error(`La carpeta "${carpeta}" es publica; no puede guardar archivos privados.`);
  }
  const nombre = `${crypto.randomUUID()}.${extension}`;
  const dir = path.join(DIR_UPLOADS, carpeta);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, nombre), buffer);
  return `${PREFIJO}${carpeta}/${nombre}`;
}

// Ruta en disco de una referencia propia; null si no es de este proveedor o
// apunta fuera de uploads/.
function rutaDe(referencia) {
  if (!esPropia(referencia)) return null;
  const ruta = path.resolve(DIR_UPLOADS, referencia.slice(PREFIJO.length));
  return ruta.startsWith(DIR_UPLOADS + path.sep) ? ruta : null;
}

async function leer(referencia) {
  const ruta = rutaDe(referencia);
  if (!ruta) return null;
  try {
    return await fs.readFile(ruta);
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function eliminar(referencia) {
  const ruta = rutaDe(referencia);
  if (ruta) await fs.rm(ruta, { force: true });
}

function urlPublica(referencia) {
  if (!esPropia(referencia)) return null;
  const carpeta = referencia.slice(PREFIJO.length).split("/")[0];
  return CARPETAS_PUBLICAS.includes(carpeta) ? `${urlBackend()}${referencia}` : null;
}

module.exports = { esPropia, guardar, leer, eliminar, urlPublica, DIR_UPLOADS, CARPETAS_PUBLICAS };

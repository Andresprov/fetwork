// Proveedor de almacenamiento en el disco del backend (desarrollo / instancia
// unica). Los archivos quedan en backend/uploads/<carpeta>/ y se sirven
// estaticos en /uploads. La referencia guardada en la BD es la ruta relativa
// ("/uploads/fotos/abc.jpg"); urlPublica le antepone PUBLIC_URL.
//
// Ojo: en Render/Railway el disco se borra en cada despliegue; en produccion
// se debe usar un proveedor externo (Cloudinary).
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const PREFIJO = "/uploads/";
const DIR_UPLOADS = path.join(__dirname, "..", "..", "..", "uploads");

function baseUrl() {
  return (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, "");
}

async function guardar(buffer, { carpeta, extension }) {
  const nombre = `${crypto.randomUUID()}.${extension}`;
  const dir = path.join(DIR_UPLOADS, carpeta);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, nombre), buffer);
  return `${PREFIJO}${carpeta}/${nombre}`;
}

// Ruta en disco de una referencia propia; null si no es de este proveedor o
// apunta fuera de uploads/.
function rutaDe(referencia) {
  if (!referencia?.startsWith(PREFIJO)) return null;
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

// Las referencias absolutas (fotos antiguas guardadas como enlace) se
// devuelven tal cual.
function urlPublica(referencia) {
  if (!referencia) return null;
  return referencia.startsWith(PREFIJO) ? `${baseUrl()}${referencia}` : referencia;
}

module.exports = { guardar, leer, eliminar, urlPublica, DIR_UPLOADS };

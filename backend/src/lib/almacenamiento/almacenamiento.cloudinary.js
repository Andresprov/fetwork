// Proveedor de almacenamiento en Cloudinary (produccion). Habla directo con
// la API REST firmada (sin SDK). Se activa con ALMACENAMIENTO=cloudinary y
// las credenciales en CLOUDINARY_URL ("cloudinary://API_KEY:API_SECRET@CLOUD_NAME",
// tal como la muestra el panel de Cloudinary).
//
// Todo se sube como recurso "image" (Cloudinary trata los PDF como imagenes):
// - publicos (fotos): tipo "upload", servidos por el CDN de Cloudinary.
// - privados (hojas de vida): tipo "private"; solo el backend los descarga
//   con una peticion firmada, asi la visibilidad la sigue decidiendo FETWork.
//
// Referencia guardada en la BD: "cloudinary:<tipo>/<public_id>.<formato>",
// p. ej. "cloudinary:upload/fetwork/fotos/9f1c....jpg".
const crypto = require("crypto");

const PREFIJO = "cloudinary:";
const TIMEOUT_MS = 20000;

function config() {
  const url = process.env.CLOUDINARY_URL;
  const m = url && /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/.exec(url.trim());
  if (!m) {
    throw new Error("Falta CLOUDINARY_URL (cloudinary://API_KEY:API_SECRET@CLOUD_NAME) para usar ALMACENAMIENTO=cloudinary.");
  }
  return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
}

// Firma de Cloudinary: parametros ordenados "k=v&k=v" + API_SECRET, en SHA-1.
function firmar(params, apiSecret) {
  const base = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(base + apiSecret).digest("hex");
}

function parametrosFirmados(params) {
  const { apiKey, apiSecret } = config();
  const conTiempo = { ...params, timestamp: Math.floor(Date.now() / 1000) };
  return { ...conTiempo, api_key: apiKey, signature: firmar(conTiempo, apiSecret) };
}

function endpoint(accion) {
  return `https://api.cloudinary.com/v1_1/${config().cloudName}/image/${accion}`;
}

// "cloudinary:private/fetwork/hojas-vida/abc.pdf" -> { tipo, publicId, formato }
function partes(referencia) {
  if (!esPropia(referencia)) return null;
  const m = /^([a-z]+)\/(.+)\.([a-z0-9]+)$/i.exec(referencia.slice(PREFIJO.length));
  return m ? { tipo: m[1], publicId: m[2], formato: m[3] } : null;
}

function esPropia(referencia) {
  return Boolean(referencia?.startsWith(PREFIJO));
}

async function guardar(buffer, { carpeta, extension, privado = false }) {
  const tipo = privado ? "private" : "upload";
  const params = parametrosFirmados({ public_id: `fetwork/${carpeta}/${crypto.randomUUID()}`, type: tipo });

  const formulario = new FormData();
  formulario.append("file", new Blob([buffer]), `archivo.${extension}`);
  for (const [k, v] of Object.entries(params)) formulario.append(k, String(v));

  const res = await fetch(endpoint("upload"), { method: "POST", body: formulario, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Cloudinary rechazo la subida (${res.status}): ${cuerpo.error?.message || "sin detalle"}`);
  }
  return `${PREFIJO}${cuerpo.type}/${cuerpo.public_id}.${cuerpo.format || extension}`;
}

function urlPublica(referencia) {
  const p = partes(referencia);
  if (!p || p.tipo !== "upload") return null;
  return `https://res.cloudinary.com/${config().cloudName}/image/upload/${p.publicId}.${p.formato}`;
}

async function leer(referencia) {
  const p = partes(referencia);
  if (!p) return null;
  let url;
  if (p.tipo === "upload") {
    url = urlPublica(referencia);
  } else {
    const params = parametrosFirmados({ public_id: p.publicId, format: p.formato, type: p.tipo });
    url = `${endpoint("download")}?${new URLSearchParams(params)}`;
  }
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Cloudinary no entrego el archivo (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

async function eliminar(referencia) {
  const p = partes(referencia);
  if (!p) return;
  const params = parametrosFirmados({ public_id: p.publicId, type: p.tipo, invalidate: "true" });
  const res = await fetch(endpoint("destroy"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Cloudinary no elimino el archivo (${res.status}).`);
}

module.exports = { esPropia, guardar, leer, eliminar, urlPublica, firmar };

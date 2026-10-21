// Cliente minimo de la API REST publica de GitHub (CU-05: sincronizar e
// importar repositorios). Solo lee datos publicos, asi que no requiere que el
// estudiante conecte su cuenta: basta con el usuario de su perfil de GitHub.
//
// Sin token, GitHub permite 60 peticiones por hora por IP; con GITHUB_TOKEN
// (un token personal sin permisos) sube a 5000. Las respuestas se cachean unos
// minutos en memoria para no gastar el limite al abrir varias veces la misma
// pantalla.
const { ErrorPeticion } = require("../../../lib/errores");

const API = "https://api.github.com";
const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX = 200;

const cache = new Map();

function leerCache(ruta) {
  const entrada = cache.get(ruta);
  if (!entrada) return undefined;
  if (Date.now() - entrada.creado > CACHE_TTL_MS) {
    cache.delete(ruta);
    return undefined;
  }
  return entrada.valor;
}

function guardarCache(ruta, valor) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(ruta, { valor, creado: Date.now() });
}

// GET contra la API. `vacioSi` son status que significan "sin datos" (p. ej.
// 409 al pedir commits de un repositorio vacio) y devuelven `null`.
async function get(ruta, { vacioSi = [] } = {}) {
  const enCache = leerCache(ruta);
  if (enCache !== undefined) return enCache;

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "FETWork",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  let res;
  try {
    res = await fetch(`${API}${ruta}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    console.error(`[github] fallo la peticion ${ruta}:`, err.message);
    throw new ErrorPeticion(503, "No fue posible conectar con GitHub. Intenta de nuevo en unos minutos.");
  }

  if (vacioSi.includes(res.status)) {
    guardarCache(ruta, null);
    return null;
  }
  if (res.status === 404) {
    throw new ErrorPeticion(404, "No se encontró en GitHub. Verifica que el usuario o el repositorio exista y sea público.");
  }
  if (res.status === 403 || res.status === 429) {
    console.error(`[github] limite de peticiones alcanzado (${res.status}) en ${ruta}`);
    throw new ErrorPeticion(503, "GitHub limitó temporalmente las consultas. Intenta de nuevo en unos minutos.");
  }
  if (!res.ok) {
    console.error(`[github] respuesta ${res.status} en ${ruta}`);
    throw new ErrorPeticion(502, "GitHub respondió con un error. Intenta de nuevo en unos minutos.");
  }

  const valor = await res.json();
  guardarCache(ruta, valor);
  return valor;
}

const seg = encodeURIComponent;

// Repositorios publicos propios del usuario (sin forks), del mas reciente al
// mas antiguo. Se limita a 100: suficiente para un portafolio de estudiante.
async function listarRepositorios(usuario) {
  const repos = await get(`/users/${seg(usuario)}/repos?type=owner&sort=pushed&per_page=100`);
  return repos.filter((r) => !r.fork && !r.private);
}

async function obtenerRepositorio(propietario, nombre) {
  return get(`/repos/${seg(propietario)}/${seg(nombre)}`);
}

// { "JavaScript": 12345, "CSS": 678 } ordenado por bytes de codigo.
async function obtenerLenguajes(propietario, nombre) {
  const lenguajes = (await get(`/repos/${seg(propietario)}/${seg(nombre)}/languages`)) || {};
  return Object.entries(lenguajes)
    .sort((a, b) => b[1] - a[1])
    .map(([lenguaje]) => lenguaje);
}

async function obtenerUltimosCommits(propietario, nombre, cantidad = 3) {
  return (await get(`/repos/${seg(propietario)}/${seg(nombre)}/commits?per_page=${cantidad}`, { vacioSi: [409] })) || [];
}

module.exports = { listarRepositorios, obtenerRepositorio, obtenerLenguajes, obtenerUltimosCommits };

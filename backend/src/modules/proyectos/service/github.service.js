// Sincronizacion con GitHub (CU-05): listar los repositorios publicos del
// estudiante, importarlos como proyectos del portafolio y consultar los datos
// de un repositorio para el panel del formulario de proyecto.
const repository = require("../repository/proyectos.repository");
const github = require("../providers/github.client");
const { ErrorPeticion } = require("../../../lib/errores");

const MAX_IMPORTAR = 30;
const MAX_TECNOLOGIAS = 20;

// Mismo require diferido que proyectos.service (dependencia circular).
function perfilesService() {
  return require("../../perfiles/service/perfiles.service");
}

// Los topics de GitHub son slugs en minuscula ("nodejs", "tailwindcss"); los
// mas comunes se muestran con su nombre real. El resto se deja como viene.
const NOMBRES_TOPICS = {
  react: "React",
  reactjs: "React",
  "react-native": "React Native",
  nodejs: "Node.js",
  node: "Node.js",
  express: "Express",
  expressjs: "Express",
  nextjs: "Next.js",
  vue: "Vue.js",
  vuejs: "Vue.js",
  angular: "Angular",
  tailwindcss: "Tailwind CSS",
  bootstrap: "Bootstrap",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  sqlite: "SQLite",
  prisma: "Prisma",
  docker: "Docker",
  django: "Django",
  flask: "Flask",
  fastapi: "FastAPI",
  laravel: "Laravel",
  spring: "Spring",
  "spring-boot": "Spring Boot",
  flutter: "Flutter",
  firebase: "Firebase",
  vite: "Vite",
  graphql: "GraphQL",
  aws: "AWS",
  "machine-learning": "Machine Learning",
};

// "https://github.com/usuario" -> "usuario". Los enlaces de GitHub ya se
// validan contra github.com al guardar el perfil.
function usuarioDesdeUrl(githubUrl) {
  try {
    const u = new URL(githubUrl);
    const usuario = u.pathname.split("/").filter(Boolean)[0];
    if (["github.com", "www.github.com"].includes(u.hostname.toLowerCase()) && /^[A-Za-z0-9-]{1,39}$/.test(usuario || "")) {
      return usuario;
    }
  } catch {
    // cae al null
  }
  return null;
}

// "https://github.com/usuario/repo(.git)(/...)" -> { propietario, nombre }.
function repositorioDesdeUrl(valor) {
  try {
    const u = new URL(String(valor || "").trim());
    const [propietario, nombre] = u.pathname.split("/").filter(Boolean);
    if (["github.com", "www.github.com"].includes(u.hostname.toLowerCase()) && propietario && nombre) {
      return { propietario, nombre: nombre.replace(/\.git$/i, "") };
    }
  } catch {
    // cae al error
  }
  throw new ErrorPeticion(400, "El enlace del repositorio debe tener la forma https://github.com/usuario/repositorio.");
}

// Clave para comparar repositorios sin importar mayusculas, ".git" ni la
// barra final.
function claveRepositorio(url) {
  try {
    const { propietario, nombre } = repositorioDesdeUrl(url);
    return `${propietario}/${nombre}`.toLowerCase();
  } catch {
    return null;
  }
}

function tecnologiasDe(lenguajes, topics = []) {
  const vistas = new Set();
  const resultado = [];
  for (const t of [...lenguajes, ...topics.map((x) => NOMBRES_TOPICS[x] || x)]) {
    const clave = t.toLowerCase();
    if (vistas.has(clave) || t.length > 50) continue;
    vistas.add(clave);
    resultado.push(t);
  }
  return resultado.slice(0, MAX_TECNOLOGIAS);
}

function urlHttp(valor) {
  try {
    const u = new URL(valor);
    return ["http:", "https:"].includes(u.protocol) && valor.length <= 500 ? valor : null;
  } catch {
    return null;
  }
}

async function usuarioGithubDelEstudiante(id_usuario) {
  const perfil = await perfilesService().obtenerMiPerfil(id_usuario);
  const usuario = perfil.github_url ? usuarioDesdeUrl(perfil.github_url) : null;
  if (!usuario) {
    throw new ErrorPeticion(
      409,
      "Primero agrega el enlace de tu perfil de GitHub (https://github.com/usuario) en Datos personales."
    );
  }
  return { usuario, idEstudiante: perfil.id_estudiante };
}

async function clavesImportadas(idEstudiante) {
  const proyectos = await repository.listarPorEstudiante(idEstudiante);
  return new Set(proyectos.map((p) => p.repositorio_github_url && claveRepositorio(p.repositorio_github_url)).filter(Boolean));
}

// GET /api/proyectos/me/github/repositorios
async function listarMisRepositorios(id_usuario) {
  const { usuario, idEstudiante } = await usuarioGithubDelEstudiante(id_usuario);
  const [repos, importadas] = await Promise.all([github.listarRepositorios(usuario), clavesImportadas(idEstudiante)]);
  return {
    usuario,
    repositorios: repos.map((r) => ({
      nombre: r.name,
      nombre_completo: r.full_name,
      descripcion: r.description,
      url: r.html_url,
      lenguaje: r.language,
      estrellas: r.stargazers_count,
      forks: r.forks_count,
      actualizado_en: r.pushed_at,
      archivado: r.archived,
      importado: importadas.has(r.full_name.toLowerCase()),
    })),
  };
}

// POST /api/proyectos/me/github/importar { repositorios: ["usuario/repo", ...] }
// Crea un proyecto por repositorio con nombre, descripcion, fecha de
// creacion, lenguajes + topics como tecnologias y el homepage como demo. Los
// que ya estan en el portafolio se omiten.
async function importarRepositorios(id_usuario, body = {}) {
  const pedidos = body.repositorios;
  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    throw new ErrorPeticion(400, "Selecciona al menos un repositorio para importar.");
  }
  if (pedidos.length > MAX_IMPORTAR) {
    throw new ErrorPeticion(400, `Puedes importar máximo ${MAX_IMPORTAR} repositorios a la vez.`);
  }

  const { usuario, idEstudiante } = await usuarioGithubDelEstudiante(id_usuario);
  const [repos, importadas] = await Promise.all([github.listarRepositorios(usuario), clavesImportadas(idEstudiante)]);
  const porNombre = new Map(repos.map((r) => [r.full_name.toLowerCase(), r]));

  const importados = [];
  const omitidos = [];
  const proyectosService = require("./proyectos.service");

  for (const pedido of new Set(pedidos.map((p) => String(p).toLowerCase()))) {
    const repo = porNombre.get(pedido);
    if (!repo) {
      omitidos.push({ repositorio: pedido, motivo: "No es un repositorio público de tu cuenta de GitHub." });
      continue;
    }
    if (importadas.has(pedido)) {
      omitidos.push({ repositorio: repo.full_name, motivo: "Ya está en tu portafolio." });
      continue;
    }
    const lenguajes = await github.obtenerLenguajes(repo.owner.login, repo.name);
    const demo = repo.homepage && urlHttp(repo.homepage);
    const proyecto = await proyectosService.crearProyecto(id_usuario, {
      nombre: repo.name.slice(0, 150),
      descripcion: repo.description ? repo.description.slice(0, 3000) : null,
      fecha: repo.created_at ? repo.created_at.slice(0, 10) : null,
      repositorio_github_url: repo.html_url,
      tecnologias: tecnologiasDe(lenguajes, repo.topics),
      enlaces: demo ? [{ tipo: "demo", url: demo }] : [],
    });
    importadas.add(pedido);
    importados.push(proyecto);
  }

  return { importados, omitidos };
}

// GET /api/proyectos/me/github/repositorio?url=... : datos para el panel
// "GitHub" del formulario (estadisticas, ultimos commits y tecnologias
// sugeridas). Cualquier repositorio publico, no solo los del estudiante.
async function consultarRepositorio(id_usuario, urlRepositorio) {
  const { propietario, nombre } = repositorioDesdeUrl(urlRepositorio);
  await perfilesService().obtenerIdEstudiante(id_usuario);

  const repo = await github.obtenerRepositorio(propietario, nombre);
  const [lenguajes, commits] = await Promise.all([
    github.obtenerLenguajes(repo.owner.login, repo.name),
    github.obtenerUltimosCommits(repo.owner.login, repo.name),
  ]);

  return {
    nombre: repo.name,
    nombre_completo: repo.full_name,
    descripcion: repo.description,
    url: repo.html_url,
    homepage: repo.homepage ? urlHttp(repo.homepage) : null,
    estrellas: repo.stargazers_count,
    forks: repo.forks_count,
    archivado: repo.archived,
    creado_en: repo.created_at,
    actualizado_en: repo.pushed_at,
    lenguajes,
    tecnologias_sugeridas: tecnologiasDe(lenguajes, repo.topics),
    commits: commits.map((c) => ({
      sha: c.sha.slice(0, 7),
      mensaje: (c.commit?.message || "").split("\n")[0].slice(0, 200),
      fecha: c.commit?.author?.date || null,
      url: c.html_url,
    })),
  };
}

module.exports = { listarMisRepositorios, importarRepositorios, consultarRepositorio, usuarioDesdeUrl };

// Tipos de enlace de un proyecto: coinciden con TIPOS_ENLACE del backend
// (proyectos.service.js).
export const TIPOS_ENLACE = [
  { value: "demo", label: "Demo en vivo", icon: "rocket_launch" },
  { value: "video", label: "Video", icon: "smart_display" },
  { value: "documentacion", label: "Documentación", icon: "description" },
  { value: "articulo", label: "Artículo", icon: "article" },
  { value: "otro", label: "Otro enlace", icon: "link" },
];

export function etiquetaEnlace(tipo) {
  return TIPOS_ENLACE.find((t) => t.value === tipo)?.label || "Enlace";
}

export function iconoEnlace(tipo) {
  return TIPOS_ENLACE.find((t) => t.value === tipo)?.icon || "link";
}

// "github.com/usuario/repo" a partir de la URL completa.
export function rutaRepositorio(url) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

export const SUGERENCIAS_TECNOLOGIAS = [
  "React",
  "Node.js",
  "Express",
  "PostgreSQL",
  "MySQL",
  "Python",
  "Java",
  "Tailwind CSS",
  "Docker",
  "Git",
  "TypeScript",
  "Flutter",
];

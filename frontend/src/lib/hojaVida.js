// Catalogos de la hoja de vida PA-GTH-F-10. Los "value" coinciden con los
// enums/listas que valida el backend (hojaVida.service.js).

const opciones = (lista) => lista.map((v) => ({ value: v, label: v }));

export const ESTADOS_CIVILES = opciones(["Soltero(a)", "Casado(a)", "Unión libre", "Separado(a)", "Divorciado(a)", "Viudo(a)"]);
export const GRUPOS_RH = opciones(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]);
export const MODALIDADES_ESTUDIO = opciones(["Presencial", "Virtual", "A distancia", "Híbrida"]);

export const NIVELES_TITULO = [
  { value: "tecnico", label: "Técnico" },
  { value: "tecnologo", label: "Tecnólogo" },
  { value: "pregrado", label: "Profesional" },
  { value: "especializacion", label: "Especialización" },
  { value: "maestria", label: "Maestría" },
];

export const TIPOS_ACTIVIDAD = [
  { value: "grupo_investigacion", label: "Grupo de investigación / semillero" },
  { value: "proyecto", label: "Proyecto de investigación" },
  { value: "tutoria", label: "Tutoría de trabajo de grado (pregrado)" },
  { value: "tutoria_posgrado", label: "Tutoría de trabajo de grado (posgrado)" },
  { value: "jurado", label: "Par evaluador / jurado" },
  { value: "informe_tecnico", label: "Trabajo o informe técnico" },
  { value: "publicacion", label: "Publicación" },
  { value: "ponencia", label: "Ponencia" },
  { value: "organizacion", label: "Pertenencia a organizaciones" },
];

export const TIPOS_REFERENCIA = [
  { value: "familiar", label: "Familiar" },
  { value: "personal", label: "Personal" },
];

export function etiqueta(lista, valor) {
  return lista.find((o) => o.value === valor)?.label || valor;
}

export const PASOS_HOJA_VIDA = [
  { clave: "datos_personales", titulo: "Datos personales", subtitulo: "Identificación y contacto" },
  { clave: "formacion", titulo: "Formación académica", subtitulo: "Títulos y cursos" },
  { clave: "experiencia", titulo: "Experiencia laboral", subtitulo: "Trayectoria" },
  { clave: "investigativa", titulo: "Investigativa y aula", subtitulo: "Semilleros y monitorías" },
  { clave: "referencias", titulo: "Referencias", subtitulo: "Familiares y personales" },
];

// "14/08/2002" a partir de un ISO del backend (fechas a medianoche UTC).
export function fechaCorta(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

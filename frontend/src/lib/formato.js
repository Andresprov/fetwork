// Las fechas llegan del backend como ISO en UTC (medianoche); se formatean en
// UTC para que no se corran un dia por la zona horaria del navegador.
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function formatearMesAnio(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// "1 registrada" / "3 registradas".
export function contar(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

export function formatearPeriodo(inicio, fin) {
  const desde = formatearMesAnio(inicio);
  const hasta = fin ? formatearMesAnio(fin) : "Actualidad";
  if (!desde) return fin ? `Hasta ${hasta}` : null;
  return `${desde} — ${hasta}`;
}

// Valor para <input type="date"> a partir de un ISO del backend.
export function aInputFecha(iso) {
  return iso ? String(iso).slice(0, 10) : "";
}

export const NIVELES = [
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

export function etiquetaNivel(nivel) {
  return NIVELES.find((n) => n.value === nivel)?.label || null;
}

export function iniciales(nombres = "", apellidos = "") {
  return `${nombres.trim().charAt(0)}${apellidos.trim().charAt(0)}`.toUpperCase();
}

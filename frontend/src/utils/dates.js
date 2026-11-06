// Utilidades de fechas. Todas las fechas se guardan como texto "YYYY-MM-DD"
// para que sean fáciles de comparar y de guardar en localStorage.

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO() {
  return toISODate(new Date());
}

// Convierte "YYYY-MM-DD" en Date a la medianoche local (evita el corrimiento por zona horaria)
export function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso, days) {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

// Cantidad de noches entre check-in y check-out
export function nightsBetween(checkIn, checkOut) {
  const ms = parseISODate(checkOut) - parseISODate(checkIn);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// true si dos rangos [inicio, fin) se superponen. El día de check-out queda libre.
export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

export function formatDate(iso, options = { day: "2-digit", month: "short", year: "numeric" }) {
  return parseISODate(iso).toLocaleDateString("es-AR", options);
}

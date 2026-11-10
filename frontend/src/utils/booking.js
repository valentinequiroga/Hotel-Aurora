import { ACTIVE_STATUSES, EXTRAS, RESERVATION_STATUS } from "../data/constants.js";
import { nightsBetween, rangesOverlap, todayISO } from "./dates.js";
 
// Validación de fechas y disponibilidad de habitaciones.
export function validateDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) return { ok: false, error: "Elegí las fechas de llegada y salida." };
  if (checkIn < todayISO()) return { ok: false, error: "La llegada no puede ser anterior a hoy." };
  if (checkOut <= checkIn) return { ok: false, error: "La salida tiene que ser posterior a la llegada." };
  return { ok: true };
}
 
// true si la habitación está libre en esas fechas, false si hay alguna reserva activa que se superpone.
export function isRoomAvailable(roomId, checkIn, checkOut, reservations, ignoreId = null) {
  return !reservations.some(
    (r) =>
      r.roomId === roomId &&
      r.id !== ignoreId &&
      ACTIVE_STATUSES.includes(r.status) &&
      rangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut)
  );
}
 
// Devuelve las habitaciones activas que tienen capacidad suficiente y están libres en esas fechas.
export function getAvailableRooms({ rooms, reservations, checkIn, checkOut, guests = 1 }) {
  return rooms.filter(
    (room) =>
      room.active &&
      room.capacity >= guests &&
      isRoomAvailable(room.id, checkIn, checkOut, reservations)
  );
}

// Calcula el precio total de la reserva, incluyendo extras. Devuelve un objeto con { nights, lodging, extras, total }.
export function calculatePrice(room, checkIn, checkOut, guests, extraIds = []) {
  const nights = nightsBetween(checkIn, checkOut);
  const lodging = room.pricePerNight * nights;
  const extras = EXTRAS.filter((e) => extraIds.includes(e.id)).map((e) => ({
    id: e.id,
    name: e.name,
    amount: e.pricing === "por_persona_noche" ? e.price * guests * nights : e.price,
  }));
  const extrasTotal = extras.reduce((sum, e) => sum + e.amount, 0);
  return { nights, lodging, extras, total: lodging + extrasTotal };
}
 
// true si la reserva puede ser cancelada por el huésped (pendiente o confirmada, y check-in en el futuro)
export function canGuestCancel(reservation) {
  return (
    [RESERVATION_STATUS.PENDING, RESERVATION_STATUS.CONFIRMED].includes(reservation.status) &&
    reservation.checkIn > todayISO()
  );
}

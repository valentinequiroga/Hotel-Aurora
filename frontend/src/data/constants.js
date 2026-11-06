// Constantes compartidas por todo el equipo.
// Si necesitás un estado, rol o servicio nuevo, agregalo acá y no "hardcodeado" en un componente.

export const ROLES = {
  ADMIN: "admin",
  GUEST: "huesped",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.GUEST]: "Huésped",
};

// Estados de una reserva, en el orden en que avanzan
export const RESERVATION_STATUS = {
  PENDING: "pendiente",
  CONFIRMED: "confirmada",
  CHECKED_IN: "checkin",
  FINISHED: "finalizada",
  CANCELLED: "cancelada",
};

// Texto y clases de Tailwind para mostrar cada estado (badges, grilla de ocupación)
// Uso: <span className={`badge ${STATUS_META[r.status].badge}`}>{STATUS_META[r.status].label}</span>
export const STATUS_META = {
  pendiente: { label: "Pendiente", badge: "bg-warn-bg text-warn-text", cell: "bg-warn-bg text-warn-text border-warn-text/20" },
  confirmada: { label: "Confirmada", badge: "bg-ok-bg text-ok-text", cell: "bg-ok-bg text-ok-text border-ok-text/20" },
  checkin: { label: "Check-in", badge: "bg-primary text-white", cell: "bg-primary text-white border-primary" },
  finalizada: { label: "Finalizada", badge: "bg-line text-muted", cell: "bg-line text-muted border-line" },
  cancelada: { label: "Cancelada", badge: "bg-bad-bg text-bad-text", cell: "bg-bad-bg text-bad-text border-bad-text/20" },
};

// Reservas que todavía "ocupan" la habitación (sirve para disponibilidad y reglas de borrado)
export const ACTIVE_STATUSES = [
  RESERVATION_STATUS.PENDING,
  RESERVATION_STATUS.CONFIRMED,
  RESERVATION_STATUS.CHECKED_IN,
];

export const ROOM_TYPES = ["Simple", "Doble", "Twin", "Familiar", "Suite"];

// Servicios extra. pricing indica cómo se cobra:
//  - "por_persona_noche": precio x huéspedes x noches
//  - "por_estadia": precio fijo una vez
export const EXTRAS = [
  {
    id: "desayuno",
    name: "Desayuno regional",
    description: "Pan casero, dulces de la zona y café de especialidad.",
    price: 6500,
    pricing: "por_persona_noche",
  },
  {
    id: "late-checkout",
    name: "Late check-out",
    description: "Dejá la habitación a las 16 h en lugar de las 11 h.",
    price: 18000,
    pricing: "por_estadia",
  },
  {
    id: "traslado",
    name: "Traslado desde la terminal",
    description: "Te buscamos en la terminal de ómnibus a la llegada.",
    price: 15000,
    pricing: "por_estadia",
  },
];

export const STORAGE_KEYS = {
  USERS: "aurora_users",
  SESSION: "aurora_session",
  ROOMS: "aurora_rooms",
  RESERVATIONS: "aurora_reservations",
};

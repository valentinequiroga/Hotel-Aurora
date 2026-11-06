// Datos hardcodeados con los que arranca la app (la consigna pide no consumir una API).
// Se copian a localStorage la primera vez; desde ahí cada cambio queda guardado.
// Para volver a estos datos: botón "Restablecer datos demo" en el footer.

import { ROLES, RESERVATION_STATUS } from "./constants";
import { addDays, todayISO } from "../utils/dates";

export const seedUsers = [
  {
    id: "u-admin",
    name: "Recepción Aurora",
    email: "recepcion@aurora.com",
    phone: "2944 55-0101",
    password: "admin123",
    role: ROLES.ADMIN,
    createdAt: "2026-03-01",
  },
  {
    id: "u-lucia",
    name: "Lucía Fernández",
    email: "lucia@mail.com",
    phone: "11 5555-1234",
    password: "lucia123",
    role: ROLES.GUEST,
    createdAt: "2026-05-14",
  },
  {
    id: "u-martin",
    name: "Martín Gómez",
    email: "martin@mail.com",
    phone: "341 555-9876",
    password: "martin123",
    role: ROLES.GUEST,
    createdAt: "2026-07-02",
  },
  {
    id: "u-carla",
    name: "Carla Ibáñez",
    email: "carla@mail.com",
    phone: "351 555-4321",
    password: "carla123",
    role: ROLES.GUEST,
    createdAt: "2026-09-20",
  },
];

export const seedRooms = [
  { id: "r-101", number: "101", name: "Clásica Individual", type: "Simple", capacity: 1, beds: "1 cama de una plaza", pricePerNight: 42000, size: 14, active: true, description: "Compacta y luminosa, ideal para viajeros solos. Ventana al jardín.", amenities: ["Wi-Fi", "Calefacción", "Escritorio"], image: "" },
  { id: "r-102", number: "102", name: "Clásica Doble", type: "Doble", capacity: 2, beds: "1 cama queen", pricePerNight: 58000, size: 18, active: true, description: "Habitación doble con vista al jardín y ducha escocesa.", amenities: ["Wi-Fi", "Calefacción", "Vista al jardín"], image: "" },
  { id: "r-103", number: "103", name: "Clásica Twin", type: "Twin", capacity: 2, beds: "2 camas de una plaza", pricePerNight: 56000, size: 18, active: true, description: "Dos camas separadas, pensada para amigos o compañeros de viaje.", amenities: ["Wi-Fi", "Calefacción", "Placard amplio"], image: "" },
  { id: "r-104", number: "104", name: "Doble Superior", type: "Doble", capacity: 2, beds: "1 cama king", pricePerNight: 64000, size: 20, active: true, description: "Cama king y sillón de lectura junto a la ventana.", amenities: ["Wi-Fi", "Calefacción", "Cafetera"], image: "" },
  { id: "r-201", number: "201", name: "Familiar Jardín", type: "Familiar", capacity: 4, beds: "1 cama queen + 2 de una plaza", pricePerNight: 89000, size: 30, active: true, description: "Dos ambientes comunicados, perfecta para familias.", amenities: ["Wi-Fi", "Calefacción", "Heladera", "Cuna a pedido"], image: "" },
  { id: "r-202", number: "202", name: "Doble Superior Balcón", type: "Doble", capacity: 3, beds: "1 cama queen + sofá cama", pricePerNight: 69000, size: 22, active: true, description: "Doble superior con sofá cama para una tercera persona.", amenities: ["Wi-Fi", "Calefacción", "Balcón"], image: "" },
  { id: "r-203", number: "203", name: "Twin Superior", type: "Twin", capacity: 2, beds: "2 camas de una plaza", pricePerNight: 56000, size: 18, active: true, description: "Twin en planta alta, silenciosa y luminosa.", amenities: ["Wi-Fi", "Calefacción", "Planta alta"], image: "" },
  { id: "r-204", number: "204", name: "Familiar Grande", type: "Familiar", capacity: 5, beds: "1 cama king + 3 de una plaza", pricePerNight: 98000, size: 34, active: true, description: "La más amplia del hotel, con kitchenette.", amenities: ["Wi-Fi", "Calefacción", "Kitchenette", "Heladera"], image: "" },
  { id: "r-301", number: "301", name: "Suite Aurora", type: "Suite", capacity: 2, beds: "1 cama king", pricePerNight: 125000, size: 36, active: true, description: "Suite en el altillo con hogar a leña y bañera con vista a la ciudad.", amenities: ["Wi-Fi", "Hogar a leña", "Bañera", "Vista panorámica", "Cafetera"], image: "" },
  { id: "r-302", number: "302", name: "Clásica Altillo", type: "Simple", capacity: 1, beds: "1 cama de plaza y media", pricePerNight: 45000, size: 15, active: false, description: "En refacción: se reabre la próxima temporada.", amenities: ["Wi-Fi", "Calefacción"], image: "" },
];

// Las reservas se generan relativas a HOY para que el panel y la grilla de
// ocupación (próximos 14 días) siempre tengan datos para mostrar.
function buildSeedReservations() {
  const t = todayISO();
  const r = (id, userId, roomId, fromOffset, nights, guests, extras, total, status, createdOffset) => ({
    id,
    userId,
    roomId,
    checkIn: addDays(t, fromOffset),
    checkOut: addDays(t, fromOffset + nights),
    guests,
    extras,
    total,
    status,
    createdAt: addDays(t, createdOffset),
  });

  return [
    r("res-001", "u-lucia", "r-102", -12, 3, 2, ["desayuno"], 213000, RESERVATION_STATUS.FINISHED, -30),
    r("res-002", "u-martin", "r-201", -2, 5, 4, ["desayuno", "traslado"], 590000, RESERVATION_STATUS.CHECKED_IN, -20),
    r("res-003", "u-lucia", "r-301", 0, 2, 2, ["late-checkout"], 268000, RESERVATION_STATUS.CHECKED_IN, -15),
    r("res-004", "u-carla", "r-104", 3, 4, 2, [], 256000, RESERVATION_STATUS.CONFIRMED, -6),
    r("res-005", "u-martin", "r-103", 6, 2, 2, ["desayuno"], 138000, RESERVATION_STATUS.PENDING, -2),
    r("res-006", "u-carla", "r-204", 9, 3, 5, ["desayuno", "traslado"], 406500, RESERVATION_STATUS.PENDING, -1),
    r("res-007", "u-lucia", "r-202", 5, 2, 3, [], 138000, RESERVATION_STATUS.CANCELLED, -8),
    r("res-008", "u-carla", "r-101", 1, 6, 1, ["desayuno"], 291000, RESERVATION_STATUS.CONFIRMED, -10),
  ];
}

export const getSeedReservations = buildSeedReservations;

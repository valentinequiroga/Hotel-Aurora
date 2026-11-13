import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/format";

/**
 * Tarjeta de una habitación.
 *
 *   <RoomCard room={room} nights={3} onReserve={(room) => ...} />
 *
 * - nights: opcional. Si hay fechas elegidas, muestra el subtotal del alojamiento.
 * - Sin sesión, el botón es un link a /login (y después del login vuelve a /habitaciones).
 * - La foto y el nombre llevan a /habitaciones/:id (RoomDetail).
 * - Si la habitación no tiene foto (room.image vacío), muestra un bloque azul con su número.
 */
export default function RoomCard({ room, nights = 0, onReserve }) {
  const { isLoggedIn } = useAuth();

  return (
    <article className="card flex flex-col overflow-hidden p-0 transition hover:shadow-md">
      <Link to={`/habitaciones/${room.id}`} aria-label={`Ver detalles de ${room.name}`}>
        {room.image ? (
          <img src={room.image} alt={room.name} className="h-44 w-full object-cover" />
        ) : (
          <div className="flex h-44 flex-col items-center justify-center bg-primary">
            <span className="eyebrow text-accent">{room.type}</span>
            <span className="font-display text-5xl text-white">{room.number}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">
          {room.type} · Hab. {room.number}
        </p>
        <h3 className="mt-1 text-2xl">
          <Link to={`/habitaciones/${room.id}`} className="transition hover:text-accent">
            {room.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">{room.description}</p>
        <Link to={`/habitaciones/${room.id}`} className="mt-2 text-sm text-primary underline transition hover:text-accent">
          Ver detalles
        </Link>
        <p className="mt-3 text-sm text-muted">
          Hasta {room.capacity} {room.capacity === 1 ? "huésped" : "huéspedes"} · {room.beds} · {room.size} m²
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {(room.amenities ?? []).slice(0, 3).map((item) => (
            <span key={item} className="badge bg-bg text-muted">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <p className="text-xl font-semibold text-primary">{formatCurrency(room.pricePerNight)}</p>
            <p className="text-xs text-muted">por noche</p>
            {nights > 0 && (
              <p className="mt-1 text-xs text-muted">
                {nights} {nights === 1 ? "noche" : "noches"}: {formatCurrency(room.pricePerNight * nights)}
              </p>
            )}
          </div>

          {isLoggedIn ? (
            <button className="btn-primary" onClick={() => onReserve(room)}>
              Reservar
            </button>
          ) : (
            <Link to="/login" state={{ from: { pathname: "/habitaciones" } }} className="btn-primary">
              Ingresar para reservar
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
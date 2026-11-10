import { ACTIVE_STATUSES, EXTRAS, STATUS_META } from "../../data/constants";
import { canGuestCancel } from "../../utils/booking";
import { formatDate, nightsBetween } from "../../utils/dates";
import { formatCurrency } from "../../utils/format";

export default function ReservationCard({ reservation, room, onCancel }) {
  const status = STATUS_META[reservation.status];
  const nights = nightsBetween(reservation.checkIn, reservation.checkOut);
  const extras = EXTRAS.filter((extra) => reservation.extras.includes(extra.id));
  const cancellable = canGuestCancel(reservation);
  const needsReception = ACTIVE_STATUSES.includes(reservation.status) && !cancellable;

  return (
    <article className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{room ? `Hab. ${room.number} · ${room.type}` : "Habitación"}</p>
          <h3 className="mt-1 text-2xl">{room ? room.name : "Habitación eliminada"}</h3>
        </div>
        <span className={`badge ${status.badge}`}>{status.label}</span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="eyebrow">Llegada</dt>
          <dd className="mt-1">{formatDate(reservation.checkIn)}</dd>
        </div>
        <div>
          <dt className="eyebrow">Salida</dt>
          <dd className="mt-1">{formatDate(reservation.checkOut)}</dd>
        </div>
        <div>
          <dt className="eyebrow">Estadía</dt>
          <dd className="mt-1">
            {nights} {nights === 1 ? "noche" : "noches"} · {reservation.guests}{" "}
            {reservation.guests === 1 ? "huésped" : "huéspedes"}
          </dd>
        </div>
      </dl>

      {extras.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {extras.map((extra) => (
            <span key={extra.id} className="badge bg-bg text-muted">
              {extra.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="text-xl font-semibold text-primary">{formatCurrency(reservation.total)}</p>
          <p className="text-xs text-muted">Reservada el {formatDate(reservation.createdAt)}</p>
        </div>

        {cancellable && (
          <button className="btn-secondary" onClick={() => onCancel(reservation)}>
            Cancelar reserva
          </button>
        )}
        {needsReception && (
          <p className="max-w-xs text-xs text-muted">
            Para cambios o cancelaciones de una estadía en curso, comunicate con recepción.
          </p>
        )}
      </div>
    </article>
  );
}
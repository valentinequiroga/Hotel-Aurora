import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { EXTRAS, RESERVATION_STATUS } from "../../data/constants";
import { calculatePrice, isRoomAvailable, validateDates } from "../../utils/booking";
import { addDays, formatDate, todayISO } from "../../utils/dates";
import { formatCurrency, generateId } from "../../utils/format";

export default function ReservationModal({ room, initial, onClose }) {
  const { user } = useAuth();
  const { reservations, setReservations } = useData();

  const [data, setData] = useState({
    checkIn: initial.checkIn,
    checkOut: initial.checkOut,
    guests: Math.min(initial.guests, room.capacity),
  });
  const [extras, setExtras] = useState([]);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const guestOptions = [];
  for (let n = 1; n <= room.capacity; n++) {
    guestOptions.push(n);
  }

  const updateData = (e) => {
    const { name, value } = e.target;
    const next = { ...data, [name]: value };
    if (name === "checkIn" && next.checkOut <= value) {
      next.checkOut = "";
    }
    setData(next);
    setError("");
  };

  const toggleExtra = (id) => {
    setExtras(extras.includes(id) ? extras.filter((extraId) => extraId !== id) : [...extras, id]);
    setError("");
  };

  const datesCheck = validateDates(data.checkIn, data.checkOut);
  const guests = Number(data.guests);
  const free = datesCheck.ok ? isRoomAvailable(room.id, data.checkIn, data.checkOut, reservations) : true;
  const price = datesCheck.ok ? calculatePrice(room, data.checkIn, data.checkOut, guests, extras) : null;
  const minCheckOut = data.checkIn ? addDays(data.checkIn, 1) : addDays(todayISO(), 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!datesCheck.ok) {
      setError(datesCheck.error);
      return;
    }
    if (guests > room.capacity) {
      setError(`Esta habitación admite hasta ${room.capacity} huéspedes.`);
      return;
    }
    if (!free) {
      setError("La habitación ya no está disponible en esas fechas. Probá con otras.");
      return;
    }

    const newReservation = {
      id: generateId("res"),
      userId: user.id,
      roomId: room.id,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests,
      extras,
      total: price.total,
      status: RESERVATION_STATUS.PENDING,
      createdAt: todayISO(),
    };
    setReservations((prev) => [...prev, newReservation]);
    setCreated(newReservation);
    toast.success("¡Reserva enviada! Recepción la va a confirmar.");
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-primary/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-title"
        className="card m-auto w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {created ? (
          <div>
            <span className="accent-rule" aria-hidden="true" />
            <h2 id="reservation-title" className="text-3xl">¡Reserva enviada!</h2>
            <p className="mt-2 text-sm text-muted">
              Quedó pendiente de confirmación. Recepción la revisa y vas a verla como confirmada en Mis reservas.
            </p>
            <dl className="mt-6 space-y-2 rounded-card bg-bg p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Habitación</dt>
                <dd>{room.name} · {room.number}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Llegada</dt>
                <dd>{formatDate(created.checkIn)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Salida</dt>
                <dd>{formatDate(created.checkOut)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Total</dt>
                <dd className="font-semibold text-primary">{formatCurrency(created.total)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-secondary" onClick={onClose}>Cerrar</button>
              <Link to="/mis-reservas" className="btn-primary">Ver mis reservas</Link>
            </div>
          </div>
        ) : (

          <form onSubmit={handleSubmit} noValidate>
            <p className="eyebrow">Reservar · Hab. {room.number}</p>
            <h2 id="reservation-title" className="mt-1 text-3xl">{room.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {formatCurrency(room.pricePerNight)} por noche · hasta {room.capacity}{" "}
              {room.capacity === 1 ? "huésped" : "huéspedes"}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="res-checkIn" className="eyebrow mb-1.5 block">Llegada</label>
                <input
                  id="res-checkIn"
                  name="checkIn"
                  type="date"
                  className="input"
                  min={todayISO()}
                  value={data.checkIn}
                  onChange={updateData}
                />
              </div>
              <div>
                <label htmlFor="res-checkOut" className="eyebrow mb-1.5 block">Salida</label>
                <input
                  id="res-checkOut"
                  name="checkOut"
                  type="date"
                  className="input"
                  min={minCheckOut}
                  value={data.checkOut}
                  onChange={updateData}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="res-guests" className="eyebrow mb-1.5 block">Huéspedes</label>
                <select id="res-guests" name="guests" className="input" value={data.guests} onChange={updateData}>
                  {guestOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "huésped" : "huéspedes"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="eyebrow mb-2">Servicios extra</legend>
              <div className="space-y-2">
                {EXTRAS.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex cursor-pointer items-start gap-3 rounded-card border border-line p-3 text-sm transition hover:border-accent"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={extras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                    />
                    <span className="flex-1">
                      <span className="font-medium text-text">{extra.name}</span>
                      <span className="block text-muted">{extra.description}</span>
                    </span>
                    <span className="text-right text-muted">
                      {formatCurrency(extra.price)}
                      <span className="block text-xs">
                        {extra.pricing === "por_persona_noche" ? "por persona y noche" : "por estadía"}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 rounded-card bg-bg p-4 text-sm">
              {price ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">
                      {price.nights} {price.nights === 1 ? "noche" : "noches"} × {formatCurrency(room.pricePerNight)}
                    </span>
                    <span>{formatCurrency(price.lodging)}</span>
                  </div>
                  {price.extras.map((extra) => (
                    <div key={extra.id} className="flex justify-between gap-4">
                      <span className="text-muted">{extra.name}</span>
                      <span>{formatCurrency(extra.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 border-t border-line pt-2 text-base font-semibold text-primary">
                    <span>Total</span>
                    <span>{formatCurrency(price.total)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted">Elegí las fechas para ver el total.</p>
              )}
            </div>

            {price && !free && (
              <p role="alert" className="mt-4 rounded-lg bg-warn-bg px-3 py-2 text-sm text-warn-text">
                Esta habitación no está disponible en esas fechas. Probá con otras.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-4 rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad-text">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary">Confirmar reserva</button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.getElementById("modal")
  );
}
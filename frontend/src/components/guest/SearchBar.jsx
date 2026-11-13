import { useState } from "react";
import { validateDates } from "../../utils/booking";
import { addDays, todayISO } from "../../utils/dates";
import { useData } from "../../context/DataContext";


const EMPTY = { checkIn: "", checkOut: "", guests: 1 };


export default function SearchBar({ initial = EMPTY, onSearch, onClear }) {
  const { rooms } = useData();
  const [data, setData] = useState(initial);

  // El máximo de huéspedes sale de la habitación activa con más capacidad
  let maxGuests = 1;
  rooms.forEach((room) => {
    if (room.active && room.capacity > maxGuests) maxGuests = room.capacity;
  });
  const guestOptions = [];
  for (let n = 1; n <= maxGuests; n++) guestOptions.push(n);
  const [error, setError] = useState("");

  const updateData = (e) => {
    const { name, value } = e.target;
    const next = { ...data, [name]: value };
    if (name === "checkIn" && next.checkOut <= value) {
      next.checkOut = "";
    }
    setData(next);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const withoutDates = !data.checkIn && !data.checkOut;
    if (!withoutDates) {
      const result = validateDates(data.checkIn, data.checkOut);
      if (!result.ok) {
        setError(result.error);
        return;
      }
    }
    onSearch({ checkIn: data.checkIn, checkOut: data.checkOut, guests: Number(data.guests) });
  };

  const handleClear = () => {
    setData(EMPTY);
    setError("");
    if (onClear) onClear();
  };

  const minCheckOut = data.checkIn ? addDays(data.checkIn, 1) : addDays(todayISO(), 1);

  return (
    <form onSubmit={handleSubmit} noValidate className="card shadow-md">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <label htmlFor="checkIn" className="eyebrow mb-1.5 block">Llegada</label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            className="input"
            min={todayISO()}
            value={data.checkIn}
            onChange={updateData}
          />
        </div>
        <div>
          <label htmlFor="checkOut" className="eyebrow mb-1.5 block">Salida</label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            className="input"
            min={minCheckOut}
            value={data.checkOut}
            onChange={updateData}
          />
        </div>
        <div>
          <label htmlFor="guests" className="eyebrow mb-1.5 block">Huéspedes</label>
          <select id="guests" name="guests" className="input" value={data.guests} onChange={updateData}>
            {guestOptions.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "huésped" : "huéspedes"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">Buscar</button>
          {onClear && (
            <button type="button" className="btn-secondary" onClick={handleClear}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad-text">
          {error}
        </p>
      )}
    </form>
  );
}
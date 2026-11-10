import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ROOM_TYPES } from "../../data/constants";
import { getAvailableRooms, validateDates } from "../../utils/booking";
import { formatDate, nightsBetween } from "../../utils/dates";
import SearchBar from "../../components/guest/SearchBar";
import RoomCard from "../../components/guest/RoomCard";
import ReservationModal from "../../components/guest/ReservationModal";

const EMPTY_SEARCH = { checkIn: "", checkOut: "", guests: 1 };

export default function Rooms() {
  const { rooms, reservations } = useData();
  const [search, setSearch] = useLocalStorage("aurora_search", EMPTY_SEARCH);
  const [type, setType] = useState("todos");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const clearSearch = () => setSearch(EMPTY_SEARCH);

  const hasDates = validateDates(search.checkIn, search.checkOut).ok;
  const nights = hasDates ? nightsBetween(search.checkIn, search.checkOut) : 0;

  const found = hasDates
    ? getAvailableRooms({
        rooms,
        reservations,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        guests: search.guests,
      })
    : rooms.filter((room) => room.active && room.capacity >= search.guests);

  const visible = found.filter((room) => type === "todos" || room.type === type);

  const searchValues = hasDates ? search : { ...EMPTY_SEARCH, guests: search.guests };

  const summary = hasDates
    ? `${visible.length} disponibles del ${formatDate(search.checkIn)} al ${formatDate(search.checkOut)} (${nights} ${nights === 1 ? "noche" : "noches"})`
    : `${visible.length} habitaciones. Elegí fechas para ver la disponibilidad.`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="accent-rule" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl">Habitaciones</h1>
      <p className="mt-2 mb-8 text-muted">Elegí tus fechas y encontrá la habitación ideal.</p>

      <SearchBar initial={searchValues} onSearch={setSearch} onClear={clearSearch} />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">{summary}</p>
        <div className="flex items-center gap-3">
          <label htmlFor="type" className="eyebrow">Tipo</label>
          <select id="type" className="input w-auto" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="todos">Todos</option>
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card mt-6 text-center">
          <h3 className="text-2xl">No encontramos habitaciones</h3>
          <p className="mt-2 text-sm text-muted">
            Probá con otras fechas, menos huéspedes o quitá el filtro de tipo.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((room) => (
            <RoomCard key={room.id} room={room} nights={nights} onReserve={setSelectedRoom} />
          ))}
        </div>
      )}

      {selectedRoom && (
        <ReservationModal
          room={selectedRoom}
          initial={searchValues}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
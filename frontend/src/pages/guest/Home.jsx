import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { EXTRAS } from "../../data/constants";
import { formatCurrency } from "../../utils/format";
import { validateDates } from "../../utils/booking";
import { nightsBetween } from "../../utils/dates";
import SearchBar from "../../components/guest/SearchBar";
import RoomCard from "../../components/guest/RoomCard";
import ReservationModal from "../../components/guest/ReservationModal";

const EMPTY_SEARCH = { checkIn: "", checkOut: "", guests: 1 };

const FEATURED_IDS = ["r-301", "r-201", "r-104"];

export default function Home() {
  const { rooms } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useLocalStorage("aurora_search", EMPTY_SEARCH);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const featured = rooms.filter((room) => room.active && FEATURED_IDS.includes(room.id));

  const hasDates = validateDates(search.checkIn, search.checkOut).ok;
  const searchValues = hasDates ? search : { ...EMPTY_SEARCH, guests: search.guests };
  const nights = hasDates ? nightsBetween(search.checkIn, search.checkOut) : 0;

  const handleSearch = (values) => {
    setSearch(values);
    navigate("/habitaciones");
  };

  return (
    <div>
      <section className="bg-primary pt-20 pb-32 md:pt-28 md:pb-40">
        <div className="mx-auto max-w-6xl px-6">
          <span className="accent-rule" aria-hidden="true" />
          <p className="eyebrow !text-accent">Hotel Aurora</p>
          <h1 className="mt-3 max-w-2xl text-4xl !text-white md:text-6xl">
            Descansá donde la luz es mejor.
          </h1>
          <p className="mt-6 max-w-xl text-white/75">
            Un hotel chico de diez habitaciones, con desayuno regional y atención personalizada.
            Elegí tus fechas y reservá en pocos pasos.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-6 md:-mt-20">
        <SearchBar initial={searchValues} onSearch={handleSearch} />
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="accent-rule" aria-hidden="true" />
            <h2 className="text-3xl md:text-4xl">Habitaciones destacadas</h2>
          </div>
          <Link to="/habitaciones" className="btn-secondary">Ver todas</Link>
        </div>

        {featured.length === 0 ? (
          <div className="card mt-8 text-center">
            <p className="text-sm text-muted">
              Por ahora no hay habitaciones destacadas. Mirá todas las habitaciones disponibles.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((room) => (
              <RoomCard key={room.id} room={room} nights={nights} onReserve={setSelectedRoom} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-20">
        <span className="accent-rule" aria-hidden="true" />
        <h2 className="text-3xl md:text-4xl">Servicios extra</h2>
        <p className="mt-2 text-muted">Los podés sumar al reservar.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {EXTRAS.map((extra) => (
            <article key={extra.id} className="card">
              <h3 className="text-xl">{extra.name}</h3>
              <p className="mt-2 text-sm text-muted">{extra.description}</p>
              <p className="mt-4 text-sm font-medium text-primary">
                {formatCurrency(extra.price)}
                <span className="font-normal text-muted">
                  {extra.pricing === "por_persona_noche" ? " por persona y noche" : " por estadía"}
                </span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-20">
        <div className="card grid gap-8 md:grid-cols-2">
          <div>
            <span className="accent-rule" aria-hidden="true" />
            <h2 className="text-3xl md:text-4xl">Cómo llegar</h2>
            <p className="mt-4 text-muted">
              Estamos a pocas cuadras del centro y a diez minutos de la terminal de ómnibus.
              Si llegás en micro, podés pedir el traslado al reservar.
            </p>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="eyebrow">Dirección</dt>
              <dd className="mt-1">Av. del Sol 1250, Villa Aurora</dd>
            </div>
            <div>
              <dt className="eyebrow">Check-in y check-out</dt>
              <dd className="mt-1">Check-in desde las 14 h · Check-out hasta las 11 h</dd>
            </div>
            <div>
              <dt className="eyebrow">Contacto</dt>
              <dd className="mt-1">recepcion@aurora.com</dd>
            </div>
          </dl>
        </div>
      </section>

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
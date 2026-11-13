import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../data/constants";
import { formatCurrency } from "../../utils/format";
import { validateDates } from "../../utils/booking";
import { nightsBetween } from "../../utils/dates";
import ReservationModal from "../../components/guest/ReservationModal";

const EMPTY_SEARCH = { checkIn: "", checkOut: "", guests: 1 };


export default function RoomDetail() {
  const { id } = useParams();
  const { getRoomById } = useData();
  const { isLoggedIn } = useAuth();
  const [search] = useLocalStorage(STORAGE_KEYS.SEARCH, EMPTY_SEARCH);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const room = getRoomById(id);

  if (!room || !room.active) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="card text-center">
          <h1 className="text-3xl">No encontramos esa habitación</h1>
          <p className="mt-2 text-sm text-muted">
            Puede que ya no esté disponible o que el link sea incorrecto.
          </p>
          <Link to="/habitaciones" className="btn-primary mt-6">Ver habitaciones</Link>
        </div>
      </div>
    );
  }

  let images = [];
  if (room.images && room.images.length > 0) images = room.images;
  else if (room.image) images = [room.image];

  const hasDates = validateDates(search.checkIn, search.checkOut).ok;
  const searchValues = hasDates ? search : { ...EMPTY_SEARCH, guests: search.guests };
  const nights = hasDates ? nightsBetween(search.checkIn, search.checkOut) : 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link to="/habitaciones" className="text-sm text-muted transition hover:text-accent">
        ← Volver a habitaciones
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Fotos */}
        <div>
          {images.length > 0 ? (
            <>
              <img
                src={images[selectedImage]}
                alt={room.name}
                className="h-80 w-full rounded-card object-cover shadow-sm"
              />
              {images.length > 1 && (
                <div className="mt-3 flex gap-3">
                  {images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`Ver foto ${index + 1}`}
                      className={`overflow-hidden rounded-card border-2 ${
                        index === selectedImage ? "border-accent" : "border-transparent"
                      }`}
                    >
                      <img src={src} alt="" className="h-16 w-24 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center rounded-card bg-primary">
              <span className="eyebrow text-accent">{room.type}</span>
              <span className="font-display text-7xl text-white">{room.number}</span>
            </div>
          )}
        </div>

        {/* Datos */}
        <div>
          <span className="accent-rule" aria-hidden="true" />
          <p className="eyebrow">
            {room.type} · Hab. {room.number}
          </p>
          <h1 className="mt-1 text-4xl md:text-5xl">{room.name}</h1>
          <p className="mt-4 text-muted">{room.description}</p>

          <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="eyebrow">Capacidad</dt>
              <dd className="mt-1">
                {room.capacity} {room.capacity === 1 ? "huésped" : "huéspedes"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Camas</dt>
              <dd className="mt-1">{room.beds}</dd>
            </div>
            <div>
              <dt className="eyebrow">Tamaño</dt>
              <dd className="mt-1">{room.size} m²</dd>
            </div>
          </dl>

          <h2 className="mt-8 text-2xl">Comodidades</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(room.amenities ?? []).map((item) => (
              <span key={item} className="badge bg-bg text-muted">
                {item}
              </span>
            ))}
          </div>

          <div className="card mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-primary">{formatCurrency(room.pricePerNight)}</p>
              <p className="text-xs text-muted">por noche</p>
              {nights > 0 && (
                <p className="mt-1 text-xs text-muted">
                  {nights} {nights === 1 ? "noche" : "noches"}: {formatCurrency(room.pricePerNight * nights)}
                </p>
              )}
            </div>

            {isLoggedIn ? (
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                Reservar
              </button>
            ) : (
              <Link
                to="/login"
                state={{ from: { pathname: `/habitaciones/${room.id}` } }}
                className="btn-primary"
              >
                Ingresar para reservar
              </Link>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ReservationModal room={room} initial={searchValues} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
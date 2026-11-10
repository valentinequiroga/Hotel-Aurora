import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { ACTIVE_STATUSES, RESERVATION_STATUS } from "../../data/constants";
import { canGuestCancel } from "../../utils/booking";
import { formatDate } from "../../utils/dates";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ReservationCard from "../../components/guest/ReservationCard";

export default function MyReservations() {
  const { user } = useAuth();
  const { reservations, setReservations, getRoomById, getReservationsByUser } = useData();
  const [toCancel, setToCancel] = useState(null);

  const mine = getReservationsByUser(user.id);

  const upcoming = mine
    .filter((r) => ACTIVE_STATUSES.includes(r.status))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const history = mine
    .filter((r) => !ACTIVE_STATUSES.includes(r.status))
    .sort((a, b) => b.checkIn.localeCompare(a.checkIn));

  const roomToCancel = toCancel ? getRoomById(toCancel.roomId) : null;

  const handleConfirmCancel = () => {
    const current = reservations.find((r) => r.id === toCancel.id);
    if (!current || !canGuestCancel(current)) {
      toast.error("Esta reserva ya no se puede cancelar.");
      setToCancel(null);
      return;
    }
    setReservations((prev) =>
      prev.map((r) => (r.id === current.id ? { ...r, status: RESERVATION_STATUS.CANCELLED } : r))
    );
    toast.success("Cancelaste tu reserva.");
    setToCancel(null);
  };

  const renderCards = (list) =>
    list.map((r) => (
      <ReservationCard key={r.id} reservation={r} room={getRoomById(r.roomId)} onCancel={setToCancel} />
    ));

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <span className="accent-rule" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl">Mis reservas</h1>
      <p className="mt-2 text-muted">Seguí el estado de tus estadías y cancelá las que todavía no empezaron.</p>

      {mine.length === 0 ? (
        <div className="card mt-8 text-center">
          <h2 className="text-2xl">Todavía no tenés reservas</h2>
          <p className="mt-2 text-sm text-muted">Elegí tus fechas y encontrá la habitación ideal.</p>
          <Link to="/habitaciones" className="btn-primary mt-6">
            Ver habitaciones
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-10">
            <h2 className="text-2xl">Próximas y en curso</h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No tenés reservas vigentes.</p>
            ) : (
              <div className="mt-4 space-y-4">{renderCards(upcoming)}</div>
            )}
          </section>

          {history.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl">Historial</h2>
              <div className="mt-4 space-y-4">{renderCards(history)}</div>
            </section>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Cancelar reserva"
        message={
          toCancel
            ? `Vas a cancelar tu reserva de ${roomToCancel ? roomToCancel.name : "la habitación"} del ${formatDate(toCancel.checkIn)} al ${formatDate(toCancel.checkOut)}. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Sí, cancelar reserva"
        danger
        onConfirm={handleConfirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </div>
  );
}
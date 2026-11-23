import { useData } from "../../context/DataContext";
import { formatDate } from "../../utils/dates";
import { formatCurrency } from "../../utils/format";
import StatCard from "../../components/admin/StatCard";

export default function Dashboard() {
  const { reservations, rooms, getRoomById } = useData();
  const hoy = new Date().toLocaleDateString("en-CA"); // "2026-11-22"

  //Reservas pendientes
  const reservasPendientes = reservations.filter(
    (reserva) => reserva.status === "pendiente"
  );

  // Reservas válidas: todas menos las canceladas y las pendientes
  const confirmadas = reservations.filter(
    (reserva) => reserva.status !== "cancelada" && reserva.status !== "pendiente"
  );

  const ocupadasHoy = confirmadas.filter(
    (reserva) => reserva.checkIn <= hoy && hoy < reserva.checkOut
  );

  const habitacionesActivas = rooms.filter((habitacion) => habitacion.active);
  const ocupacion = habitacionesActivas.length
    ? Math.round((ocupadasHoy.length / habitacionesActivas.length) * 100)
    : 0;


  const mesActual = hoy.slice(0, 7);

  const ingresos = confirmadas
    .filter((reserva) => reserva.checkIn.startsWith(mesActual))
    .reduce((acumulado, reserva) => acumulado + reserva.total, 0);

  // Próximos check-in y check-out (desde hoy, ordenados, los 5 primeros)
  const proximosCheckIn = confirmadas
    .filter((reserva) => reserva.checkIn >= hoy)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .slice(0, 5);

  const proximosCheckOut = confirmadas
    .filter((reserva) => reserva.checkOut >= hoy)
    .sort((a, b) => a.checkOut.localeCompare(b.checkOut))
    .slice(0, 5);

  return (
    <div>
      <span className="accent-rule" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl pb-5">Panel de recepción</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard titulo="Ocupación de hoy" valor={`${ocupacion}%`} />
        <StatCard titulo="Reservas pendientes" valor={reservasPendientes.length} />
        <StatCard titulo="Ingresos del mes" valor={formatCurrency(ingresos)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl mb-3">Próximos check-in</h2>
          <ul>
            {proximosCheckIn.map((reserva) => (
              <li key={reserva.id}>
                {formatDate(reserva.checkIn)} · {getRoomById(reserva.roomId)?.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl mb-3">Próximos check-out</h2>
          <ul>
            {proximosCheckOut.map((reserva) => (
              <li key={reserva.id}>
                {formatDate(reserva.checkOut)} · {getRoomById(reserva.roomId)?.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
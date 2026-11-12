import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { RESERVATION_STATUS } from "../../data/constants";
import { formatDate } from "../../utils/dates";
import { formatCurrency } from "../../utils/format";

export default function AdminReservations() {
  const { reservations, setReservations, getRoomById } = useData();
  const { getUserById } = useAuth();
  const [filter, setFilter] = useState("todas");
  const visible =
    filter === "todas"
      ? reservations
      : reservations.filter((res) => res.status === filter);
  const cambiarEstadoDeReserva = (idDeLaReserva, nuevoEstado) => {   // los dos los llena el botón
    setReservations((listaActualDeReservas) =>                       // lo llena React
      listaActualDeReservas.map((reservaActual) =>                   // lo llena .map
        reservaActual.id === idDeLaReserva
          ? { ...reservaActual, status: nuevoEstado }
          : reservaActual
      )
    );
  };
  const estadosPermitidosDesdeCadaEstado = {
    pendiente: ["confirmada", "cancelada"],
    confirmada: ["checkin", "cancelada"],
    checkin: ["finalizada"],
    finalizada: [],
    cancelada: [],
  };

  return (
    <div>
      <span className="accent-rule" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl">Reservas</h1>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="todas">Todas</option>
        {Object.values(RESERVATION_STATUS).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr>
            <th>Huésped</th>
            <th>Habitación</th>
            <th>Fechas</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((res) => (
            <tr key={res.id}>
              <td>{getUserById(res.userId)?.name}</td>
              <td>{getRoomById(res.roomId)?.name}</td>
              <td>{formatDate(res.checkIn)} → {formatDate(res.checkOut)}</td>
              <td>{formatCurrency(res.total)}</td>
              <td>{res.status}</td>
              <td>
                <select
                  value={res.status}
                  onChange={(e) => cambiarEstadoDeReserva(res.id, e.target.value)}
                >
                  <option value={res.status}>{res.status}</option>
                  {estadosPermitidosDesdeCadaEstado[res.status].map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
}
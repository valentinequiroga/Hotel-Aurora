import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/dates";
import { formatCurrency } from "../../utils/format";
import { toast } from "react-toastify";
import { RESERVATION_STATUS, STATUS_META } from "../../data/constants";

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
    toast.success(`Estado actualizado a "${nuevoEstado}"`);
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
      <h1 className="text-4xl md:text-5xl  pb-5">Reservas</h1>

      <select className="input w-auto py-1" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="todas">Todas</option>
        {Object.values(RESERVATION_STATUS).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="card mt-3 overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="eyebrow border-b border-line">
            <tr>
              <th className="px-6 py-4 font-medium">Huésped</th>
              <th className="px-6 py-4 font-medium">Habitación</th>
              <th className="px-6 py-4 font-medium">Fechas</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((res) => (
              <tr key={res.id} className="transition hover:bg-bg">
                <td className="px-6 py-5">{getUserById(res.userId)?.name}</td>
                <td className="px-6 py-5">{getRoomById(res.roomId)?.name}</td>
                <td className="whitespace-nowrap px-6 py-5 text-muted">{formatDate(res.checkIn)} → {formatDate(res.checkOut)}</td>
                <td className="px-6 py-5">{formatCurrency(res.total)}</td>
                <td className="px-6 py-5">
                  <span className={`badge ${STATUS_META[res.status].badge}`}>
                    {STATUS_META[res.status].label}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  {estadosPermitidosDesdeCadaEstado[res.status].length === 0 ? (
                    <span className="text-muted">—</span>
                  ) : (
                    <select
                      className="input w-auto py-1.5"
                      value=""
                      onChange={(e) => cambiarEstadoDeReserva(res.id, e.target.value)}
                    >
                      <option value="" disabled>Cambiar a…</option>
                      {estadosPermitidosDesdeCadaEstado[res.status].map((estado) => (
                        <option key={estado} value={estado}>{STATUS_META[estado].label}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
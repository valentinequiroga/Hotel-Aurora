import { useData } from "../../context/DataContext";
import { STATUS_META } from "../../data/constants";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Occupancy() {

  const { rooms, reservations } = useData();
  const { getUserById } = useAuth();
  const [desplazamiento, setDesplazamiento] = useState(0);
  const dias = [];

  for (let i = 0; i < 30; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    dias.push(fecha);
  }

  const convertirATexto = (dia) => {
    const anio = dia.getFullYear();
    const mes = String(dia.getMonth() + 1).padStart(2, "0");
    const numeroDeDia = String(dia.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${numeroDeDia}`;
  };

  

  const buscarReserva = (habitacion, dia) => {
    const diaTexto = convertirATexto(dia);

    return reservations.find((reserva) =>
      reserva.roomId === habitacion.id &&
      reserva.checkIn <= diaTexto &&
      diaTexto < reserva.checkOut &&
      reserva.status !== "cancelada"
    );
  };

  return (

    <div>
      <span className="accent-rule" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl pb-5">Calendario de Reservas</h1>

      <div className="flex gap-5 mb-4 text-sm">
        {Object.entries(STATUS_META)
          .filter(([estado]) => estado !== "cancelada")
          .map(([estado, meta]) => (
            <div key={estado} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full border ${meta.cell}`}></span>
              {meta.label}
            </div>
          ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4">

        {/* Izquierda: habitaciones (quietas) */}
        <table className="text-sm">
          <thead>
            <tr>
              <th className="h-10 pr-4 text-left">Habitación</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((habitacion) => (
              <tr key={habitacion.id}>
                <td className="h-9 pr-4 whitespace-nowrap">{habitacion.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Derecha: días (se desplazan) */}
        <div className="overflow-x-auto flex-1 border border-gray-100 rounded-lg">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                {dias.map((dia) => (
                  <th key={dia.toDateString()} className="h-10 px-2 text-center font-medium min-w-12">
                    {dia.getDate()}/{dia.getMonth() + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((habitacion) => (
                <tr key={habitacion.id}>
                  {dias.map((dia, indice) => {
                    const reserva = buscarReserva(habitacion, dia);
                    const diaTexto = convertirATexto(dia);
                    const diaSiguiente = dias[indice + 1];

                    const esInicio = reserva && (reserva.checkIn === diaTexto || indice === 0);
                    const esFin = reserva && (!diaSiguiente || convertirATexto(diaSiguiente) === reserva.checkOut);

                    return (
                      <td key={dia.toDateString()} className="h-10 w-12 min-w-12 border border-gray-100 py-1 px-0">
                        {reserva && (
                          <div
                            className={`h-full flex items-center relative
                  ${STATUS_META[reserva.status].cell}
                  ${esInicio ? "rounded-l-lg ml-1" : "-ml-px"}
                  ${esFin ? "rounded-r-lg mr-1" : "-mr-px"}`}
                          >
                            {esInicio && (
                              <div className="relative z-10 w-0 whitespace-nowrap px-2 text-xs font-medium">
                                {getUserById(reserva.userId)?.name}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div >
  );
}

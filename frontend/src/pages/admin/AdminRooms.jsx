import { useData } from "../../context/DataContext";
import { formatCurrency } from "../../utils/format";

export default function AdminRooms() {
  const { rooms, setRooms, reservations } = useData();

  //Funciones
  const cambiarEstadoDeHabitacion = (idDeLaHabitacion) => {
    setRooms((listaActualDeHabitaciones) =>
      listaActualDeHabitaciones.map((habitacion) =>
        habitacion.id === idDeLaHabitacion
          ? { ...habitacion, active: !habitacion.active }
          : habitacion
      )
    );
  }

  const tieneReservasActivas = (idDeLaHabitacion) =>
    reservations.some(
      (res) =>
        res.roomId === idDeLaHabitacion &&
        res.status !== "cancelada" &&
        res.status !== "finalizada"
    );

  const borrarHabitacion = (idDeLaHabitacion) => {
    if (tieneReservasActivas(idDeLaHabitacion)) {
      alert("No se puede eliminar: la habitación tiene reservas activas.");
      return;                                  // corta acá, no borra
    }

    setRooms((listaActualDeHabitaciones) =>
      listaActualDeHabitaciones.filter(
        (habitacion) => habitacion.id !== idDeLaHabitacion
      )
    );
  };

  return (
    <div>
      <span className="accent-rule" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl  pb-5">Habitaciones</h1>
      <div className="card mt-3 overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="eyebrow border-b border-line">
            <tr>
              <th className="px-6 py-4 font-medium">N.º</th>
              <th className="px-6 py-4 font-medium">Nombre</th>
              <th className="px-6 py-4 font-medium">Tipo</th>
              <th className="px-6 py-4 font-medium">Capacidad</th>
              <th className="px-6 py-4 font-medium">Camas</th>
              <th className="px-6 py-4 font-medium">Precio/noche</th>
              <th className="px-6 py-4 font-medium">Tamaño</th>
              <th className="px-6 py-4 font-medium ">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {rooms.map((habitacion) => (           // habitacion: lo llena .map, una por vuelta
              <tr key={habitacion.id} className="transition-colors hover:bg-line/30 ">             {/* key: React necesita saber qué fila es cuál */}
                <td className="px-6 py-4">{habitacion.number}</td>
                <td className="px-6 py-4">{habitacion.name}</td>
                <td className="px-6 py-4">{habitacion.type}</td>
                <td className="px-6 py-4">{habitacion.capacity}</td>
                <td className="px-6 py-4 ">{habitacion.beds}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(habitacion.pricePerNight)}</td>
                <td className="px-6 py-4">{habitacion.size}</td>
                <td className="px-6 py-5 ">
                  <span
                    onClick={() => cambiarEstadoDeHabitacion(habitacion.id)}
                    className={
                      habitacion.active
                        ? "rounded-full border px-3 py-1 text-s transition-colors bg-ok-bg text-ok-text border-ok-text/20 hover:border-ok-text"
                        : "rounded-full border px-3 py-1 text-s transition-colors bg-bad-bg text-bad-text border-bad-text/20 hover:border-bad-text"
                    }
                  >
                    {habitacion.active ? "Activa" : "Inactiva"}
                  </span>

                </td>
                <td className="px-6 py-5 ">
                  <button
                    onClick={() => borrarHabitacion(habitacion.id)}
                    className="rounded-full border border-line px-3 py-1 text-s transition-colors hover:bg-bad-bg hover:text-bad-text hover:border-bad-text/20"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}

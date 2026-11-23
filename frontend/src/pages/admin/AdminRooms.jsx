import { useData } from "../../context/DataContext";
import { formatCurrency } from "../../utils/format";
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import RoomForm from "../../components/admin/RoomForm";
import { Pencil } from "lucide-react";

export default function AdminRooms() {
  const { rooms, setRooms, reservations } = useData();
  const [habitacionEditando, setHabitacionEditando] = useState(null);

  const habitacionVacia = {
    name: "",
    pricePerNight: "",
    number: "",
    type: "Simple",
    capacity: "",
    beds: "",
    size: "",
    active: true,
    description: "",
    amenities: [],
    image: "",
  };

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

  const guardarHabitacion = (habitacionEditada) => {
    if (habitacionEditada.id) {
      setRooms((listaActualDeHabitaciones) =>
        listaActualDeHabitaciones.map((habitacion) =>
          habitacion.id === habitacionEditada.id
            ? {
              ...habitacionEditada, pricePerNight: Number(habitacionEditada.pricePerNight), capacity: Number(habitacionEditada.capacity),
              size: Number(habitacionEditada.size),
              amenities: habitacionEditada.amenities
                .map((comodidad) => comodidad.trim())
                .filter((comodidad) => comodidad !== ""),
            }
            : habitacion
        )
      );

    } else {
      setRooms((listaActualDeHabitaciones) => [
        ...listaActualDeHabitaciones,
        {
          ...habitacionEditada,
          pricePerNight: Number(habitacionEditada.pricePerNight),
          id: `room-${Date.now()}`,
        },
      ]);
    }

    setHabitacionEditando(null);   // cierra el modal
  };


  return (
    <div>
      <span className="accent-rule" aria-hidden="true" />
      <div className="flex items-center justify-between ">
        <h1 className="text-4xl md:text-5xl pb-3">Habitaciones</h1>

        <div className="flex justify-end">
          <button
            onClick={() => setHabitacionEditando(habitacionVacia)}
            className="rounded-full px-4 py-1.5 text-sm transition-colors bg-primary text-white hover:opacity-80"
          >
            + Nueva habitación
          </button>
        </div>
      </div>

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
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <button
                      onClick={() => setHabitacionEditando(habitacion)}
                      className="rounded-full border border-line px-3 py-1 text-xs text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      <Pencil size={16} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => borrarHabitacion(habitacion.id)}
                      className="rounded-card px-3 py-1.5 text-sm font-medium text-bad-text hover:bg-bad-bg disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {habitacionEditando && (
          <Modal
            title={habitacionEditando.id ? "Editar habitación" : "Nueva habitación"}
            onClose={() => setHabitacionEditando(null)}
          >
            <RoomForm
              habitacionInicial={habitacionEditando}
              onGuardar={guardarHabitacion}
              onCancelar={() => setHabitacionEditando(null)}
            />
          </Modal>
        )}

      </div>
    </div>

  );
}

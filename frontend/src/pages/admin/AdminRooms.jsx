import { useData } from "../../context/DataContext";
import { formatCurrency } from "../../utils/format";

export default function AdminRooms() {
  const { rooms, setRooms} = useData();
  
  //Funciones
  const cambiarEstadoDeHabitacion = (idDeLaHabitacion) => {
    setRooms((listaActualDeHabitaciones) => 
    listaActualDeHabitaciones.map((habitacion) =>
    habitacion.id === idDeLaHabitacion
     ? {...habitacion, active: !habitacion.active }
     :habitacion
      )
    );
  }

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
        
        <tbody>
          {rooms.map((habitacion) => (           // habitacion: lo llena .map, una por vuelta
            <tr key={habitacion.id}>             {/* key: React necesita saber qué fila es cuál */}
              <td className="px-6 py-4">{habitacion.number}</td>
              <td className="px-6 py-4">{habitacion.name}</td>
              <td className="px-6 py-4">{habitacion.type}</td>
              <td className="px-6 py-4">{habitacion.capacity}</td>
              <td className="px-6 py-4">{habitacion.beds}</td>
              <td className="px-6 py-4">{formatCurrency(habitacion.pricePerNight)}</td> 
              <td className="px-6 py-4">{habitacion.size}</td>
              <td className="px-6 py-4">{habitacion.active ? "Activa" : "Inactiva"}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => cambiarEstadoDeHabitacion (habitacion.id) }>
                 { habitacion.active ? "Desactivar" : "Activar" }
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

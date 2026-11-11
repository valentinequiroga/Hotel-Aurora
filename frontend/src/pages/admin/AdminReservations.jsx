import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext"
import { formatDate } from "../../utils/dates";
import { formatCurrency } from "../../utils/format";


export default function AdminReservations() {
  const { reservations, getRoomById } = useData();
  const { getUserById } = useAuth();

  return (
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
      {reservations.map((res) => (
        <tr key={res.id}>
          <td>{getUserById(res.userId)?.name}</td>
          <td>{getRoomById(res.roomId)?.name}</td>
          <td>{formatDate(res.checkIn)} → {formatDate(res.checkOut)}</td>
          <td>{formatCurrency(res.total)}</td>
          <td>{res.status}</td>
        </tr>
      ))}


    </tbody>

    </table>




    /*
        <div>
          <span className="accent-rule" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl">Reservas</h1>
    
          <ul className="mt-8 space-y-2">
            {reservations.map((res) => (
              <li key={res.id}>
                {getUserById(res.userId)?.name} 
                <br />
                {res.id} · {getRoomById(res.roomId)?.name} · {res.status}
              </li>
            ))}
          </ul>
        </div>*/
  );
}
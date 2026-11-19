import { useData } from "../../context/DataContext";

export default function Occupancy() {

  const { rooms, reservations } = useData();

  const dias = [];

  for (let i = 0; i < 14; i++) {
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

  console.log(convertirATexto(dias[0]));

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
      <h1 className="text-4xl md:text-5xl pb-5">Grilla de ocupación</h1>


      <table>
        <thead>
          <tr>
            <th>Habitación</th>
            {dias.map((dia) => (
              <th key={dia.toDateString()} className="px-2">
                {dia.getDate()}/{dia.getMonth() + 1}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rooms.map((habitacion) => (
            <tr key={habitacion.id}>
              <td>{habitacion.name}</td>
              {dias.map((dia) => (
                <td key={dia.toDateString()}>
                  {buscarReserva(habitacion, dia) ? "X" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

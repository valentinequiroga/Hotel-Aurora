import Placeholder from "../../components/ui/Placeholder";

// TODO (Persona B): reemplazar este placeholder por la página real.
export default function Rooms() {
  return (
    <Placeholder
      title="Habitaciones"
      owner="Persona B"
      todo={[
    "Listado de habitaciones activas con RoomCard",
    "Filtro por fechas y cantidad de personas (disponibilidad)",
    "Botón Reservar: si no hay sesión, mandar a /login",
      ]}
    />
  );
}

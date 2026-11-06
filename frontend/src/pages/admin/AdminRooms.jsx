import Placeholder from "../../components/ui/Placeholder";

// TODO (Persona C): reemplazar este placeholder por la página real.
export default function AdminRooms() {
  return (
    <Placeholder
      inPanel
      title="Habitaciones"
      owner="Persona C"
      todo={[
    "Tabla de habitaciones con alta, edición, baja y activar/desactivar",
    "RoomForm dentro de un Modal (Portal)",
    "Reglas de borrado: no eliminar con reservas activas",
      ]}
    />
  );
}

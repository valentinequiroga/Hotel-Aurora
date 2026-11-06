import Placeholder from "../../components/ui/Placeholder";

// TODO (Persona C): reemplazar este placeholder por la página real.
export default function AdminReservations() {
  return (
    <Placeholder
      inPanel
      title="Reservas"
      owner="Persona C"
      todo={[
    "Tabla de reservas con filtros por estado",
    "Cambiar estado: pendiente → confirmada → check-in → finalizada / cancelada",
      ]}
    />
  );
}

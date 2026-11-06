import Placeholder from "../../components/ui/Placeholder";

// TODO (Persona C): reemplazar este placeholder por la página real.
export default function Occupancy() {
  return (
    <Placeholder
      inPanel
      title="Grilla de ocupación"
      owner="Persona C"
      todo={[
    "Habitaciones en filas y los próximos 14 días en columnas",
    "Reservas coloreadas según STATUS_META[estado].cell",
      ]}
    />
  );
}

import Placeholder from "../../components/ui/Placeholder";

// TODO (Persona C): reemplazar este placeholder por la página real.
export default function Dashboard() {
  return (
    <Placeholder
      inPanel
      title="Panel de recepción"
      owner="Persona C"
      todo={[
    "StatCard: ocupación de hoy, reservas pendientes, ingresos",
    "Próximos check-in y check-out",
      ]}
    />
  );
}

import Placeholder from "../../components/ui/Placeholder";

// TODO (Persona B): reemplazar este placeholder por la página real.
export default function MyReservations() {
  return (
    <Placeholder
      title="Mis reservas"
      owner="Persona B"
      todo={[
    "Reservas del usuario logueado (useData().getReservationsByUser(user.id))",
    "Cancelar las que todavía no empezaron",
      ]}
    />
  );
}

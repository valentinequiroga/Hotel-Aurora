import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import Logo from "../ui/Logo";

const YEAR = new Date().getFullYear();

// Pie simple: logo, links y copyright en una línea, como en la guía
export default function Footer() {
  const { resetDemoData } = useData();

  const handleReset = () => {
    if (window.confirm("¿Volver a los datos de ejemplo? Se pierden los cambios hechos.")) {
      resetDemoData();
    }
  };

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 text-sm text-muted md:flex-row md:justify-between">
        <Link to="/" aria-label="Ir al inicio">
          <Logo size="text-xl" />
        </Link>
        <nav className="flex gap-6">
          <Link to="/habitaciones" className="transition hover:text-accent">Habitaciones</Link>
          <Link to="/mis-reservas" className="transition hover:text-accent">Mis reservas</Link>
          <button onClick={handleReset} className="transition hover:text-accent">Restablecer demo</button>
        </nav>
        <p>© {YEAR} Hotel Aurora</p>
      </div>
    </footer>
  );
}

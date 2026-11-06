import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <span className="accent-rule" aria-hidden="true" />
      <p className="font-display text-8xl text-primary">404</p>
      <h1 className="mt-4 text-3xl">Esta habitación no existe</h1>
      <p className="mt-3 text-muted">
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>
      <div className="mt-10 flex gap-3">
        <Link to="/" className="btn-primary">Volver al inicio</Link>
        <Link to="/habitaciones" className="btn-secondary">Ver habitaciones</Link>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";

// Secciones del panel. Para sumar una nueva, agregala acá y en las rutas de App.jsx.
const adminLinks = [
  { to: "/admin", label: "Panel de recepción", end: true },
  { to: "/admin/ocupacion", label: "Ocupación" },
  { to: "/admin/reservas", label: "Reservas" },
  { to: "/admin/habitaciones", label: "Habitaciones" },
  { to: "/admin/usuarios", label: "Usuarios" },
];

const linkClass = ({ isActive }) =>
  `block rounded-card px-4 py-2.5 text-[15px] transition duration-200 ${
    isActive ? "bg-bg font-medium text-text" : "text-muted hover:text-accent"
  }`;

// Estructura del panel de recepción: barra lateral blanca + contenido sobre fondo claro
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Cerraste sesión.");
    navigate("/");
  };

  const nav = (
    <nav className="flex flex-col gap-1">
      {adminLinks.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} className={linkClass} onClick={() => setOpen(false)}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  const account = (
    <div className="space-y-3 border-t border-line pt-5">
      <div>
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted">{user.email}</p>
      </div>
      <div className="flex gap-2">
        <Link to="/" className="btn-secondary flex-1 px-3 py-2">Ver sitio</Link>
        <button onClick={handleLogout} className="btn-secondary flex-1 px-3 py-2">Salir</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:flex">
      {/* Barra lateral (escritorio) */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-line bg-surface px-6 py-10 md:sticky md:top-0 md:flex md:h-screen">
        <div className="space-y-10">
          <Link to="/admin" className="block px-1">
            <Logo size="text-3xl" />
          </Link>
          {nav}
        </div>
        {account}
      </aside>

      {/* Barra superior (celular) */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface md:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button className="p-2" onClick={() => setOpen((v) => !v)} aria-label="Abrir menú" aria-expanded={open}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        {open && <div className="space-y-6 px-5 pb-6">{nav}{account}</div>}
      </header>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-14 md:py-12">
        <Outlet />
      </main>
    </div>
  );
}

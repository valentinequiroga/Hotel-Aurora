import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../data/constants";
import Logo from "../ui/Logo";

// Barra superior azul noche. Los links pasan a dorado al hacer hover o estar activos.
const linkClass = ({ isActive }) =>
  `text-sm font-medium transition duration-200 hover:text-accent ${isActive ? "text-accent" : "text-white"}`;

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    toast.info("Cerraste sesión. ¡Te esperamos pronto!");
    navigate("/");
  };

  const links = (
    <>
      <NavLink to="/habitaciones" className={linkClass} onClick={close}>Habitaciones</NavLink>
      {isLoggedIn && !isAdmin && (
        <NavLink to="/mis-reservas" className={linkClass} onClick={close}>Mis reservas</NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin" className={linkClass} onClick={close}>Panel de recepción</NavLink>
      )}
    </>
  );

  const account = isLoggedIn ? (
    <div className="flex items-center gap-4">
      <div className="leading-tight md:text-right">
        <p className="text-sm font-medium text-white">{user.name}</p>
        <p className="text-xs text-white/60">{ROLE_LABELS[user.role]}</p>
      </div>
      <button onClick={handleLogout} className="btn-light">Salir</button>
    </div>
  ) : (
    <div className="flex items-center gap-5">
      <NavLink to="/login" className={linkClass} onClick={close}>Ingresar</NavLink>
      <Link to="/registro" className="btn-light" onClick={close}>Crear cuenta</Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 bg-primary">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link to="/" aria-label="Hotel Aurora, ir al inicio">
          <Logo light />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links}
          <span className="h-5 w-px bg-white/20" aria-hidden="true" />
          {account}
        </div>

        <button
          className="rounded-card p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 md:hidden">
          {links}
          {account}
        </div>
      )}
    </header>
  );
}

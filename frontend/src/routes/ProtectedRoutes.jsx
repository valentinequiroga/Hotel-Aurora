import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege rutas según sesión y rol. Se usa envolviendo rutas hijas:
 *
 *   <Route element={<ProtectedRoute />}>             -> cualquier usuario logueado
 *   <Route element={<ProtectedRoute role="admin" />}> -> solo administradores
 *
 * - Sin sesión: manda a /login y recuerda a dónde quería ir.
 * - Con sesión pero sin el rol: lo devuelve al inicio.
 */
export default function ProtectedRoute({ role }) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace state={{ denied: true }} />;
  }

  return <Outlet />;
}

/**
 * Para /login y /registro: si ya hay sesión, no tiene sentido mostrarlas.
 * También es la que redirige justo después de iniciar sesión o registrarse:
 * vuelve a la página protegida que se quería ver o, si no, al inicio según el rol.
 */
export function GuestOnlyRoute() {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoggedIn) {
    const from = location.state?.from?.pathname;
    return <Navigate to={from || (isAdmin ? "/admin" : "/")} replace />;
  }
  return <Outlet />;
}

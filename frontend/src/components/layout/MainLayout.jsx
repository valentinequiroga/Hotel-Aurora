import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Estructura común de todas las páginas: Navbar arriba, contenido y Footer abajo.
export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Volver arriba al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ProtectedRoute nos avisa cuando alguien entró a una ruta sin permiso
  useEffect(() => {
    if (location.state?.denied) {
      toast.warn("Esa sección es solo para el personal de recepción.");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

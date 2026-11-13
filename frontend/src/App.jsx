import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute, { GuestOnlyRoute } from "./routes/ProtectedRoute";
import { ROLES } from "./data/constants";

import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Persona A
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

// Persona B
import RoomDetail from "./pages/guest/RoomDetail";
import Home from "./pages/guest/Home";
import Rooms from "./pages/guest/Rooms";
import MyReservations from "./pages/guest/MyReservations";


// Persona C
import Dashboard from "./pages/admin/Dashboard";
import Occupancy from "./pages/admin/Occupancy";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminReservations from "./pages/admin/AdminReservations";

export default function App() {
  return (
    // DataProvider va afuera porque AuthProvider usa las reservas
    // para las reglas de borrado de usuarios
    <DataProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Público */}
              <Route path="/" element={<Home />} />
              <Route path="/habitaciones" element={<Rooms />} />
              <Route path="/habitaciones/:id" element={<RoomDetail />} />

              {/* Solo sin sesión */}
              <Route element={<GuestOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
              </Route>

              {/* Cualquier usuario logueado */}
              <Route element={<ProtectedRoute />}>
                <Route path="/mis-reservas" element={<MyReservations />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Solo administradores (recepción): tiene su propio layout con barra lateral */}
            <Route element={<ProtectedRoute role={ROLES.ADMIN} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="ocupacion" element={<Occupancy />} />
                <Route path="reservas" element={<AdminReservations />} />
                <Route path="habitaciones" element={<AdminRooms />} />
                <Route path="usuarios" element={<AdminUsers />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
      </AuthProvider>
    </DataProvider>
  );
}

import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useData } from "./DataContext";
import { ACTIVE_STATUSES, ROLES, STORAGE_KEYS } from "../data/constants";
import { seedUsers } from "../data/seeds";
import { generateId, isValidEmail } from "../utils/format";
import { todayISO } from "../utils/dates";

/*
  AuthContext: usuarios, sesión y roles.

  En cualquier componente:
    const { user, isLoggedIn, isAdmin, login, logout } = useAuth();

  Todas las funciones que pueden fallar devuelven { ok: true } o { ok: false, error: "mensaje" }
  para que la pantalla muestre el error con un toast o debajo del formulario.
*/

const AuthContext = createContext();

// Nunca exponemos la contraseña fuera del contexto
const withoutPassword = ({ password: _password, ...rest }) => rest;

export function AuthProvider({ children }) {
  const { reservations } = useData();
  const [users, setUsers] = useLocalStorage(STORAGE_KEYS.USERS, seedUsers);
  // En la sesión guardamos solo el id: así, si el admin cambia el rol o borra
  // la cuenta, el cambio se refleja enseguida para ese usuario.
  const [sessionUserId, setSessionUserId] = useLocalStorage(STORAGE_KEYS.SESSION, null);

  const storedUser = users.find((u) => u.id === sessionUserId);
  const user = storedUser ? withoutPassword(storedUser) : null;
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === ROLES.ADMIN;

  const findByEmail = (email) =>
    users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  const login = (email, password) => {
    const found = findByEmail(email);
    if (!found || found.password !== password) {
      return { ok: false, error: "El email o la contraseña no son correctos." };
    }
    setSessionUserId(found.id);
    return { ok: true, user: withoutPassword(found) };
  };

  const logout = () => setSessionUserId(null);

  const register = ({ name, email, phone, password }) => {
    if (!name.trim() || !email.trim() || !password) {
      return { ok: false, error: "Completá nombre, email y contraseña." };
    }
    if (!isValidEmail(email)) return { ok: false, error: "El email no es válido." };
    if (password.length < 6) {
      return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
    }
    if (findByEmail(email)) return { ok: false, error: "Ya existe una cuenta con ese email." };

    const newUser = {
      id: generateId("u"),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role: ROLES.GUEST, // las cuentas nuevas siempre son de huésped
      createdAt: todayISO(),
    };
    setUsers((prev) => [...prev, newUser]);
    setSessionUserId(newUser.id);
    return { ok: true, user: withoutPassword(newUser) };
  };

  // ---------- Gestión de usuarios (solo admin) ----------

  const adminCount = users.filter((u) => u.role === ROLES.ADMIN).length;

  const countActiveReservations = (userId) =>
    reservations.filter((r) => r.userId === userId && ACTIVE_STATUSES.includes(r.status)).length;

  const updateUserRole = (userId, role) => {
    if (!isAdmin) return { ok: false, error: "No tenés permisos para esta acción." };
    if (userId === user.id) return { ok: false, error: "No podés cambiar tu propio rol." };
    const target = users.find((u) => u.id === userId);
    if (!target) return { ok: false, error: "El usuario no existe." };
    if (target.role === ROLES.ADMIN && role !== ROLES.ADMIN && adminCount <= 1) {
      return { ok: false, error: "Tiene que quedar al menos un administrador." };
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    return { ok: true };
  };

  const deleteUser = (userId) => {
    if (!isAdmin) return { ok: false, error: "No tenés permisos para esta acción." };
    if (userId === user.id) return { ok: false, error: "No podés eliminar tu propia cuenta." };
    const target = users.find((u) => u.id === userId);
    if (!target) return { ok: false, error: "El usuario no existe." };
    if (target.role === ROLES.ADMIN && adminCount <= 1) {
      return { ok: false, error: "Tiene que quedar al menos un administrador." };
    }
    const active = countActiveReservations(userId);
    if (active > 0) {
      return {
        ok: false,
        error: `Tiene ${active} reserva(s) activa(s). Cancelalas o finalizalas antes de eliminar la cuenta.`,
      };
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return { ok: true };
  };

  // Lista pública de usuarios (sin contraseñas) para tablas y para mostrar
  // el nombre del huésped en las reservas
  const publicUsers = users.map(withoutPassword);
  const getUserById = (id) => publicUsers.find((u) => u.id === id);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        register,
        users: publicUsers,
        getUserById,
        updateUserRole,
        deleteUser,
        countActiveReservations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../data/constants";
import { seedRooms, getSeedReservations, seedUsers } from "../data/seeds";

/*
  DataContext: el "almacén" de habitaciones y reservas.
  Acá solo se guardan los datos. La lógica de negocio va en cada parte:
    - Persona B (huésped): disponibilidad, cálculo de precio, crear/cancelar reserva.
    - Persona C (admin): ABM de habitaciones, cambio de estados, métricas.
  Para modificar datos usen setRooms / setReservations con una función:
    setReservations(prev => [...prev, nuevaReserva])
*/

const DataContext = createContext();

export function DataProvider({ children }) {
  const [rooms, setRooms] = useLocalStorage(STORAGE_KEYS.ROOMS, seedRooms);
  const [reservations, setReservations] = useLocalStorage(
    STORAGE_KEYS.RESERVATIONS,
    getSeedReservations
  );

  const getRoomById = (id) => rooms.find((room) => room.id === id);

  const getReservationsByUser = (userId) =>
    reservations.filter((reservation) => reservation.userId === userId);

  // Vuelve todo al estado inicial (útil para la demo del día de la entrega)
  const resetDemoData = () => {
    setRooms(seedRooms);
    setReservations(getSeedReservations());
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.assign("/");
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        setRooms,
        reservations,
        setReservations,
        getRoomById,
        getReservationsByUser,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);

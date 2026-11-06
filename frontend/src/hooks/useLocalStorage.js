import { useEffect, useState } from "react";

/**
 * Igual que useState, pero el valor se guarda en localStorage.
 *
 *   const [rooms, setRooms] = useLocalStorage("aurora_rooms", seedRooms);
 *
 * - Si la clave no existe, arranca con initialValue (o lo que devuelva, si es función).
 * - Acepta actualizaciones funcionales: setRooms(prev => [...prev, nueva]).
 * - Si otra pestaña cambia la misma clave, este estado se actualiza solo.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    } catch (error) {
      console.warn(`No se pudo leer "${key}" de localStorage`, error);
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  // Cada vez que cambia el valor, lo guardamos
  useEffect(() => {
    try {
      if (value === undefined || value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`No se pudo guardar "${key}" en localStorage`, error);
    }
  }, [key, value]);

  // Sincroniza entre pestañas abiertas
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== key) return;
      try {
        setValue(event.newValue === null ? null : JSON.parse(event.newValue));
      } catch {
        /* valor corrupto: lo ignoramos */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, setValue];
}

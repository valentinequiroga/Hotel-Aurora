import { useState } from "react";

export default function RoomForm({ habitacionInicial, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(habitacionInicial);   // copia editable de la habitación

  const cambiarCampo = (evento) => {
    const { name, value } = evento.target;                 // qué input cambió y qué escribieron
    setDatos({ ...datos, [name]: value });                 // copia con ese campo nuevo
  };

  const cambiarComodidades = (evento) => {
    setDatos({ ...datos, amenities: evento.target.value.split(",") });
  };

  const enviar = (evento) => {
    evento.preventDefault();                               // que no recargue la página
    onGuardar(datos);                                      // le pasa los datos a quien lo usa
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">

       <div className="grid grid-cols-2 gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Nombre
        <input name="name" value={datos.name} onChange={cambiarCampo}
          className="rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Número de Habitación
        <input name="number" value={datos.number} onChange={cambiarCampo}
          className="rounded-lg border border-line px-3 py-2" />
      </label>
      </div>
      
      <label className="flex flex-col gap-1 text-sm">
        Tipo
        <select name="type" value={datos.type} onChange={cambiarCampo}
          className="rounded-lg border border-line px-3 py-2">
          <option>Simple</option>
          <option>Doble</option>
          <option>Twin</option>
          <option>Familiar</option>
          <option>Suite</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Capacidad
          <input name="capacity" type="number" value={datos.capacity} onChange={cambiarCampo}
            className="rounded-lg border border-line px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Camas
          <input name="beds" value={datos.beds} onChange={cambiarCampo}
            placeholder="Ej: 1 cama queen"
            className="rounded-lg border border-line px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tamaño (m²)
          <input name="size" type="number" value={datos.size} onChange={cambiarCampo}
            className="rounded-lg border border-line px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Precio por noche
          <input name="pricePerNight" type="number" value={datos.pricePerNight} onChange={cambiarCampo}
            className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Descripción
        <textarea name="description" value={datos.description} onChange={cambiarCampo}
          rows={3} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Comodidades (separadas por coma)
        <input value={datos.amenities.join(",")} onChange={cambiarComodidades}
          placeholder="Wi-Fi, Calefacción, Cafetera"
          className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="flex justify-end gap-2 max-h-[75vh] overflow-y-auto pr-2">
        <button type="button" onClick={onCancelar} className="hover:bg-linetransition-opacity hover:opacity-60">Cancelar</button>
        <button type="submit" className="rounded-full px-4 py-1.5 text-m transition-colors bg-line text-muted hover:bg-primary hover:text-white">Guardar</button>
      </div>
    </form>
  );
}
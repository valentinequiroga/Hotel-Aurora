import { useState } from "react";

export default function RoomForm({ habitacionInicial, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(habitacionInicial);   // copia editable de la habitación

  const cambiarCampo = (evento) => {
    const { name, value } = evento.target;                 // qué input cambió y qué escribieron
    setDatos({ ...datos, [name]: value });                 // copia con ese campo nuevo
  };

  const enviar = (evento) => {
    evento.preventDefault();                               // que no recargue la página
    onGuardar(datos);                                      // le pasa los datos a quien lo usa
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Nombre
        <input name="name" value={datos.name} onChange={cambiarCampo}
          className="rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Precio por noche
        <input name="pricePerNight" type="number" value={datos.pricePerNight} onChange={cambiarCampo}
          className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancelar}>Cancelar</button>
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}
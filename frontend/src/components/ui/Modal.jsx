import { createPortal } from "react-dom";

export default function Modal({ title, onClose, children }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}                                   // clic en el fondo oscuro → cierra
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
        onClick={(evento) => evento.stopPropagation()}    // clic adentro → NO cierra
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body                                         // dónde se dibuja
  );
}
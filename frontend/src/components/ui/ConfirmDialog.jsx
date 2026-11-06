import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Diálogo de confirmación simple, renderizado con un Portal en <div id="modal">.
 * (Si Persona C arma el Modal genérico, este puede pasar a usarlo por dentro.)
 *
 *   <ConfirmDialog open={...} title="..." message="..." confirmLabel="Eliminar"
 *                  danger onConfirm={...} onCancel={...} />
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/40 p-4" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        className="card w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal")
  );
}

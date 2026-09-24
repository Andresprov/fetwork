import { useEffect } from "react";
import Button from "./Button";

export default function Modal({ open, onClose, icon, eyebrow, title, children, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-inverse-surface/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-gutter-mobile overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${maxWidth} my-space-xl bg-surface-container-lowest rounded-xl shadow-xl p-space-lg md:p-space-xl flex flex-col gap-space-md`} role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            {icon && (
              <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </div>
            )}
            <div className="flex flex-col">
              {eyebrow && (
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">{eyebrow}</span>
              )}
              <span className="font-headline-sm text-headline-sm text-on-surface">{title}</span>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface flex items-center justify-center transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, children, confirmLabel = "Eliminar", onConfirm, onCancel, loading }) {
  return (
    <Modal open={open} onClose={onCancel} icon="warning" title={title} maxWidth="max-w-md">
      <p className="font-body-md text-body-md text-on-surface-variant">{children}</p>
      <div className="flex justify-end gap-space-sm pt-space-xs">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" size="sm" icon="delete" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

const ALERTAS = {
  error: { clases: "bg-error-container text-on-error-container", icono: "error" },
  success: { clases: "bg-secondary-container text-on-secondary-container", icono: "check_circle" },
  info: { clases: "bg-surface-container-high text-on-surface", icono: "info" },
};

export function Alert({ tone = "info", children, onClose }) {
  const { clases, icono } = ALERTAS[tone];
  return (
    <div className={`flex items-start gap-space-xs p-space-sm rounded-lg ${clases}`} role={tone === "error" ? "alert" : "status"}>
      <span className="material-symbols-outlined text-[20px] shrink-0">{icono}</span>
      <p className="flex-1 font-body-md text-body-md">{children}</p>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Cerrar" className="opacity-70 hover:opacity-100">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}

export function Loading({ texto = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center gap-space-xs py-space-2xl text-on-surface-variant">
      <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
      <span className="font-body-md text-body-md">{texto}</span>
    </div>
  );
}

export function EmptyState({ icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-space-sm py-space-xl px-space-md rounded-xl bg-surface-container-low">
      <div className="w-14 h-14 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
      {children && <p className="font-body-md text-body-md text-on-surface-variant max-w-md">{children}</p>}
      {action}
    </div>
  );
}

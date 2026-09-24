const VARIANTES = {
  primary: "bg-primary hover:bg-tertiary text-on-primary shadow-md",
  secondary: "bg-surface-container-high hover:bg-surface-dim text-on-surface",
  ghost: "bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface",
  danger: "bg-error hover:bg-error/90 text-on-error shadow-sm",
};

const TAMANOS = {
  md: "h-11 px-space-lg font-label-lg text-label-lg",
  sm: "h-9 px-space-md font-label-md text-label-md",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-space-xs rounded-lg font-semibold transition-all active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none ${VARIANTES[variant]} ${TAMANOS[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
      ) : (
        icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {iconRight && !loading && <span className="material-symbols-outlined text-[18px]">{iconRight}</span>}
    </button>
  );
}

export function IconButton({ icon, title, variant = "ghost", className = "", ...props }) {
  const estilos = {
    ghost: "text-on-surface-variant hover:text-primary hover:bg-surface-container-high",
    danger: "text-on-surface-variant hover:text-error hover:bg-error-container",
  };
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${estilos[variant]} ${className}`}
      {...props}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
  );
}

export default function Card({ children, className = "", accent = false }) {
  return (
    <section className={`relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm ${className}`}>
      {accent && <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-fixed" />}
      {children}
    </section>
  );
}

export function CardHeader({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-space-sm">
      <div className="flex items-start gap-space-sm">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>
        )}
        <div className="flex flex-col">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
          {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "neutral", icon, className = "" }) {
  const tonos = {
    neutral: "bg-surface-container-high text-on-surface-variant",
    primary: "bg-secondary-container text-on-secondary-container",
    info: "bg-info-bg text-info",
    pending: "bg-pending-bg text-pending",
    success: "bg-success-bg text-success",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-space-xs py-space-xxs rounded font-label-sm text-label-sm uppercase tracking-wide ${tonos[tone]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </span>
  );
}

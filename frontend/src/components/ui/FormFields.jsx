const BASE_INPUT =
  "w-full rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all";

function Etiqueta({ htmlFor, label, required, hint }) {
  return (
    <label className="flex items-center justify-between gap-space-xs font-label-md text-label-md text-on-surface" htmlFor={htmlFor}>
      <span>
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </span>
      {hint && <span className="font-body-sm text-body-sm text-outline font-normal">{hint}</span>}
    </label>
  );
}

export function TextField({ id, label, icon, required, hint, help, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-space-xxs ${className}`}>
      {label && <Etiqueta htmlFor={id} label={label} required={required} hint={hint} />}
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">{icon}</span>
        )}
        <input id={id} required={required} className={`${BASE_INPUT} h-11 ${icon ? "pl-10" : "pl-space-md"} pr-space-md`} {...props} />
      </div>
      {help && <p className="font-body-sm text-body-sm text-outline">{help}</p>}
    </div>
  );
}

export function TextAreaField({ id, label, required, hint, help, className = "", rows = 4, ...props }) {
  return (
    <div className={`flex flex-col gap-space-xxs ${className}`}>
      {label && <Etiqueta htmlFor={id} label={label} required={required} hint={hint} />}
      <textarea id={id} rows={rows} required={required} className={`${BASE_INPUT} p-space-md resize-y`} {...props} />
      {help && <p className="font-body-sm text-body-sm text-outline">{help}</p>}
    </div>
  );
}

export function SelectField({ id, label, required, options, placeholder, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-space-xxs ${className}`}>
      {label && <Etiqueta htmlFor={id} label={label} required={required} />}
      <div className="relative flex items-center">
        <select id={id} required={required} className={`${BASE_INPUT} h-11 pl-space-md pr-10 appearance-none cursor-pointer`} {...props}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">expand_more</span>
      </div>
    </div>
  );
}

// Campo de solo lectura para datos sincronizados desde Q10.
export function ReadOnlyField({ label, value, className = "" }) {
  return (
    <div className={`p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xxs ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
        <span className="material-symbols-outlined text-outline text-[16px]" title="Dato sincronizado desde Q10">
          lock
        </span>
      </div>
      <span className="font-body-lg text-body-lg text-on-surface font-semibold">{value || "—"}</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low py-space-lg shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left">
        <div className="flex flex-col gap-space-xxs">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            © 2026 Fundación Escuela Tecnológica de Neiva Jesús Oviedo Pérez - FET. Personería Jurídica 0787 de MinEducación.
          </p>
          <p className="font-body-sm text-body-sm text-outline">
            Sujeta a inspección y vigilancia por el Ministerio de Educación Nacional. Tratamiento de Datos Personales bajo Ley 1581 de 2012 (Habeas Data).
          </p>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="px-space-xs py-space-xxs rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm">
            SNIES 9128
          </span>
          <span className="px-space-xs py-space-xxs rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            Vigilada MinEducación
          </span>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            Términos y Privacidad
          </a>
        </div>
      </div>
    </footer>
  )
}

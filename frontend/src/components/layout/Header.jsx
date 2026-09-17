// Header institucional compartido por las pantallas de autenticacion.
// Estructura y tokens tomados de los mockups de Stitch (autenticacion/*),
// sustituyendo el logo generado por IA del mockup por una marca SVG propia.
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="m8.5 12 2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">FETWork</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase leading-none mt-space-xxs">
              Bolsa de Empleo Institucional
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-space-lg">
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors hidden sm:inline-block"
            href="/login"
          >
            Portal Institucional
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors hidden sm:inline-block"
            href="mailto:practicas@fet.edu.co"
          >
            Mesa de Ayuda FET
          </a>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </nav>
      </div>
    </header>
  );
}

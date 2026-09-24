import BrandMark from "./BrandMark";

// Header institucional compartido por las pantallas de autenticacion.
// Estructura y tokens tomados de los mockups de Stitch (autenticacion/*),
// sustituyendo el logo generado por IA del mockup por una marca SVG propia.
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <BrandMark />
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

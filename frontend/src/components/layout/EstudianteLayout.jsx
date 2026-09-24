import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import BrandMark from "./BrandMark";
import Footer from "./Footer";
import { Alert, Loading } from "../ui/Feedback";
import { getMiPerfil } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";
import { clearSession } from "../../lib/session";
import Avatar from "../perfil/Avatar";

const SECCIONES = [
  { to: "/perfil", label: "Resumen", icon: "dashboard", end: true },
  { to: "/perfil/datos", label: "Datos personales", icon: "badge" },
  { to: "/perfil/habilidades", label: "Habilidades", icon: "psychology" },
  { to: "/perfil/experiencia", label: "Experiencia", icon: "work_history" },
  { to: "/perfil/certificaciones", label: "Certificaciones", icon: "workspace_premium" },
  { to: "/perfil/visibilidad", label: "Visibilidad", icon: "visibility" },
  { to: "/perfil/vista-publica", label: "Vista pública", icon: "person_search" },
];

// Layout del area autenticada del estudiante. Carga el perfil una sola vez y
// lo comparte con cada pantalla a traves del contexto del <Outlet>.
export default function EstudianteLayout() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const recargarPerfil = useCallback(async () => {
    try {
      setPerfil(await getMiPerfil());
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    getMiPerfil()
      .then(setPerfil)
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  function cerrarSesion() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-primary text-on-primary shadow-md">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="h-16 flex items-center justify-between gap-space-md">
            <Link to="/perfil" className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center">
                <BrandMark className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight leading-none">FETWork</span>
                <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase leading-none mt-space-xxs">
                  Portal de Empleabilidad FET
                </span>
              </div>
            </Link>

            {perfil && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuAbierto((v) => !v)}
                  className="flex items-center gap-space-xs rounded-lg px-space-xs py-space-xxs hover:bg-on-primary/10 transition-colors"
                >
                  <Avatar perfil={perfil} />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-label-lg text-label-lg leading-tight">
                      {perfil.nombres} {perfil.apellidos}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary-fixed-dim leading-tight">{perfil.programa.nombre}</span>
                  </div>
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </button>
                {menuAbierto && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
                    <div className="absolute right-0 mt-space-xs w-60 z-20 bg-surface-container-lowest text-on-surface rounded-xl shadow-xl p-space-xs flex flex-col">
                      <div className="px-space-sm py-space-xs border-b border-surface-container-high mb-space-xxs">
                        <p className="font-label-md text-label-md">{perfil.correo}</p>
                        <p className="font-body-sm text-body-sm text-outline">Código {perfil.codigo_institucional_q10}</p>
                      </div>
                      <button
                        type="button"
                        onClick={cerrarSesion}
                        className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg hover:bg-surface-container-low font-label-lg text-label-lg text-error"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <nav className="flex gap-space-xxs overflow-x-auto pb-space-xs -mx-space-xs px-space-xs" aria-label="Secciones del perfil">
            {SECCIONES.map((s) => (
              <NavLink
                key={s.to}
                to={s.to}
                end={s.end}
                className={({ isActive }) =>
                  `flex items-center gap-space-xxs whitespace-nowrap px-space-sm py-space-xs rounded-lg font-label-lg text-label-lg transition-colors ${
                    isActive ? "bg-on-primary-fixed-variant text-on-primary shadow-sm" : "text-primary-fixed hover:bg-on-primary/10"
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                {s.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className="bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex flex-wrap items-center justify-between gap-space-xs font-label-md text-label-md">
          <span className="flex items-center gap-space-xxs text-secondary">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Sincronizado con Q10 Académico
          </span>
          {perfil?.semestre && (
            <span className="inline-flex items-center gap-space-xxs px-space-xs py-space-xxs rounded bg-surface-container-high text-on-surface">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Semestre {perfil.semestre}
            </span>
          )}
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl">
        {error && !perfil && <Alert tone="error">{error}</Alert>}
        {!error && !perfil && <Loading texto="Cargando tu perfil..." />}
        {perfil && <Outlet context={{ perfil, setPerfil, recargarPerfil }} />}
      </main>

      <Footer />
    </div>
  );
}

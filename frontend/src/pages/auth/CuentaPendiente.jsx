import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { clearSession } from "../../lib/session";

// Estado posterior a CU-11 (registro) o a un intento de login CU-12 mientras
// la empresa sigue en estado_validacion = 'pendiente'.
export default function CuentaPendiente() {
  const location = useLocation();
  const navigate = useNavigate();
  const nombreEmpresa = location.state?.nombre_empresa || "tu empresa";
  const correo = location.state?.correo;

  function cerrarSesion() {
    clearSession();
    navigate("/empresas/login");
  }

  return (
    <AuthLayout mainClassName="items-stretch">
      <div className="w-full max-w-[1280px] mx-auto py-space-md lg:py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-start">
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-md p-space-lg lg:p-space-xl flex flex-col gap-space-md">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-secondary-container to-primary-fixed" />

              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span>Solicitud en Revisión Administrativa</span>
                </div>
                <span className="inline-flex items-center gap-space-xxs text-outline font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Seguridad FET SNIES 9128</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md pt-space-xs">
                <div className="relative flex-shrink-0 w-16 h-16 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[36px]">hourglass_top</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                    La cuenta de {nombreEmpresa} está pendiente de aprobación institucional
                  </h1>
                  <span className="font-label-md text-label-md text-secondary font-semibold mt-space-xxs">
                    Coordinación de Prácticas y Empleabilidad FET
                  </span>
                </div>
              </div>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Hemos recibido la información de tu organización{correo ? ` (${correo})` : ""}. Un Validador
                Institucional de la Coordinación de Prácticas y Empleabilidad FET revisará el expediente antes de
                habilitar el acceso completo.
              </p>

              <div className="flex flex-col gap-space-sm pt-space-xs">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[22px]">policy</span>
                  Límites operativos del portal
                </h2>
                <div className="grid grid-cols-1 gap-space-xs">
                  <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
                    <div className="w-7 h-7 rounded-lg bg-error-container/60 text-error flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          Búsqueda de talentos y descarga de hojas de vida
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">
                          Inactivo
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Deshabilitado temporalmente para salvaguardar los datos personales de los estudiantes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
                    <div className="w-7 h-7 rounded-lg bg-error-container/60 text-error flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">campaign</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          Publicación y difusión de vacantes de pasantías
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">
                          Inactivo
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Podrás publicar ofertas una vez tu cuenta cuente con visto bueno del Validador.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              <div className="flex items-start gap-space-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                    ¿Requieres agilizar la vinculación de practicantes urgentes?
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Contacta a la Mesa de Empleabilidad FET:{" "}
                    <a className="text-primary font-semibold hover:underline" href="mailto:practicas@fet.edu.co">
                      practicas@fet.edu.co
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Expediente Electrónico
                </span>
              </div>
              <div className="flex items-center gap-space-md pb-space-xs">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold font-headline-sm text-headline-sm">
                  {nombreEmpresa.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">{nombreEmpresa}</span>
                  {correo && <span className="font-body-sm text-body-sm text-on-surface-variant">{correo}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-space-xs bg-surface-container-low rounded-xl p-space-md text-body-sm font-body-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-on-surface-variant flex items-center gap-space-xxs">
                    <span className="material-symbols-outlined text-[16px] text-outline">timelapse</span>
                    Tiempo Estimado
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-bold">24 a 48 horas hábiles</span>
                </div>
              </div>

              <div className="flex flex-col gap-space-sm pt-space-xs">
                <button
                  className="w-full px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm active:scale-[0.99]"
                  onClick={cerrarSesion}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  <span>Cerrar Sesión Segura</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

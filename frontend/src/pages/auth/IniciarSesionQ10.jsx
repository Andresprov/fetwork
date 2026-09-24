import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { getRosterQ10 } from "../../api/auth";
import { getErrorMessage } from "../../api/client";

// CU-01 / CU-20 / CU-23 / CU-26: inicio de sesion via Q10 (SSO institucional).
export default function IniciarSesionQ10() {
  const navigate = useNavigate();
  const [roster, setRoster] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRosterQ10()
      .then(setRoster)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setCargando(false));
  }, []);

  function seleccionarCuenta(codigo) {
    // TODO: cuando exista integracion SSO real, este boton debe redirigir a
    // q10.fet.edu.co/auth/saml2 en vez de navegar a /auth/callback con el
    // codigo mock seleccionado.
    navigate(`/auth/callback?codigo=${encodeURIComponent(codigo)}`);
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-full max-w-[1280px] mx-auto items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          <section className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-xl p-space-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-fixed" />
            <div>
              <div className="flex items-center gap-space-md mb-space-lg">
                <div className="w-14 h-14 p-1.5 rounded-lg bg-surface-container-low flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[28px]">school</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Autenticación Federada
                  </span>
                  <h1 className="font-headline-md text-headline-md text-on-surface">FETWork Campus Hub</h1>
                </div>
              </div>

              <div className="mb-space-lg">
                <div className="inline-flex items-center gap-space-xs px-space-xs py-space-xxs rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-space-xs">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  <span>Single Sign-On (SSO) Centralizado</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-xs">
                  Acceso Institucional Único
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Ingresa con tu cuenta de Q10 Académico. No requieres credenciales adicionales.
                </p>
              </div>

              {cargando && (
                <p className="font-body-sm text-body-sm text-outline">Cargando cuentas institucionales...</p>
              )}
              {error && (
                <p className="font-body-sm text-body-sm text-error mb-space-md">{error}</p>
              )}

              {!cargando && !error && (
                <div className="flex flex-col gap-space-sm mb-space-lg">
                  <span className="font-label-sm text-label-sm text-outline uppercase block mb-space-xxs">
                    Selecciona tu cuenta institucional
                  </span>
                  {roster.map((cuenta) => (
                    <button
                      key={cuenta.codigo_institucional_q10}
                      onClick={() => seleccionarCuenta(cuenta.codigo_institucional_q10)}
                      type="button"
                      className="group w-full py-3 px-space-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary rounded-lg font-label-lg text-label-lg flex items-center justify-between shadow-md hover:shadow-lg transition-all transform active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded bg-on-primary/15 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary-fixed text-[20px]">
                            {cuenta.rol === "docente" ? "person_apron" : "school"}
                          </span>
                        </div>
                        <span className="text-left">
                          {cuenta.nombres} {cuenta.apellidos}
                          <span className="block font-label-sm text-label-sm opacity-80 capitalize">{cuenta.rol}</span>
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-primary-fixed group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-space-md bg-surface-container-low/70 rounded-lg p-space-sm">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">verified</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tus credenciales académicas y tu expediente se autentican directamente a través del servidor
                  seguro de Q10 de la Fundación Escuela Tecnológica de Neiva.
                </p>
              </div>
            </div>
          </section>

          <div className="lg:col-span-5 flex flex-col gap-space-md justify-between">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-outline">
                    Empresas &amp; Empleadores
                  </span>
                  <span className="material-symbols-outlined text-outline text-[20px]">domain</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                  ¿Eres una empresa u organización aliada?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Gestiona vacantes de pasantías, contratos de aprendizaje y vinculación profesional de talentos
                  FET en el Huila y la región surcolombiana.
                </p>
              </div>
              <div className="pt-space-sm">
                <a
                  className="w-full py-2.5 px-space-md bg-surface-container-high hover:bg-surface-dim text-on-surface rounded font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors group"
                  href="/empresas/login"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">business_center</span>
                  <span>Ingreso exclusivo para Empresas Aliadas</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </a>
                <div className="mt-space-sm text-center">
                  <a
                    className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors"
                    href="/empresas/registro"
                  >
                    ¿Nueva empresa? Solicita tu vinculación aquí
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

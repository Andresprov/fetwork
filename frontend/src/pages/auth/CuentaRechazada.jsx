import { useState } from "react";
import { useLocation } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { recuperarContrasenaEmpresa } from "../../api/auth";
import { getErrorMessage } from "../../api/client";

// CU-27 (dictamen de rechazo del validador, mostrado del lado empresa) +
// CU-13 (recuperacion de contrasena), como en el mockup combinado.
export default function CuentaRechazada() {
  const location = useLocation();
  const comentario =
    location.state?.comentario_validacion ||
    "El validador institucional no registró un motivo adicional para el rechazo. Contacta a la Coordinación de Prácticas para más detalle.";
  const correoInicial = location.state?.correo || "";

  const [correo, setCorreo] = useState(correoInicial);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await recuperarContrasenaEmpresa(correo);
      setEnviado(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout mainClassName="items-stretch">
      <div className="w-full max-w-[1280px] mx-auto py-space-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-error" />
            <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-md pt-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-xs py-space-xxs rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[14px]">cancel</span>
                Estado de Solicitud: Requiere Corrección / Rechazada
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
              Observaciones de la Coordinación de Prácticas
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              La solicitud de adscripción institucional fue revisada por la Coordinación de Prácticas y
              Empleabilidad FET. Se identificaron inconsistencias que impiden la habilitación del perfil.
            </p>

            <div className="bg-surface-container-low rounded-xl p-space-md mb-space-lg relative">
              <div className="mt-space-sm p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
                <div className="flex items-center gap-1.5 text-error mb-space-xxs">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                    Dictamen del Validador Institucional
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface italic">"{comentario}"</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm pt-space-xs">
              <a
                href="/empresas/registro"
                className="flex-1 bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors py-2.5 px-space-md rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">edit_document</span>
                Subsanar Información y Reenviar Solicitud
              </a>
              <a
                href="mailto:practicas@fet.edu.co"
                className="bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors py-2.5 px-space-md rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-space-xs"
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                Contactar a la Mesa de Prácticas
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
            <div className="flex items-center justify-between gap-space-xs mb-space-md pt-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-xs py-space-xxs rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-primary text-[14px]">shield_lock</span>
                Seguridad Empresarial
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
              Recuperación de Contraseña
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              Ingresa el correo corporativo registrado de tu organización. Te enviaremos un enlace temporal para
              restablecer tu clave de acceso.
            </p>

            {enviado ? (
              <div className="mb-space-md p-space-sm rounded-lg bg-secondary-container text-on-secondary-container">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <p className="font-label-md text-label-md font-bold">Instrucciones enviadas con éxito</p>
                </div>
                <p className="font-body-sm text-body-sm mt-space-xxs text-on-secondary-container">
                  Revisa tu bandeja corporativa para completar la renovación de tu contraseña.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-space-md mb-space-md" onSubmit={onSubmit}>
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="corporateEmail">
                    Correo Electrónico Corporativo
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">mail</span>
                    <input
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-bright transition-all"
                      id="corporateEmail"
                      placeholder="talento.humano@organizacion.com"
                      required
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

                <button
                  className="w-full bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors py-2.5 px-space-md rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm disabled:opacity-60"
                  type="submit"
                  disabled={enviando}
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  {enviando ? "Enviando..." : "Enviar Enlace de Restablecimiento"}
                </button>
              </form>
            )}

            <div className="bg-surface-container-high rounded-xl p-space-md mb-space-lg flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">school</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wide">
                  ¿Eres Estudiante o Docente FET?
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Los estudiantes y docentes recuperan sus claves directamente en el sistema institucional Q10.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center pt-space-xs">
              <a
                className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant font-bold flex items-center gap-space-xs transition-colors py-space-xxs"
                href="/empresas/login"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Volver al Inicio de Sesión Empresa
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { loginQ10 } from "../../api/auth";
import { getErrorMessage } from "../../api/client";
import { saveSession } from "../../lib/session";

// CU-01: pantalla de transicion mientras se valida la sesion con Q10.
// TODO: cuando exista integracion SSO real, este componente reacciona al
// callback real de Q10 SAML en vez de disparar POST /usuarios/q10/login
// con el codigo mock recibido por query string.
export default function TransicionErrorQ10() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codigo = searchParams.get("codigo");

  const [estado, setEstado] = useState("conectando"); // conectando | exito | error
  const [usuario, setUsuario] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const yaIntento = useRef(false);

  useEffect(() => {
    if (!codigo) {
      setEstado("error");
      setMensajeError("No se recibio un codigo institucional Q10 para autenticar.");
      return;
    }
    if (yaIntento.current) return;
    yaIntento.current = true;

    loginQ10(codigo)
      .then(({ token, usuario: datosUsuario }) => {
        saveSession({ token, usuario: datosUsuario, tipo: "q10" });
        setUsuario(datosUsuario);
        setEstado("exito");
      })
      .catch((err) => {
        setMensajeError(getErrorMessage(err));
        setEstado("error");
      });
  }, [codigo]);

  useEffect(() => {
    if (estado !== "exito") return undefined;
    if (countdown <= 0) {
      navigate("/login");
      return undefined;
    }
    const timeoutId = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timeoutId);
  }, [estado, countdown, navigate]);

  function reintentar() {
    yaIntento.current = false;
    setEstado("conectando");
    setMensajeError(null);
    // Forzar un nuevo intento en el siguiente tick.
    setTimeout(() => {
      if (!codigo) return;
      yaIntento.current = true;
      loginQ10(codigo)
        .then(({ token, usuario: datosUsuario }) => {
          saveSession({ token, usuario: datosUsuario, tipo: "q10" });
          setUsuario(datosUsuario);
          setEstado("exito");
        })
        .catch((err) => {
          setMensajeError(getErrorMessage(err));
          setEstado("error");
        });
    }, 0);
  }

  const progreso = estado === "conectando" ? 60 : 100;

  return (
    <AuthLayout>
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-space-md">
        <div className="mb-space-lg inline-flex items-center gap-space-xs px-space-md py-space-xxs rounded-full bg-surface-container-high shadow-sm">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
            CU-01 • Enlace Seguro SSO FET
          </span>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden">
          <div className="w-full h-1.5 bg-surface-container-high overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 ease-out ${estado === "error" ? "bg-error" : "bg-primary-container"}`}
              style={{ width: `${progreso}%` }}
            />
          </div>

          <div className="p-space-lg lg:p-space-2xl flex flex-col items-center text-center">
            {estado !== "error" && (
              <>
                <div className="relative flex items-center justify-center w-28 h-28 my-space-xs">
                  <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping opacity-75" />
                  <div className="relative w-20 h-20 rounded-full bg-primary-container flex items-center justify-center shadow-md">
                    <span
                      className="material-symbols-outlined text-on-primary text-[36px] animate-spin"
                      style={{ animationDuration: "3s" }}
                    >
                      sync
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                  </div>
                </div>

                <div className="mt-space-md max-w-xl">
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-widest block mb-space-xxs">
                    Módulo de Autenticación Central
                  </span>
                  {estado === "conectando" && (
                    <>
                      <h1 className="font-headline-lg text-headline-lg text-on-surface">
                        Conectando con Q10 Académico...
                      </h1>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                        Validando tu identidad institucional con el codigo{" "}
                        <strong className="text-on-surface font-semibold">{codigo}</strong> (proveedor Q10
                        simulado, Sprint 1).
                      </p>
                    </>
                  )}
                  {estado === "exito" && usuario && (
                    <>
                      <h1 className="font-headline-lg text-headline-lg text-on-surface">
                        ¡Bienvenido, {usuario.nombres}!
                      </h1>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                        Sesion iniciada correctamente como{" "}
                        <strong className="text-on-surface font-semibold">{usuario.rol}</strong>. Redirigiendo en{" "}
                        <span className="font-bold text-on-surface">{countdown}</span> segundos...
                      </p>
                    </>
                  )}
                </div>
              </>
            )}

            {estado === "error" && (
              <div className="w-full p-space-md bg-error-container text-on-error-container rounded-lg shadow-md text-left">
                <div className="flex items-start gap-space-sm">
                  <div className="p-space-xxs rounded bg-error/15 text-error mt-0.5 flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">error</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-space-xxs">
                    <span className="font-headline-sm text-headline-sm text-error font-bold leading-tight">
                      Alerta de Autenticación Q10
                    </span>
                    <p className="font-body-md text-body-md text-on-error-container mt-space-xxs">{mensajeError}</p>
                    <div className="mt-space-sm flex flex-wrap items-center gap-space-sm pt-space-xs">
                      <button
                        onClick={reintentar}
                        type="button"
                        className="px-space-md py-space-xs rounded bg-error text-on-error font-label-md text-label-md font-semibold hover:bg-error/90 transition-colors flex items-center gap-space-xxs shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">replay</span>
                        <span>Reintentar Conexión</span>
                      </button>
                      <a
                        href="/login"
                        className="px-space-md py-space-xs rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-space-xxs shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        <span>Volver al inicio de sesión</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

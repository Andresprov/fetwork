import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { loginEmpresa, recuperarContrasenaEmpresa } from "../../api/auth";
import { getErrorMessage } from "../../api/client";
import { saveSession } from "../../lib/session";

// CU-12: inicio de sesion de empresa. Incluye el modal de recuperacion CU-13.
export default function InicioSesionEmpresa() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [empresaConectada, setEmpresaConectada] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [recuperacionEnviada, setRecuperacionEnviada] = useState(false);
  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState(false);
  const [errorRecuperacion, setErrorRecuperacion] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const resultado = await loginEmpresa({ correo, contrasena });
      if (resultado.estado === "aprobada") {
        saveSession({ token: resultado.token, usuario: resultado.empresa, tipo: "empresa" });
        setEmpresaConectada(resultado.empresa);
      } else if (resultado.estado === "pendiente") {
        navigate("/empresas/pendiente", { state: { correo } });
      } else if (resultado.estado === "rechazada") {
        navigate("/empresas/rechazada", {
          state: { correo, comentario_validacion: resultado.comentario_validacion },
        });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setEnviando(false);
    }
  }

  async function onSubmitRecuperacion(event) {
    event.preventDefault();
    setErrorRecuperacion(null);
    setEnviandoRecuperacion(true);
    try {
      await recuperarContrasenaEmpresa(correoRecuperacion);
      setRecuperacionEnviada(true);
    } catch (err) {
      setErrorRecuperacion(getErrorMessage(err));
    } finally {
      setEnviandoRecuperacion(false);
    }
  }

  function cerrarModal() {
    setModalAbierto(false);
    setRecuperacionEnviada(false);
    setErrorRecuperacion(null);
    setCorreoRecuperacion("");
  }

  if (empresaConectada) {
    return (
      <AuthLayout>
        <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-md p-space-xl flex flex-col items-center text-center gap-space-md">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Bienvenida, {empresaConectada.nombre_empresa}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sesión iniciada correctamente. El panel de gestión de vacantes (CU-14 en adelante) se habilitará en
            un sprint posterior.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative py-space-md">
        <div className="lg:col-span-6 flex flex-col justify-center gap-space-lg relative z-10">
          <div className="flex items-center gap-space-xs">
            <span className="px-space-xs py-space-xxs rounded-xl bg-secondary-container text-on-secondary-container font-label-sm text-label-sm tracking-wide uppercase">
              Ecosistema Empresarial Huila
            </span>
          </div>
          <div className="flex flex-col gap-space-xs">
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              Impulsa tu organización con talento FET de alto impacto
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Plataforma centralizada de reclutamiento para el sector productivo regional. Vincula aprendices,
              tecnólogos e ingenieros formados bajo rigor técnico y compromiso social.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">assured_workload</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Validación Académica</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Perfiles homologados y certificados por la Coordinación de Prácticas y Extensión Institucional
                FET.
              </p>
            </div>
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Gestión Ágil CU-12</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Publicación instantánea de convocatorias, trazabilidad de postulantes y seguimiento a contratos
                de aprendizaje.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-space-md relative">
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl flex flex-col gap-space-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-fixed" />
            <div className="flex flex-col gap-space-xxs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[24px]">corporate_fare</span>
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                    FETWork Empresas
                  </span>
                </div>
                <span className="px-space-xs py-space-xxs rounded-lg bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  Módulo CU-12
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-xxs">
                Portal de Empresas y Empleadores
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Gestiona convocatorias, pasantías y descubre talento técnico y profesional de la FET.
              </p>
            </div>

            <form className="flex flex-col gap-space-md mt-space-xs" onSubmit={onSubmit}>
              <div className="flex flex-col gap-space-xxs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="corporate-email">
                  <span>Correo Electrónico Corporativo</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
                    alternate_email
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    id="corporate-email"
                    placeholder="talento@techhuila.com"
                    required
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-xxs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="corporate-password">
                    Contraseña de Acceso
                  </label>
                  <button
                    className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors font-semibold"
                    onClick={() => setModalAbierto(true)}
                    type="button"
                  >
                    ¿Olvidaste tu contraseña? (CU-13)
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">lock</span>
                  <input
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    id="corporate-password"
                    placeholder="••••••••••••"
                    required
                    type={mostrarContrasena ? "text" : "password"}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                  <button
                    className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-md"
                    onClick={() => setMostrarContrasena((v) => !v)}
                    type="button"
                    title="Mostrar u ocultar contraseña"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {mostrarContrasena ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

              <button
                className="w-full h-12 rounded-lg bg-primary hover:bg-tertiary text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs shadow-md transition-all active:scale-[0.99] mt-space-xs disabled:opacity-60"
                type="submit"
                disabled={enviando}
              >
                <span>{enviando ? "Ingresando..." : "Ingresar al Portal Empresarial"}</span>
                <span className="material-symbols-outlined text-[20px]">login</span>
              </button>
            </form>

            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mt-space-xs">
              <div className="flex items-start gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">domain_add</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    ¿Tu empresa aún no tiene cuenta institucional?
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Regístrate para publicar vacantes y vincular practicantes en convenio FET.
                  </p>
                </div>
              </div>
              <a
                href="/empresas/registro"
                className="w-full sm:w-auto px-space-md py-space-xs rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm font-semibold whitespace-nowrap shadow-sm transition-colors text-center"
              >
                Crear cuenta de Empresa (CU-11)
              </a>
            </div>

            <div className="pt-space-xs flex flex-col gap-space-xxs text-center md:text-left">
              <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">school</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-left">
                  Si eres estudiante o docente de la FET, debes ingresar a través de tu cuenta institucional Q10.{" "}
                  <a className="font-label-sm text-label-sm text-primary font-bold hover:underline inline-flex items-center gap-0.5 ml-1" href="/login">
                    Ir a Acceso Estudiante/Docente
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-gutter-mobile">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-xl p-space-lg md:p-space-xl flex flex-col gap-space-md relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                    Recuperación de Acceso (CU-13)
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Restablecer Contraseña
                  </span>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface flex items-center justify-center transition-colors"
                onClick={cerrarModal}
                type="button"
                title="Cerrar ventana"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {recuperacionEnviada ? (
              <div className="p-space-sm rounded-lg bg-secondary-container text-on-secondary-container">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <p className="font-label-md text-label-md font-bold">Instrucciones enviadas</p>
                </div>
                <p className="font-body-sm text-body-sm mt-space-xxs">
                  Si el correo esta registrado, revisa tu bandeja para completar la renovación de tu contraseña.
                </p>
              </div>
            ) : (
              <>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Ingresa el correo electrónico corporativo registrado para tu empresa. Enviaremos un enlace
                  institucional seguro para restaurar tu clave.
                </p>
                <form className="flex flex-col gap-space-md" onSubmit={onSubmitRecuperacion}>
                  <div className="flex flex-col gap-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="recovery-corporate-email">
                      Correo Electrónico Corporativo Oficial
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">mail</span>
                      <input
                        className="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                        id="recovery-corporate-email"
                        placeholder="rrhh@empresahuila.org"
                        required
                        type="email"
                        value={correoRecuperacion}
                        onChange={(e) => setCorreoRecuperacion(e.target.value)}
                      />
                    </div>
                  </div>

                  {errorRecuperacion && <p className="font-body-sm text-body-sm text-error">{errorRecuperacion}</p>}

                  <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                    <button
                      className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface font-label-md text-label-md font-semibold transition-colors"
                      onClick={cerrarModal}
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-space-lg py-space-xs rounded-lg bg-primary hover:bg-tertiary text-on-primary font-label-md text-label-md font-semibold shadow-sm transition-all flex items-center gap-space-xs disabled:opacity-60"
                      type="submit"
                      disabled={enviandoRecuperacion}
                    >
                      <span>{enviandoRecuperacion ? "Enviando..." : "Enviar Instrucciones (CU-13)"}</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

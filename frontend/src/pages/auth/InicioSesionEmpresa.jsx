import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'

// CU-12, CU-13 — Inicio de sesión de empresa (JWT + bcrypt) y recuperación de contraseña
export default function InicioSesionEmpresa() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [toast, setToast] = useState('')

  function handleLoginSubmit(e) {
    e.preventDefault()
    // TODO: conectar con authService (POST /api/auth/empresas/login)
    setToast(`Iniciando sesión segura para ${email} (Validación CU-12 FET)...`)
    setTimeout(() => setToast(''), 6000)
  }

  function handleRecoverySubmit(e) {
    e.preventDefault()
    // TODO: conectar con authService (POST /api/auth/empresas/recuperar)
    setRecoveryOpen(false)
    setToast(`Instrucciones de recuperación enviadas a ${recoveryEmail}. Verifica tu bandeja corporativa.`)
    setTimeout(() => setToast(''), 6000)
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative py-space-md">
          {/* Columna izquierda: propuesta de valor */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-space-lg relative z-10">
            <div className="flex items-center gap-space-xs">
              <span className="px-space-xs py-space-xxs rounded-xl bg-secondary-container text-on-secondary-container font-label-sm text-label-sm tracking-wide uppercase">
                Ecosistema Empresarial Huila
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Convenios Marco &amp; Ley 789</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
                Impulsa tu organización con talento FET de alto impacto
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Plataforma centralizada de reclutamiento para el sector productivo regional. Vincula aprendices, tecnólogos e
                ingenieros formados bajo rigor técnico y compromiso social.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    assured_workload
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Validación Académica</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Perfiles homologados y certificados por la Coordinación de Prácticas y Extensión Institucional FET.
                </p>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[22px]">bolt</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Gestión Ágil CU-12</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Publicación instantánea de convocatorias, trazabilidad de postulantes y seguimiento a contratos de aprendizaje.
                </p>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-md mt-space-xs bg-primary/90 h-44 flex items-end p-space-md">
              <div className="flex items-center justify-between w-full text-on-primary">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed">Alianzas Activas</span>
                  <span className="font-headline-sm text-headline-sm font-semibold">+180 Empresas en Neiva, Pitalito y Rivera</span>
                </div>
                <span className="material-symbols-outlined text-primary-fixed text-[28px]">handshake</span>
              </div>
            </div>
            <div className="flex items-center gap-space-md p-space-sm rounded-xl bg-surface-container-low">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center">FET</div>
                <div className="inline-block h-8 w-8 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center justify-center">HU</div>
                <div className="inline-block h-8 w-8 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm flex items-center justify-center">CO</div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-bold">94.8% de efectividad de emparejamiento</span>
                <span className="font-body-sm text-body-sm text-outline">Convocatorias cubiertas en promedio en menos de 12 días</span>
              </div>
            </div>
          </div>

          {/* Columna derecha: formulario de login */}
          <div className="lg:col-span-6 flex flex-col gap-space-md relative">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-primary-fixed/30 blur-3xl -z-10 pointer-events-none" />
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl flex flex-col gap-space-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-fixed" />
              <div className="flex flex-col gap-space-xxs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[24px]">corporate_fare</span>
                    <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">FETWork Empresas</span>
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

              <form className="flex flex-col gap-space-md mt-space-xs" onSubmit={handleLoginSubmit}>
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="corporate-email">
                    <span>Correo Electrónico Corporativo</span>
                    <span className="font-label-sm text-label-sm text-outline font-normal">Dominio de la empresa</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">alternate_email</span>
                    <input
                      className="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="corporate-email"
                      name="corporate-email"
                      placeholder="talento@techhuila.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-space-xxs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="corporate-password">
                      Contraseña de Acceso
                    </label>
                    <button
                      type="button"
                      className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors font-semibold"
                      onClick={() => setRecoveryOpen(true)}
                    >
                      ¿Olvidaste tu contraseña? (CU-13)
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">lock</span>
                    <input
                      className="w-full h-11 pl-10 pr-11 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="corporate-password"
                      name="corporate-password"
                      placeholder="••••••••••••"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-md"
                      title="Mostrar u ocultar contraseña"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-xxs">
                  <label className="flex items-center gap-space-xs cursor-pointer select-none">
                    <input className="w-4 h-4 rounded text-primary focus:ring-secondary accent-primary cursor-pointer" id="remember-device" name="remember-device" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Recordar este equipo</span>
                  </label>
                  <div className="flex items-center gap-space-xxs text-outline font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Conexión Cifrada SSL</span>
                  </div>
                </div>
                <button
                  className="w-full h-12 rounded-lg bg-primary hover:bg-tertiary text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-space-xs shadow-md transition-all active:scale-[0.99] mt-space-xs"
                  type="submit"
                >
                  <span>Ingresar al Portal Empresarial</span>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </button>
              </form>

              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mt-space-xs">
                <div className="flex items-start gap-space-xs">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">domain_add</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">¿Tu empresa aún no tiene cuenta institucional?</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Regístrate para publicar vacantes y vincular practicantes en convenio FET.
                    </p>
                  </div>
                </div>
                <Link
                  to="/empresas/registro"
                  className="w-full sm:w-auto px-space-md py-space-xs rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm font-semibold whitespace-nowrap shadow-sm transition-colors text-center"
                >
                  Crear cuenta de Empresa (CU-11)
                </Link>
              </div>

              <div className="pt-space-xs flex flex-col gap-space-xxs text-center md:text-left">
                <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">school</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-left">
                    Si eres estudiante o docente de la FET, debes ingresar a través de tu cuenta institucional Q10.{' '}
                    <Link to="/login" className="font-label-sm text-label-sm text-primary font-bold hover:underline inline-flex items-center gap-0.5 ml-1">
                      Ir a Acceso Estudiante/Docente
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </Link>
                  </p>
                </div>
                <p className="font-label-sm text-label-sm text-outline mt-space-xxs text-center">
                  Toda cuenta corporativa requiere verificación y validación previa por la Coordinación de Prácticas y Empleabilidad FET Neiva.
                </p>
              </div>
            </div>

            {toast && (
              <div className="p-space-sm rounded-xl bg-primary text-on-primary shadow-lg flex items-center justify-between transition-all">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="font-body-sm text-body-sm font-medium">{toast}</span>
                </div>
                <button className="text-on-primary hover:opacity-80" onClick={() => setToast('')} type="button">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de recuperación (CU-13) */}
        {recoveryOpen && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-gutter-mobile">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-xl p-space-lg md:p-space-xl flex flex-col gap-space-md relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Recuperación de Acceso (CU-13)</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Restablecer Contraseña</span>
                  </div>
                </div>
                <button
                  className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface flex items-center justify-center transition-colors"
                  onClick={() => setRecoveryOpen(false)}
                  title="Cerrar ventana"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Ingresa el correo electrónico corporativo registrado para tu empresa. Enviaremos un enlace institucional seguro y
                token temporal de 15 minutos para restaurar tu clave.
              </p>
              <form className="flex flex-col gap-space-md" onSubmit={handleRecoverySubmit}>
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="recovery-corporate-email">
                    Correo Electrónico Corporativo Oficial
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">mail</span>
                    <input
                      className="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="recovery-corporate-email"
                      name="recovery-corporate-email"
                      placeholder="rrhh@empresahuila.org"
                      required
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">info</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Por seguridad institucional, si tu empresa cambió de representante o dirección de talento humano, comunícate
                    con la Oficina de Prácticas FET: <span className="font-semibold text-on-surface">empleabilidad@fet.edu.co</span>.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                  <button
                    className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface font-label-md text-label-md font-semibold transition-colors"
                    onClick={() => setRecoveryOpen(false)}
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-space-lg py-space-xs rounded-lg bg-primary hover:bg-tertiary text-on-primary font-label-md text-label-md font-semibold shadow-sm transition-all flex items-center gap-space-xs"
                    type="submit"
                  >
                    <span>Enviar Instrucciones (CU-13)</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

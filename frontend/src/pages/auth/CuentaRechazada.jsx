import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'

// CU-13, CU-27 — Cuenta rechazada (izquierda) / recuperar contraseña de empresa (derecha)
export default function CuentaRechazada() {
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleRecoverySubmit(e) {
    e.preventDefault()
    // TODO: conectar con authService (POST /api/auth/empresas/recuperar)
    setSent(true)
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1280px] mx-auto py-space-md">
          <div className="w-full mb-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">domain_verification</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Gestión de Acceso Corporativo</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  <span className="font-label-sm text-label-sm text-secondary font-bold">Ventanilla Única FET</span>
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface truncate">Portal de Validación Empresarial y Soporte de Credenciales</p>
              </div>
            </div>
            <div className="flex items-center gap-space-xs text-on-surface-variant bg-surface-container-low px-space-sm py-space-xxs rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-tertiary">verified_user</span>
              <span className="font-label-sm text-label-sm">Protocolo Activo CU-27 / CU-13</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* CU-27: Cuenta rechazada */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-error" />
              <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-md pt-space-xs">
                <span className="inline-flex items-center gap-1.5 px-space-xs py-space-xxs rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">cancel</span>
                  Estado de Solicitud: Requiere Corrección / Rechazada
                </span>
                <span className="font-label-sm text-label-sm text-outline">Radicado FET-EMP-2025-0841</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Observaciones de la Coordinación de Prácticas</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                La solicitud de adscripción institucional fue revisada por la Dirección de Extensión y Relacionamiento con el
                Sector Externo FET. Se identificaron inconsistencias documentales que impiden la habilitación del perfil.
              </p>
              <div className="bg-surface-container-low rounded-xl p-space-md mb-space-lg relative">
                <div className="flex items-start gap-space-md">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[24px]">badge</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xxs mb-space-xs">
                      <div>
                        <h3 className="font-label-lg text-label-lg text-on-surface">Lic. Marcela Perdomo</h3>
                        <p className="font-body-sm text-body-sm text-tertiary font-semibold">Validador de Empleabilidad FET • Dirección de Prácticas</p>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-xs py-space-xxs rounded-md inline-flex items-center gap-1 self-start">
                        <span className="material-symbols-outlined text-[14px]">event</span>
                        24 de Mayo de 2026
                      </span>
                    </div>
                    <div className="mt-space-sm p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
                      <div className="flex items-center gap-1.5 text-error mb-space-xxs">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Dictamen del Validador Institucional</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface italic">
                        "Motivo del rechazo: El NIT ingresado no coincide con el certificado de existencia y representación legal
                        de Cámara de Comercio adjunto, y el correo corporativo debe pertenecer al dominio oficial de la empresa
                        para habilitar la publicación de vacantes institucionales."
                      </p>
                    </div>
                    <div className="mt-space-md grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                      <div className="flex items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-high">
                        <span className="material-symbols-outlined text-error text-[18px]">badge</span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">RUT / Cámara de Comercio</span>
                          <span className="font-label-sm text-label-sm text-error font-bold">Discrepancia en Dígito de Verificación</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-high">
                        <span className="material-symbols-outlined text-error text-[18px]">alternate_email</span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Dominio de Correo</span>
                          <span className="font-label-sm text-label-sm text-error font-bold">Dominio Genérico No Autorizado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-space-lg">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold block mb-space-xs">Pasos de regularización requeridos:</span>
                <div className="flex items-center gap-space-md text-on-surface-variant">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">1</span>
                    <span className="font-body-sm text-body-sm">Adjuntar Certificado CC Neiva &lt; 30 días</span>
                  </div>
                  <span className="text-outline">→</span>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">2</span>
                    <span className="font-body-sm text-body-sm">Vincular correo @tuempresa.com</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm pt-space-xs">
                <Link
                  to="/empresas/registro"
                  className="flex-1 bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors py-2.5 px-space-md rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_document</span>
                  Subsanar Información y Reenviar Solicitud
                </Link>
                <a
                  href="mailto:practicas@fet.edu.co"
                  className="bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors py-2.5 px-space-md rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-space-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  Contactar a la Mesa de Prácticas
                </a>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center gap-space-xs text-outline font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Resolución de Subsanaciones: Máximo 48 horas hábiles por la coordinación FET.</span>
              </div>
            </div>

            {/* CU-13: Recuperación de contraseña */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
              <div className="flex items-center justify-between gap-space-xs mb-space-md pt-space-xs">
                <span className="inline-flex items-center gap-1.5 px-space-xs py-space-xxs rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-primary text-[14px]">shield_lock</span>
                  Seguridad Empresarial
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">CU-13</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Recuperación de Contraseña</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                Ingresa el correo corporativo registrado de tu organización. Te enviaremos un enlace criptográfico temporal para
                restablecer tu clave de acceso.
              </p>
              <form className="flex flex-col gap-space-md mb-space-md" onSubmit={handleRecoverySubmit}>
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="corporateEmail">
                    <span>Correo Electrónico Corporativo</span>
                    <span className="font-label-sm text-label-sm text-outline">Dominio Empresarial</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">mail</span>
                    <input
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-bright transition-all"
                      id="corporateEmail"
                      placeholder="talento.humano@organizacion.com"
                      required
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                    />
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Debe coincidir con la cuenta del representante legal o reclutador registrado.</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center gap-space-sm">
                  <svg className="w-8 h-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 36 36">
                    <path d="M18 2.25C9.3 2.25 2.25 9.3 2.25 18C2.25 26.7 9.3 33.75 18 33.75C26.7 33.75 33.75 26.7 33.75 18C33.75 9.3 26.7 2.25 18 2.25ZM18 30.75C10.95 30.75 5.25 25.05 5.25 18C5.25 10.95 10.95 5.25 18 5.25C25.05 5.25 30.75 10.95 30.75 18C30.75 25.05 25.05 30.75 18 30.75Z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M18 9V18L24 21.6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                  </svg>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold">Vigencia del Token de Acceso: 20 Minutos</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Cifrado RSA-2048 con expiración por inactividad.</span>
                  </div>
                </div>
                <button
                  className="w-full bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors py-2.5 px-space-md rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  Enviar Enlace de Restablecimiento
                </button>
              </form>
              {sent && (
                <div className="mb-space-md p-space-sm rounded-lg bg-secondary-container text-on-secondary-container">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <p className="font-label-md text-label-md font-bold">Instrucciones enviadas con éxito</p>
                  </div>
                  <p className="font-body-sm text-body-sm mt-space-xxs text-on-secondary-container">
                    Revisa tu bandeja corporativa y la carpeta de spam para completar la renovación de tu contraseña.
                  </p>
                </div>
              )}
              <div className="bg-surface-container-high rounded-xl p-space-md mb-space-lg flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">school</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wide">¿Eres Estudiante o Docente FET?</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Los estudiantes y docentes recuperan sus claves directamente en el sistema institucional Q10.
                  </p>
                  <a className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant font-bold mt-space-xs flex items-center gap-1" href="#">
                    Ir a Recuperación Q10 Campus
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center pt-space-xs">
                <Link to="/empresas/login" className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant font-bold flex items-center gap-space-xs transition-colors py-space-xxs">
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Volver al Inicio de Sesión Empresa
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-space-xl p-space-md rounded-xl bg-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">help_center</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Centro de Vinculación y Prácticas Empresariales FET</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Sede Neiva: Km 12 Vía al Sur • Horario de Atención: Lunes a Viernes 7:00 a.m. - 5:00 p.m.</p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <a className="px-space-md py-space-xs rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-surface-bright transition-colors flex items-center gap-1" href="mailto:practicas@fet.edu.co">
                <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                practicas@fet.edu.co
              </a>
              <a className="px-space-md py-space-xs rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-surface-bright transition-colors flex items-center gap-1" href="tel:+576088631111">
                <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                PBX (608) 863 1111
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

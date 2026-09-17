import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'

// CU-01, CU-20, CU-23, CU-26 — Inicio de sesión federado vía Q10 (estudiantes, egresados, docentes, coordinadores)
export default function IniciarSesionQ10() {
  const [connecting, setConnecting] = useState(false)

  function handleSsoClick(e) {
    e.preventDefault()
    setConnecting(true)
    // TODO: redirigir a q10.fet.edu.co/auth/saml2 (flujo SSO real)
    setTimeout(() => setConnecting(false), 2400)
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-full max-w-[1280px] mx-auto items-center justify-center">
        <div className="relative w-full flex justify-center">
          <div className="absolute -top-12 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-tertiary-fixed-dim/15 rounded-full blur-2xl pointer-events-none -z-10" />
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          <section className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-xl p-space-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-fixed" />
            <div>
              <div className="flex items-center gap-space-md mb-space-lg">
                <div className="w-14 h-14 p-1.5 rounded-lg bg-surface-container-low flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-[28px]">shield_person</span>
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
              <div className="mb-space-xl">
                <span className="font-label-sm text-label-sm text-outline uppercase block mb-space-xs">
                  Población habilitada:
                </span>
                <div className="flex flex-wrap gap-space-xs">
                  {[
                    ['Estudiantes', 'bg-primary'],
                    ['Egresados', 'bg-secondary'],
                    ['Docentes Auditores', 'bg-tertiary'],
                    ['Coordinadores', 'bg-surface-tint'],
                  ].map(([label, dot]) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-space-sm mb-space-lg">
                <button
                  onClick={handleSsoClick}
                  disabled={connecting}
                  className="group w-full py-3.5 px-space-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary rounded-lg font-label-lg text-label-lg flex items-center justify-between shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] disabled:pointer-events-none disabled:opacity-90"
                >
                  {connecting ? (
                    <div className="flex items-center gap-space-sm mx-auto">
                      <svg className="animate-spin h-5 w-5 text-on-primary" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="font-label-lg text-label-lg text-on-primary">Conectando con Q10 Neiva...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded bg-on-primary/15 flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-primary-fixed text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            lock
                          </span>
                        </div>
                        <span className="font-headline-sm text-headline-sm tracking-normal">Iniciar sesión con Q10</span>
                      </div>
                      <span className="material-symbols-outlined text-primary-fixed group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
                <p className="font-body-sm text-body-sm text-outline text-center">
                  Redirección directa a <span className="font-label-sm text-on-surface-variant">q10.fet.edu.co/auth/saml2</span>
                </p>
              </div>
            </div>
            <div className="pt-space-md bg-surface-container-low/70 rounded-lg p-space-sm">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">verified</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tus credenciales académicas y tu expediente se autentican directamente a través del servidor seguro de Q10 de
                  la Fundación Escuela Tecnológica de Neiva.
                </p>
              </div>
            </div>
          </section>
          <div className="lg:col-span-5 flex flex-col gap-space-md justify-between">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-outline">Empresas &amp; Empleadores</span>
                  <span className="material-symbols-outlined text-outline text-[20px]">domain</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                  ¿Eres una empresa u organización aliada?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Gestiona vacantes de pasantías, contratos de aprendizaje y vinculación profesional de talentos FET en el Huila
                  y la región surcolombiana.
                </p>
              </div>
              <div className="pt-space-sm">
                <Link
                  to="/empresas/login"
                  className="w-full py-2.5 px-space-md bg-surface-container-high hover:bg-surface-dim text-on-surface rounded font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors group"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">business_center</span>
                  <span>Ingreso exclusivo para Empresas Aliadas</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </Link>
                <div className="mt-space-sm text-center">
                  <Link
                    to="/empresas/registro"
                    className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors"
                  >
                    ¿Nueva empresa? Solicita tu vinculación aquí
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md">
              <div className="flex items-center justify-between pb-space-xs mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">Estado de Conectividad</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
              </div>
              <div className="bg-surface-container-low rounded p-space-xs mb-space-sm flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">dns</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface">Servidor Q10 Neiva</span>
                    <span className="font-body-sm text-body-sm text-outline">Nodo Campus Prado Alto</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                    En Línea
                  </span>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant font-mono">32ms</span>
                </div>
              </div>
              <div className="flex flex-col gap-space-xxs">
                <a
                  className="flex items-center justify-between p-space-xxs rounded hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary"
                  href="#"
                >
                  <span className="flex items-center gap-space-xs font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">contact_support</span>
                    Mesa de Ayuda de Tecnologías FET
                  </span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
                <a
                  className="flex items-center justify-between p-space-xxs rounded hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary"
                  href="#"
                >
                  <span className="flex items-center gap-space-xs font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">help_center</span>
                    Preguntas Frecuentes de Acceso
                  </span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

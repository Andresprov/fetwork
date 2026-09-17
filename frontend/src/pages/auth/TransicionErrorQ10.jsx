import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'

const Q10_ENDPOINT = 'https://site2.q10.com/login?enc=fet_neiva'

// Transición y error de autenticación Q10 (callback SSO)
export default function TransicionErrorQ10() {
  const [countdown, setCountdown] = useState(3)
  const [showError, setShowError] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  function retryConnection() {
    setShowError(false)
    setCountdown(3)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const progress = showError ? 100 : 48 + (3 - countdown) * 24

  return (
    <AuthLayout>
      <div className="flex flex-col w-full">
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-space-md">
          <div className="absolute -top-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="mb-space-lg inline-flex items-center gap-space-xs px-space-md py-space-xxs rounded-full bg-surface-container-high shadow-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">CU-01 • Enlace Seguro SSO FET</span>
            <span className="font-label-sm text-label-sm text-outline">|</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">Túnel Encriptado</span>
          </div>

          <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden">
            <div className="w-full h-1.5 bg-surface-container-high overflow-hidden relative">
              <div
                className={`h-full transition-all duration-300 ease-out ${showError ? 'bg-error' : 'bg-primary-container'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="p-space-lg lg:p-space-2xl flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center w-28 h-28 my-space-xs">
                <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping opacity-75" />
                <div className="absolute -inset-2 rounded-full bg-secondary/10 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-primary-container flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-on-primary text-[36px] animate-spin" style={{ animationDuration: '3s' }}>sync</span>
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                </div>
              </div>

              <div className="mt-space-md max-w-xl">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-widest block mb-space-xxs">Módulo de Autenticación Central</span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Conectando con Q10 Académico...</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                  Estamos redirigiéndote de forma segura al portal central de autenticación de la{' '}
                  <strong className="text-on-surface font-semibold">Fundación Escuela Tecnológica de Neiva (FET)</strong> para
                  validar tu identidad institucional y sincronizar tu expediente académico en tiempo real.
                </p>
              </div>

              <div className="mt-space-md inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[18px]">timer</span>
                <span className="font-body-sm text-body-sm">
                  Redirección automática estimada en{' '}
                  <span className="font-bold text-on-surface font-label-md text-label-md">{String(countdown).padStart(2, '0')}</span> segundos...
                </span>
              </div>

              <div className="w-full mt-space-xl p-space-md bg-surface-container-low rounded-lg text-left shadow-sm">
                <div className="flex items-center justify-between pb-space-xs mb-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px]">shield</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Ficha Técnica de Validación Criptográfica</span>
                  </div>
                  <span className="px-space-xs py-space-xxs rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">TLS 1.3 Activo</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-xs pt-space-xs">
                  <div className="flex flex-col gap-space-xxs p-space-xs rounded bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center gap-space-xxs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary">key</span>
                      <span className="font-label-sm text-label-sm uppercase font-semibold">Protocolo Federado</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface font-medium">OAuth 2.0 / SAML 2.0 Seguro</p>
                    <span className="font-body-sm text-body-sm text-outline">Token transitorio con firma ECDSA</span>
                  </div>
                  <div className="flex flex-col gap-space-xxs p-space-xs rounded bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center gap-space-xxs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary">link</span>
                      <span className="font-label-sm text-label-sm uppercase font-semibold">Endpoint Destino</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface font-mono truncate" title={Q10_ENDPOINT}>site2.q10.com/login?enc=fet...</p>
                    <span className="font-body-sm text-body-sm text-outline">Nodo Autorizado Campus Neiva</span>
                  </div>
                  <div className="flex flex-col gap-space-xxs p-space-xs rounded bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center gap-space-xxs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                      <span className="font-label-sm text-label-sm uppercase font-semibold">Certificado de Emisión</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface font-medium">FET CriptoNet SHA-256</p>
                    <span className="font-body-sm text-body-sm text-outline">Emisor Raíz DigiCert CA 2024</span>
                  </div>
                </div>
              </div>

              <div className="mt-space-lg w-full flex flex-col sm:flex-row items-center justify-between gap-space-md p-space-md bg-surface-container-high/40 rounded-lg">
                <div className="flex items-center gap-space-sm text-left">
                  <span className="material-symbols-outlined text-outline text-[24px]">info</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">¿El navegador no respondió automáticamente al enlace seguro?</span>
                </div>
                <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                  <a
                    className="px-space-md py-space-xs rounded bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-primary transition-all flex items-center justify-center gap-space-xxs shadow-sm"
                    href={Q10_ENDPOINT}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Continuar manualmente a Q10</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </div>

              <div className="mt-space-lg w-full flex flex-col items-center">
                <button
                  className="text-outline hover:text-on-surface text-label-sm font-label-sm underline flex items-center gap-space-xxs transition-colors py-space-xxs"
                  onClick={() => setShowError((v) => !v)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">bug_report</span>
                  <span>Simular evento de contingencia o cancelación de sesión (Modo QA / Sandbox)</span>
                </button>
              </div>

              {showError && (
                <div className="w-full mt-space-md p-space-md bg-error-container text-on-error-container rounded-lg shadow-md text-left transition-all">
                  <div className="flex items-start gap-space-sm">
                    <div className="p-space-xxs rounded bg-error/15 text-error mt-0.5 flex-shrink-0">
                      <span className="material-symbols-outlined text-[24px]">error</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-space-xxs">
                      <div className="flex items-center justify-between">
                        <span className="font-headline-sm text-headline-sm text-error font-bold leading-tight">Alerta de Autenticación Q10</span>
                        <span className="px-space-xs py-0.5 rounded bg-error text-on-error font-label-sm text-label-sm font-mono uppercase">Err: AUTH_SAML_CANCEL</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-error-container mt-space-xxs">
                        No pudimos completar la autenticación con Q10 Académico. El servicio de credenciales institucionales no
                        respondió a tiempo o la sesión fue rechazada/cancelada por el usuario.
                      </p>
                      <div className="mt-space-sm flex flex-wrap items-center gap-space-sm pt-space-xs">
                        <button
                          className="px-space-md py-space-xs rounded bg-error text-on-error font-label-md text-label-md font-semibold hover:bg-error/90 transition-colors flex items-center gap-space-xxs shadow-sm"
                          onClick={retryConnection}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          <span>Reintentar Conexión</span>
                        </button>
                        <a
                          className="px-space-md py-space-xs rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-space-xxs shadow-sm"
                          href="#"
                        >
                          <span className="material-symbols-outlined text-[16px]">headset_mic</span>
                          <span>Contactar Soporte FET</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-space-xl pt-space-md flex items-center justify-center w-full">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-error transition-colors font-label-md text-label-md py-space-xs px-space-md rounded hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Cancelar y volver al portal FETWork</span>
                </Link>
              </div>
            </div>
            <div className="bg-surface-container-low px-space-lg py-space-xs flex flex-col sm:flex-row items-center justify-between text-outline font-label-sm text-label-sm">
              <span className="flex items-center gap-space-xxs">
                <span className="material-symbols-outlined text-[14px]">domain_verification</span>
                Conexión directa a nodo Huila: 190.85.122.46
              </span>
              <span className="font-mono">Hash: 4a8f9c210d7e63</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-xl">
            {[
              ['1', 'Credenciales FET', 'Ingresa tu código institucional y contraseña única en el formulario oficial de Q10.'],
              ['2', 'Validación Académica', 'Verificación del estado activo (estudiante, egresado o practicante habilitado).'],
              ['3', 'Retorno Inmediato', 'Regresarás automáticamente a tu panel de vacantes personalizadas en FETWork.'],
            ].map(([n, title, desc]) => (
              <div key={n} className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-label-md flex-shrink-0">{n}</div>
                <div>
                  <h2 className="font-label-md text-label-md text-on-surface font-semibold">{title}</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xxs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'

// Cuenta pendiente de aprobación (empresa recién registrada, a la espera del Validador de Empresas)
export default function CuentaPendiente() {
  const navigate = useNavigate()
  const [downloadState, setDownloadState] = useState('idle') // idle | loading | done
  const [signingOut, setSigningOut] = useState(false)

  function handleDownload() {
    setDownloadState('loading')
    // TODO: conectar con servicio de generación de documentos (docxtemplater) para el Convenio Marco
    setTimeout(() => {
      setDownloadState('done')
      setTimeout(() => setDownloadState('idle'), 3000)
    }, 1200)
  }

  function handleSignOut() {
    setSigningOut(true)
    // TODO: invalidar sesión JWT de la empresa
    setTimeout(() => navigate('/empresas/login'), 800)
  }

  const restrictions = [
    {
      icon: 'block',
      title: 'Búsqueda de talentos y descarga de hojas de vida',
      badge: 'Inactivo',
      desc: 'Deshabilitado temporalmente para salvaguardar los datos personales de estudiantes bajo el marco de Habeas Data institucional.',
      enabled: false,
    },
    {
      icon: 'campaign',
      title: 'Publicación y difusión de vacantes de pasantías',
      badge: 'Inactivo',
      desc: 'Deshabilitado temporalmente. Podrás publicar ofertas laborales una vez tu NIT cuente con visto bueno de la decanatura respectiva.',
      enabled: false,
    },
    {
      icon: 'check_circle',
      title: 'Monitoreo de estado institucional y consulta de normatividad',
      badge: 'Habilitado',
      desc: 'Puedes consultar en tiempo real este radicado y preparar la documentación del Convenio Específico de Cooperación Empresarial.',
      enabled: true,
    },
  ]

  return (
    <AuthLayout>
      <div className="flex flex-col w-full max-w-[1280px] mx-auto py-space-md lg:py-space-xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-start">
          {/* Columna izquierda */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-md p-space-lg lg:p-space-xl flex flex-col gap-space-md">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-secondary-container to-primary-fixed" />
              <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span>Solicitud en Revisión Administrativa</span>
                  <span className="text-outline">•</span>
                  <span className="font-bold text-primary">Radicado #EMP-2025-048</span>
                </div>
                <span className="inline-flex items-center gap-space-xxs text-outline font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Seguridad FET SNIES 9128</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md pt-space-xs">
                <div className="relative flex-shrink-0 w-16 h-16 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-secondary text-[14px]">sync</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                    Tu cuenta está pendiente de aprobación institucional
                  </h1>
                  <span className="font-label-md text-label-md text-secondary font-semibold mt-space-xxs">
                    Coordinación de Prácticas y Empleabilidad FET
                  </span>
                </div>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Hemos recibido exitosamente la información de tu organización. Para garantizar la seguridad de nuestra comunidad
                académica, un Validador Institucional de la Coordinación de Prácticas y Empleabilidad FET está revisando tu
                expediente legal y perfil corporativo.
              </p>
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
                <div className="flex justify-between items-center text-on-surface">
                  <span className="font-label-md text-label-md text-on-surface-variant">Fase 2 de 3: Cotejo Documental de Cámara de Comercio y NIT</span>
                  <span className="font-label-md text-label-md font-bold text-primary">65% completado</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-700 ease-out" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
                  <span>1. Registro inicial completado</span>
                  <span className="text-secondary font-semibold">2. Validación de credenciales</span>
                  <span>3. Activación de vacantes</span>
                </div>
              </div>
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[22px]">policy</span>
                    Límites operativos del portal
                  </h2>
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Modo Lectura Restringida</span>
                </div>
                <div className="grid grid-cols-1 gap-space-xs">
                  {restrictions.map((r) => (
                    <div key={r.title} className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          r.enabled ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container/60 text-error'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold">{r.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.enabled ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                            }`}
                          >
                            {r.badge}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              <div className="flex items-start gap-space-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">¿Requieres agilizar la vinculación de practicantes urgentes?</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Contacta a la Mesa de Empleabilidad FET:{' '}
                    <a className="text-primary font-semibold hover:underline" href="mailto:practicas@fet.edu.co">practicas@fet.edu.co</a> o PBX (608) 867 5550 Ext. 115.
                  </p>
                </div>
              </div>
              <a
                className="whitespace-nowrap px-space-md py-space-xs rounded-lg bg-surface-container-highest hover:bg-surface-dim text-on-surface font-label-md text-label-md transition-colors flex items-center gap-space-xxs"
                href="mailto:practicas@fet.edu.co?subject=Urgencia%20Aprobacion%20Empresa%20Radicado%20EMP-2025-048"
              >
                <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
                Escribir a Coordinación
              </a>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Expediente Electrónico</span>
                <span className="px-space-xs py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Ref: 2026-Q1</span>
              </div>
              <div className="flex items-center gap-space-md pb-space-xs">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold font-headline-sm text-headline-sm">TH</div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">TechHuila Soluciones S.A.S.</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Tecnologías de la Información y Software</span>
                </div>
              </div>
              <div className="flex flex-col gap-space-xs bg-surface-container-low rounded-xl p-space-md text-body-sm font-body-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-on-surface-variant flex items-center gap-space-xxs">
                    <span className="material-symbols-outlined text-[16px] text-outline">badge</span>
                    NIT Registrado
                  </span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">901.428.115-2</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-on-surface-variant flex items-center gap-space-xxs">
                    <span className="material-symbols-outlined text-[16px] text-outline">mail</span>
                    Correo Institucional
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-medium truncate max-w-[180px]">talento@techhuila.com</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-on-surface-variant flex items-center gap-space-xxs">
                    <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
                    Fecha de Solicitud
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">Hoy, hace unos momentos</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-on-surface-variant flex items-center gap-space-xxs">
                    <span className="material-symbols-outlined text-[16px] text-outline">timelapse</span>
                    Tiempo Estimado
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-bold">24 a 48 horas hábiles</span>
                </div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container flex items-start gap-space-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">info</span>
                <p className="font-body-sm text-body-sm leading-snug">
                  Al validarse tu persona jurídica, se notificará automáticamente al correo de contacto registrado con las
                  credenciales de gestión de practicantes en Neiva y el Huila.
                </p>
              </div>
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <button
                  onClick={handleDownload}
                  disabled={downloadState === 'loading'}
                  className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm active:scale-[0.99]"
                >
                  {downloadState === 'loading' && (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      <span>Preparando documento institucional...</span>
                    </>
                  )}
                  {downloadState === 'done' && (
                    <>
                      <span className="material-symbols-outlined text-secondary text-[20px]">check</span>
                      <span>Convenio Descargado Correctamente</span>
                    </>
                  )}
                  {downloadState === 'idle' && (
                    <>
                      <span className="material-symbols-outlined text-primary text-[20px]">download_for_offline</span>
                      <span>Descargar Convenio Marco de Cooperación (PDF)</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm active:scale-[0.99]"
                >
                  <span className={`material-symbols-outlined text-[18px] ${signingOut ? 'animate-spin' : ''}`}>
                    {signingOut ? 'sync' : 'lock_reset'}
                  </span>
                  <span>{signingOut ? 'Cerrando sesión de forma segura...' : 'Cerrar Sesión Segura'}</span>
                </button>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-md bg-primary/90 h-44 flex flex-col justify-end p-space-md">
              <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-bold">Campus FET Neiva</span>
              <p className="font-headline-sm text-headline-sm text-inverse-on-surface">Compromiso con el talento del Huila</p>
              <p className="font-body-sm text-body-sm text-inverse-on-surface/80">Km 12 Vía al Sur, Rivera - Huila, Colombia</p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

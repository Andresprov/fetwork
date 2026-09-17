import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'

// CU-11 — Registro de empresa aliada (queda en estado "pendiente" hasta validación)
export default function RegistroEmpresa() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const rules = useMemo(
    () => ({
      min: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  )

  const matchFeedback = !confirmPassword
    ? null
    : password === confirmPassword
      ? { ok: true, text: 'Las contraseñas coinciden' }
      : { ok: false, text: 'Las contraseñas no coinciden' }

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Por favor rectifique: las contraseñas no coinciden.')
      return
    }
    // TODO: conectar con authService (POST /api/auth/empresas/registro) — queda en estado "pendiente"
    setSubmitted(true)
  }

  const ruleItems = [
    ['min', 'Mínimo 8 caracteres'],
    ['upper', 'Al menos 1 mayúscula'],
    ['number', 'Al menos 1 número'],
    ['symbol', 'Al menos 1 símbolo'],
  ]

  return (
    <AuthLayout>
      <div className="flex flex-col w-full max-w-[1280px] mx-auto py-space-md lg:py-space-xl">
        <div className="relative w-full overflow-hidden mb-space-lg rounded-xl bg-surface-container p-space-lg md:p-space-2xl shadow-sm">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
            <div className="max-w-2xl space-y-space-xs">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-lg bg-surface-container-highest text-primary font-label-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Vinculación Empresarial FET • Convenio y Ley 789</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
                Crear Cuenta de Empresa Aliada
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Registra tu organización para publicar ofertas de prácticas, pasantías y acceder al semillero de talento FET en
                el Huila y el surcolombiano.
              </p>
            </div>
            <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">domain_verification</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-none">+180</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">Convenios Activos Huila</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl">
            <form className="space-y-space-lg" onSubmit={handleSubmit}>
              {/* 1. Razón social */}
              <div>
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined text-[20px]">apartment</span>
                    <span className="font-label-lg text-label-lg uppercase tracking-wide">1. Información de la Razón Social</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-xs py-space-xxs rounded-lg">
                    * Campos requeridos
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="razon-social">
                      Nombre o Razón Social de la Empresa <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="razon-social"
                      name="razonSocial"
                      placeholder="ej. Coopecafé Huila S.A.S."
                      required
                      type="text"
                    />
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="nit-empresa">
                      NIT con dígito de verificación <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="nit-empresa"
                      name="nit"
                      pattern="^[0-9]{8,10}-[0-9]{1}$"
                      placeholder="ej. 901.428.115-2"
                      required
                      title="Formato de NIT válido (ej. 901428115-2 o 901.428.115-2)"
                      type="text"
                    />
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="sector-economico">
                      Sector Económico / Productivo <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-11 px-space-sm pr-space-xl rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low appearance-none cursor-pointer"
                        id="sector-economico"
                        name="sector"
                        required
                        defaultValue=""
                      >
                        <option disabled value="">Selecciona un sector clave</option>
                        <option value="ti">Tecnologías de la Información &amp; Software</option>
                        <option value="agro">Agroindustria &amp; Especialidad de Café</option>
                        <option value="energia">Energías Renovables, Eléctrica &amp; Servicios</option>
                        <option value="salud">Salud, Bioseguridad &amp; Ocupacional</option>
                        <option value="construccion">Construcción &amp; Obras Civiles</option>
                        <option value="comercio">Comercio, Logística &amp; Servicios</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="municipio-sede">
                      Municipio de la Sede Principal <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-11 px-space-sm pr-space-xl rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low appearance-none cursor-pointer"
                        id="municipio-sede"
                        name="municipio"
                        required
                        defaultValue=""
                      >
                        <option disabled value="">Selecciona municipio en Huila / Región</option>
                        <option value="neiva">Neiva (Sede Central FET)</option>
                        <option value="pitalito">Pitalito</option>
                        <option value="garzon">Garzón</option>
                        <option value="la-plata">La Plata</option>
                        <option value="campoalegre">Campoalegre</option>
                        <option value="gigante">Gigante</option>
                        <option value="palermo">Palermo</option>
                        <option value="rivera">Rivera</option>
                        <option value="otro">Otro Municipio / Nivel Nacional</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                        location_city
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Contacto */}
              <div>
                <div className="flex items-center gap-space-xs text-primary pb-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">contact_mail</span>
                  <span className="font-label-lg text-label-lg uppercase tracking-wide">2. Canales de Contacto Oficial</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="space-y-space-xxs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="correo-corporativo">
                      Correo Electrónico Corporativo <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="correo-corporativo"
                      name="email"
                      placeholder="ej. talento@organizacion.com.co"
                      required
                      type="email"
                    />
                    <p className="font-body-sm text-body-sm text-outline flex items-center gap-space-xxs pt-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                      Se usará para recibir notificaciones institucionales y validar el dominio de la empresa.
                    </p>
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="telefono-contacto">
                      Teléfono / PBX de Contacto <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="telefono-contacto"
                      name="telefono"
                      placeholder="(608) 867 0000 ó 310..."
                      required
                      type="tel"
                    />
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="sitio-web">
                      Sitio Web Corporativo o Perfil Profesional
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="sitio-web"
                      name="sitioWeb"
                      placeholder="https://www.empresa.com.co"
                      type="url"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Seguridad */}
              <div>
                <div className="flex items-center gap-space-xs text-primary pb-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  <span className="font-label-lg text-label-lg uppercase tracking-wide">3. Seguridad de Acceso al Portal</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="empresa-pass">
                      Contraseña de Acceso <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-11 px-space-sm pr-space-xl rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                        id="empresa-pass"
                        name="password"
                        placeholder="••••••••••••"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="absolute right-space-sm top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                        onClick={() => setShowPassword((v) => !v)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    <div className="pt-space-xs grid grid-cols-2 gap-y-1 gap-x-2 font-label-sm text-label-sm">
                      {ruleItems.map(([key, label]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-1 ${rules[key] ? 'text-secondary font-bold' : 'text-outline'}`}
                        >
                          <span
                            className="material-symbols-outlined text-[15px]"
                            style={rules[key] ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {rules[key] ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="empresa-pass-confirm">
                      Confirmar Contraseña <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-11 px-space-sm pr-space-xl rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                        id="empresa-pass-confirm"
                        name="confirmPassword"
                        placeholder="••••••••••••"
                        required
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        className="absolute right-space-sm top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                        onClick={() => setShowConfirm((v) => !v)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    <p className={`font-label-sm text-label-sm pt-1 h-5 flex items-center gap-1 ${matchFeedback ? (matchFeedback.ok ? 'text-secondary' : 'text-error') : 'text-outline'}`}>
                      {matchFeedback?.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Legal */}
              <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm">
                <div className="flex items-start gap-space-sm">
                  <input className="mt-1 w-4 h-4 rounded text-primary cursor-pointer accent-primary" id="legal-habeas" name="acceptHabeas" required type="checkbox" />
                  <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="legal-habeas">
                    Acepto la <a className="text-primary font-bold underline hover:text-secondary" href="#">Política de Tratamiento de Datos Personales</a> de la FET
                    (Ley 1581 de 2012) y el Reglamento General de Prácticas y Convenios de Pasantía.
                  </label>
                </div>
                <div className="flex items-start gap-space-sm">
                  <input className="mt-1 w-4 h-4 rounded text-primary cursor-pointer accent-primary" id="legal-veracity" name="acceptVeracity" required type="checkbox" />
                  <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="legal-veracity">
                    Declaro bajo la gravedad de juramento que la información suministrada es verídica y corresponde a una persona
                    jurídica o natural con registro mercantil vigente en Cámara de Comercio.
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-space-md p-space-md rounded-xl bg-secondary-container/50 text-on-surface">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary text-[22px]">policy</span>
                </div>
                <div className="space-y-space-xxs">
                  <span className="font-label-md text-label-md text-primary tracking-wide uppercase">Aviso Importante de Seguridad Académica</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Para proteger a nuestros estudiantes y garantizar convenios transparentes bajo la Ley 789 de 2002, todas las
                    cuentas empresariales pasan por un proceso de <strong>revisión y validación administrativa por la Coordinación
                    de Prácticas FET</strong> antes de ser habilitadas para publicar vacantes.
                  </p>
                </div>
              </div>

              <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <button
                  className="w-full sm:w-auto px-space-xl py-3 rounded-lg bg-primary hover:bg-secondary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all shadow-md active:scale-[0.98]"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>Registrar Empresa y Enviar a Validación</span>
                </button>
                <Link to="/empresas/login" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors flex items-center gap-1">
                  <span>¿Ya tienes cuenta activa? Inicia sesión aquí (CU-12)</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="rounded-xl overflow-hidden shadow-md bg-surface-container-lowest">
              <div className="h-32 bg-primary/80 relative flex items-end p-space-md">
                <div className="relative z-10 text-on-primary">
                  <span className="px-space-xs py-space-xxs rounded bg-primary text-on-primary font-label-sm text-label-sm uppercase">Red de Aliados</span>
                  <h3 className="font-headline-sm text-headline-sm text-white mt-1">Conectamos el Huila con el futuro laboral</h3>
                </div>
              </div>
              <div className="p-space-md space-y-space-sm">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Nuestros graduados y practicantes en Tecnologías de Software, Agroindustria, Gestión Ambiental y Redes Eléctricas
                  potencian la productividad regional.
                </p>
                <div className="p-space-sm rounded-lg bg-surface-container-low space-y-space-xxs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
                    <span>Tiempo promedio de validación</span>
                    <span className="font-bold text-secondary">24 a 48 hrs hábiles</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="w-3/4 h-full bg-primary rounded-full" />
                  </div>
                  <span className="font-body-sm text-[11px] text-outline block text-right">Verificación por Coordinación Institucional</span>
                </div>
              </div>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container shadow-sm space-y-space-md">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-primary text-[22px]">shield</span>
                <h3 className="font-headline-sm text-headline-sm">Beneficios del Convenio FET</h3>
              </div>
              <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                {[
                  <>Acompañamiento legal y seguimiento según la <strong>Ley 789 de 2002</strong> (Contratos de Aprendizaje).</>,
                  'Filtro de candidatos certificados por competencias técnicas y proyecto formativo.',
                  'Publicación ilimitada de requerimientos de pasantías y empleos profesionales sin costo.',
                  'Trazabilidad de postulaciones conectada al expediente académico Q10.',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-space-xs">
                <div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[24px]">support_agent</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Coordinación de Prácticas</span>
                    <span className="font-body-sm text-body-sm text-outline">practicas@fet.edu.co • PBX Neiva Ext. 104</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm bg-surface-container-lowest p-space-md space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Sede Principal de Operaciones</span>
              <div className="w-full h-24 rounded-lg bg-surface-container flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-outline text-[32px]">location_on</span>
              </div>
              <p className="font-body-sm text-[12px] text-outline text-center pt-1">
                Campus Universitario FET • Km 12 Vía Neiva - Rivera, Huila
              </p>
            </div>
          </div>
        </div>

        {submitted && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md">
            <div className="bg-surface-container-lowest max-w-md w-full rounded-xl shadow-2xl p-space-xl space-y-space-md text-center">
              <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
              </div>
              <div className="space-y-space-xxs">
                <h3 className="font-headline-md text-headline-md text-on-surface">¡Solicitud de Vinculación Recibida!</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Hemos enviado un correo con instrucciones de verificación al correo corporativo indicado. La Coordinación de
                  Prácticas FET auditará su NIT y registro mercantil para activar la cuenta.
                </p>
              </div>
              <div className="pt-space-xs">
                <Link
                  to="/empresas/pendiente"
                  className="block w-full py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow hover:bg-secondary transition-all"
                >
                  Entendido, ver estado de mi solicitud
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

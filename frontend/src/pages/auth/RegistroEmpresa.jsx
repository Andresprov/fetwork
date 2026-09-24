import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { registrarEmpresa } from "../../api/auth";
import { getErrorMessage } from "../../api/client";

const SECTORES = [
  { value: "ti", label: "Tecnologías de la Información & Software" },
  { value: "agro", label: "Agroindustria & Especialidad de Café" },
  { value: "energia", label: "Energías Renovables, Eléctrica & Servicios" },
  { value: "salud", label: "Salud, Bioseguridad & Ocupacional" },
  { value: "construccion", label: "Construcción & Obras Civiles" },
  { value: "comercio", label: "Comercio, Logística & Servicios" },
];

function evaluarReglasContrasena(valor) {
  return {
    min: valor.length >= 8,
    upper: /[A-Z]/.test(valor),
    number: /[0-9]/.test(valor),
    symbol: /[^A-Za-z0-9]/.test(valor),
  };
}

function ReglaContrasena({ cumplida, children }) {
  return (
    <div className={`flex items-center gap-1 ${cumplida ? "text-secondary font-bold" : "text-outline"}`}>
      <span className="material-symbols-outlined text-[15px]">
        {cumplida ? "check_circle" : "radio_button_unchecked"}
      </span>
      <span>{children}</span>
    </div>
  );
}

// CU-11: registro de empresa aliada. Queda en estado "pendiente" hasta que
// un Validador de Empresas la apruebe o rechace (CU-27).
export default function RegistroEmpresa() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    razonSocial: "",
    sector: "",
    email: "",
    telefono: "",
    sitioWeb: "",
    password: "",
    confirmPassword: "",
    acceptHabeas: false,
    acceptVeracity: false,
  });
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const reglas = useMemo(() => evaluarReglasContrasena(form.password), [form.password]);
  const contrasenaValida = reglas.min && reglas.upper && reglas.number && reglas.symbol;
  const contrasenasCoinciden = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!contrasenaValida) {
      setError("La contraseña no cumple los requisitos mínimos de seguridad.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    try {
      await registrarEmpresa({
        correo: form.email,
        contrasena: form.password,
        nombre_empresa: form.razonSocial,
        sector: SECTORES.find((s) => s.value === form.sector)?.label || form.sector,
        sitio_web: form.sitioWeb || undefined,
        telefono: form.telefono,
      });
      navigate("/empresas/pendiente", { state: { nombre_empresa: form.razonSocial, correo: form.email } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout mainClassName="items-stretch">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto py-space-md lg:py-space-xl">
        <div className="relative w-full overflow-hidden mb-space-lg rounded-xl bg-surface-container p-space-lg md:p-space-2xl shadow-sm">
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
                Registra tu organización para publicar ofertas de prácticas, pasantías y acceder al semillero de
                talento FET en el Huila y el surcolombiano.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl">
            <form className="space-y-space-lg" onSubmit={onSubmit}>
              <div>
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined text-[20px]">apartment</span>
                    <span className="font-label-lg text-label-lg uppercase tracking-wide">
                      1. Información de la Razón Social
                    </span>
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
                      placeholder="ej. Coopecafé Huila S.A.S."
                      required
                      type="text"
                      value={form.razonSocial}
                      onChange={(e) => actualizarCampo("razonSocial", e.target.value)}
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
                        required
                        value={form.sector}
                        onChange={(e) => actualizarCampo("sector", e.target.value)}
                      >
                        <option disabled value="">
                          Selecciona un sector clave
                        </option>
                        {SECTORES.map((sector) => (
                          <option key={sector.value} value={sector.value}>
                            {sector.label}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-space-xs text-primary pb-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">contact_mail</span>
                  <span className="font-label-lg text-label-lg uppercase tracking-wide">
                    2. Canales de Contacto Oficial
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="space-y-space-xxs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="correo-corporativo">
                      Correo Electrónico Corporativo <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="correo-corporativo"
                      placeholder="ej. talento@organizacion.com.co"
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => actualizarCampo("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="telefono-contacto">
                      Teléfono / PBX de Contacto <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="telefono-contacto"
                      placeholder="(608) 867 0000 ó 310..."
                      required
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => actualizarCampo("telefono", e.target.value)}
                    />
                  </div>
                  <div className="space-y-space-xxs">
                    <label className="font-label-md text-label-md text-on-surface block" htmlFor="sitio-web">
                      Sitio Web Corporativo o Perfil Profesional
                    </label>
                    <input
                      className="w-full h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="sitio-web"
                      placeholder="https://www.empresa.com.co"
                      type="url"
                      value={form.sitioWeb}
                      onChange={(e) => actualizarCampo("sitioWeb", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-space-xs text-primary pb-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  <span className="font-label-lg text-label-lg uppercase tracking-wide">
                    3. Seguridad de Acceso al Portal
                  </span>
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
                        placeholder="••••••••••••"
                        required
                        type={mostrarPass ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => actualizarCampo("password", e.target.value)}
                      />
                      <button
                        className="absolute right-space-sm top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                        onClick={() => setMostrarPass((v) => !v)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {mostrarPass ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    <div className="pt-space-xs grid grid-cols-2 gap-y-1 gap-x-2 font-label-sm text-label-sm">
                      <ReglaContrasena cumplida={reglas.min}>Mínimo 8 caracteres</ReglaContrasena>
                      <ReglaContrasena cumplida={reglas.upper}>Al menos 1 mayúscula</ReglaContrasena>
                      <ReglaContrasena cumplida={reglas.number}>Al menos 1 número</ReglaContrasena>
                      <ReglaContrasena cumplida={reglas.symbol}>Al menos 1 símbolo</ReglaContrasena>
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
                        placeholder="••••••••••••"
                        required
                        type={mostrarConfirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) => actualizarCampo("confirmPassword", e.target.value)}
                      />
                      <button
                        className="absolute right-space-sm top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                        onClick={() => setMostrarConfirm((v) => !v)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {mostrarConfirm ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    {form.confirmPassword && (
                      <p className={`font-label-sm text-label-sm pt-1 h-5 ${contrasenasCoinciden ? "text-secondary" : "text-error"}`}>
                        {contrasenasCoinciden ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm">
                <div className="flex items-start gap-space-sm">
                  <input
                    className="mt-1 w-4 h-4 rounded text-primary cursor-pointer accent-primary"
                    id="legal-habeas"
                    required
                    type="checkbox"
                    checked={form.acceptHabeas}
                    onChange={(e) => actualizarCampo("acceptHabeas", e.target.checked)}
                  />
                  <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="legal-habeas">
                    Acepto la Política de Tratamiento de Datos Personales de la FET (Ley 1581 de 2012) y el
                    Reglamento General de Prácticas y Convenios de Pasantía.
                  </label>
                </div>
                <div className="flex items-start gap-space-sm">
                  <input
                    className="mt-1 w-4 h-4 rounded text-primary cursor-pointer accent-primary"
                    id="legal-veracity"
                    required
                    type="checkbox"
                    checked={form.acceptVeracity}
                    onChange={(e) => actualizarCampo("acceptVeracity", e.target.checked)}
                  />
                  <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="legal-veracity">
                    Declaro bajo la gravedad de juramento que la información suministrada es verídica y
                    corresponde a una persona jurídica o natural con registro mercantil vigente.
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-space-md p-space-md rounded-xl bg-secondary-container/50 text-on-surface">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary text-[22px]">policy</span>
                </div>
                <div className="space-y-space-xxs">
                  <span className="font-label-md text-label-md text-primary tracking-wide uppercase">
                    Aviso Importante de Seguridad Académica
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Todas las cuentas empresariales pasan por un proceso de revisión y validación administrativa
                    por la Coordinación de Prácticas FET antes de ser habilitadas para publicar vacantes.
                  </p>
                </div>
              </div>

              {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

              <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <button
                  className="w-full sm:w-auto px-space-xl py-3 rounded-lg bg-primary hover:bg-secondary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all shadow-md active:scale-[0.98] disabled:opacity-60"
                  type="submit"
                  disabled={enviando}
                >
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>{enviando ? "Enviando..." : "Registrar Empresa y Enviar a Validación"}</span>
                </button>
                <a
                  className="font-label-md text-label-md text-secondary hover:text-primary transition-colors flex items-center gap-1"
                  href="/empresas/login"
                >
                  <span>¿Ya tienes cuenta activa? Inicia sesión aquí</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-space-md">
            <div className="p-space-lg rounded-xl bg-surface-container shadow-sm space-y-space-md">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-primary text-[22px]">shield</span>
                <h3 className="font-headline-sm text-headline-sm">Beneficios del Convenio FET</h3>
              </div>
              <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Acompañamiento legal y seguimiento según la Ley 789 de 2002 (Contratos de Aprendizaje).</span>
                </li>
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Filtro de candidatos certificados por competencias técnicas y proyecto formativo.</span>
                </li>
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Publicación ilimitada de requerimientos de pasantías y empleos profesionales sin costo.</span>
                </li>
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
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

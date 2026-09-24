import { Link, useOutletContext } from "react-router-dom";
import Card, { Badge } from "../../components/ui/Card";
import Avatar from "../../components/perfil/Avatar";
import { contar } from "../../lib/formato";

// Criterios de completitud calculados sobre datos reales del perfil.
function calcularCompletitud(perfil) {
  const items = [
    { label: "Teléfono de contacto", ok: Boolean(perfil.telefono), to: "/perfil/datos" },
    { label: "Fotografía de perfil", ok: Boolean(perfil.foto_url), to: "/perfil/datos" },
    { label: "Hoja de vida enlazada", ok: Boolean(perfil.hoja_vida_url), to: "/perfil/datos" },
    { label: "GitHub o portafolio", ok: Boolean(perfil.github_url || perfil.portafolio_url), to: "/perfil/datos" },
    { label: "Al menos 3 habilidades", ok: perfil.resumen.habilidades >= 3, to: "/perfil/habilidades" },
    { label: "Experiencia registrada", ok: perfil.resumen.experiencias > 0, to: "/perfil/experiencia" },
    { label: "Certificación registrada", ok: perfil.resumen.certificaciones > 0, to: "/perfil/certificaciones" },
  ];
  const completos = items.filter((i) => i.ok).length;
  return { items, porcentaje: Math.round((completos / items.length) * 100) };
}

const ACCESOS = [
  { to: "/perfil/datos", icon: "badge", titulo: "Datos personales", texto: "Revisa tus datos de Q10 y actualiza tu contacto y enlaces profesionales." },
  { to: "/perfil/habilidades", icon: "psychology", titulo: "Habilidades", texto: "Registra tus competencias técnicas, metodológicas, blandas e idiomas.", contador: "habilidades" },
  { to: "/perfil/experiencia", icon: "work_history", titulo: "Experiencia", texto: "Documenta pasantías, monitorías y empleos que respalden tu trayectoria.", contador: "experiencias" },
  { to: "/perfil/certificaciones", icon: "workspace_premium", titulo: "Certificaciones", texto: "Agrega cursos, diplomados y certificaciones que complementen tu formación.", contador: "certificaciones" },
  { to: "/perfil/visibilidad", icon: "visibility", titulo: "Visibilidad", texto: "Decide qué secciones de tu perfil pueden consultar las empresas aliadas." },
  { to: "/perfil/vista-publica", icon: "person_search", titulo: "Vista pública", texto: "Comprueba cómo ven tu perfil los reclutadores de las empresas aliadas." },
];

export default function PerfilDashboard() {
  const { perfil } = useOutletContext();
  const { items, porcentaje } = calcularCompletitud(perfil);
  const seccionesVisibles = Object.values(perfil.visibilidad).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <Card accent className="lg:col-span-8 p-space-lg md:p-space-xl flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row items-start gap-space-md">
            <Avatar perfil={perfil} size="w-20 h-20" texto="font-headline-md text-headline-md" />
            <div className="flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <Badge tone="primary" icon="verified">Estudiante FET</Badge>
                {perfil.semestre && <Badge>Semestre {perfil.semestre}</Badge>}
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                ¡Hola, {perfil.nombres}!
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {perfil.programa.nombre} · Código {perfil.codigo_institucional_q10}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
            <Stat icon="psychology" valor={perfil.resumen.habilidades} label="Habilidades" />
            <Stat icon="work_history" valor={perfil.resumen.experiencias} label="Experiencias" />
            <Stat icon="workspace_premium" valor={perfil.resumen.certificaciones} label="Certificaciones" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
            <span className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[20px]">visibility</span>
              {seccionesVisibles} de 4 secciones visibles para empresas
            </span>
            <Link to="/perfil/visibilidad" className="font-label-md text-label-md text-secondary hover:text-primary flex items-center gap-1">
              Configurar visibilidad
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
          </div>
        </Card>

        <Card className="lg:col-span-4 p-space-lg flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Completitud del perfil</span>
            <Badge tone={porcentaje === 100 ? "success" : "primary"}>{porcentaje}%</Badge>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div className="h-full bg-primary-container transition-all" style={{ width: `${porcentaje}%` }} />
          </div>
          <ul className="flex flex-col gap-space-xxs">
            {items.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="flex items-center justify-between gap-space-xs px-space-sm py-space-xs rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <span className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
                    <span className={`material-symbols-outlined text-[20px] ${item.ok ? "text-secondary" : "text-outline"}`}>
                      {item.ok ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    {item.label}
                  </span>
                  {!item.ok && <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex flex-col gap-space-md">
        <h2 className="font-headline-md text-headline-md text-on-surface">Gestiona tu perfil profesional</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {ACCESOS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow p-space-lg flex flex-col gap-space-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">{a.icon}</span>
                </div>
                {a.contador && <Badge>{contar(perfil.resumen[a.contador], "registrada", "registradas")}</Badge>}
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{a.titulo}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-1">{a.texto}</p>
              <span className="font-label-md text-label-md text-secondary flex items-center gap-1">
                Ir a la sección
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, valor, label }) {
  return (
    <div className="p-space-md rounded-lg bg-surface-container-low flex items-center gap-space-sm">
      <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
      <div className="flex flex-col">
        <span className="font-headline-md text-headline-md text-on-surface leading-none">{valor}</span>
        <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
      </div>
    </div>
  );
}

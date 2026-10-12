import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/Feedback";
import { formatearPeriodo } from "../../lib/formato";

// Campos que exige el formato PA-GTH-F-10 por cada experiencia (deben
// coincidir con CAMPOS_EXPERIENCIA_FORMATO del backend).
const CAMPOS_FORMATO = [
  { campo: "direccion", label: "Dirección" },
  { campo: "telefono", label: "Teléfono" },
  { campo: "jefe_inmediato", label: "Jefe inmediato" },
  { campo: "dedicacion", label: "Dedicación" },
  { campo: "fecha_inicio", label: "Fecha de ingreso" },
  { campo: "descripcion", label: "Funciones y logros" },
];

// Paso 3 del PA-GTH-F-10: reutiliza las experiencias del perfil (seccion
// 7.3) y señala que datos faltan para cumplir el formato.
export default function PasoExperiencia({ experiencias }) {
  const navigate = useNavigate();

  if (experiencias.length === 0) {
    return (
      <EmptyState
        icon="work_history"
        title="Aún no has registrado experiencia"
        action={
          <Button size="sm" icon="add" onClick={() => navigate("/perfil/experiencia")}>
            Registrar experiencia
          </Button>
        }
      >
        Pasantías, monitorías, contratos de aprendizaje o empleos. Se registran una sola vez y se usan en tu perfil y en tu hoja de vida.
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container-low">
        <span className="material-symbols-outlined text-secondary">auto_awesome</span>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Tomamos las experiencias de tu perfil. El formato institucional exige además la dirección, el teléfono y el jefe
          inmediato de cada entidad; estos datos no se muestran en tu perfil público.
        </p>
      </div>

      {experiencias.map((exp, i) => {
        const faltantes = CAMPOS_FORMATO.filter((c) => !exp[c.campo]);
        return (
          <div key={exp.id_experiencia} className="flex flex-col gap-space-sm p-space-md rounded-lg border border-surface-container-high">
            <div className="flex flex-wrap items-start justify-between gap-space-sm">
              <div className="flex items-start gap-space-sm">
                <span className="w-8 h-8 rounded-lg bg-surface-container-low text-primary font-label-lg text-label-lg flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface">{exp.cargo}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {[exp.entidad, formatearPeriodo(exp.fecha_inicio, exp.fecha_fin)].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </div>
              {faltantes.length === 0 ? <Badge tone="success" icon="check">Completa</Badge> : <Badge tone="pending">Faltan {faltantes.length} datos</Badge>}
            </div>
            {faltantes.length > 0 && (
              <p className="font-body-sm text-body-sm text-on-surface-variant">Pendiente: {faltantes.map((f) => f.label).join(", ")}.</p>
            )}
          </div>
        );
      })}

      <Button variant="secondary" icon="edit" className="w-fit" onClick={() => navigate("/perfil/experiencia")}>
        Completar o editar experiencias
      </Button>
    </div>
  );
}

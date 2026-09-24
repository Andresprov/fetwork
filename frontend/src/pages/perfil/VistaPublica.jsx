import { Link, useOutletContext } from "react-router-dom";
import PerfilPublicoView from "../../components/perfil/PerfilPublicoView";

// Vista previa del perfil publico para el propio estudiante.
export default function VistaPublica() {
  const { perfil } = useOutletContext();

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">visibility</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Vista previa</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">Así ven tu perfil las empresas aliadas</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Las secciones marcadas como ocultas no son visibles para los reclutadores.
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-space-sm">
          <Link
            to={`/perfiles/${perfil.id_estudiante}`}
            target="_blank"
            className="h-10 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Abrir enlace público
          </Link>
          <Link
            to="/perfil/visibilidad"
            className="h-10 px-space-md rounded-lg bg-primary hover:bg-tertiary text-on-primary font-label-md text-label-md flex items-center gap-space-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Configurar visibilidad
          </Link>
        </div>
      </div>

      <PerfilPublicoView idEstudiante={perfil.id_estudiante} modoVistaPrevia />
    </div>
  );
}

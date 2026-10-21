import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { getRepositorioGithub } from "../../api/proyectos";
import { getErrorMessage } from "../../api/client";
import { formatearMesAnio } from "../../lib/formato";

const ESPERA_MS = 600;

// Panel lateral del formulario de proyecto (CU-05): verifica en GitHub el
// repositorio vinculado y muestra sus estadisticas y ultimos commits. Con
// "Completar con GitHub" llena lo que falte del formulario (onCompletar).
// Solo se monta con una URL de repositorio bien formada y con key={url}, asi
// que cada repositorio arranca con su propio estado.
export default function PanelGithub({ url, onCompletar }) {
  const [estado, setEstado] = useState({ cargando: true, repo: null, error: null });

  useEffect(() => {
    let vigente = true;
    // Espera a que el estudiante termine de escribir antes de consultar.
    const temporizador = setTimeout(() => {
      getRepositorioGithub(url)
        .then((repo) => vigente && setEstado({ cargando: false, repo, error: null }))
        .catch((err) => vigente && setEstado({ cargando: false, repo: null, error: getErrorMessage(err) }));
    }, ESPERA_MS);
    return () => {
      vigente = false;
      clearTimeout(temporizador);
    };
  }, [url]);

  const { cargando, repo, error } = estado;

  return (
    <Card className="p-space-lg flex flex-col gap-space-md">
      <span className="flex items-center gap-space-xs font-headline-sm text-headline-sm text-on-surface">
        <span className="material-symbols-outlined text-secondary">hub</span>
        GitHub
      </span>

      {cargando && (
        <span className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-primary text-[18px]">progress_activity</span>
          Verificando el repositorio...
        </span>
      )}

      {error && (
        <p className="flex items-start gap-space-xs font-body-md text-body-md text-error">
          <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
          {error}
        </p>
      )}

      {repo && (
        <>
          <div className="flex flex-col gap-space-xxs">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-label-lg text-label-lg text-secondary hover:text-primary break-all">
              {repo.nombre_completo}
            </a>
            <span className="flex items-center gap-1 font-label-md text-label-md text-secondary">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Repositorio público verificado
            </span>
          </div>

          <div className="flex flex-wrap gap-space-md font-label-md text-label-md text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">star</span>
              {repo.estrellas}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">fork_right</span>
              {repo.forks}
            </span>
            {repo.actualizado_en && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">update</span>
                {formatearMesAnio(repo.actualizado_en)}
              </span>
            )}
          </div>

          {repo.archivado && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">Este repositorio está archivado (solo lectura) en GitHub.</p>
          )}

          {repo.lenguajes.length > 0 && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <span className="font-semibold text-on-surface">Lenguajes:</span> {repo.lenguajes.join(", ")}
            </p>
          )}

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Últimos commits</span>
            {repo.commits.length === 0 ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant">El repositorio aún no tiene commits.</span>
            ) : (
              <ul className="flex flex-col gap-space-xs">
                {repo.commits.map((c) => (
                  <li key={c.sha} className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-outline mt-0.5">commit</span>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex flex-col min-w-0 group">
                      <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary line-clamp-2 break-words">{c.mensaje}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {c.sha}
                        {c.fecha && ` · ${formatearMesAnio(c.fecha)}`}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button variant="secondary" size="sm" icon="auto_fix_high" onClick={() => onCompletar(repo)}>
            Completar con datos de GitHub
          </Button>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Llena la descripción, la fecha y la demo si están vacías, y agrega los lenguajes y temas del repositorio a las tecnologías.
          </p>
        </>
      )}
    </Card>
  );
}

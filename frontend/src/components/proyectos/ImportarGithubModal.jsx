import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Badge } from "../ui/Card";
import { Alert, Loading } from "../ui/Feedback";
import { getRepositoriosGithub, importarRepositoriosGithub } from "../../api/proyectos";
import { getErrorMessage } from "../../api/client";
import { formatearMesAnio } from "../../lib/formato";

const MAX_IMPORTAR = 30;

// Sincronizacion con GitHub (CU-05): lista los repositorios publicos del
// perfil de GitHub del estudiante y crea un proyecto por cada uno elegido.
// Los que ya estan en el portafolio aparecen marcados y no se pueden elegir.
// Se monta solo mientras esta abierto: cada apertura consulta de nuevo.
export default function ImportarGithubModal({ onClose, onImportados }) {
  const [datos, setDatos] = useState(null); // { usuario, repositorios }
  const [error, setError] = useState(null);
  const [sinGithub, setSinGithub] = useState(false);
  const [seleccion, setSeleccion] = useState(() => new Set());
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    getRepositoriosGithub()
      .then(setDatos)
      .catch((err) => {
        if (err?.response?.status === 409) setSinGithub(true);
        setError(getErrorMessage(err));
      });
  }, []);

  const disponibles = datos?.repositorios.filter((r) => !r.importado) || [];

  function alternar(nombre) {
    setSeleccion((prev) => {
      const nueva = new Set(prev);
      if (nueva.has(nombre)) nueva.delete(nombre);
      else if (nueva.size < MAX_IMPORTAR) nueva.add(nombre);
      return nueva;
    });
  }

  const todosElegidos = disponibles.length > 0 && disponibles.slice(0, MAX_IMPORTAR).every((r) => seleccion.has(r.nombre_completo));
  const alternarTodos = () =>
    setSeleccion(todosElegidos ? new Set() : new Set(disponibles.slice(0, MAX_IMPORTAR).map((r) => r.nombre_completo)));

  async function onImportar() {
    setImportando(true);
    setError(null);
    try {
      const res = await importarRepositoriosGithub([...seleccion]);
      setResultado(res);
      if (res.importados.length) onImportados(res.importados);
      const importadas = new Set(res.importados.map((p) => p.repositorio_github_url.toLowerCase()));
      setDatos((d) => ({
        ...d,
        repositorios: d.repositorios.map((r) => (importadas.has(r.url.toLowerCase()) ? { ...r, importado: true } : r)),
      }));
      setSeleccion(new Set());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setImportando(false);
    }
  }

  return (
    <Modal open onClose={onClose} icon="sync" eyebrow="GitHub" title="Sincronizar con GitHub" maxWidth="max-w-3xl">
      {datos && (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Repositorios públicos de{" "}
          <a href={`https://github.com/${datos.usuario}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary hover:text-primary">
            @{datos.usuario}
          </a>
          . Cada repositorio que elijas se agrega a tu portafolio con su descripción, lenguajes y enlace; después puedes completarlo.
        </p>
      )}

      {error && (
        <Alert tone="error">
          {error}
          {sinGithub && (
            <>
              {" "}
              <Link to="/perfil/datos" onClick={onClose} className="font-semibold underline">
                Ir a Datos personales
              </Link>
            </>
          )}
        </Alert>
      )}

      {resultado && (
        <Alert tone="success" onClose={() => setResultado(null)}>
          {resultado.importados.length === 1 ? "Se importó 1 proyecto." : `Se importaron ${resultado.importados.length} proyectos.`}
          {resultado.omitidos.length > 0 && ` ${resultado.omitidos.length} se omitieron: ${resultado.omitidos.map((o) => `${o.repositorio} (${o.motivo})`).join("; ")}`}
        </Alert>
      )}

      {!datos && !error && <Loading texto="Consultando tus repositorios en GitHub..." />}

      {datos && datos.repositorios.length === 0 && (
        <p className="font-body-md text-body-md text-on-surface-variant text-center py-space-lg">
          No encontramos repositorios públicos propios en esta cuenta (los forks no se incluyen).
        </p>
      )}

      {datos && datos.repositorios.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <span className="font-label-md text-label-md text-on-surface-variant">
              {disponibles.length} disponibles · {datos.repositorios.length - disponibles.length} ya en tu portafolio
            </span>
            {disponibles.length > 0 && (
              <Button variant="ghost" size="sm" icon={todosElegidos ? "deselect" : "select_all"} onClick={alternarTodos}>
                {todosElegidos ? "Quitar selección" : "Seleccionar todos"}
              </Button>
            )}
          </div>

          <ul className="flex flex-col gap-space-xs max-h-[50vh] overflow-y-auto pr-1">
            {datos.repositorios.map((r) => {
              const elegido = seleccion.has(r.nombre_completo);
              return (
                <li key={r.nombre_completo}>
                  <label
                    className={`flex items-start gap-space-sm p-space-sm rounded-lg border transition-colors ${
                      r.importado
                        ? "border-outline-variant/50 bg-surface-container-low opacity-70 cursor-default"
                        : elegido
                          ? "border-secondary bg-secondary-container/40 cursor-pointer"
                          : "border-outline-variant/70 hover:bg-surface-container-low cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 accent-secondary shrink-0"
                      checked={r.importado || elegido}
                      disabled={r.importado}
                      onChange={() => alternar(r.nombre_completo)}
                    />
                    <div className="flex flex-col gap-space-xxs min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <span className="font-label-lg text-label-lg text-on-surface break-all">{r.nombre}</span>
                        {r.importado && <Badge tone="primary" icon="check">En tu portafolio</Badge>}
                        {r.archivado && <Badge icon="inventory_2">Archivado</Badge>}
                      </div>
                      {r.descripcion && <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{r.descripcion}</p>}
                      <div className="flex flex-wrap items-center gap-space-sm font-label-md text-label-md text-on-surface-variant">
                        {r.lenguaje && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">code</span>
                            {r.lenguaje}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">star</span>
                          {r.estrellas}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">fork_right</span>
                          {r.forks}
                        </span>
                        {r.actualizado_en && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">update</span>
                            {formatearMesAnio(r.actualizado_en)}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="flex flex-wrap justify-end gap-space-sm pt-space-xs">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        {datos && disponibles.length > 0 && (
          <Button icon="download" loading={importando} disabled={seleccion.size === 0} onClick={onImportar}>
            {seleccion.size > 0 ? `Importar ${seleccion.size}` : "Importar"}
          </Button>
        )}
      </div>
    </Modal>
  );
}

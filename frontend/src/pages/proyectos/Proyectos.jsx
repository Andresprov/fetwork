import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Card, { Badge } from "../../components/ui/Card";
import Button, { IconButton } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { ConfirmDialog } from "../../components/ui/Modal";
import { Alert, EmptyState, Loading } from "../../components/ui/Feedback";
import { TextField } from "../../components/ui/FormFields";
import { eliminarProyecto, getMisProyectos } from "../../api/proyectos";
import { getErrorMessage } from "../../api/client";
import { formatearMesAnio } from "../../lib/formato";
import { etiquetaEnlace, iconoEnlace, rutaRepositorio } from "../../lib/proyectos";
import ImportarGithubModal from "../../components/proyectos/ImportarGithubModal";

// Portafolio de proyectos del estudiante (CU-04). El registro y la edicion
// viven en ProyectoForm (incluye la vinculacion del repositorio, CU-05); la
// importacion desde GitHub, en ImportarGithubModal.
export default function Proyectos() {
  const { perfil, recargarPerfil } = useOutletContext();
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    getMisProyectos()
      .then(setProyectos)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return proyectos;
    return proyectos.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.tecnologias.some((t) => t.toLowerCase().includes(q))
    );
  }, [proyectos, busqueda]);

  const conRepositorio = proyectos.filter((p) => p.repositorio_github_url).length;
  const tecnologias = new Set(proyectos.flatMap((p) => p.tecnologias.map((t) => t.toLowerCase()))).size;

  function onImportados(nuevos) {
    setProyectos((prev) => [...nuevos, ...prev]);
    recargarPerfil();
  }

  async function onEliminar() {
    setEliminando(true);
    try {
      await eliminarProyecto(porEliminar.id_proyecto);
      setProyectos((prev) => prev.filter((p) => p.id_proyecto !== porEliminar.id_proyecto));
      recargarPerfil();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPorEliminar(null);
      setEliminando(false);
    }
  }

  if (cargando) return <Loading texto="Cargando tus proyectos..." />;

  return (
    <div className="flex flex-col gap-space-xl">
      <PageHeader
        eyebrow="Portafolio"
        title="Portafolio de proyectos"
        description="Exhibe las aplicaciones que has desarrollado, tus proyectos de aula y de semillero, y vincula sus repositorios para que las empresas aliadas conozcan tu trabajo."
        actions={
          <>
            <Button variant="secondary" icon="sync" onClick={() => setSincronizando(true)}>
              Sincronizar con GitHub
            </Button>
            <Button icon="add_circle" onClick={() => navigate("/perfil/proyectos/nuevo")}>
              Registrar proyecto
            </Button>
          </>
        }
      />

      {error && <Alert tone="error">{error}</Alert>}

      {!perfil.visibilidad.mostrar_proyectos && (
        <Alert tone="info">
          Tus proyectos están ocultos en tu perfil público. Puedes mostrarlos desde{" "}
          <Link to="/perfil/visibilidad" className="font-semibold underline">
            Visibilidad
          </Link>
          .
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        <Stat icon="folder_special" valor={proyectos.length} label="Proyectos publicados" />
        <Stat icon="code" valor={conRepositorio} label="Con repositorio GitHub" />
        <Stat icon="layers" valor={tecnologias} label="Tecnologías distintas" />
      </div>

      {proyectos.length === 0 ? (
        <EmptyState
          icon="folder_special"
          title="Aún no has registrado proyectos"
          action={
            <div className="flex flex-wrap justify-center gap-space-xs">
              <Button size="sm" icon="add" onClick={() => navigate("/perfil/proyectos/nuevo")}>
                Registrar mi primer proyecto
              </Button>
              <Button size="sm" variant="secondary" icon="sync" onClick={() => setSincronizando(true)}>
                Importar desde GitHub
              </Button>
            </div>
          }
        >
          Incluye proyectos de aula, de semillero o personales, o impórtalos directamente desde tus repositorios públicos de GitHub. Las empresas valoran ver código real y demos funcionales.
        </EmptyState>
      ) : (
        <>
          <Card className="p-space-md">
            <TextField
              id="buscar-proyecto"
              icon="search"
              placeholder="Buscar por nombre o tecnología..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Card>

          {filtrados.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant text-center py-space-lg">
              Ningún proyecto coincide con «{busqueda}».
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
              {filtrados.map((p) => (
                <Card key={p.id_proyecto} className="p-space-lg flex flex-col gap-space-md">
                  <div className="flex items-start justify-between gap-space-xs">
                    <div className="flex flex-col gap-space-xxs min-w-0">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface break-words">{p.nombre}</h3>
                      {p.fecha && (
                        <span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                          {formatearMesAnio(p.fecha)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-space-xxs shrink-0">
                      <IconButton icon="edit" title="Editar proyecto" onClick={() => navigate(`/perfil/proyectos/${p.id_proyecto}`)} />
                      <IconButton icon="delete" title="Eliminar proyecto" variant="danger" onClick={() => setPorEliminar(p)} />
                    </div>
                  </div>

                  {p.descripcion && (
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 whitespace-pre-line">{p.descripcion}</p>
                  )}

                  {p.tecnologias.length > 0 && (
                    <div className="flex flex-wrap gap-space-xxs">
                      {p.tecnologias.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-space-xs">
                    {p.repositorio_github_url && (
                      <a
                        href={p.repositorio_github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-space-xs h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high font-label-md text-label-md text-on-surface truncate px-space-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">code</span>
                        <span className="truncate">{rutaRepositorio(p.repositorio_github_url)}</span>
                      </a>
                    )}
                    {p.enlaces.length > 0 && (
                      <div className="flex flex-wrap gap-space-xs">
                        {p.enlaces.map((e) => (
                          <a
                            key={e.url}
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-[16px]">{iconoEnlace(e.tipo)}</span>
                            {etiquetaEnlace(e.tipo)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {sincronizando && <ImportarGithubModal onClose={() => setSincronizando(false)} onImportados={onImportados} />}

      <ConfirmDialog
        open={porEliminar !== null}
        title="Eliminar proyecto"
        loading={eliminando}
        onCancel={() => setPorEliminar(null)}
        onConfirm={onEliminar}
      >
        ¿Seguro que deseas eliminar el proyecto «{porEliminar?.nombre}»? Esta acción no se puede deshacer.
      </ConfirmDialog>
    </div>
  );
}

function Stat({ icon, valor, label }) {
  return (
    <Card className="p-space-md flex items-center justify-between gap-space-sm">
      <div className="flex flex-col">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</span>
        <span className="font-headline-lg text-headline-lg text-on-surface">{valor}</span>
      </div>
      <div className="w-11 h-11 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
    </Card>
  );
}

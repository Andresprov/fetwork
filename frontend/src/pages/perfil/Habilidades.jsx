import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card, { Badge, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Alert, EmptyState, Loading } from "../../components/ui/Feedback";
import { SelectField } from "../../components/ui/FormFields";
import { agregarHabilidad, getCatalogoHabilidades, getMisHabilidades, quitarHabilidad } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";
import { NIVELES, contar, etiquetaNivel } from "../../lib/formato";

const ICONOS_CATEGORIA = {
  "Tecnologías y Lenguajes": "code",
  "Bases de Datos": "database",
  "Infraestructura y DevOps": "cloud",
  "Metodologías y Prácticas": "account_tree",
  "Habilidades Blandas": "diversity_3",
  Idiomas: "translate",
};

const TONO_NIVEL = { basico: "pending", intermedio: "info", avanzado: "success" };

export default function Habilidades() {
  const { recargarPerfil } = useOutletContext();
  const [catalogo, setCatalogo] = useState([]);
  const [mias, setMias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [idCategoria, setIdCategoria] = useState("");
  const [idHabilidad, setIdHabilidad] = useState("");
  const [nivel, setNivel] = useState("intermedio");
  const [agregando, setAgregando] = useState(false);
  const [quitando, setQuitando] = useState(null);

  useEffect(() => {
    Promise.all([getCatalogoHabilidades(), getMisHabilidades()])
      .then(([cat, propias]) => {
        setCatalogo(cat);
        setMias(propias);
        if (cat.length) setIdCategoria(String(cat[0].id_categoria));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setCargando(false));
  }, []);

  const idsMias = useMemo(() => new Set(mias.map((h) => h.id_habilidad)), [mias]);

  const opcionesHabilidad = useMemo(() => {
    const categoria = catalogo.find((c) => String(c.id_categoria) === idCategoria);
    if (!categoria) return [];
    return categoria.habilidades
      .filter((h) => !idsMias.has(h.id_habilidad))
      .map((h) => ({ value: String(h.id_habilidad), label: h.nombre }));
  }, [catalogo, idCategoria, idsMias]);

  const agrupadas = useMemo(
    () =>
      catalogo
        .map((c) => ({ ...c, propias: mias.filter((h) => h.categoria.id_categoria === c.id_categoria) }))
        .filter((c) => c.propias.length > 0),
    [catalogo, mias]
  );

  async function onAgregar(e) {
    e.preventDefault();
    if (!idHabilidad) return;
    setAgregando(true);
    setError(null);
    try {
      const nueva = await agregarHabilidad({ id_habilidad: Number(idHabilidad), nivel });
      setMias((prev) => [...prev, nueva]);
      setIdHabilidad("");
      recargarPerfil();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAgregando(false);
    }
  }

  async function onQuitar(habilidad) {
    setQuitando(habilidad.id_habilidad);
    setError(null);
    try {
      await quitarHabilidad(habilidad.id_habilidad);
      setMias((prev) => prev.filter((h) => h.id_habilidad !== habilidad.id_habilidad));
      recargarPerfil();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setQuitando(null);
    }
  }

  if (cargando) return <Loading texto="Cargando habilidades..." />;

  return (
    <div className="flex flex-col gap-space-xl">
      <PageHeader
        eyebrow="Competencias"
        title="Habilidades"
        description="Registra tus competencias técnicas, metodológicas, blandas e idiomas para que las empresas aliadas identifiquen tu perfil."
      />

      <Card accent className="p-space-lg flex flex-col gap-space-md">
        <CardHeader icon="add_task" title="Agregar habilidad" subtitle="Selecciona la categoría, la habilidad y tu nivel de dominio." />
        <form onSubmit={onAgregar} className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-end">
          <SelectField
            id="categoria"
            label="Categoría"
            className="md:col-span-4"
            value={idCategoria}
            onChange={(e) => {
              setIdCategoria(e.target.value);
              setIdHabilidad("");
            }}
            options={catalogo.map((c) => ({ value: String(c.id_categoria), label: c.nombre }))}
          />
          <SelectField
            id="habilidad"
            label="Habilidad"
            className="md:col-span-4"
            value={idHabilidad}
            onChange={(e) => setIdHabilidad(e.target.value)}
            placeholder={opcionesHabilidad.length ? "Selecciona una habilidad" : "Ya agregaste todas las de esta categoría"}
            options={opcionesHabilidad}
          />
          <SelectField
            id="nivel"
            label="Nivel"
            className="md:col-span-2"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            options={NIVELES}
          />
          <Button type="submit" icon="add_circle" loading={agregando} disabled={!idHabilidad} className="md:col-span-2 w-full">
            Agregar
          </Button>
        </form>
        {error && <Alert tone="error">{error}</Alert>}
      </Card>

      {agrupadas.length === 0 ? (
        <EmptyState icon="psychology" title="Aún no has registrado habilidades">
          Agrega tus primeras competencias con el formulario de arriba. Aparecerán agrupadas por categoría.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
          {agrupadas.map((categoria) => (
            <Card key={categoria.id_categoria} className="p-space-lg flex flex-col gap-space-md">
              <CardHeader
                icon={ICONOS_CATEGORIA[categoria.nombre] || "label"}
                title={categoria.nombre}
                action={<Badge>{contar(categoria.propias.length, "registrada", "registradas")}</Badge>}
              />
              <div className="flex flex-wrap gap-space-xs">
                {categoria.propias.map((h) => (
                  <span
                    key={h.id_habilidad}
                    className="inline-flex items-center gap-space-xs pl-space-sm pr-space-xxs py-space-xxs rounded-lg bg-surface-container-low font-label-lg text-label-lg text-on-surface"
                  >
                    {h.nombre}
                    {h.nivel && <Badge tone={TONO_NIVEL[h.nivel]}>{etiquetaNivel(h.nivel)}</Badge>}
                    <button
                      type="button"
                      onClick={() => onQuitar(h)}
                      disabled={quitando === h.id_habilidad}
                      title={`Quitar ${h.nombre}`}
                      aria-label={`Quitar ${h.nombre}`}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {quitando === h.id_habilidad ? "progress_activity" : "close"}
                      </span>
                    </button>
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

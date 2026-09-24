import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card, { Badge } from "../../components/ui/Card";
import Button, { IconButton } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import Modal, { ConfirmDialog } from "../../components/ui/Modal";
import { Alert, EmptyState, Loading } from "../../components/ui/Feedback";
import { SelectField, TextAreaField, TextField } from "../../components/ui/FormFields";
import { actualizarExperiencia, crearExperiencia, eliminarExperiencia, getExperiencias } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";
import { aInputFecha, formatearPeriodo } from "../../lib/formato";

const DEDICACIONES = ["Tiempo completo", "Medio tiempo", "Por horas", "Pasantía", "Monitoría"].map((d) => ({ value: d, label: d }));

const VACIO = {
  cargo: "",
  entidad: "",
  dedicacion: "",
  fecha_inicio: "",
  fecha_fin: "",
  descripcion: "",
  direccion: "",
  telefono: "",
  jefe_inmediato: "",
};

function aFormulario(exp) {
  return {
    ...VACIO,
    ...Object.fromEntries(Object.keys(VACIO).map((k) => [k, exp[k] || ""])),
    fecha_inicio: aInputFecha(exp.fecha_inicio),
    fecha_fin: aInputFecha(exp.fecha_fin),
  };
}

export default function Experiencia() {
  const { recargarPerfil } = useOutletContext();
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [editando, setEditando] = useState(null); // null | "nueva" | experiencia
  const [form, setForm] = useState(VACIO);
  const [actual, setActual] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    getExperiencias()
      .then(setExperiencias)
      .catch((err) => setErrorCarga(getErrorMessage(err)))
      .finally(() => setCargando(false));
  }, []);

  function abrir(exp) {
    setEditando(exp || "nueva");
    setForm(exp ? aFormulario(exp) : VACIO);
    setActual(exp ? !exp.fecha_fin && Boolean(exp.fecha_inicio) : false);
    setErrorForm(null);
  }

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  async function onGuardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorForm(null);
    const payload = { ...form, fecha_fin: actual ? "" : form.fecha_fin };
    try {
      if (editando === "nueva") {
        const creada = await crearExperiencia(payload);
        setExperiencias((prev) => [creada, ...prev]);
        recargarPerfil();
      } else {
        const actualizada = await actualizarExperiencia(editando.id_experiencia, payload);
        setExperiencias((prev) => prev.map((x) => (x.id_experiencia === actualizada.id_experiencia ? actualizada : x)));
      }
      setEditando(null);
    } catch (err) {
      setErrorForm(getErrorMessage(err));
    } finally {
      setGuardando(false);
    }
  }

  async function onEliminar() {
    setEliminando(true);
    try {
      await eliminarExperiencia(porEliminar.id_experiencia);
      setExperiencias((prev) => prev.filter((x) => x.id_experiencia !== porEliminar.id_experiencia));
      setPorEliminar(null);
      recargarPerfil();
    } catch (err) {
      setErrorCarga(getErrorMessage(err));
      setPorEliminar(null);
    } finally {
      setEliminando(false);
    }
  }

  if (cargando) return <Loading texto="Cargando experiencia..." />;

  return (
    <div className="flex flex-col gap-space-xl">
      <PageHeader
        eyebrow="Trayectoria"
        title="Experiencia laboral y prácticas"
        description="Registra tus pasantías, contratos de aprendizaje, monitorías y empleos. Esta información alimenta tu perfil público y tu hoja de vida institucional."
        actions={
          <Button icon="add_circle" onClick={() => abrir(null)}>
            Agregar experiencia
          </Button>
        }
      />

      {errorCarga && <Alert tone="error">{errorCarga}</Alert>}

      <div className="flex items-center gap-space-xs">
        <h2 className="font-headline-md text-headline-md text-on-surface">Experiencias registradas</h2>
        <Badge>{experiencias.length}</Badge>
      </div>

      {experiencias.length === 0 ? (
        <EmptyState
          icon="work_history"
          title="Aún no has registrado experiencia"
          action={
            <Button size="sm" icon="add" onClick={() => abrir(null)}>
              Agregar mi primera experiencia
            </Button>
          }
        >
          Incluye pasantías, monitorías, proyectos con empresas o empleos formales.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-space-md">
          {experiencias.map((exp) => (
            <Card key={exp.id_experiencia} className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-start justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-low text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[26px]">apartment</span>
                  </div>
                  <div className="flex flex-col gap-space-xxs">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{exp.cargo}</h3>
                      {exp.dedicacion && <Badge tone="primary">{exp.dedicacion}</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-space-md gap-y-space-xxs font-body-md text-body-md text-on-surface-variant">
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <span className="material-symbols-outlined text-[18px]">domain</span>
                        {exp.entidad}
                      </span>
                      {formatearPeriodo(exp.fecha_inicio, exp.fecha_fin) && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                          {formatearPeriodo(exp.fecha_inicio, exp.fecha_fin)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-space-xxs">
                  <IconButton icon="edit" title="Editar experiencia" onClick={() => abrir(exp)} />
                  <IconButton icon="delete" title="Eliminar experiencia" variant="danger" onClick={() => setPorEliminar(exp)} />
                </div>
              </div>

              {exp.descripcion && (
                <div className="p-space-md rounded-lg bg-surface-container-low">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Funciones y logros</span>
                  <p className="font-body-md text-body-md text-on-surface mt-space-xxs whitespace-pre-line">{exp.descripcion}</p>
                </div>
              )}

              {(exp.jefe_inmediato || exp.telefono || exp.direccion) && (
                <p className="flex flex-wrap items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">contact_phone</span>
                  {[exp.jefe_inmediato && `Referencia: ${exp.jefe_inmediato}`, exp.telefono && `Tel. ${exp.telefono}`, exp.direccion]
                    .filter(Boolean)
                    .join(" · ")}
                  <Badge icon="lock">Privado</Badge>
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editando !== null}
        onClose={() => setEditando(null)}
        icon="work_history"
        eyebrow="Experiencia"
        title={editando === "nueva" ? "Agregar experiencia" : "Editar experiencia"}
      >
        <form onSubmit={onGuardar} className="flex flex-col gap-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <TextField id="cargo" label="Cargo" required value={form.cargo} onChange={cambiar("cargo")} placeholder="Desarrollador junior" />
            <TextField id="entidad" label="Empresa o entidad" required value={form.entidad} onChange={cambiar("entidad")} placeholder="TechHuila S.A.S." />
            <SelectField id="dedicacion" label="Dedicación" value={form.dedicacion} onChange={cambiar("dedicacion")} placeholder="Selecciona una opción" options={DEDICACIONES} />
            <div className="hidden sm:block" />
            <TextField id="fecha_inicio" label="Fecha de inicio" type="date" value={form.fecha_inicio} onChange={cambiar("fecha_inicio")} />
            <div className="flex flex-col gap-space-xxs">
              <TextField id="fecha_fin" label="Fecha de finalización" type="date" value={actual ? "" : form.fecha_fin} onChange={cambiar("fecha_fin")} disabled={actual} />
              <label className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                <input type="checkbox" checked={actual} onChange={(e) => setActual(e.target.checked)} className="accent-primary w-4 h-4" />
                Actualmente trabajo aquí
              </label>
            </div>
          </div>
          <TextAreaField
            id="descripcion"
            label="Funciones y logros"
            value={form.descripcion}
            onChange={cambiar("descripcion")}
            hint={`${form.descripcion.length}/2000`}
            maxLength={2000}
            placeholder="Describe tus responsabilidades y resultados concretos."
          />

          <div className="flex flex-col gap-space-sm p-space-md rounded-lg border border-dashed border-outline-variant">
            <span className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-secondary">lock</span>
              Datos de referencia para tu hoja de vida. No se muestran en tu perfil público.
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <TextField id="jefe_inmediato" label="Jefe inmediato" value={form.jefe_inmediato} onChange={cambiar("jefe_inmediato")} />
              <TextField id="telefono_exp" label="Teléfono de la entidad" type="tel" value={form.telefono} onChange={cambiar("telefono")} />
              <TextField id="direccion" label="Dirección" className="sm:col-span-2" value={form.direccion} onChange={cambiar("direccion")} />
            </div>
          </div>

          {errorForm && <Alert tone="error">{errorForm}</Alert>}

          <div className="flex justify-end gap-space-sm">
            <Button variant="secondary" onClick={() => setEditando(null)}>
              Cancelar
            </Button>
            <Button type="submit" icon="save" loading={guardando}>
              {editando === "nueva" ? "Agregar experiencia" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={porEliminar !== null}
        title="Eliminar experiencia"
        loading={eliminando}
        onCancel={() => setPorEliminar(null)}
        onConfirm={onEliminar}
      >
        ¿Seguro que deseas eliminar la experiencia «{porEliminar?.cargo}» en {porEliminar?.entidad}? Esta acción no se puede deshacer.
      </ConfirmDialog>
    </div>
  );
}

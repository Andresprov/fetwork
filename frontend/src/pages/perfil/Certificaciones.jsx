import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card, { Badge } from "../../components/ui/Card";
import Button, { IconButton } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import Modal, { ConfirmDialog } from "../../components/ui/Modal";
import { Alert, EmptyState, Loading } from "../../components/ui/Feedback";
import { SelectField, TextField } from "../../components/ui/FormFields";
import { actualizarCertificacion, crearCertificacion, eliminarCertificacion, getCertificaciones } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";
import { aInputFecha, formatearMesAnio } from "../../lib/formato";

const MODALIDADES = ["Presencial", "Virtual", "Híbrida"].map((m) => ({ value: m, label: m }));
const VACIO = { nombre: "", entidad_emisora: "", fecha: "", duracion: "", modalidad: "" };

function aFormulario(c) {
  return {
    nombre: c.nombre || "",
    entidad_emisora: c.entidad_emisora || "",
    fecha: aInputFecha(c.fecha),
    duracion: c.duracion || "",
    modalidad: c.modalidad || "",
  };
}

export default function Certificaciones() {
  const { recargarPerfil } = useOutletContext();
  const [certificaciones, setCertificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [editando, setEditando] = useState(null); // null | "nueva" | certificacion
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    getCertificaciones()
      .then(setCertificaciones)
      .catch((err) => setErrorCarga(getErrorMessage(err)))
      .finally(() => setCargando(false));
  }, []);

  function abrir(cert) {
    setEditando(cert || "nueva");
    setForm(cert ? aFormulario(cert) : VACIO);
    setErrorForm(null);
  }

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  async function onGuardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorForm(null);
    try {
      if (editando === "nueva") {
        const creada = await crearCertificacion(form);
        setCertificaciones((prev) => [creada, ...prev]);
        recargarPerfil();
      } else {
        const actualizada = await actualizarCertificacion(editando.id_certificacion, form);
        setCertificaciones((prev) => prev.map((c) => (c.id_certificacion === actualizada.id_certificacion ? actualizada : c)));
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
      await eliminarCertificacion(porEliminar.id_certificacion);
      setCertificaciones((prev) => prev.filter((c) => c.id_certificacion !== porEliminar.id_certificacion));
      setPorEliminar(null);
      recargarPerfil();
    } catch (err) {
      setErrorCarga(getErrorMessage(err));
      setPorEliminar(null);
    } finally {
      setEliminando(false);
    }
  }

  if (cargando) return <Loading texto="Cargando certificaciones..." />;

  return (
    <div className="flex flex-col gap-space-xl">
      <PageHeader
        eyebrow="Formación complementaria"
        title="Certificaciones y cursos"
        description="Agrega certificaciones, diplomados y cursos que respalden tus competencias ante las empresas aliadas."
        actions={
          <Button icon="add_circle" onClick={() => abrir(null)}>
            Agregar certificación
          </Button>
        }
      />

      {errorCarga && <Alert tone="error">{errorCarga}</Alert>}

      <div className="flex items-center gap-space-xs">
        <h2 className="font-headline-md text-headline-md text-on-surface">Certificaciones registradas</h2>
        <Badge>{certificaciones.length}</Badge>
      </div>

      {certificaciones.length === 0 ? (
        <EmptyState
          icon="workspace_premium"
          title="Aún no has registrado certificaciones"
          action={
            <Button size="sm" icon="add" onClick={() => abrir(null)}>
              Agregar mi primera certificación
            </Button>
          }
        >
          Incluye cursos de plataformas reconocidas, diplomados de extensión FET o certificaciones de la industria.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {certificaciones.map((c) => (
            <Card key={c.id_certificacion} className="p-space-lg flex flex-col gap-space-sm">
              <div className="flex items-start justify-between gap-space-xs">
                <div className="w-11 h-11 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                </div>
                <div className="flex gap-space-xxs">
                  <IconButton icon="edit" title="Editar certificación" onClick={() => abrir(c)} />
                  <IconButton icon="delete" title="Eliminar certificación" variant="danger" onClick={() => setPorEliminar(c)} />
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{c.nombre}</h3>
              {c.entidad_emisora && <p className="font-body-md text-body-md text-secondary font-semibold">{c.entidad_emisora}</p>}
              <div className="flex flex-wrap gap-space-xs mt-auto pt-space-xs">
                {c.fecha && <Badge icon="event">{formatearMesAnio(c.fecha)}</Badge>}
                {c.duracion && <Badge icon="schedule">{c.duracion}</Badge>}
                {c.modalidad && <Badge tone="info">{c.modalidad}</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editando !== null}
        onClose={() => setEditando(null)}
        icon="workspace_premium"
        eyebrow="Certificación"
        title={editando === "nueva" ? "Agregar certificación" : "Editar certificación"}
      >
        <form onSubmit={onGuardar} className="flex flex-col gap-space-md">
          <TextField id="nombre" label="Nombre de la certificación o curso" required value={form.nombre} onChange={cambiar("nombre")} placeholder="Professional Scrum Master I" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <TextField id="entidad_emisora" label="Entidad emisora" value={form.entidad_emisora} onChange={cambiar("entidad_emisora")} placeholder="Scrum.org" />
            <TextField id="fecha" label="Fecha de obtención" type="date" value={form.fecha} onChange={cambiar("fecha")} />
            <TextField id="duracion" label="Duración" value={form.duracion} onChange={cambiar("duracion")} placeholder="40 horas" />
            <SelectField id="modalidad" label="Modalidad" value={form.modalidad} onChange={cambiar("modalidad")} placeholder="Selecciona una opción" options={MODALIDADES} />
          </div>

          {errorForm && <Alert tone="error">{errorForm}</Alert>}

          <div className="flex justify-end gap-space-sm">
            <Button variant="secondary" onClick={() => setEditando(null)}>
              Cancelar
            </Button>
            <Button type="submit" icon="save" loading={guardando}>
              {editando === "nueva" ? "Agregar certificación" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={porEliminar !== null}
        title="Eliminar certificación"
        loading={eliminando}
        onCancel={() => setPorEliminar(null)}
        onConfirm={onEliminar}
      >
        ¿Seguro que deseas eliminar «{porEliminar?.nombre}»? Esta acción no se puede deshacer.
      </ConfirmDialog>
    </div>
  );
}

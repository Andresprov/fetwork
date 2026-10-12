import { useState } from "react";
import Button, { IconButton } from "../../components/ui/Button";
import Modal, { ConfirmDialog } from "../../components/ui/Modal";
import { Alert, EmptyState } from "../../components/ui/Feedback";
import { actualizarRegistro, crearRegistro, eliminarRegistro } from "../../api/hojaVida";
import { getErrorMessage } from "../../api/client";

// CRUD en modal compartido por titulos, actividades y referencias de la hoja
// de vida. Cada paso define el formulario y como se pinta cada registro;
// tras cualquier cambio se llama onCambio() para recargar la hoja de vida
// (y su completitud) desde el backend.
export default function ListaRegistros({
  recurso,
  idCampo,
  registros,
  vacio,
  aFormulario = (r) => ({ ...vacio, ...Object.fromEntries(Object.keys(vacio).map((k) => [k, r[k] ?? ""])) }),
  renderFormulario,
  renderItem,
  descripcionEliminar,
  icono,
  nombre,
  tituloVacio,
  textoVacio,
  onCambio,
}) {
  const [editando, setEditando] = useState(null); // null | "nuevo" | registro
  const [form, setForm] = useState(vacio);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState(null);

  function abrir(registro) {
    setEditando(registro || "nuevo");
    setForm(registro ? aFormulario(registro) : vacio);
    setErrorForm(null);
  }

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  async function onGuardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorForm(null);
    try {
      if (editando === "nuevo") await crearRegistro(recurso, form);
      else await actualizarRegistro(recurso, editando[idCampo], form);
      await onCambio();
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
      await eliminarRegistro(recurso, porEliminar[idCampo]);
      await onCambio();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPorEliminar(null);
      setEliminando(false);
    }
  }

  return (
    <div className="flex flex-col gap-space-sm">
      {error && <Alert tone="error" onClose={() => setError(null)}>{error}</Alert>}

      {registros.length === 0 ? (
        <EmptyState icon={icono} title={tituloVacio}>
          {textoVacio}
        </EmptyState>
      ) : (
        registros.map((r) => (
          <div key={r[idCampo]} className="flex items-start justify-between gap-space-sm p-space-md rounded-lg bg-surface-container-low">
            <div className="min-w-0 flex-1">{renderItem(r)}</div>
            <div className="flex gap-space-xxs shrink-0">
              <IconButton icon="edit" title={`Editar ${nombre}`} onClick={() => abrir(r)} />
              <IconButton icon="delete" title={`Eliminar ${nombre}`} variant="danger" onClick={() => setPorEliminar(r)} />
            </div>
          </div>
        ))
      )}

      <Button variant="secondary" icon="add_circle" className="w-full" onClick={() => abrir(null)}>
        Agregar {nombre}
      </Button>

      <Modal
        open={editando !== null}
        onClose={() => setEditando(null)}
        icon={icono}
        eyebrow="Hoja de vida"
        title={`${editando === "nuevo" ? "Agregar" : "Editar"} ${nombre}`}
      >
        <form onSubmit={onGuardar} className="flex flex-col gap-space-md">
          {renderFormulario(form, cambiar)}
          {errorForm && <Alert tone="error">{errorForm}</Alert>}
          <div className="flex justify-end gap-space-sm">
            <Button variant="secondary" onClick={() => setEditando(null)}>
              Cancelar
            </Button>
            <Button type="submit" icon="save" loading={guardando}>
              {editando === "nuevo" ? "Agregar" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={porEliminar !== null}
        title={`Eliminar ${nombre}`}
        loading={eliminando}
        onCancel={() => setPorEliminar(null)}
        onConfirm={onEliminar}
      >
        {porEliminar && descripcionEliminar(porEliminar)}
      </ConfirmDialog>
    </div>
  );
}

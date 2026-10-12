import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Alert } from "../../components/ui/Feedback";
import { ReadOnlyField, SelectField, TextField } from "../../components/ui/FormFields";
import { guardarDatosPersonales } from "../../api/hojaVida";
import { getErrorMessage } from "../../api/client";
import { aInputFecha } from "../../lib/formato";
import { ESTADOS_CIVILES, GRUPOS_RH } from "../../lib/hojaVida";

const CAMPOS = [
  "documento_identidad",
  "fecha_nacimiento",
  "lugar_nacimiento",
  "estado_civil",
  "lugar_residencia",
  "direccion",
  "rh",
  "contacto_emergencia_nombre",
  "contacto_emergencia_telefono",
];

function aFormulario(datos) {
  const form = Object.fromEntries(CAMPOS.map((c) => [c, datos[c] || ""]));
  form.fecha_nacimiento = aInputFecha(datos.fecha_nacimiento);
  return form;
}

// Paso 1 del PA-GTH-F-10. Nombres, correo y codigo vienen de Q10; el
// telefono es el del perfil. El resto es privado de la hoja de vida.
export default function PasoDatosPersonales({ perfil, datos, onCambio }) {
  const [form, setForm] = useState(() => aFormulario(datos));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const original = aFormulario(datos);
  const hayCambios = CAMPOS.some((c) => form[c] !== original[c]);

  const cambiar = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setExito(false);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const guardado = await guardarDatosPersonales(form);
      setForm(aFormulario(guardado));
      await onCambio();
      setExito(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-space-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <ReadOnlyField label="Nombres" value={perfil.nombres} />
        <ReadOnlyField label="Apellidos" value={perfil.apellidos} />
        <ReadOnlyField label="Correo institucional" value={perfil.correo} />
        <ReadOnlyField label="Código estudiantil" value={perfil.codigo_institucional_q10} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <TextField id="documento_identidad" label="Documento de identidad" value={form.documento_identidad} onChange={cambiar("documento_identidad")} maxLength={20} placeholder="1075298412" />
        <TextField id="fecha_nacimiento" label="Fecha de nacimiento" type="date" value={form.fecha_nacimiento} onChange={cambiar("fecha_nacimiento")} />
        <TextField id="lugar_nacimiento" label="Lugar de nacimiento" value={form.lugar_nacimiento} onChange={cambiar("lugar_nacimiento")} maxLength={120} placeholder="Neiva, Huila" />
        <SelectField id="estado_civil" label="Estado civil" options={ESTADOS_CIVILES} placeholder="Selecciona una opción" value={form.estado_civil} onChange={cambiar("estado_civil")} />
        <TextField id="lugar_residencia" label="Ciudad de residencia" value={form.lugar_residencia} onChange={cambiar("lugar_residencia")} maxLength={120} placeholder="Neiva" />
        <TextField id="direccion" label="Dirección de residencia" value={form.direccion} onChange={cambiar("direccion")} maxLength={200} placeholder="Calle 21 # 5-40, barrio Ipanema" />
        <SelectField id="rh" label="Grupo sanguíneo (RH)" options={GRUPOS_RH} placeholder="Selecciona una opción" value={form.rh} onChange={cambiar("rh")} />
        <div className="flex flex-col gap-space-xxs">
          <ReadOnlyField label="Teléfono / celular" value={perfil.telefono} />
          <Link to="/perfil/datos" className="font-label-md text-label-md text-secondary hover:text-primary w-fit">
            {perfil.telefono ? "Cambiar en Datos personales" : "Agregar en Datos personales"}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm p-space-md rounded-lg border border-dashed border-outline-variant">
        <span className="flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface">
          <span className="material-symbols-outlined text-[20px] text-secondary">emergency</span>
          Contacto en caso de emergencia
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <TextField id="contacto_emergencia_nombre" label="Nombre completo" value={form.contacto_emergencia_nombre} onChange={cambiar("contacto_emergencia_nombre")} maxLength={150} />
          <TextField id="contacto_emergencia_telefono" label="Teléfono" type="tel" value={form.contacto_emergencia_telefono} onChange={cambiar("contacto_emergencia_telefono")} maxLength={20} />
        </div>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {exito && !hayCambios && <Alert tone="success">Tus datos personales se guardaron correctamente.</Alert>}

      <div className="flex justify-end">
        <Button type="submit" icon="save" loading={guardando} disabled={!hayCambios}>
          Guardar datos personales
        </Button>
      </div>
    </form>
  );
}

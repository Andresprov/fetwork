import { Badge } from "../../components/ui/Card";
import { SelectField, TextField } from "../../components/ui/FormFields";
import ListaRegistros from "./ListaRegistros";
import { TIPOS_REFERENCIA, etiqueta } from "../../lib/hojaVida";

const VACIO = { tipo: "personal", nombre_completo: "", parentesco: "", profesion_ocupacion: "", telefono: "" };

// Paso 5 del PA-GTH-F-10: referencias familiares y personales. El
// parentesco solo aplica a las familiares.
export default function PasoReferencias({ referencias, onCambio }) {
  const familiares = referencias.filter((r) => r.tipo === "familiar").length;
  const personales = referencias.length - familiares;

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-wrap gap-space-xs">
        <Badge tone={familiares ? "success" : "pending"} icon={familiares ? "check" : "schedule"}>
          {familiares} familiar{familiares === 1 ? "" : "es"}
        </Badge>
        <Badge tone={personales ? "success" : "pending"} icon={personales ? "check" : "schedule"}>
          {personales} personal{personales === 1 ? "" : "es"}
        </Badge>
        <span className="font-body-sm text-body-sm text-on-surface-variant">Registra al menos una referencia de cada tipo.</span>
      </div>

      <ListaRegistros
        recurso="referencias"
        idCampo="id_referencia"
        registros={referencias}
        vacio={VACIO}
        icono="contacts"
        nombre="referencia"
        tituloVacio="Sin referencias registradas"
        textoVacio="Agrega personas que puedan dar fe de tu formación y desempeño."
        onCambio={onCambio}
        descripcionEliminar={(r) => `¿Seguro que deseas eliminar la referencia de ${r.nombre_completo}?`}
        renderItem={(r) => (
          <div className="flex flex-col gap-space-xxs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-lg text-label-lg text-on-surface">{r.nombre_completo}</span>
              <Badge tone={r.tipo === "familiar" ? "info" : "primary"}>{etiqueta(TIPOS_REFERENCIA, r.tipo)}</Badge>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {[r.parentesco, r.profesion_ocupacion, r.telefono && `Tel. ${r.telefono}`].filter(Boolean).join(" · ")}
            </span>
          </div>
        )}
        renderFormulario={(form, cambiar) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <SelectField id="tipo" label="Tipo de referencia" required options={TIPOS_REFERENCIA} value={form.tipo} onChange={cambiar("tipo")} />
            {form.tipo === "familiar" ? (
              <TextField id="parentesco" label="Parentesco" required maxLength={60} value={form.parentesco} onChange={cambiar("parentesco")} placeholder="Madre" />
            ) : (
              <div className="hidden sm:block" />
            )}
            <TextField id="nombre_completo" label="Nombre completo" required className="sm:col-span-2" maxLength={150} value={form.nombre_completo} onChange={cambiar("nombre_completo")} />
            <TextField id="profesion_ocupacion" label="Profesión u ocupación" maxLength={120} value={form.profesion_ocupacion} onChange={cambiar("profesion_ocupacion")} />
            <TextField id="telefono" label="Teléfono" required type="tel" maxLength={20} value={form.telefono} onChange={cambiar("telefono")} />
          </div>
        )}
      />
    </div>
  );
}

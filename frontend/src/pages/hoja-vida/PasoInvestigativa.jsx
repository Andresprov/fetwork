import { Badge } from "../../components/ui/Card";
import { SelectField, TextAreaField, TextField } from "../../components/ui/FormFields";
import ListaRegistros from "./ListaRegistros";
import { TIPOS_ACTIVIDAD, etiqueta } from "../../lib/hojaVida";

const VACIO = { tipo: "", descripcion: "", periodo: "" };

// Paso 4 del PA-GTH-F-10: experiencia academica e investigativa
// (semilleros, proyectos, monitorias, ponencias, publicaciones...).
export default function PasoInvestigativa({ actividades, onCambio }) {
  return (
    <ListaRegistros
      recurso="actividades"
      idCampo="id_actividad"
      registros={actividades}
      vacio={VACIO}
      icono="science"
      nombre="actividad"
      tituloVacio="Sin actividades registradas"
      textoVacio="Registra tu participación en semilleros, grupos de investigación, monitorías, ponencias o publicaciones."
      onCambio={onCambio}
      descripcionEliminar={(a) => `¿Seguro que deseas eliminar la actividad «${a.descripcion}»?`}
      renderItem={(a) => (
        <div className="flex flex-col gap-space-xxs">
          <div className="flex flex-wrap items-center gap-space-xs">
            <Badge tone="primary">{etiqueta(TIPOS_ACTIVIDAD, a.tipo)}</Badge>
            {a.periodo && <span className="font-label-md text-label-md text-on-surface-variant">{a.periodo}</span>}
          </div>
          <p className="font-body-md text-body-md text-on-surface whitespace-pre-line break-words">{a.descripcion}</p>
        </div>
      )}
      renderFormulario={(form, cambiar) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <SelectField id="tipo" label="Tipo de actividad" required options={TIPOS_ACTIVIDAD} placeholder="Selecciona el tipo" value={form.tipo} onChange={cambiar("tipo")} />
          <TextField id="periodo" label="Periodo" maxLength={60} value={form.periodo} onChange={cambiar("periodo")} placeholder="2024-1 a 2025-1" />
          <TextAreaField
            id="descripcion"
            label="Descripción"
            required
            className="sm:col-span-2"
            maxLength={1000}
            hint={`${form.descripcion.length}/1000`}
            value={form.descripcion}
            onChange={cambiar("descripcion")}
            placeholder="Semillero AgroTech: investigador en trazabilidad de café con sensores IoT."
          />
        </div>
      )}
    />
  );
}

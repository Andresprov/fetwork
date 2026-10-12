import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Card";
import { ReadOnlyField, SelectField, TextField } from "../../components/ui/FormFields";
import ListaRegistros from "./ListaRegistros";
import { aInputFecha, formatearMesAnio } from "../../lib/formato";
import { MODALIDADES_ESTUDIO, NIVELES_TITULO, etiqueta, fechaCorta } from "../../lib/hojaVida";

const VACIO = { nivel: "", titulo_obtenido: "", institucion: "", pais_ciudad: "", fecha_grado: "", modalidad_estudio: "" };

// Paso 2 del PA-GTH-F-10: formacion en curso (Q10), titulos previos y
// cursos (reutiliza las certificaciones del perfil, seccion 7.3).
export default function PasoFormacion({ perfil, titulos, certificaciones, onCambio }) {
  return (
    <div className="flex flex-col gap-space-lg">
      <section className="flex flex-col gap-space-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Formación en curso</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
          <ReadOnlyField label="Programa académico" value={perfil.programa.nombre} className="sm:col-span-2" />
          <ReadOnlyField label="Semestre" value={perfil.semestre ? `Semestre ${perfil.semestre}` : null} />
        </div>
      </section>

      <section className="flex flex-col gap-space-sm">
        <div className="flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Títulos obtenidos</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Técnicos, tecnólogos u otros títulos de educación superior que ya hayas obtenido.</p>
        </div>
        <ListaRegistros
          recurso="titulos"
          idCampo="id_titulo"
          registros={titulos}
          vacio={VACIO}
          aFormulario={(t) => ({ ...VACIO, ...Object.fromEntries(Object.keys(VACIO).map((k) => [k, t[k] || ""])), fecha_grado: aInputFecha(t.fecha_grado) })}
          icono="school"
          nombre="título"
          tituloVacio="Sin títulos registrados"
          textoVacio="Si aún no tienes títulos de educación superior, puedes dejar esta sección vacía."
          onCambio={onCambio}
          descripcionEliminar={(t) => `¿Seguro que deseas eliminar el título «${t.titulo_obtenido}»?`}
          renderItem={(t) => (
            <div className="flex flex-col gap-space-xxs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-lg text-label-lg text-on-surface">{t.titulo_obtenido}</span>
                <Badge tone="primary">{etiqueta(NIVELES_TITULO, t.nivel)}</Badge>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {[t.institucion, t.pais_ciudad, t.modalidad_estudio, t.fecha_grado && `Grado: ${fechaCorta(t.fecha_grado)}`].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}
          renderFormulario={(form, cambiar) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <SelectField id="nivel" label="Nivel" required options={NIVELES_TITULO} placeholder="Selecciona el nivel" value={form.nivel} onChange={cambiar("nivel")} />
              <TextField id="fecha_grado" label="Fecha de grado" type="date" value={form.fecha_grado} onChange={cambiar("fecha_grado")} />
              <TextField id="titulo_obtenido" label="Título obtenido" required className="sm:col-span-2" maxLength={200} value={form.titulo_obtenido} onChange={cambiar("titulo_obtenido")} placeholder="Técnico en Sistemas" />
              <TextField id="institucion" label="Institución" required maxLength={200} value={form.institucion} onChange={cambiar("institucion")} placeholder="SENA" />
              <TextField id="pais_ciudad" label="País / ciudad" maxLength={120} value={form.pais_ciudad} onChange={cambiar("pais_ciudad")} placeholder="Colombia, Neiva" />
              <SelectField id="modalidad_estudio" label="Modalidad" options={MODALIDADES_ESTUDIO} placeholder="Selecciona una opción" value={form.modalidad_estudio} onChange={cambiar("modalidad_estudio")} />
            </div>
          )}
        />
      </section>

      <section className="flex flex-col gap-space-sm">
        <div className="flex flex-wrap items-end justify-between gap-space-xs">
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Cursos, diplomados y certificaciones</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Se toman de la sección Certificaciones de tu perfil.</p>
          </div>
          <Link to="/perfil/certificaciones" className="font-label-lg text-label-lg text-secondary hover:text-primary flex items-center gap-1">
            Gestionar certificaciones
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
        {certificaciones.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant p-space-md rounded-lg bg-surface-container-low">No has registrado cursos ni certificaciones.</p>
        ) : (
          <ul className="flex flex-col gap-space-xs">
            {certificaciones.map((c) => (
              <li key={c.id_certificacion} className="flex flex-wrap items-center justify-between gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                <span className="font-label-lg text-label-lg text-on-surface">{c.nombre}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {[c.entidad_emisora, c.duracion, formatearMesAnio(c.fecha)].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

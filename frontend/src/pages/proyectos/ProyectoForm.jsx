import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Card, { CardHeader } from "../../components/ui/Card";
import Button, { IconButton } from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Alert, Loading } from "../../components/ui/Feedback";
import { SelectField, TextAreaField, TextField } from "../../components/ui/FormFields";
import { actualizarProyecto, crearProyecto, getMiProyecto } from "../../api/proyectos";
import { getErrorMessage } from "../../api/client";
import { aInputFecha } from "../../lib/formato";
import { SUGERENCIAS_TECNOLOGIAS, TIPOS_ENLACE } from "../../lib/proyectos";

const VACIO = { nombre: "", fecha: "", descripcion: "", repositorio_github_url: "", tecnologias: [], enlaces: [] };
const MAX_TECNOLOGIAS = 20;
const MAX_ENLACES = 10;

function esRepoGithub(url) {
  try {
    const u = new URL(url);
    return ["github.com", "www.github.com"].includes(u.hostname) && u.pathname.split("/").filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

// Registro y edicion de un proyecto (CU-04) con vinculacion del repositorio
// de GitHub (CU-05). Ruta /perfil/proyectos/nuevo o /perfil/proyectos/:id.
export default function ProyectoForm() {
  const { id } = useParams();
  const esNuevo = id === undefined;
  const navigate = useNavigate();
  const { perfil, recargarPerfil } = useOutletContext();

  const [form, setForm] = useState(VACIO);
  const [cargando, setCargando] = useState(!esNuevo);
  const [errorCarga, setErrorCarga] = useState(null);
  const [nuevaTecnologia, setNuevaTecnologia] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (esNuevo) return;
    getMiProyecto(id)
      .then((p) =>
        setForm({
          nombre: p.nombre,
          fecha: aInputFecha(p.fecha),
          descripcion: p.descripcion || "",
          repositorio_github_url: p.repositorio_github_url || "",
          tecnologias: p.tecnologias,
          enlaces: p.enlaces,
        })
      )
      .catch((err) => setErrorCarga(getErrorMessage(err)))
      .finally(() => setCargando(false));
  }, [esNuevo, id]);

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  function agregarTecnologia(valor) {
    const limpio = valor.trim();
    if (!limpio) return;
    setForm((f) => {
      if (f.tecnologias.length >= MAX_TECNOLOGIAS) return f;
      if (f.tecnologias.some((t) => t.toLowerCase() === limpio.toLowerCase())) return f;
      return { ...f, tecnologias: [...f.tecnologias, limpio] };
    });
    setNuevaTecnologia("");
  }

  function onTecnologiaKey(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      agregarTecnologia(nuevaTecnologia);
    } else if (e.key === "Backspace" && !nuevaTecnologia && form.tecnologias.length) {
      setForm((f) => ({ ...f, tecnologias: f.tecnologias.slice(0, -1) }));
    }
  }

  const quitarTecnologia = (t) => setForm((f) => ({ ...f, tecnologias: f.tecnologias.filter((x) => x !== t) }));

  const cambiarEnlace = (i, campo) => (e) =>
    setForm((f) => ({ ...f, enlaces: f.enlaces.map((en, j) => (j === i ? { ...en, [campo]: e.target.value } : en)) }));
  const agregarEnlace = () => setForm((f) => ({ ...f, enlaces: [...f.enlaces, { tipo: "demo", url: "" }] }));
  const quitarEnlace = (i) => setForm((f) => ({ ...f, enlaces: f.enlaces.filter((_, j) => j !== i) }));

  async function onSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    // Si quedo texto sin confirmar en el campo de tecnologias, se incluye.
    const pendiente = nuevaTecnologia.trim();
    const payload = {
      ...form,
      tecnologias: pendiente && !form.tecnologias.some((t) => t.toLowerCase() === pendiente.toLowerCase()) ? [...form.tecnologias, pendiente] : form.tecnologias,
      enlaces: form.enlaces.filter((en) => en.url.trim()),
    };
    try {
      if (esNuevo) {
        await crearProyecto(payload);
        recargarPerfil();
      } else {
        await actualizarProyecto(id, payload);
      }
      navigate("/perfil/proyectos");
    } catch (err) {
      setError(getErrorMessage(err));
      setGuardando(false);
    }
  }

  if (cargando) return <Loading texto="Cargando proyecto..." />;
  if (errorCarga) {
    return (
      <div className="flex flex-col gap-space-md">
        <Alert tone="error">{errorCarga}</Alert>
        <Link to="/perfil/proyectos" className="font-label-lg text-label-lg text-secondary">
          Volver al portafolio
        </Link>
      </div>
    );
  }

  const repoValido = esRepoGithub(form.repositorio_github_url);
  const checklist = [
    { label: "Nombre del proyecto", ok: Boolean(form.nombre.trim()) },
    { label: "Descripción de al menos 80 caracteres", ok: form.descripcion.trim().length >= 80 },
    { label: "Al menos 2 tecnologías", ok: form.tecnologias.length >= 2 },
    { label: "Repositorio de GitHub vinculado", ok: repoValido },
    { label: "Demo o video del proyecto", ok: form.enlaces.some((en) => ["demo", "video"].includes(en.tipo) && en.url.trim()) },
  ];
  const cumplidos = checklist.filter((c) => c.ok).length;
  const sugerencias = SUGERENCIAS_TECNOLOGIAS.filter((s) => !form.tecnologias.some((t) => t.toLowerCase() === s.toLowerCase())).slice(0, 6);

  return (
    <div className="flex flex-col gap-space-xl">
      <Link to="/perfil/proyectos" className="flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:text-primary w-fit">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver al portafolio
      </Link>

      <PageHeader
        eyebrow="Portafolio"
        title={esNuevo ? "Registrar proyecto" : "Editar proyecto"}
        description="Documenta la solución que desarrollaste, las tecnologías que usaste y vincula su repositorio de GitHub."
      />

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <Card className="p-space-lg flex flex-col gap-space-md">
            <CardHeader icon="assignment" title="Información general" subtitle="Qué problema resuelve y cuándo lo desarrollaste" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <TextField
                id="nombre"
                label="Nombre del proyecto"
                required
                maxLength={150}
                className="sm:col-span-2"
                value={form.nombre}
                onChange={cambiar("nombre")}
                placeholder="AgroTrace Huila - Trazabilidad cafetera"
              />
              <TextField id="fecha" label="Fecha" type="date" value={form.fecha} onChange={cambiar("fecha")} help="Inicio o entrega del proyecto." />
            </div>
            <TextAreaField
              id="descripcion"
              label="Descripción"
              rows={6}
              maxLength={3000}
              hint={`${form.descripcion.length}/3000`}
              value={form.descripcion}
              onChange={cambiar("descripcion")}
              placeholder="Describe el problema, la solución, tu rol en el equipo y los resultados obtenidos."
            />
          </Card>

          <Card className="p-space-lg flex flex-col gap-space-md">
            <CardHeader icon="layers" title="Tecnologías aplicadas" subtitle={`Lenguajes, frameworks y herramientas (máximo ${MAX_TECNOLOGIAS})`} />
            <div className="flex flex-col gap-space-xs">
              <label htmlFor="tecnologia" className="font-label-md text-label-md text-on-surface">
                Stack tecnológico
              </label>
              <div className="flex flex-wrap items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-low focus-within:ring-2 focus-within:ring-secondary">
                {form.tecnologias.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 pl-space-sm pr-1 py-space-xxs rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md">
                    {t}
                    <button type="button" onClick={() => quitarTecnologia(t)} aria-label={`Quitar ${t}`} className="w-5 h-5 rounded-full hover:bg-on-secondary-container/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
                <input
                  id="tecnologia"
                  value={nuevaTecnologia}
                  onChange={(e) => setNuevaTecnologia(e.target.value)}
                  onKeyDown={onTecnologiaKey}
                  onBlur={() => agregarTecnologia(nuevaTecnologia)}
                  maxLength={50}
                  disabled={form.tecnologias.length >= MAX_TECNOLOGIAS}
                  placeholder={form.tecnologias.length ? "Agregar otra..." : "Escribe una tecnología y presiona Enter"}
                  className="flex-1 min-w-[160px] h-9 bg-transparent px-space-xs font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                />
              </div>
            </div>
            {sugerencias.length > 0 && (
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Sugerencias</span>
                {sugerencias.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => agregarTecnologia(s)}
                    className="px-space-xs py-space-xxs rounded bg-surface-container-high hover:bg-surface-dim font-label-md text-label-md text-on-surface"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-space-lg flex flex-col gap-space-md">
            <CardHeader icon="hub" title="Repositorio y enlaces" subtitle="Código fuente, despliegues y material de apoyo" />
            <TextField
              id="repositorio"
              label="Repositorio en GitHub"
              icon="code"
              type="url"
              value={form.repositorio_github_url}
              onChange={cambiar("repositorio_github_url")}
              placeholder="https://github.com/usuario/repositorio"
              help={
                form.repositorio_github_url && !repoValido
                  ? "Usa el enlace completo del repositorio: https://github.com/usuario/repositorio"
                  : "Debe ser un repositorio público para que las empresas puedan consultarlo."
              }
            />
            {!perfil.github_url && (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Aún no has vinculado tu perfil de GitHub. Agrégalo en{" "}
                <Link to="/perfil/datos" className="text-secondary font-semibold hover:text-primary">
                  Datos personales
                </Link>{" "}
                para que aparezca en tu perfil público.
              </p>
            )}

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-on-surface">Otros enlaces</span>
              {form.enlaces.map((en, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-space-xs items-end">
                  <SelectField id={`enlace-tipo-${i}`} options={TIPOS_ENLACE} value={en.tipo} onChange={cambiarEnlace(i, "tipo")} aria-label="Tipo de enlace" />
                  <TextField id={`enlace-url-${i}`} type="url" value={en.url} onChange={cambiarEnlace(i, "url")} placeholder="https://" aria-label="URL del enlace" />
                  <IconButton icon="delete" title="Quitar enlace" variant="danger" className="h-11 w-11" onClick={() => quitarEnlace(i)} />
                </div>
              ))}
              {form.enlaces.length < MAX_ENLACES && (
                <Button variant="secondary" size="sm" icon="add_link" className="w-fit" onClick={agregarEnlace}>
                  Agregar enlace
                </Button>
              )}
            </div>
          </Card>

          {error && <Alert tone="error">{error}</Alert>}

          <div className="flex flex-wrap justify-end gap-space-sm">
            <Button variant="secondary" onClick={() => navigate("/perfil/proyectos")}>
              Cancelar
            </Button>
            <Button type="submit" icon="save" loading={guardando}>
              {esNuevo ? "Guardar proyecto" : "Guardar cambios"}
            </Button>
          </div>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-40">
          <Card className="p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">Checklist de calidad</span>
              <span className="font-label-md text-label-md text-secondary">
                {cumplidos}/{checklist.length}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-primary-container transition-all" style={{ width: `${(cumplidos / checklist.length) * 100}%` }} />
            </div>
            <ul className="flex flex-col gap-space-xs">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
                  <span className={`material-symbols-outlined text-[20px] ${c.ok ? "text-secondary" : "text-outline"}`}>
                    {c.ok ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  {c.label}
                </li>
              ))}
            </ul>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Solo el nombre es obligatorio, pero los proyectos completos generan más confianza en los reclutadores.
            </p>
          </Card>

          <Card className="p-space-lg flex flex-col gap-space-sm">
            <span className="flex items-center gap-space-xs font-headline-sm text-headline-sm text-on-surface">
              <span className="material-symbols-outlined text-secondary">tips_and_updates</span>
              Buenas prácticas
            </span>
            <ul className="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface-variant list-disc pl-space-md">
              <li>Incluye un README con el problema, el stack y cómo ejecutarlo.</li>
              <li>Usa mensajes de commit claros (feat:, fix:, docs:).</li>
              <li>Nunca publiques credenciales: usa un archivo .env.example.</li>
            </ul>
          </Card>
        </aside>
      </form>
    </div>
  );
}

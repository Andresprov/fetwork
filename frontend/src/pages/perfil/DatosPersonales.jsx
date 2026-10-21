import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card, { Badge, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Alert } from "../../components/ui/Feedback";
import { ReadOnlyField, TextField } from "../../components/ui/FormFields";
import Avatar from "../../components/perfil/Avatar";
import { actualizarMiPerfil, eliminarFoto, eliminarHojaVida, obtenerMiHojaVida, subirFoto, subirHojaVida } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";

const CAMPOS = ["telefono", "hoja_vida_url", "portafolio_url", "github_url"];
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
const MAX_FOTO_BYTES = 2 * 1024 * 1024;
const MAX_HOJA_VIDA_BYTES = 5 * 1024 * 1024;

function valoresIniciales(perfil) {
  return Object.fromEntries(CAMPOS.map((c) => [c, perfil[c] || ""]));
}

// Datos personales y academicos: lo que viene de Q10 es de solo lectura;
// el estudiante solo edita su contacto y enlaces profesionales.
export default function DatosPersonales() {
  const { perfil, setPerfil } = useOutletContext();
  const [form, setForm] = useState(() => valoresIniciales(perfil));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const hayCambios = CAMPOS.some((c) => form[c] !== (perfil[c] || ""));

  function cambiar(campo) {
    return (e) => {
      setForm((f) => ({ ...f, [campo]: e.target.value }));
      setExito(false);
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    // Solo se envian los campos modificados: asi un enlace de hoja de vida
    // vacio no reemplaza (ni borra) el PDF adjunto.
    const cambios = Object.fromEntries(CAMPOS.filter((c) => form[c] !== (perfil[c] || "")).map((c) => [c, form[c]]));
    try {
      const actualizado = await actualizarMiPerfil(cambios);
      setPerfil(actualizado);
      setForm(valoresIniciales(actualizado));
      setExito(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="flex flex-col gap-space-xl">
      <PageHeader
        eyebrow="Mi perfil"
        title="Datos personales y académicos"
        description="Tus datos académicos se sincronizan desde Q10 y no se pueden modificar aquí. Mantén actualizada tu información de contacto y tus enlaces profesionales."
      />

      <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-high">
        <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">shield</span>
        </div>
        <div className="flex flex-col gap-space-xxs">
          <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-space-xs">
            Expediente oficial FET y Q10 Académico <Badge tone="primary">Sincronizado</Badge>
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Si necesitas corregir tu nombre, programa o semestre, solicítalo en Registro y Control Académico de la FET.
            El cambio se reflejará automáticamente en tu próximo inicio de sesión.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <Card className="lg:col-span-5 p-space-lg flex flex-col gap-space-md">
          <CardHeader
            icon="account_balance"
            title="Identidad académica Q10"
            subtitle="Datos de solo lectura"
            action={<Badge icon="lock">Bloqueado</Badge>}
          />
          <ReadOnlyField label="Nombres y apellidos" value={`${perfil.nombres} ${perfil.apellidos}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <ReadOnlyField label="Código institucional" value={perfil.codigo_institucional_q10} />
            <ReadOnlyField label="Semestre actual" value={perfil.semestre ? `Semestre ${perfil.semestre}` : null} />
          </div>
          <ReadOnlyField label="Programa académico" value={perfil.programa.nombre} />
          <ReadOnlyField label="Correo institucional" value={perfil.correo} />
        </Card>

        <Card className="lg:col-span-7">
          <form onSubmit={onSubmit} className="flex flex-col">
            <div className="p-space-lg flex flex-col gap-space-md">
              <CardHeader
                icon="edit_note"
                title="Perfil profesional y de contacto"
                subtitle="Información editable que podrán consultar las empresas aliadas según tu configuración de visibilidad."
                action={<Badge tone="primary" icon="edit">Editable</Badge>}
              />

              <FotoPerfil perfil={perfil} setPerfil={setPerfil} />
              <HojaVidaAdjunta perfil={perfil} setPerfil={setPerfil} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <TextField
                  id="telefono"
                  label="Teléfono / móvil"
                  icon="call"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  value={form.telefono}
                  onChange={cambiar("telefono")}
                />
                <TextField
                  id="hoja_vida_url"
                  label="Enlace a tu hoja de vida"
                  icon="description"
                  type="url"
                  placeholder="https://..."
                  value={form.hoja_vida_url}
                  onChange={cambiar("hoja_vida_url")}
                  help={perfil.hoja_vida_archivo ? "Si guardas un enlace, reemplazará el PDF adjunto." : "Opcional si adjuntas el PDF."}
                />
                <TextField
                  id="github_url"
                  label="Perfil de GitHub"
                  icon="code"
                  type="url"
                  placeholder="https://github.com/usuario"
                  value={form.github_url}
                  onChange={cambiar("github_url")}
                  help="El enlace de tu perfil: con él puedes importar tus repositorios al portafolio."
                />
                <TextField
                  id="portafolio_url"
                  label="Portafolio web"
                  icon="language"
                  type="url"
                  placeholder="https://miportafolio.com"
                  value={form.portafolio_url}
                  onChange={cambiar("portafolio_url")}
                />
              </div>

              {error && <Alert tone="error">{error}</Alert>}
              {exito && <Alert tone="success">Tus datos se guardaron correctamente.</Alert>}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm px-space-lg py-space-md bg-surface-container-low">
              <span className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                Datos protegidos bajo la Ley 1581 de 2012
              </span>
              <div className="flex gap-space-sm">
                <Button variant="secondary" disabled={!hayCambios || guardando} onClick={() => setForm(valoresIniciales(perfil))}>
                  Descartar
                </Button>
                <Button type="submit" icon="save" loading={guardando} disabled={!hayCambios}>
                  Guardar cambios
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

// La foto se guarda al seleccionarla (no depende del boton "Guardar cambios").
function FotoPerfil({ perfil, setPerfil }) {
  const input = useRef(null);
  const [ocupado, setOcupado] = useState(null); // "subiendo" | "quitando"
  const [error, setError] = useState(null);

  async function onSeleccionar(e) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    setError(null);
    if (!TIPOS_FOTO.includes(archivo.type)) return setError("La foto debe ser una imagen JPG, PNG o WEBP.");
    if (archivo.size > MAX_FOTO_BYTES) return setError("La foto no puede pesar más de 2 MB.");
    setOcupado("subiendo");
    try {
      setPerfil(await subirFoto(archivo));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOcupado(null);
    }
  }

  async function onQuitar() {
    setError(null);
    setOcupado("quitando");
    try {
      setPerfil(await eliminarFoto());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOcupado(null);
    }
  }

  return (
    <div className="flex flex-col gap-space-sm p-space-md rounded-lg border border-outline-variant/70">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
        <Avatar key={perfil.foto_url || "sin-foto"} perfil={perfil} size="w-20 h-20" texto="font-headline-md text-headline-md" />
        <div className="flex flex-col gap-space-xs flex-1">
          <span className="font-label-lg text-label-lg text-on-surface">Fotografía de perfil</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Foto formal con fondo neutro. JPG, PNG o WEBP de máximo 2 MB.</span>
          <div className="flex flex-wrap gap-space-xs">
            <input ref={input} type="file" accept={TIPOS_FOTO.join(",")} className="hidden" onChange={onSeleccionar} />
            <Button size="sm" icon="upload" loading={ocupado === "subiendo"} disabled={Boolean(ocupado)} onClick={() => input.current?.click()}>
              {perfil.foto_url ? "Cambiar foto" : "Subir foto"}
            </Button>
            {perfil.foto_url && (
              <Button size="sm" variant="secondary" icon="delete" loading={ocupado === "quitando"} disabled={Boolean(ocupado)} onClick={onQuitar}>
                Quitar
              </Button>
            )}
          </div>
        </div>
      </div>
      {error && <Alert tone="error" onClose={() => setError(null)}>{error}</Alert>}
    </div>
  );
}

// Hoja de vida en PDF para las empresas (no la institucional PA-GTH-F-10).
// Como la foto, se guarda al seleccionarla. En el perfil publico solo se puede
// descargar si el estudiante muestra su contacto.
function HojaVidaAdjunta({ perfil, setPerfil }) {
  const input = useRef(null);
  const [ocupado, setOcupado] = useState(null); // "subiendo" | "quitando" | "abriendo"
  const [error, setError] = useState(null);

  async function onSeleccionar(e) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    setError(null);
    if (archivo.type && archivo.type !== "application/pdf") return setError("La hoja de vida debe ser un archivo PDF.");
    if (archivo.size > MAX_HOJA_VIDA_BYTES) return setError("La hoja de vida no puede pesar más de 5 MB.");
    setOcupado("subiendo");
    try {
      setPerfil(await subirHojaVida(archivo));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOcupado(null);
    }
  }

  async function onQuitar() {
    setError(null);
    setOcupado("quitando");
    try {
      setPerfil(await eliminarHojaVida());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOcupado(null);
    }
  }

  // Se abre la pestaña antes de la peticion para que el navegador no la
  // bloquee como ventana emergente.
  async function onVer() {
    setError(null);
    setOcupado("abriendo");
    const pestana = window.open("", "_blank");
    try {
      const { blob } = await obtenerMiHojaVida();
      const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      if (pestana) pestana.location.href = url;
      else window.location.assign(url);
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      pestana?.close();
      setError(getErrorMessage(err));
    } finally {
      setOcupado(null);
    }
  }

  return (
    <div className="flex flex-col gap-space-sm p-space-md rounded-lg border border-outline-variant/70">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
        <div className="w-14 h-14 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[28px]">{perfil.hoja_vida_archivo ? "picture_as_pdf" : "upload_file"}</span>
        </div>
        <div className="flex flex-col gap-space-xs flex-1">
          <span className="font-label-lg text-label-lg text-on-surface flex flex-wrap items-center gap-space-xs">
            Hoja de vida en PDF {perfil.hoja_vida_archivo && <Badge tone="primary" icon="check">Adjunta</Badge>}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            La que verán las empresas si muestras tu contacto. PDF de máximo 5 MB. No es la hoja de vida institucional.
          </span>
          <div className="flex flex-wrap gap-space-xs">
            <input ref={input} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onSeleccionar} />
            <Button size="sm" icon="upload" loading={ocupado === "subiendo"} disabled={Boolean(ocupado)} onClick={() => input.current?.click()}>
              {perfil.hoja_vida_archivo ? "Reemplazar PDF" : "Subir PDF"}
            </Button>
            {perfil.hoja_vida_archivo && (
              <>
                <Button size="sm" variant="secondary" icon="visibility" loading={ocupado === "abriendo"} disabled={Boolean(ocupado)} onClick={onVer}>
                  Ver
                </Button>
                <Button size="sm" variant="secondary" icon="delete" loading={ocupado === "quitando"} disabled={Boolean(ocupado)} onClick={onQuitar}>
                  Quitar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {error && <Alert tone="error" onClose={() => setError(null)}>{error}</Alert>}
    </div>
  );
}

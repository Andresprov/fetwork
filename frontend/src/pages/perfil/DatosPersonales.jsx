import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card, { Badge, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Alert } from "../../components/ui/Feedback";
import { ReadOnlyField, TextField } from "../../components/ui/FormFields";
import Avatar from "../../components/perfil/Avatar";
import { actualizarMiPerfil } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";

const CAMPOS = ["telefono", "foto_url", "hoja_vida_url", "portafolio_url", "github_url"];

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
    try {
      const actualizado = await actualizarMiPerfil(form);
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md p-space-md rounded-lg border border-outline-variant/70">
                <Avatar perfil={{ ...perfil, foto_url: form.foto_url }} size="w-20 h-20" texto="font-headline-md text-headline-md" />
                <TextField
                  id="foto_url"
                  className="flex-1 w-full"
                  label="Fotografía de perfil"
                  icon="image"
                  type="url"
                  placeholder="https://..."
                  value={form.foto_url}
                  onChange={cambiar("foto_url")}
                  help="Enlace público a una foto formal con fondo neutro."
                />
              </div>

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
                  label="Hoja de vida"
                  icon="description"
                  type="url"
                  placeholder="https://..."
                  value={form.hoja_vida_url}
                  onChange={cambiar("hoja_vida_url")}
                />
                <TextField
                  id="github_url"
                  label="Perfil de GitHub"
                  icon="code"
                  type="url"
                  placeholder="https://github.com/usuario"
                  value={form.github_url}
                  onChange={cambiar("github_url")}
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

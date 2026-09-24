import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Card, { Badge } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Toggle from "../../components/ui/Toggle";
import PageHeader from "../../components/ui/PageHeader";
import { Alert } from "../../components/ui/Feedback";
import { actualizarVisibilidad } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";
import { contar } from "../../lib/formato";

const OPCIONES = [
  {
    campo: "mostrar_experiencia",
    icon: "work_history",
    titulo: "Experiencia laboral y prácticas",
    texto: "Permite a las empresas ver tus pasantías, monitorías y empleos: cargo, entidad, periodo y funciones.",
    contador: (p) => contar(p.resumen.experiencias, "registrada", "registradas"),
  },
  {
    campo: "mostrar_certificaciones",
    icon: "workspace_premium",
    titulo: "Certificaciones y cursos",
    texto: "Muestra tus certificaciones, diplomados y cursos con su entidad emisora y fecha.",
    contador: (p) => contar(p.resumen.certificaciones, "registrada", "registradas"),
  },
  {
    campo: "mostrar_proyectos",
    icon: "terminal",
    titulo: "Proyectos y enlaces profesionales",
    texto: "Permite explorar tus proyectos académicos y tus enlaces de GitHub y portafolio.",
    contador: (p) => contar(p.resumen.proyectos, "proyecto", "proyectos"),
  },
  {
    campo: "mostrar_contacto",
    icon: "contact_mail",
    titulo: "Información de contacto",
    texto: "Muestra tu correo institucional, tu teléfono y el enlace a tu hoja de vida.",
    nota: "Si la desactivas, las empresas solo podrán contactarte a través de la Coordinación de Prácticas FET.",
  },
];

const SIEMPRE_PRIVADOS = [
  "Documento de identidad, fecha y lugar de nacimiento",
  "Dirección de residencia y estado civil",
  "Contactos de emergencia y referencias personales o familiares",
  "Títulos académicos y actividades investigativas de la hoja de vida",
  "Teléfono, dirección y jefe inmediato de tus experiencias",
];

export default function Visibilidad() {
  const { perfil, setPerfil } = useOutletContext();
  const [valores, setValores] = useState(perfil.visibilidad);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const hayCambios = OPCIONES.some((o) => valores[o.campo] !== perfil.visibilidad[o.campo]);
  const visibles = Object.values(valores).filter(Boolean).length;

  function cambiar(campo, valor) {
    setValores((v) => ({ ...v, [campo]: valor }));
    setExito(false);
  }

  async function guardar() {
    setGuardando(true);
    setError(null);
    try {
      const visibilidad = await actualizarVisibilidad(valores);
      setPerfil((p) => ({ ...p, visibilidad }));
      setValores(visibilidad);
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
        eyebrow="Privacidad"
        title="Configuración de visibilidad"
        description="Controla qué secciones de tu perfil pueden consultar las empresas aliadas a la FET. Tu nombre, programa y habilidades siempre son visibles."
        actions={
          <Button icon="save" onClick={guardar} loading={guardando} disabled={!hayCambios}>
            Guardar preferencias
          </Button>
        }
      />

      {error && <Alert tone="error">{error}</Alert>}
      {exito && <Alert tone="success">Tus preferencias de visibilidad se guardaron correctamente.</Alert>}
      {hayCambios && !guardando && <Alert tone="info">Tienes cambios sin guardar.</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary">tune</span>
              Secciones del perfil público
            </h2>
            <span className="font-label-md text-label-md text-on-surface-variant">{visibles} de 4 visibles</span>
          </div>

          {OPCIONES.map((o) => (
            <Card key={o.campo} className="p-space-lg flex items-start gap-space-md">
              <div className="w-11 h-11 rounded-lg bg-surface-container-low text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">{o.icon}</span>
              </div>
              <div className="flex-1 flex flex-col gap-space-xxs">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <h3 className="font-label-lg text-label-lg text-on-surface text-[16px]">{o.titulo}</h3>
                  <Badge tone={valores[o.campo] ? "success" : "neutral"}>{valores[o.campo] ? "Visible" : "Oculto"}</Badge>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">{o.texto}</p>
                {o.contador && <span className="font-label-md text-label-md text-secondary">{o.contador(perfil)}</span>}
                {o.nota && (
                  <p className="mt-space-xs flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-info">info</span>
                    {o.nota}
                  </p>
                )}
              </div>
              <Toggle checked={valores[o.campo]} onChange={(v) => cambiar(o.campo, v)} label={o.titulo} />
            </Card>
          ))}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <Card className="p-space-lg flex flex-col gap-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Vista previa</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">¿Cómo te ven las empresas?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Revisa tu perfil tal como lo verá un reclutador después de guardar tus preferencias.
            </p>
            <Link
              to="/perfil/vista-publica"
              className="mt-space-xs h-10 rounded-lg bg-surface-container-high hover:bg-surface-dim text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              Ver mi perfil público
            </Link>
          </Card>

          <Card className="p-space-lg flex flex-col gap-space-sm">
            <h3 className="font-label-lg text-label-lg text-on-surface flex items-center gap-space-xs text-[16px]">
              <span className="material-symbols-outlined text-primary">shield_lock</span>
              Datos siempre privados
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Por política institucional, esta información nunca se muestra a empresas, sin importar tu configuración:
            </p>
            <ul className="flex flex-col gap-space-xs">
              {SIEMPRE_PRIVADOS.map((item) => (
                <li key={item} className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">lock</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

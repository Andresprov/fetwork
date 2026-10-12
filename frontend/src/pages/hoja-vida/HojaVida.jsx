import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Alert, Loading } from "../../components/ui/Feedback";
import { getHojaVida } from "../../api/hojaVida";
import { getErrorMessage } from "../../api/client";
import { PASOS_HOJA_VIDA } from "../../lib/hojaVida";
import PasoDatosPersonales from "./PasoDatosPersonales";
import PasoFormacion from "./PasoFormacion";
import PasoExperiencia from "./PasoExperiencia";
import PasoInvestigativa from "./PasoInvestigativa";
import PasoReferencias from "./PasoReferencias";

const ICONOS = ["badge", "school", "work_history", "science", "contacts"];

// CU-08: diligenciar la hoja de vida institucional PA-GTH-F-10 en 5 pasos.
// El paso activo vive en la URL (?paso=N) para poder enlazarlo directamente.
export default function HojaVida() {
  const { perfil } = useOutletContext();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [hv, setHv] = useState(null);
  const [error, setError] = useState(null);

  const paso = Math.min(Math.max(Number(params.get("paso")) || 1, 1), PASOS_HOJA_VIDA.length);
  const irAPaso = (n) => {
    setParams({ paso: String(n) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const recargar = useCallback(async () => {
    try {
      setHv(await getHojaVida());
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    getHojaVida()
      .then(setHv)
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (!hv) return error ? <Alert tone="error">{error}</Alert> : <Loading texto="Cargando tu hoja de vida..." />;

  const { completitud } = hv;
  const actual = PASOS_HOJA_VIDA[paso - 1];

  return (
    <div className="flex flex-col gap-space-xl">
      <PageHeader
        eyebrow="Formato oficial PA-GTH-F-10"
        title="Hoja de vida institucional"
        description="Diligencia tu hoja de vida en el formato oficial de Talento Humano de la FET. Estos datos son privados: solo se usan para generar el documento y nunca se muestran en tu perfil público."
        actions={
          <Button icon="download" onClick={() => navigate("/perfil/hoja-vida/exportar")}>
            Vista previa y descarga
          </Button>
        }
      />

      {error && <Alert tone="error" onClose={() => setError(null)}>{error}</Alert>}

      <Card className="p-space-md md:p-space-lg">
        <ol className="grid grid-cols-5 gap-space-xs">
          {PASOS_HOJA_VIDA.map((p, i) => {
            const n = i + 1;
            const pct = completitud.pasos[p.clave];
            const activo = n === paso;
            return (
              <li key={p.clave}>
                <button type="button" onClick={() => irAPaso(n)} className="w-full flex flex-col items-center gap-space-xxs text-center group">
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-label-lg text-label-lg transition-all ${
                      activo
                        ? "bg-primary text-on-primary ring-4 ring-secondary-container"
                        : pct === 100
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant group-hover:bg-surface-dim"
                    }`}
                  >
                    {pct === 100 && !activo ? <span className="material-symbols-outlined text-[20px]">check</span> : n}
                  </span>
                  <span className={`hidden md:block font-label-md text-label-md ${activo ? "text-on-surface" : "text-on-surface-variant"}`}>{p.titulo}</span>
                  <span className={`hidden md:block font-body-sm text-body-sm ${pct === 100 ? "text-secondary" : "text-outline"}`}>{pct}%</span>
                </button>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <Card className="lg:col-span-8 p-space-lg md:p-space-xl flex flex-col gap-space-lg">
          <div className="flex items-start gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">{ICONOS[paso - 1]}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Paso {paso} de {PASOS_HOJA_VIDA.length}
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface">{actual.titulo}</h2>
            </div>
          </div>

          {paso === 1 && <PasoDatosPersonales key="datos" perfil={perfil} datos={hv.datos_personales} onCambio={recargar} />}
          {paso === 2 && <PasoFormacion perfil={perfil} titulos={hv.titulos} certificaciones={hv.certificaciones} onCambio={recargar} />}
          {paso === 3 && <PasoExperiencia experiencias={hv.experiencias} />}
          {paso === 4 && <PasoInvestigativa actividades={hv.actividades} onCambio={recargar} />}
          {paso === 5 && <PasoReferencias referencias={hv.referencias} onCambio={recargar} />}

          <div className="flex flex-wrap justify-between gap-space-sm pt-space-md border-t border-surface-container-high">
            <Button variant="secondary" icon="arrow_back" disabled={paso === 1} onClick={() => irAPaso(paso - 1)}>
              Anterior
            </Button>
            {paso < PASOS_HOJA_VIDA.length ? (
              <Button iconRight="arrow_forward" onClick={() => irAPaso(paso + 1)}>
                Siguiente: {PASOS_HOJA_VIDA[paso].titulo}
              </Button>
            ) : (
              <Button iconRight="arrow_forward" onClick={() => navigate("/perfil/hoja-vida/exportar")}>
                Revisar y descargar
              </Button>
            )}
          </div>
        </Card>

        <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-40">
          <div className="rounded-xl bg-primary text-on-primary p-space-lg flex flex-col gap-space-md shadow-md">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed-dim">Estado de diligenciamiento</span>
            <div className="flex items-end gap-space-xs">
              <span className="font-headline-xl text-headline-xl leading-none">{completitud.total}%</span>
              <span className="font-body-sm text-body-sm text-primary-fixed-dim pb-1">completitud del formato</span>
            </div>
            <div className="w-full h-2 rounded-full bg-on-primary/20 overflow-hidden">
              <div className="h-full bg-secondary-fixed transition-all" style={{ width: `${completitud.total}%` }} />
            </div>
            <ul className="flex flex-col gap-space-xxs">
              {PASOS_HOJA_VIDA.map((p, i) => {
                const pct = completitud.pasos[p.clave];
                return (
                  <li key={p.clave}>
                    <button
                      type="button"
                      onClick={() => irAPaso(i + 1)}
                      className={`w-full flex items-center justify-between gap-space-xs px-space-xs py-space-xxs rounded font-label-md text-label-md ${
                        paso === i + 1 ? "bg-on-primary/15" : "hover:bg-on-primary/10"
                      }`}
                    >
                      <span className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[18px]">{pct === 100 ? "check_circle" : "radio_button_unchecked"}</span>
                        {i + 1}. {p.titulo}
                      </span>
                      <span>{pct}%</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <Card className="p-space-lg flex flex-col gap-space-sm">
            <span className="flex items-center gap-space-xs font-headline-sm text-headline-sm text-on-surface">
              <span className="material-symbols-outlined text-secondary">lock</span>
              Tus datos están protegidos
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Documento, RH, contacto de emergencia, títulos, actividades y referencias solo aparecen en el documento que
              descargas. Las empresas nunca los ven en tu perfil público ni en las búsquedas.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

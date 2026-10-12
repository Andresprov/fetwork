import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { Alert, Loading } from "../../components/ui/Feedback";
import { getHojaVida, guardarArchivo, obtenerPdfHojaVida } from "../../api/hojaVida";
import { getErrorMessage } from "../../api/client";
import { PASOS_HOJA_VIDA } from "../../lib/hojaVida";

// CU-09: vista previa y descarga de la hoja de vida en PDF. La vista previa
// es el mismo PDF que se descarga, generado por el backend sobre el formato
// oficial PA-GTH-F-10, asi que se ve exactamente igual al documento final.
export default function ExportarHojaVida() {
  const navigate = useNavigate();
  const [hv, setHv] = useState(null);
  const [pdf, setPdf] = useState(null); // { blob, nombre, url }
  const [error, setError] = useState(null);
  const [errorPdf, setErrorPdf] = useState(null);
  const [descargado, setDescargado] = useState(null);

  useEffect(() => {
    getHojaVida()
      .then(setHv)
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    let url = null;
    let cancelado = false;
    obtenerPdfHojaVida()
      .then(({ blob, nombre }) => {
        if (cancelado) return;
        url = URL.createObjectURL(blob);
        setPdf({ blob, nombre, url });
      })
      .catch((err) => !cancelado && setErrorPdf(getErrorMessage(err)));
    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  function onDescargar() {
    guardarArchivo(pdf.blob, pdf.nombre);
    setDescargado(pdf.nombre);
  }

  if (!hv) return error ? <Alert tone="error">{error}</Alert> : <Loading texto="Preparando tu hoja de vida..." />;

  const pendientes = PASOS_HOJA_VIDA.map((p, i) => ({ ...p, n: i + 1, pct: hv.completitud.pasos[p.clave] })).filter((p) => p.pct < 100);

  return (
    <div className="flex flex-col gap-space-xl">
      <PageHeader
        eyebrow="Formato oficial PA-GTH-F-10"
        title="Exportar hoja de vida institucional"
        description="Revisa la vista previa y descarga tu hoja de vida en PDF, con el formato de Talento Humano de la FET, lista para adjuntar a tus postulaciones."
        actions={
          <>
            <Button variant="secondary" icon="edit_document" onClick={() => navigate("/perfil/hoja-vida")}>
              Editar datos
            </Button>
            <Button icon="download" loading={!pdf && !errorPdf} disabled={!pdf} onClick={onDescargar}>
              Descargar hoja de vida (PDF)
            </Button>
          </>
        }
      />

      {descargado && <Alert tone="success" onClose={() => setDescargado(null)}>Se descargó «{descargado}».</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 rounded-xl bg-surface-container-high p-space-sm md:p-space-lg flex flex-col gap-space-sm">
          {errorPdf ? (
            <Alert tone="error">{errorPdf}</Alert>
          ) : !pdf ? (
            <Loading texto="Generando la vista previa del documento..." />
          ) : (
            <>
              <iframe title="Vista previa de la hoja de vida" src={pdf.url} className="w-full h-[70vh] min-h-[480px] rounded bg-surface-container-lowest shadow-md" />
              <a href={pdf.url} target="_blank" rel="noreferrer" className="self-center inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline">
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Abrir en otra pestaña
              </a>
            </>
          )}
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-40">
          <Card className="p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">Ficha del documento</span>
              <span className={`font-label-md text-label-md ${hv.completitud.total === 100 ? "text-success" : "text-pending"}`}>{hv.completitud.total}% completo</span>
            </div>
            <dl className="grid grid-cols-2 gap-space-sm">
              <Dato etiqueta="Formato" valor="PDF" />
              <Dato etiqueta="Código" valor="PA-GTH-F-10" />
            </dl>
            {pendientes.length === 0 ? (
              <Alert tone="success">Todas las secciones del formato están diligenciadas.</Alert>
            ) : (
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-label-md text-on-surface">Secciones por completar</span>
                {pendientes.map((p) => (
                  <button
                    key={p.clave}
                    type="button"
                    onClick={() => navigate(`/perfil/hoja-vida?paso=${p.n}`)}
                    className="flex items-center justify-between gap-space-xs px-space-sm py-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high font-body-md text-body-md text-on-surface"
                  >
                    <span>
                      {p.n}. {p.titulo}
                    </span>
                    <span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
                      {p.pct}%
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </span>
                  </button>
                ))}
                <p className="font-body-sm text-body-sm text-on-surface-variant">Puedes descargar el documento en cualquier momento; las secciones vacías aparecerán como «No registra».</p>
              </div>
            )}
          </Card>

          <Card className="p-space-lg flex flex-col gap-space-sm">
            <span className="flex items-center gap-space-xs font-headline-sm text-headline-sm text-on-surface">
              <span className="material-symbols-outlined text-secondary">help</span>
              ¿Qué sigue tras la descarga?
            </span>
            <ol className="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface-variant list-decimal pl-space-md">
              <li>Revisa el documento y fírmalo.</li>
              <li>Adjúntalo a tus postulaciones a vacantes y pasantías.</li>
              <li>No modifiques la estructura del formato para conservar su validez institucional.</li>
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Dato({ etiqueta: texto, valor }) {
  return (
    <div className="flex flex-col">
      <dt className="font-label-sm text-label-sm uppercase text-on-surface-variant">{texto}</dt>
      <dd className={`font-body-md text-body-md ${valor ? "text-on-surface" : "text-outline italic"}`}>{valor || "Sin diligenciar"}</dd>
    </div>
  );
}

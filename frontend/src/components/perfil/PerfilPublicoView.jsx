import { useEffect, useMemo, useState } from "react";
import Card, { Badge } from "../ui/Card";
import { Alert, Loading } from "../ui/Feedback";
import Avatar from "./Avatar";
import { getPerfilPublico } from "../../api/perfiles";
import { getErrorMessage } from "../../api/client";
import { etiquetaNivel, formatearMesAnio, formatearPeriodo } from "../../lib/formato";

// Vista publica del perfil de un estudiante. Es la misma pantalla que usa el
// estudiante para previsualizar su perfil y la que consultaran las empresas.
// Solo pinta lo que devuelve el endpoint publico, que ya aplica los toggles
// de visibilidad. En modo vista previa se indica que secciones estan ocultas.
export default function PerfilPublicoView({ idEstudiante, modoVistaPrevia = false }) {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPerfilPublico(idEstudiante)
      .then(setPerfil)
      .catch((err) => setError(getErrorMessage(err)));
  }, [idEstudiante]);

  const habilidadesPorCategoria = useMemo(() => {
    if (!perfil) return [];
    const grupos = new Map();
    for (const h of perfil.habilidades) {
      if (!grupos.has(h.categoria.nombre)) grupos.set(h.categoria.nombre, []);
      grupos.get(h.categoria.nombre).push(h);
    }
    return [...grupos.entries()];
  }, [perfil]);

  if (error) return <Alert tone="error">{error}</Alert>;
  if (!perfil) return <Loading texto="Cargando perfil..." />;

  const enlaces = perfil.enlaces && [
    perfil.enlaces.github_url && { icon: "code", label: "GitHub", url: perfil.enlaces.github_url },
    perfil.enlaces.portafolio_url && { icon: "language", label: "Portafolio", url: perfil.enlaces.portafolio_url },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-space-lg">
      <Card accent className="p-space-lg md:p-space-xl">
        <div className="flex flex-col md:flex-row items-start gap-space-lg">
          <Avatar perfil={perfil} size="w-28 h-28" texto="font-headline-lg text-headline-lg" />
          <div className="flex-1 flex flex-col gap-space-xs">
            <div className="flex flex-wrap gap-space-xs">
              <Badge tone="primary" icon="verified">Estudiante FET</Badge>
              {perfil.semestre && <Badge>Semestre {perfil.semestre}</Badge>}
            </div>
            <h1 className="font-headline-lg text-headline-lg md:font-headline-xl md:text-headline-xl text-on-surface">
              {perfil.nombres} {perfil.apellidos}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{perfil.programa}</p>
            <p className="flex items-center gap-space-xxs font-body-md text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              Fundación Escuela Tecnológica de Neiva — FET
            </p>
          </div>
          {perfil.contacto?.hoja_vida_url && (
            <a
              href={perfil.contacto.hoja_vida_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-space-lg rounded-lg bg-primary hover:bg-tertiary text-on-primary font-label-lg text-label-lg flex items-center gap-space-xs shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Ver hoja de vida
            </a>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <Seccion icon="work_history" titulo="Experiencia" oculta={!perfil.secciones.experiencia} vacia={!perfil.experiencias?.length} modoVistaPrevia={modoVistaPrevia}>
            {perfil.experiencias?.length ? (
              <div className="flex flex-col gap-space-sm">
                {perfil.experiencias.map((x) => (
                  <div key={x.id_experiencia} className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                    <div className="flex flex-wrap items-start justify-between gap-space-xs">
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{x.cargo}</h3>
                        <p className="font-body-md text-body-md text-secondary font-semibold">{x.entidad}</p>
                      </div>
                      <div className="flex flex-col items-end gap-space-xxs">
                        {formatearPeriodo(x.fecha_inicio, x.fecha_fin) && (
                          <span className="font-label-md text-label-md text-on-surface-variant">
                            {formatearPeriodo(x.fecha_inicio, x.fecha_fin)}
                          </span>
                        )}
                        {x.dedicacion && <Badge tone="primary">{x.dedicacion}</Badge>}
                      </div>
                    </div>
                    {x.descripcion && <p className="font-body-md text-body-md text-on-surface whitespace-pre-line">{x.descripcion}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <SinDatos>No hay experiencia registrada.</SinDatos>
            )}
          </Seccion>

          <Seccion icon="terminal" titulo="Proyectos" oculta={!perfil.secciones.proyectos} vacia={!perfil.proyectos?.length} modoVistaPrevia={modoVistaPrevia}>
            {perfil.proyectos?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                {perfil.proyectos.map((p) => (
                  <div key={p.id_proyecto} className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                    <div className="flex items-start justify-between gap-space-xs">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{p.nombre}</h3>
                      {p.fecha && <span className="font-label-md text-label-md text-on-surface-variant">{formatearMesAnio(p.fecha)}</span>}
                    </div>
                    {p.descripcion && <p className="font-body-md text-body-md text-on-surface-variant">{p.descripcion}</p>}
                    {p.tecnologias.length > 0 && (
                      <div className="flex flex-wrap gap-space-xxs">
                        {p.tecnologias.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                    )}
                    {p.repositorio_github_url && (
                      <a href={p.repositorio_github_url} target="_blank" rel="noopener noreferrer" className="font-label-md text-label-md text-secondary hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">code</span>
                        Repositorio
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <SinDatos>No hay proyectos publicados todavía.</SinDatos>
            )}
          </Seccion>

          <Seccion icon="workspace_premium" titulo="Certificaciones y cursos" oculta={!perfil.secciones.certificaciones} vacia={!perfil.certificaciones?.length} modoVistaPrevia={modoVistaPrevia}>
            {perfil.certificaciones?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                {perfil.certificaciones.map((c) => (
                  <div key={c.id_certificacion} className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xxs">
                    <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                    <h3 className="font-label-lg text-label-lg text-on-surface text-[15px]">{c.nombre}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {[c.entidad_emisora, c.fecha && formatearMesAnio(c.fecha), c.duracion, c.modalidad].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <SinDatos>No hay certificaciones registradas.</SinDatos>
            )}
          </Seccion>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <Card className="p-space-lg flex flex-col gap-space-md">
            <TituloSeccion icon="psychology" titulo="Habilidades" />
            {habilidadesPorCategoria.length === 0 ? (
              <SinDatos>No hay habilidades registradas.</SinDatos>
            ) : (
              habilidadesPorCategoria.map(([categoria, habilidades]) => (
                <div key={categoria} className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{categoria}</span>
                  <div className="flex flex-wrap gap-space-xxs">
                    {habilidades.map((h) => (
                      <span key={h.id_habilidad} className="inline-flex items-center gap-1 px-space-xs py-space-xxs rounded bg-surface-container-low font-label-md text-label-md text-on-surface">
                        {h.nombre}
                        {h.nivel && <span className="text-secondary">· {etiquetaNivel(h.nivel)}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </Card>

          <Seccion icon="contact_mail" titulo="Contacto" oculta={!perfil.secciones.contacto} modoVistaPrevia={modoVistaPrevia} compacta>
            {perfil.contacto && (
              <ul className="flex flex-col gap-space-sm">
                <DatoContacto icon="mail" label="Correo institucional" valor={perfil.contacto.correo} href={`mailto:${perfil.contacto.correo}`} />
                {perfil.contacto.telefono && (
                  <DatoContacto icon="call" label="Teléfono" valor={perfil.contacto.telefono} href={`tel:${perfil.contacto.telefono.replace(/\s/g, "")}`} />
                )}
              </ul>
            )}
          </Seccion>

          {enlaces && enlaces.length > 0 && (
            <Card className="p-space-lg flex flex-col gap-space-md">
              <TituloSeccion icon="link" titulo="Enlaces profesionales" />
              <ul className="flex flex-col gap-space-sm">
                {enlaces.map((e) => (
                  <DatoContacto key={e.label} icon={e.icon} label={e.label} valor={e.url.replace(/^https?:\/\//, "")} href={e.url} externo />
                ))}
              </ul>
            </Card>
          )}

          <div className="p-space-lg rounded-xl bg-surface-container-high flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">shield_lock</span>
              Protección de datos
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Datos protegidos por la Ley 1581 de 2012 y la política institucional de la FET. La información personal de la hoja de
              vida no se divulga en este perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TituloSeccion({ icon, titulo }) {
  return (
    <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      {titulo}
    </h2>
  );
}

// Seccion controlada por un toggle de visibilidad. Para visitantes, una
// seccion oculta o vacia simplemente no aparece.
function Seccion({ icon, titulo, oculta, vacia = false, modoVistaPrevia, compacta = false, children }) {
  if ((oculta || vacia) && !modoVistaPrevia) return null;
  return (
    <Card className={`${compacta ? "p-space-lg" : "p-space-lg md:p-space-xl"} flex flex-col gap-space-md`}>
      <div className="flex items-center justify-between gap-space-xs">
        <TituloSeccion icon={icon} titulo={titulo} />
        {oculta && <Badge icon="visibility_off">Oculta</Badge>}
      </div>
      {oculta ? (
        <p className="font-body-md text-body-md text-on-surface-variant p-space-md rounded-lg bg-surface-container-low border border-dashed border-outline-variant">
          Esta sección está oculta para las empresas según tu configuración de visibilidad.
        </p>
      ) : (
        children
      )}
    </Card>
  );
}

function SinDatos({ children }) {
  return <p className="font-body-md text-body-md text-outline">{children}</p>;
}

function DatoContacto({ icon, label, valor, href, externo = false }) {
  return (
    <li className="flex items-start gap-space-sm">
      <div className="w-9 h-9 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
        <a
          href={href}
          {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-body-md text-body-md text-on-surface hover:text-primary break-all"
        >
          {valor}
        </a>
      </div>
    </li>
  );
}

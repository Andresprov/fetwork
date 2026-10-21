// CU-09: rellena el formato oficial PA-GTH-F-10 con docxtemplater y lo
// convierte a PDF con LibreOffice. Los marcadores los inserta
// hojaVida.plantilla.js; sus nombres son el contrato entre ambos archivos.
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const { pathToFileURL } = require("url");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { obtenerPlantilla } = require("./hojaVida.plantilla");
const almacenamiento = require("../../../lib/almacenamiento");
const { normalizarFoto } = require("../../../lib/imagen");

const INSTITUCION_FET = "Fundación Escuela Tecnológica de Neiva “Jesús Oviedo Pérez”";

// Las fechas se guardan a medianoche UTC; se formatean en UTC para no
// correrse un dia.
function fechaCorta(d) {
  if (!d) return "";
  const f = new Date(d);
  const dd = String(f.getUTCDate()).padStart(2, "0");
  const mm = String(f.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${f.getUTCFullYear()}`;
}

// Fecha del dia en hora de Colombia (el servidor puede estar en UTC y de
// noche ya seria el dia siguiente).
function fechaHoy() {
  return new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
}

// "03/2024": la columna FECHA de la tabla de cursos del formato es angosta.
function mesAnio(d) {
  if (!d) return "";
  const f = new Date(d);
  return `${String(f.getUTCMonth() + 1).padStart(2, "0")}/${f.getUTCFullYear()}`;
}

function partesFecha(d) {
  if (!d) return { dia: "", mes: "", anio: "" };
  const f = new Date(d);
  return {
    dia: String(f.getUTCDate()).padStart(2, "0"),
    mes: String(f.getUTCMonth() + 1).padStart(2, "0"),
    anio: String(f.getUTCFullYear()),
  };
}

function titulo(t) {
  return {
    fecha_grado: fechaCorta(t.fecha_grado),
    institucion: t.institucion || "",
    pais_ciudad: t.pais_ciudad || "",
    titulo_obtenido: t.titulo_obtenido,
    modalidad_estudio: t.modalidad_estudio || "",
  };
}

// "Descripcion (periodo)" para las subsecciones 4.2 a 4.8 del formato.
const actividad = (a) => ({ texto: a.periodo ? `${a.descripcion} (${a.periodo})` : a.descripcion });

function armarDatos({ estudiante, datos, titulos, experiencias, certificaciones, actividades, referencias }) {
  const nacimiento = partesFecha(datos?.fecha_nacimiento);
  const porNivel = (nivel) => titulos.filter((t) => t.nivel === nivel).map(titulo);
  const porTipo = (tipo) => actividades.filter((a) => a.tipo === tipo);
  const ref = (r) => ({
    nombre_completo: r.nombre_completo,
    parentesco: r.parentesco || "",
    profesion_ocupacion: r.profesion_ocupacion || "",
    telefono: r.telefono || "",
  });

  // El formato oficial no tiene seccion de "formacion en curso": el programa
  // que el estudiante cursa en la FET va en el bloque Pregrado como «En curso».
  const programaEnCurso = {
    fecha_grado: estudiante.semestre ? `En curso (semestre ${estudiante.semestre})` : "En curso",
    institucion: INSTITUCION_FET,
    pais_ciudad: "Colombia, Neiva",
    titulo_obtenido: estudiante.programa.nombre,
    modalidad_estudio: "",
  };

  const emergencia = [datos?.contacto_emergencia_nombre, datos?.contacto_emergencia_telefono && `Tel. ${datos.contacto_emergencia_telefono}`]
    .filter(Boolean)
    .join(" — ");

  return {
    // 1. Datos personales
    nombre_completo: `${estudiante.nombres} ${estudiante.apellidos}`,
    documento_identidad: datos?.documento_identidad || "",
    nac_dia: nacimiento.dia,
    nac_mes: nacimiento.mes,
    nac_anio: nacimiento.anio,
    lugar_nacimiento: datos?.lugar_nacimiento || "",
    estado_civil: datos?.estado_civil || "",
    lugar_residencia: datos?.lugar_residencia || "",
    direccion: datos?.direccion || "",
    telefono: estudiante.telefono || "",
    correo: estudiante.usuario.correo,
    rh: datos?.rh || "",
    contacto_emergencia: emergencia,

    // 2. Formacion academica (2.1 educacion superior y 2.2 tecnica/tecnologica)
    titulos_maestria: porNivel("maestria"),
    titulos_especializacion: porNivel("especializacion"),
    titulos_pregrado: [programaEnCurso, ...porNivel("pregrado")],
    titulos_tecnologo: porNivel("tecnologo"),
    titulos_tecnico: porNivel("tecnico"),
    cursos: certificaciones.map((c) => ({
      nombre: c.nombre,
      entidad_emisora: c.entidad_emisora || "",
      fecha: mesAnio(c.fecha),
      duracion: c.duracion || "",
      modalidad: c.modalidad || "",
    })),

    // 3. Experiencia laboral
    experiencias: experiencias.map((e) => ({
      entidad: e.entidad,
      cargo: e.cargo,
      direccion: e.direccion || "",
      telefono: e.telefono || "",
      jefe_inmediato: e.jefe_inmediato || "",
      dedicacion: e.dedicacion || "",
      periodo: [fechaCorta(e.fecha_inicio), e.fecha_fin ? fechaCorta(e.fecha_fin) : e.fecha_inicio ? "Actualidad" : ""]
        .filter(Boolean)
        .join(" — "),
      descripcion: e.descripcion || "",
    })),

    // 4. Experiencia academica e investigativa ("tutoria" = pregrado).
    grupos: porTipo("grupo_investigacion").map((a) => ({ nombre: a.descripcion, tiempo: a.periodo || "" })),
    act_proyecto: porTipo("proyecto").map(actividad),
    act_tutoria: porTipo("tutoria").map(actividad),
    act_tutoria_posgrado: porTipo("tutoria_posgrado").map(actividad),
    act_jurado: porTipo("jurado").map(actividad),
    act_informe_tecnico: porTipo("informe_tecnico").map(actividad),
    act_publicacion: porTipo("publicacion").map(actividad),
    act_organizacion: porTipo("organizacion").map(actividad),
    act_ponencia: porTipo("ponencia").map(actividad),

    // 5. Referencias
    referencias_familiares: referencias.filter((r) => r.tipo === "familiar").map(ref),
    referencias_personales: referencias.filter((r) => r.tipo === "personal").map(ref),

    fecha_diligenciamiento: fechaHoy(),
  };
}

// ---------- Foto de perfil en el recuadro del formato ----------
// docxtemplater no inserta imagenes sin un modulo de pago, asi que la foto se
// agrega despues de renderizar: se copia a word/media, se registra la
// relacion y se ancla una imagen detras del recuadro verde «Rectángulo 13»,
// con su misma posicion y tamaño (leidos del propio formato) y recortada
// como "cover" para llenarlo sin deformarse.

const ID_RELACION_FOTO = "rIdFotoPerfil";
const NS_A = "http://schemas.openxmlformats.org/drawingml/2006/main";
const NS_PIC = "http://schemas.openxmlformats.org/drawingml/2006/picture";

function recuadroFoto(xml) {
  const nombre = xml.indexOf('name="Rectángulo 13"');
  const inicioRun = nombre === -1 ? -1 : xml.lastIndexOf("<w:r>", nombre);
  const finAnchor = xml.indexOf("</wp:anchor>", nombre);
  if (inicioRun === -1 || finAnchor === -1) {
    throw new Error("El formato oficial cambió: no se encontró el recuadro de la foto («Rectángulo 13»).");
  }
  const anchor = xml.slice(inicioRun, finAnchor);
  const numero = (patron) => {
    const m = patron.exec(anchor);
    if (!m) throw new Error(`El formato oficial cambió: el recuadro de la foto no tiene ${patron}.`);
    return Number(m[1]);
  };
  return {
    inicioRun,
    x: numero(/<wp:positionH relativeFrom="column"><wp:posOffset>(-?\d+)</),
    y: numero(/<wp:positionV relativeFrom="paragraph"><wp:posOffset>(-?\d+)</),
    ancho: numero(/<wp:extent cx="(\d+)"/),
    alto: numero(/<wp:extent cx="\d+" cy="(\d+)"/),
    borde: numero(/<a:ln w="(\d+)"/),
  };
}

function insertarFoto(zip, foto) {
  const xml = zip.file("word/document.xml").asText();
  const r = recuadroFoto(xml);

  // La foto llega hasta la mitad del borde: queda debajo de la linea verde
  // (que se dibuja encima) sin dejar franja blanca.
  const margen = Math.round(r.borde / 2);
  const x = r.x + margen;
  const y = r.y + margen;
  const cx = r.ancho - 2 * margen;
  const cy = r.alto - 2 * margen;

  // Recorte tipo "cover" (en milesimas de porcentaje, como pide DrawingML).
  const proporcionCaja = cx / cy;
  const proporcionFoto = foto.ancho / foto.alto;
  let lados = 0;
  let extremos = 0;
  if (proporcionFoto > proporcionCaja) lados = Math.round(((1 - proporcionCaja / proporcionFoto) / 2) * 100000);
  else extremos = Math.round(((1 - proporcionFoto / proporcionCaja) / 2) * 100000);

  const dibujo =
    `<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="251658239" behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1">` +
    `<wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="column"><wp:posOffset>${x}</wp:posOffset></wp:positionH>` +
    `<wp:positionV relativeFrom="paragraph"><wp:posOffset>${y}</wp:posOffset></wp:positionV>` +
    `<wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/>` +
    `<wp:docPr id="9001" name="Foto de perfil"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="${NS_A}" noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
    `<a:graphic xmlns:a="${NS_A}"><a:graphicData uri="${NS_PIC}"><pic:pic xmlns:pic="${NS_PIC}">` +
    `<pic:nvPicPr><pic:cNvPr id="9001" name="foto_perfil.jpg"/><pic:cNvPicPr/></pic:nvPicPr>` +
    `<pic:blipFill><a:blip r:embed="${ID_RELACION_FOTO}"/><a:srcRect l="${lados}" t="${extremos}" r="${lados}" b="${extremos}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
    `</pic:pic></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r>`;
  zip.file("word/document.xml", xml.slice(0, r.inicioRun) + dibujo + xml.slice(r.inicioRun));

  zip.file("word/media/foto_perfil.jpg", foto.buffer);
  const rels = zip.file("word/_rels/document.xml.rels").asText();
  zip.file(
    "word/_rels/document.xml.rels",
    rels.replace(
      "</Relationships>",
      `<Relationship Id="${ID_RELACION_FOTO}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/foto_perfil.jpg"/></Relationships>`
    )
  );
  const tipos = zip.file("[Content_Types].xml").asText();
  if (!/<Default Extension="jpg"/i.test(tipos)) {
    zip.file("[Content_Types].xml", tipos.replace("<Default ", '<Default Extension="jpg" ContentType="image/jpeg"/><Default '));
  }
}

// La foto se toma del almacenamiento propio; si no hay (o es un enlace
// externo antiguo) el recuadro queda vacio, como en el formato en blanco.
async function cargarFoto(estudiante) {
  const archivo = await almacenamiento.leer(estudiante.foto_url);
  if (!archivo) return null;
  try {
    return await normalizarFoto(archivo);
  } catch (err) {
    console.error("[hoja-vida] no se pudo leer la foto de perfil:", err.message);
    return null;
  }
}

async function generarDocx(todo) {
  const zip = new PizZip(obtenerPlantilla());
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => "",
  });
  doc.render(armarDatos(todo));
  const foto = await cargarFoto(todo.estudiante);
  if (foto) insertarFoto(doc.getZip(), foto);
  return doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });
}

// Ruta de soffice: LIBREOFFICE_PATH o la instalacion por defecto de cada SO
// (en Linux/Docker basta con que este en el PATH).
function rutaSoffice() {
  if (process.env.LIBREOFFICE_PATH) return process.env.LIBREOFFICE_PATH;
  if (process.platform === "win32") return "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
  if (process.platform === "darwin") return "/Applications/LibreOffice.app/Contents/MacOS/soffice";
  return "soffice";
}

const ejecutar = promisify(execFile);

// Perfil de LibreOffice reutilizado entre conversiones: crearlo es lo mas
// lento del arranque. Un perfil no admite dos procesos a la vez, asi que las
// conversiones se encolan.
const PERFIL_LIBREOFFICE = pathToFileURL(path.join(os.tmpdir(), "fetwork-libreoffice-perfil")).href;
let cola = Promise.resolve();

async function convertirAPdf(docx, dir) {
  try {
    await ejecutar(rutaSoffice(), [`-env:UserInstallation=${PERFIL_LIBREOFFICE}`, "--headless", "--convert-to", "pdf", "--outdir", dir, docx], { timeout: 60000 });
    return await fs.readFile(path.join(dir, "hoja_vida.pdf"));
  } catch (err) {
    const e = new Error("Fallo la conversion a PDF con LibreOffice", { cause: err });
    e.status = 503;
    e.publicMessage = "No fue posible generar el PDF de la hoja de vida. Intenta de nuevo más tarde.";
    throw e;
  }
}

// Rellena el formato y lo convierte a PDF en un directorio temporal propio.
async function generarPdf(todo) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "fetwork-hv-"));
  try {
    const docx = path.join(dir, "hoja_vida.docx");
    await fs.writeFile(docx, await generarDocx(todo));
    const turno = cola.then(() => convertirAPdf(docx, dir));
    cola = turno.catch(() => {});
    return await turno;
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

function nombreArchivo(estudiante) {
  const base = `${estudiante.apellidos} ${estudiante.nombres}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `Hoja_de_vida_PA-GTH-F-10_${base}.pdf`;
}

module.exports = { generarPdf, nombreArchivo };

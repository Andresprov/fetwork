// Prepara en memoria la plantilla de docxtemplater a partir del formato
// OFICIAL de Talento Humano de la FET (templates/plantilla_hoja_vida_PA-GTH-F-10.docx,
// version 01 del 23/06/2018), insertandole los marcadores que rellena
// hojaVida.documento.js.
//
// El archivo oficial nunca se modifica ni se guarda una copia derivada: se lee
// y se transforma en memoria la primera vez que se necesita (queda en cache).
// Encabezado, logo, estilos, fuentes, recuadro de foto y saltos de pagina se
// conservan tal cual.
//
// Cada parrafo que se toca se valida por su texto: si el formato oficial
// cambia (otra version), falla con un mensaje claro en lugar de generar una
// plantilla corrupta.
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");

const RUTA_FORMATO_OFICIAL = path.join(__dirname, "..", "..", "..", "..", "templates", "plantilla_hoja_vida_PA-GTH-F-10.docx");

function construirPlantilla() {
  const zip = new PizZip(fs.readFileSync(RUTA_FORMATO_OFICIAL));
  const xml = zip.file("word/document.xml").asText();
  const inicioBody = xml.indexOf("<w:body>") + "<w:body>".length;
  const finBody = xml.indexOf("</w:body>");
  const body = xml.slice(inicioBody, finBody);

  // ---------- Division del cuerpo en elementos de primer nivel ----------

  function elementosPrimerNivel(contenido) {
    const patron = /<(\/?)(w:p|w:tbl|w:sectPr)\b[^>]*?(\/?)>/g;
    const elementos = [];
    const pila = [];
    let inicio = 0;
    let m;
    while ((m = patron.exec(contenido))) {
      const [etiqueta, cierre, , autocierre] = m;
      if (!cierre && !autocierre) {
        if (!pila.length) inicio = m.index;
        pila.push(1);
      } else if (cierre) {
        pila.pop();
        if (!pila.length) elementos.push(contenido.slice(inicio, m.index + etiqueta.length));
      } else if (!pila.length) {
        elementos.push(etiqueta);
      }
    }
    return elementos;
  }

  const el = elementosPrimerNivel(body);

  const textoDe = (fragmento) => [...fragmento.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]).join("");

  function verificarVacio(indice) {
    if (textoDe(el[indice]).trim() !== "" || !el[indice].startsWith("<w:p")) {
      throw new Error(`El formato oficial cambió: se esperaba un párrafo vacío en el elemento ${indice}.`);
    }
  }

  function verificar(indice, esperado) {
    const real = textoDe(el[indice]).trim();
    if (!real.startsWith(esperado)) {
      throw new Error(`El formato oficial cambió: se esperaba «${esperado}» en el elemento ${indice} y hay «${real}».`);
    }
  }

  // ---------- Constructores de XML ----------

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const RPR_DATOS = '<w:rPr><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>';

  const run = (texto, rPr = "") => `<w:r>${rPr}<w:t xml:space="preserve">${esc(texto)}</w:t></w:r>`;
  const parrafo = (texto, rPr = "") => `<w:p>${run(texto, rPr)}</w:p>`;

  // Parrafo que solo contiene una etiqueta de seccion: con paragraphLoop,
  // docxtemplater lo elimina al renderizar.
  const marcador = (etiqueta) => parrafo(etiqueta);

  // Bloque que se repite por cada elemento de `lista` y, si la lista esta
  // vacia, muestra `vacio` en su lugar.
  function bloque(lista, contenido, vacio) {
    const partes = [marcador(`{#${lista}}`), ...contenido, marcador(`{/${lista}}`)];
    if (vacio) partes.push(marcador(`{^${lista}}`), ...vacio, marcador(`{/${lista}}`));
    return partes;
  }

  // Agrega " {campo}" al final de un parrafo de etiqueta ("NOMBRE:", ...),
  // quitando antes los runs de relleno visual del formato en blanco (solo
  // tabulaciones o solo espacios subrayados).
  const RUN_RELLENO = /<w:r>(?:<w:rPr>(?:(?!<\/w:rPr>).)*<\/w:rPr>)?(?:<w:tab\/>|<w:t xml:space="preserve">\s+<\/w:t>)<\/w:r>/g;

  function agregarTexto(parrafoXml, texto, rPr = "") {
    const limpio = parrafoXml.replace(RUN_RELLENO, "");
    const separador = /\s$/.test(textoDe(limpio)) ? "" : " ";
    return limpio.replace(/<\/w:p>$/, `${run(separador + texto, rPr)}</w:p>`);
  }

  function conValor(indice, esperado, campo, rPr = "") {
    verificar(indice, esperado);
    return agregarTexto(el[indice], `{${campo}}`, rPr);
  }

  // Copia del parrafo de etiqueta con un texto fijo agregado (para "No registra").
  function etiquetaConTexto(indice, texto) {
    return agregarTexto(el[indice], texto).replace(/ w14:paraId="[^"]*"/, "");
  }

  const reemplazos = new Map(); // indice -> array de elementos que lo reemplazan
  const eliminar = new Set();

  // ---------- 1. Datos personales ----------

  reemplazos.set(12, [conValor(12, "NOMBRE:", "nombre_completo", RPR_DATOS)]);
  reemplazos.set(14, [conValor(14, "DOCUMENTO DE IDENTIDAD:", "documento_identidad", RPR_DATOS)]);

  verificar(16, "FECHA DE NACIMIENTO:");
  {
    let i = 0;
    const campos = ["nac_dia", "nac_mes", "nac_anio"];
    reemplazos.set(16, [el[16].replace(/<w:t xml:space="preserve">\(\) <\/w:t>/g, () => `<w:t xml:space="preserve">({${campos[i++]}}) </w:t>`)]);
    if (i !== 3) throw new Error("El formato oficial cambió: no se encontraron los tres «()» de la fecha de nacimiento.");
  }

  reemplazos.set(18, [conValor(18, "LUGAR DE NACIMIENTO:", "lugar_nacimiento", RPR_DATOS)]);
  reemplazos.set(20, [conValor(20, "ESTADO CIVIL:", "estado_civil", RPR_DATOS)]);
  reemplazos.set(22, [conValor(22, "LUGAR DE RESIDENCIA:", "lugar_residencia", RPR_DATOS)]);
  reemplazos.set(24, [conValor(24, "DIRECCIÓN:", "direccion", RPR_DATOS)]);
  reemplazos.set(26, [conValor(26, "TELÉFONOS:", "telefono", RPR_DATOS)]);
  reemplazos.set(28, [conValor(28, "E-MAIL:", "correo", RPR_DATOS)]);
  reemplazos.set(30, [conValor(30, "R-H:", "rh", RPR_DATOS)]);
  reemplazos.set(32, [conValor(32, "Persona de contacto en caso de emergencia:", "contacto_emergencia", RPR_DATOS)]);

  // ---------- 2. Formacion academica ----------

  // Bloque de titulo: [encabezado "Nivel:", Fecha de grado, Institucion,
  // Pais y ciudad, Titulo obtenido, (Modalidad)] + parrafo en blanco como
  // separador. En 2.2 el separador va ANTES del bloque: la seccion termina
  // justo antes de un salto de pagina y un parrafo vacio al final podria
  // pasar solo a una hoja nueva y dejarla en blanco.
  function bloqueTitulo(lista, desde, nivel, conModalidad, separadorAntes = false) {
    verificar(desde, `${nivel}:`);
    const campos = [
      [desde + 1, "Fecha de grado:", "fecha_grado"],
      [desde + 2, "Institución:", "institucion"],
      [desde + 3, "País y ciudad:", "pais_ciudad"],
      [desde + 4, "Título obtenido:", "titulo_obtenido"],
    ];
    if (conModalidad) campos.push([desde + 5, "Modalidad de estudio:", "modalidad_estudio"]);
    const blanco = desde + campos.length + 1;
    const ordenar = (partes) => (separadorAntes ? [el[blanco], ...partes] : [...partes, el[blanco]]);
    const contenido = ordenar([el[desde], ...campos.map(([i, e, c]) => conValor(i, e, c))]);
    for (let i = desde + 1; i <= blanco; i++) eliminar.add(i);
    reemplazos.set(desde, bloque(lista, contenido, ordenar([etiquetaConTexto(desde, "No registra")])));
  }

  bloqueTitulo("titulos_maestria", 42, "Maestría", false);
  bloqueTitulo("titulos_especializacion", 48, "Especialización", false);
  bloqueTitulo("titulos_pregrado", 54, "Pregrado", false);
  verificarVacio(68);
  eliminar.add(68); // separador del encabezado 2.2: lo aporta el primer bloque
  bloqueTitulo("titulos_tecnologo", 69, "Tecnólogo", true, true);
  bloqueTitulo("titulos_tecnico", 76, "Técnico", true, true);

  // Tabla de diplomados y cursos: se conserva el encabezado y la primera fila
  // (convertida en fila repetida); las 25 filas vacias restantes se quitan.
  verificar(61, "Diplomados, cursos, seminarios y actualizaciones");
  {
    const tabla = el[62];
    const filas = tabla.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g);
    if (!filas || filas.length < 2 || !textoDe(filas[0]).startsWith("TEMA")) {
      throw new Error("El formato oficial cambió: la tabla de diplomados no tiene la estructura esperada.");
    }
    const llenarCeldas = (fila, textos) => {
      let i = 0;
      return fila.replace(/<w:p ([^>]*?)\/>/g, (_, attrs) => `<w:p ${attrs}>${run(textos[i++])}</w:p>`);
    };
    const repetida = llenarCeldas(filas[1], ["{#cursos}{nombre}", "{duracion}", "{fecha}", "{entidad_emisora}", "{modalidad}{/cursos}"]);
    const vacia = llenarCeldas(filas[1], ["{^cursos}No registra", "", "", "", "{/cursos}"]);
    const inicioFilas = tabla.indexOf(filas[0]);
    const finFilas = tabla.lastIndexOf("</w:tr>") + "</w:tr>".length;
    reemplazos.set(62, [tabla.slice(0, inicioFilas) + filas[0] + repetida + vacia + tabla.slice(finFilas)]);
  }
  // Tras la tabla el formato en blanco deja cuatro parrafos vacios (espacio
  // para escribir a mano). Con la tabla llena al final de una pagina pasaban a
  // la siguiente y dejaban un hueco encima de 2.2; basta con uno.
  for (let i = 63; i <= 66; i++) verificarVacio(i);
  [64, 65, 66].forEach((i) => eliminar.add(i));

  // ---------- 3. Experiencia laboral ----------
  // El formato trae tres bloques fijos (el 2.º y 3.º sin INSTITUCIÓN/EMPRESA);
  // se deja un unico bloque completo que se repite por cada experiencia.

  verificar(85, "EXPERIENCIA LABORAL");
  {
    verificar(94, "FUNCIONES:");
    const funciones = el[94].replace(/<w:t>FUNCIONES: _+<\/w:t>/, '<w:t xml:space="preserve">FUNCIONES: {descripcion}</w:t>');
    // Separador antes de cada experiencia (no despues), por el mismo motivo
    // que en 2.2: la seccion termina en salto de pagina.
    verificarVacio(86);
    eliminar.add(86);
    const contenido = [
      el[95],
      conValor(87, "INSTITUCIÓN/EMPRESA:", "entidad"),
      conValor(88, "NOMBRE DEL CARGO:", "cargo"),
      conValor(89, "DIRECCIÓN:", "direccion"),
      conValor(90, "TELÉFONOS:", "telefono"),
      conValor(91, "NOMBRE DEL JEFE INMEDIATO:", "jefe_inmediato"),
      conValor(92, "DEDICACIÓN:", "dedicacion"),
      conValor(93, "FECHA DE INICIO Y TERMINACIÓN:", "periodo"),
      funciones,
    ];
    verificar(96, "NOMBRE DEL CARGO:");
    verificar(110, "FUNCIONES:");
    for (let i = 88; i <= 110; i++) eliminar.add(i);
    reemplazos.set(87, bloque("experiencias", contenido, [el[95], parrafo("No registra experiencia laboral.")]));
  }

  // ---------- 4. Experiencia academica e investigativa ----------

  const noRegistra = () => parrafo("No registra");
  const listaActividades = (lista) => bloque(lista, [parrafo("{texto}")], [noRegistra()]);

  verificar(116, "4.1 PERTENENCIA A GRUPOS DE INVESTIGACIÓN");
  reemplazos.set(118, bloque("grupos", [conValor(118, "Nombre del grupo:", "nombre"), conValor(119, "Tiempo de vinculación:", "tiempo"), parrafo("")], [noRegistra()]));
  eliminar.add(119);

  const despuesDe = (indice, esperado, nuevos) => {
    verificar(indice, esperado);
    reemplazos.set(indice, [el[indice], ...nuevos]);
  };

  despuesDe(121, "4.2 PROYECTOS DE INVESTIGACIÓN DESARROLLADOS", listaActividades("act_proyecto"));
  despuesDe(126, "Tutorías trabajos de culminación de posgrado", listaActividades("act_tutoria_posgrado"));
  despuesDe(129, "Tutorías trabajos de culminación de pregrado", listaActividades("act_tutoria"));
  despuesDe(131, "4.4 PAR EVALUADOR / JURADO", listaActividades("act_jurado"));
  despuesDe(134, "4.5 TRABAJOS E INFORMES TÉCNICOS", listaActividades("act_informe_tecnico"));
  despuesDe(137, "4.6 PUBLICACIONES", listaActividades("act_publicacion"));
  despuesDe(140, "4.7 PERTENENCIA A ORGANIZACIONES", listaActividades("act_organizacion"));
  despuesDe(143, "4.8 PONENCIAS", listaActividades("act_ponencia"));

  // ---------- 5. Referencias ----------

  verificar(149, "REFERENCIA FAMILIAR");
  reemplazos.set(
    151,
    bloque(
      "referencias_familiares",
      [
        conValor(151, "NOMBRE COMPLETO:", "nombre_completo"),
        conValor(152, "PROFESIÓN U OCUPACIÓN:", "profesion_ocupacion"),
        conValor(153, "PARENTESCO:", "parentesco"),
        conValor(154, "TELÉFONO:", "telefono"),
        el[155],
      ],
      [noRegistra()]
    )
  );
  [152, 153, 154, 155].forEach((i) => eliminar.add(i));

  verificar(157, "REFERENCIA PERSONAL");
  reemplazos.set(
    159,
    bloque(
      "referencias_personales",
      [
        conValor(159, "NOMBRE COMPLETO:", "nombre_completo"),
        conValor(160, "PROFESIÓN U OCUPACIÓN:", "profesion_ocupacion"),
        conValor(161, "TELÉFONO:", "telefono"),
        el[162],
      ],
      [noRegistra()]
    )
  );
  [160, 161, 162].forEach((i) => eliminar.add(i));

  verificar(172, "FIRMA");
  // Fecha en que se genera el documento, debajo de la firma. La FECHA del
  // encabezado es la de aprobacion de la version 01 del formato (control
  // documental) y no se toca.
  reemplazos.set(172, [
    el[172],
    parrafo(""),
    `<w:p><w:pPr><w:jc w:val="center"/></w:pPr>${run("Fecha de diligenciamiento: ", "<w:rPr><w:b/><w:bCs/></w:rPr>")}${run("{fecha_diligenciamiento}")}</w:p>`,
  ]);

  // ---------- Saltos de pagina ----------
  // El formato separa las secciones con un parrafo que solo contiene un salto
  // de pagina. Con datos reales, si la pagina anterior se llena, ese parrafo
  // cae en una pagina nueva y deja una hoja en blanco. Se reemplaza por
  // "salto de pagina antes" en el titulo de la seccion siguiente.
  for (const [salto, titulo, texto] of [
    [37, 38, "FORMACIÓN ACADÉMICA"],
    [83, 85, "EXPERIENCIA LABORAL"],
    [111, 113, "EXPERIENCIA ACADÉMICA"],
    [144, 146, "REFERENCIAS"],
  ]) {
    if (!el[salto].includes('<w:br w:type="page"/>') || textoDe(el[salto]).trim() !== "") {
      throw new Error(`El formato oficial cambió: el elemento ${salto} ya no es un salto de página.`);
    }
    verificar(titulo, texto);
    eliminar.add(salto);
    // El parrafo vacio que seguia al salto quedaria al final de la pagina
    // anterior: se quita.
    if (titulo === salto + 2 && textoDe(el[salto + 1]).trim() === "") eliminar.add(salto + 1);
    if (!el[titulo].includes("<w:pPr>")) throw new Error(`El formato oficial cambió: el título «${texto}» no tiene propiedades de párrafo.`);
    reemplazos.set(titulo, [el[titulo].replace(/(<w:pStyle w:val="Ttulo1"\/>)/, "$1<w:pageBreakBefore/>")]);
    if (!reemplazos.get(titulo)[0].includes("<w:pageBreakBefore/>")) {
      throw new Error(`El formato oficial cambió: el título «${texto}» no usa el estilo Título 1.`);
    }
  }

  // ---------- Ensamblado ----------

  // Los titulos (estilos Título 1/2/3) se mantienen con el parrafo siguiente
  // para que ninguno quede solo al final de una pagina (p. ej. «4.5» con su
  // contenido en la hoja siguiente). Va justo despues de pStyle, como pide el
  // orden de propiedades de OOXML.
  const nuevoBody = el
    .map((contenido, i) => {
      if (reemplazos.has(i)) return reemplazos.get(i).join("");
      if (eliminar.has(i)) return "";
      return contenido;
    })
    .join("")
    .replace(/(<w:pStyle w:val="Ttulo[123]"\/>)/g, "$1<w:keepNext/>");

  zip.file("word/document.xml", xml.slice(0, inicioBody) + nuevoBody + xml.slice(finBody));
  return zip.generate({ type: "nodebuffer", compression: "DEFLATE" });
}

let cache = null;

// Buffer del .docx con marcadores, listo para docxtemplater.
function obtenerPlantilla() {
  if (!cache) cache = construirPlantilla();
  return cache;
}

module.exports = { obtenerPlantilla };

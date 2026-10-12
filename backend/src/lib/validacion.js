const { ErrorPeticion } = require("./errores");

// Validadores de entrada compartidos por los modulos. Cada service los crea
// con su propio mapa de etiquetas (campo -> "El nombre visible") para que los
// mensajes de error se muestren tal cual en la UI.
function crearValidadores(etiquetas = {}) {
  const etiqueta = (campo) => etiquetas[campo] || campo;

  function texto(valor, campo, { requerido = false, max = 200 } = {}) {
    if (valor === undefined || valor === null || String(valor).trim() === "") {
      if (requerido) throw new ErrorPeticion(400, `${etiqueta(campo)} es obligatorio.`);
      return null;
    }
    if (typeof valor !== "string") {
      throw new ErrorPeticion(400, `${etiqueta(campo)} no tiene un formato válido.`);
    }
    const limpio = valor.trim();
    if (limpio.length > max) {
      throw new ErrorPeticion(400, `${etiqueta(campo)} no puede superar ${max} caracteres.`);
    }
    return limpio;
  }

  function url(valor, campo, opciones = {}) {
    const limpio = texto(valor, campo, { max: 500, ...opciones });
    if (limpio === null) return null;
    try {
      const parsed = new URL(limpio);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      throw new ErrorPeticion(400, `${etiqueta(campo)} debe ser un enlace válido que empiece por http:// o https://.`);
    }
    return limpio;
  }

  function telefono(valor, campo = "telefono") {
    const limpio = texto(valor, campo, { max: 20 });
    if (limpio === null) return null;
    if (!/^\+?[0-9\s()-]{7,20}$/.test(limpio)) {
      throw new ErrorPeticion(400, `${etiquetas[campo] || "El teléfono"} solo puede contener números, espacios, guiones y el prefijo +.`);
    }
    return limpio;
  }

  function fecha(valor, etiquetaFecha) {
    if (valor === undefined || valor === null || valor === "") return null;
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(valor)) {
      throw new ErrorPeticion(400, `${etiquetaFecha} debe tener el formato AAAA-MM-DD.`);
    }
    const d = new Date(`${valor.slice(0, 10)}T00:00:00.000Z`);
    if (Number.isNaN(d.getTime())) throw new ErrorPeticion(400, `${etiquetaFecha} no es una fecha válida.`);
    return d;
  }

  function opcion(valor, campo, opciones, { requerido = false } = {}) {
    if (valor === undefined || valor === null || valor === "") {
      if (requerido) throw new ErrorPeticion(400, `${etiqueta(campo)} es obligatorio.`);
      return null;
    }
    if (!opciones.includes(valor)) {
      throw new ErrorPeticion(400, `${etiqueta(campo)} no es una opción válida.`);
    }
    return valor;
  }

  return { texto, url, telefono, fecha, opcion };
}

function idEntero(valor, etiqueta = "El identificador") {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) throw new ErrorPeticion(400, `${etiqueta} no es válido.`);
  return n;
}

module.exports = { crearValidadores, idEntero };

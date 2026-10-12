import client from "./client";

const BASE = "/perfiles/me/hoja-vida";

export async function getHojaVida() {
  const { data } = await client.get(BASE);
  return data;
}

export async function guardarDatosPersonales(payload) {
  const { data } = await client.put(`${BASE}/datos-personales`, payload);
  return data;
}

// recurso: "titulos" | "actividades" | "referencias"
export async function crearRegistro(recurso, payload) {
  const { data } = await client.post(`${BASE}/${recurso}`, payload);
  return data;
}

export async function actualizarRegistro(recurso, id, payload) {
  const { data } = await client.put(`${BASE}/${recurso}/${id}`, payload);
  return data;
}

export async function eliminarRegistro(recurso, id) {
  await client.delete(`${BASE}/${recurso}/${id}`);
}

// PDF generado por el backend desde el formato oficial, con el nombre que
// indica Content-Disposition. Con responseType "blob" el cuerpo de un error
// tambien llega como Blob: se convierte a JSON para getErrorMessage.
export async function obtenerPdfHojaVida() {
  try {
    const respuesta = await client.get(`${BASE}/exportar`, { responseType: "blob" });
    const disposicion = respuesta.headers["content-disposition"] || "";
    const nombre = /filename="([^"]+)"/.exec(disposicion)?.[1] || "Hoja_de_vida_PA-GTH-F-10.pdf";
    return { blob: respuesta.data, nombre };
  } catch (err) {
    const data = err?.response?.data;
    if (data instanceof Blob) {
      try {
        err.response.data = JSON.parse(await data.text());
      } catch {
        /* se usa el mensaje generico */
      }
    }
    throw err;
  }
}

export function guardarArchivo(blob, nombre) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

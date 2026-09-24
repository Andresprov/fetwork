import client from "./client";

export async function getMiPerfil() {
  const { data } = await client.get("/perfiles/me");
  return data;
}

export async function actualizarMiPerfil(payload) {
  const { data } = await client.put("/perfiles/me", payload);
  return data;
}

export async function actualizarVisibilidad(payload) {
  const { data } = await client.put("/perfiles/me/visibilidad", payload);
  return data;
}

export async function getCatalogoHabilidades() {
  const { data } = await client.get("/perfiles/habilidades/catalogo");
  return data.categorias;
}

export async function getMisHabilidades() {
  const { data } = await client.get("/perfiles/me/habilidades");
  return data.habilidades;
}

export async function agregarHabilidad({ id_habilidad, nivel }) {
  const { data } = await client.post("/perfiles/me/habilidades", { id_habilidad, nivel: nivel || null });
  return data;
}

export async function quitarHabilidad(idHabilidad) {
  await client.delete(`/perfiles/me/habilidades/${idHabilidad}`);
}

export async function getExperiencias() {
  const { data } = await client.get("/perfiles/me/experiencias");
  return data.experiencias;
}

export async function crearExperiencia(payload) {
  const { data } = await client.post("/perfiles/me/experiencias", payload);
  return data;
}

export async function actualizarExperiencia(id, payload) {
  const { data } = await client.put(`/perfiles/me/experiencias/${id}`, payload);
  return data;
}

export async function eliminarExperiencia(id) {
  await client.delete(`/perfiles/me/experiencias/${id}`);
}

export async function getCertificaciones() {
  const { data } = await client.get("/perfiles/me/certificaciones");
  return data.certificaciones;
}

export async function crearCertificacion(payload) {
  const { data } = await client.post("/perfiles/me/certificaciones", payload);
  return data;
}

export async function actualizarCertificacion(id, payload) {
  const { data } = await client.put(`/perfiles/me/certificaciones/${id}`, payload);
  return data;
}

export async function eliminarCertificacion(id) {
  await client.delete(`/perfiles/me/certificaciones/${id}`);
}

export async function getPerfilPublico(idEstudiante) {
  const { data } = await client.get(`/perfiles/${idEstudiante}/publico`);
  return data;
}

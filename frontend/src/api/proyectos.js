import client from "./client";

export async function getMisProyectos() {
  const { data } = await client.get("/proyectos/me");
  return data.proyectos;
}

export async function getMiProyecto(id) {
  const { data } = await client.get(`/proyectos/me/${id}`);
  return data;
}

export async function crearProyecto(payload) {
  const { data } = await client.post("/proyectos/me", payload);
  return data;
}

export async function actualizarProyecto(id, payload) {
  const { data } = await client.put(`/proyectos/me/${id}`, payload);
  return data;
}

export async function eliminarProyecto(id) {
  await client.delete(`/proyectos/me/${id}`);
}

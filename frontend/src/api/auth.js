import client from "./client";

export async function getRosterQ10() {
  const { data } = await client.get("/usuarios/q10/roster");
  return data.roster;
}

export async function loginQ10(codigoInstitucionalQ10) {
  const { data } = await client.post("/usuarios/q10/login", {
    codigo_institucional_q10: codigoInstitucionalQ10,
  });
  return data;
}

export async function registrarEmpresa(payload) {
  const { data } = await client.post("/empresas/registro", payload);
  return data;
}

export async function loginEmpresa({ correo, contrasena }) {
  const { data } = await client.post("/empresas/login", { correo, contrasena });
  return data;
}

export async function recuperarContrasenaEmpresa(correo) {
  const { data } = await client.post("/empresas/recuperar-contrasena", { correo });
  return data;
}

export async function resetearContrasenaEmpresa({ token, nueva_contrasena }) {
  const { data } = await client.post("/empresas/resetear-contrasena", { token, nueva_contrasena });
  return data;
}

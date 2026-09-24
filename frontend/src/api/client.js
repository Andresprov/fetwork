import axios from "axios";
import { clearSession, getSession } from "../lib/session";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// Adjunta el JWT de la sesion activa a cada peticion.
client.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Si una peticion autenticada recibe 401, la sesion expiro: se limpia y se
// vuelve al inicio de sesion. Los 401 de login (sin token) no se tocan.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && error.config?.headers?.Authorization) {
      clearSession();
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// Los controllers del backend responden { error, errores? } en fallos.
// Esta funcion homogeniza el mensaje para mostrarlo directo en la UI.
export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.errores?.length) return data.errores.join(" ");
  if (data?.error) return data.error;
  if (error?.code === "ERR_NETWORK") return "No fue posible conectar con el servidor. Intenta de nuevo en unos minutos.";
  return "Ocurrió un error inesperado. Intenta de nuevo.";
}

export default client;

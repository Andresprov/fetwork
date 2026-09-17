import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// Los controllers del backend responden { error, errores? } en fallos.
// Esta funcion homogeniza el mensaje para mostrarlo directo en la UI.
export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.errores?.length) return data.errores.join(" ");
  if (data?.error) return data.error;
  if (error?.message) return error.message;
  return "Ocurrio un error inesperado. Intenta de nuevo.";
}

export default client;

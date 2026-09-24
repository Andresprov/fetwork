import { Navigate } from "react-router-dom";
import { getSession } from "../lib/session";

// Solo deja pasar a un estudiante con sesion Q10 activa. La validez real del
// token la decide el backend; si expira, el interceptor de axios cierra sesion.
export default function RequireEstudiante({ children }) {
  const session = getSession();
  if (!session?.token || session.usuario?.rol !== "estudiante") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

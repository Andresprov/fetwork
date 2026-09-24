import { Navigate, Route, Routes } from "react-router-dom";
import IniciarSesionQ10 from "../pages/auth/IniciarSesionQ10";
import InicioSesionEmpresa from "../pages/auth/InicioSesionEmpresa";
import RegistroEmpresa from "../pages/auth/RegistroEmpresa";
import CuentaPendiente from "../pages/auth/CuentaPendiente";
import CuentaRechazada from "../pages/auth/CuentaRechazada";
import TransicionErrorQ10 from "../pages/auth/TransicionErrorQ10";
import EstudianteLayout from "../components/layout/EstudianteLayout";
import RequireEstudiante from "./RequireEstudiante";
import PerfilDashboard from "../pages/perfil/PerfilDashboard";
import DatosPersonales from "../pages/perfil/DatosPersonales";
import Habilidades from "../pages/perfil/Habilidades";
import Experiencia from "../pages/perfil/Experiencia";
import Certificaciones from "../pages/perfil/Certificaciones";
import Visibilidad from "../pages/perfil/Visibilidad";
import VistaPublica from "../pages/perfil/VistaPublica";
import PerfilPublico from "../pages/perfil/PerfilPublico";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<IniciarSesionQ10 />} />
      <Route path="/empresas/login" element={<InicioSesionEmpresa />} />
      <Route path="/empresas/registro" element={<RegistroEmpresa />} />
      <Route path="/empresas/pendiente" element={<CuentaPendiente />} />
      <Route path="/empresas/rechazada" element={<CuentaRechazada />} />
      <Route path="/auth/callback" element={<TransicionErrorQ10 />} />

      <Route
        path="/perfil"
        element={
          <RequireEstudiante>
            <EstudianteLayout />
          </RequireEstudiante>
        }
      >
        <Route index element={<PerfilDashboard />} />
        <Route path="datos" element={<DatosPersonales />} />
        <Route path="habilidades" element={<Habilidades />} />
        <Route path="experiencia" element={<Experiencia />} />
        <Route path="certificaciones" element={<Certificaciones />} />
        <Route path="visibilidad" element={<Visibilidad />} />
        <Route path="vista-publica" element={<VistaPublica />} />
      </Route>

      <Route path="/perfiles/:idEstudiante" element={<PerfilPublico />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

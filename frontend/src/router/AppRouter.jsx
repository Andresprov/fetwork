import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import IniciarSesionQ10 from '../pages/auth/IniciarSesionQ10'
import InicioSesionEmpresa from '../pages/auth/InicioSesionEmpresa'
import RegistroEmpresa from '../pages/auth/RegistroEmpresa'
import CuentaPendiente from '../pages/auth/CuentaPendiente'
import CuentaRechazada from '../pages/auth/CuentaRechazada'
import TransicionErrorQ10 from '../pages/auth/TransicionErrorQ10'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<IniciarSesionQ10 />} />
        <Route path="/empresas/login" element={<InicioSesionEmpresa />} />
        <Route path="/empresas/registro" element={<RegistroEmpresa />} />
        <Route path="/empresas/pendiente" element={<CuentaPendiente />} />
        <Route path="/empresas/rechazada" element={<CuentaRechazada />} />
        <Route path="/auth/callback" element={<TransicionErrorQ10 />} />
      </Routes>
    </BrowserRouter>
  )
}

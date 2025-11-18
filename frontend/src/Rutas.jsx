import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardCliente from "./pages/dashboardCliente/DashboardCliente.jsx";
import Dashboard from "./pages/dashboardMedico/Dashboard.jsx";
import DashboardAdmin from "./pages/dashboardAdmin/DashboardAdmin.jsx";
import NuevaCitaPage from "./pages/dashboardCliente/NuevaCitaPage.jsx";
import PerfilPages from "./pages/dashboardCliente/PerfilPages.jsx";
import CalendarioCitas from "./pages/dashboardAdmin/CalendarioCitas.jsx";
import PacientesDashboard from "./pages/dashboardAdmin/PacientesDashboard"
import DoctorDashboard from "./pages/dashboardAdmin/DoctorDashboard.jsx";
import TratamientosDashboard from "./pages/dashboardAdmin/TratamientosDashboard.jsx";
import ProcedimientosDashboard from "./pages/dashboardAdmin/ProcedimientosDashboard.jsx";
import MaterialesDashboard from "./pages/dashboardAdmin/MaterialesDashboard.jsx";
import EquiposDashboard from "./pages/dashboardAdmin/EquiposDashboard.jsx";
import ProveedoresDashboard from "./pages/dashboardAdmin/ProveedoresDashboard.jsx";
import InventarioDashboard from "./pages/dashboardAdmin/InventarioDashboard.jsx";
import ServiciosDashboard from "./pages/dashboardAdmin/ServiciosDashboard.jsx";
import EspecialidadesDashboard from "./pages/dashboardAdmin/EspecialidadesDashboard.jsx";
import HorariosDashboard from "./pages/dashboardAdmin/HorariosDashboard.jsx";
import NotasDashboard from "./pages/dashboardAdmin/NotasDashboard.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ServiciosView from "./pages/dashboardCliente/ServiciosView.jsx";
import TratamientosViewCliente from "./pages/dashboardCliente/TratamientosView.jsx";
import EspecialidadesView from "./pages/dashboardCliente/EspecialidadesView.jsx";
import NotasView from "./pages/dashboardMedico/NotasView.jsx";
import HorariosView from "./pages/dashboardMedico/HorariosView.jsx";
import TratamientosViewMedico from "./pages/dashboardMedico/TratamientosView.jsx";
import ProcedimientosView from "./pages/dashboardMedico/ProcedimientosView.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas de Paciente */}
      <Route 
        path="/cliente" 
        element={
          <ProtectedRoute allowedRoles={["paciente"]}>
            <DashboardCliente />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cliente/nueva-cita" 
        element={
          <ProtectedRoute allowedRoles={["paciente"]}>
            <NuevaCitaPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cliente/servicios" 
        element={
          <ProtectedRoute allowedRoles={["paciente"]}>
            <ServiciosView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cliente/tratamientos" 
        element={
          <ProtectedRoute allowedRoles={["paciente"]}>
            <TratamientosViewCliente />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cliente/especialidades" 
        element={
          <ProtectedRoute allowedRoles={["paciente"]}>
            <EspecialidadesView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute allowedRoles={["paciente", "doctor", "admin", "administrador"]}>
            <PerfilPages />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas de Doctor */}
      <Route 
        path="/medico" 
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/medico/notas" 
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <NotasView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/medico/horarios" 
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <HorariosView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/medico/tratamientos" 
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <TratamientosViewMedico />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/medico/procedimientos" 
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <ProcedimientosView />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas de Admin */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendario" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <CalendarioCitas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pacientes" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <PacientesDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctores" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tratamientos" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <TratamientosDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/procedimientos" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <ProcedimientosDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/materiales" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <MaterialesDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/equipos" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <EquiposDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/proveedores" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <ProveedoresDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inventario" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <InventarioDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/servicios" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <ServiciosDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/especialidades" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <EspecialidadesDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/horarios" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <HorariosDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notas" 
        element={
          <ProtectedRoute allowedRoles={["admin", "administrador"]}>
            <NotasDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default Rutas;

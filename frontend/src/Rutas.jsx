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
import RegisterPage from "./pages/RegisterPage.jsx";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cliente" element={<DashboardCliente />} />
      <Route path="/cliente/nueva-cita" element={<NuevaCitaPage />} />
      <Route path="/perfil" element={<PerfilPages />} />
      <Route path="/medico" element={<Dashboard />} />
      <Route path="/admin" element={<DashboardAdmin />} />
      <Route path="/calendario" element={<CalendarioCitas />} />
      <Route path="/pacientes" element={<PacientesDashboard />} />
      <Route path="/doctores" element={<DoctorDashboard />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default Rutas;

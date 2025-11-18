import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        setIsAuthorized(false);
        return;
      }

      const userRole = user?.rol?.nombre?.toLowerCase();
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        toast.error("No tienes permisos para acceder a esta página");
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [allowedRoles, location.pathname]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.rol?.nombre?.toLowerCase();
    
    // Redirigir según el rol del usuario
    const roleRouteMap = {
      paciente: "/cliente",
      doctor: "/medico",
      admin: "/admin",
      administrador: "/admin",
    };

    const redirectPath = roleRouteMap[userRole] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;


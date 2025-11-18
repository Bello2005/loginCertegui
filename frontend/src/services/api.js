// URL base de tu backend
export const BASE_URL = "http://localhost:3000/";

// Helper de Axios
import axios from "axios";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para silenciar errores 404 en endpoints específicos
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silenciar errores 404 para el endpoint de usuario/me
    if (
      error.response?.status === 404 &&
      (error.config?.url?.includes("/api/usuario/me") || 
       error.config?.url?.includes("usuario/me"))
    ) {
      // Crear un error personalizado silencioso
      const silentError = new Error("Usuario no encontrado (silencioso)");
      silentError.silent = true;
      silentError.response = error.response;
      silentError.config = error.config;
      // No loguear este error
      return Promise.reject(silentError);
    }
    return Promise.reject(error);
  }
);

// Interceptor de request para evitar mostrar errores en consola
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Helper para rutas con /api/
export const apiRoutes = {
  get: (url) => api.get(`api/${url}`),
  post: (url, data) => api.post(`api/${url}`, data),
  put: (url, data) => api.put(`api/${url}`, data),
  delete: (url) => api.delete(`api/${url}`),
};

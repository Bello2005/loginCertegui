// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles,
  Shield,
  UserCircle2
} from "lucide-react";
import { api } from "../services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Validación en tiempo real del email
  useEffect(() => {
    if (email && !email.includes("@")) {
      setEmailError("El correo debe contener @");
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Formato de correo inválido");
    } else {
      setEmailError("");
    }
  }, [email]);

  // Validación en tiempo real de la contraseña
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("El correo es requerido");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Formato de correo inválido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("login", { email, password });

      if (!data || !data.token || !data.user) {
        toast.error("Respuesta inválida del servidor.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const roleRouteMap = {
        paciente: "/cliente",
        doctor: "/medico",
        admin: "/admin",
        administrador: "/admin",
      };

      const roleName = data.user?.rol?.nombre?.toLowerCase();
      const redirectPath = roleRouteMap[roleName];

      if (redirectPath) {
        toast.success(`¡Bienvenido, ${data.user.nombre}!`);
        // Pequeño delay para mostrar el toast antes de redirigir
        setTimeout(() => {
          navigate(redirectPath);
        }, 500);
      } else {
        toast.warning("Rol no reconocido. Contacte al administrador.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error en login:", error);

      if (error.response?.status === 401) {
        toast.error("Correo o contraseña incorrectos.");
        setPasswordError("Credenciales incorrectas");
      } else if (error.response?.status === 400) {
        toast.error("Por favor completa todos los campos.");
      } else if (error.code === 'ECONNREFUSED' || !error.response) {
        toast.error("No se pudo conectar al servidor. Verifica que el backend esté corriendo.");
      } else {
        toast.error(`Error: ${error.response?.data?.message || "Error en el servidor. Intenta nuevamente."}`);
      }
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 dark:border-gray-700/50"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Header con logo */}
          <motion.div
            className="flex flex-col items-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="relative mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full blur-lg opacity-50"></div>
              <UserCircle2 className="relative text-6xl md:text-7xl text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
              variants={itemVariants}
            >
              ortho&mas
            </motion.h1>
            
            <motion.p
              className="text-gray-600 dark:text-gray-400 text-sm md:text-base text-center flex items-center gap-2"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4" />
              Bienvenido al sistema de citas médicas
            </motion.p>
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={itemVariants}
          >
            {/* Campo Email */}
            <motion.div
              variants={itemVariants}
              className="space-y-2"
            >
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 transition-colors ${
                      focusedField === "email"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                    emailError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : focusedField === "email"
                      ? "border-indigo-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  } focus:outline-none`}
                />
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <span>⚠</span> {emailError}
                </motion.p>
              )}
            </motion.div>

            {/* Campo Contraseña */}
            <motion.div
              variants={itemVariants}
              className="space-y-2"
            >
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-colors ${
                      focusedField === "password"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                    passwordError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : focusedField === "password"
                      ? "border-indigo-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <span>⚠</span> {passwordError}
                </motion.p>
              )}
            </motion.div>

            {/* Link de olvidé contraseña */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end"
            >
              <Link
                to="#"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </motion.div>

            {/* Botón de submit */}
            <motion.button
              type="submit"
              disabled={loading || !!emailError || !!passwordError}
              variants={itemVariants}
              whileHover={!loading && !emailError && !passwordError ? { scale: 1.02 } : {}}
              whileTap={!loading && !emailError && !passwordError ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || emailError || passwordError
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="my-6 flex items-center"
          >
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">o</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </motion.div>

          {/* Link de registro */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              ¿No tienes una cuenta?
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              <UserCircle2 className="w-4 h-4" />
              Crear una cuenta
            </Link>
          </motion.div>

          {/* Badge de seguridad */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <Shield className="w-4 h-4" />
            <span>Conexión segura y encriptada</span>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 ortho&mas. Todos los derechos reservados.
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default LoginPage;

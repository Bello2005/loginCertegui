// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Sparkles,
  Shield,
  UserCircle2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { api } from "../services/api";

const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Validación en tiempo real
  useEffect(() => {
    const newErrors = {};

    if (nombre && nombre.length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (apellido && apellido.length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    if (correo && !correo.includes("@")) {
      newErrors.correo = "El correo debe contener @";
    } else if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    if (password && password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
  }, [nombre, apellido, correo, password, confirmPassword]);

  const validateForm = () => {
    const newErrors = {};

    if (!nombre || nombre.length < 2) {
      newErrors.nombre = "El nombre es requerido (mínimo 2 caracteres)";
    }

    if (!apellido || apellido.length < 2) {
      newErrors.apellido = "El apellido es requerido (mínimo 2 caracteres)";
    }

    if (!correo) {
      newErrors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("register", {
        nombre,
        apellido,
        correo,
        password,
      });

      if (data.success) {
        toast.success("¡Cuenta creada exitosamente! Redirigiendo al login...");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(data.message || "Error al registrar usuario");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error en registro:", error);

      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Datos inválidos. Verifica la información.");
      } else if (error.response?.status === 409) {
        toast.error("Este correo ya está registrado. Intenta con otro.");
        setErrors({ ...errors, correo: "Este correo ya está en uso" });
      } else if (error.code === 'ECONNREFUSED' || !error.response) {
        toast.error("No se pudo conectar al servidor. Verifica que el backend esté corriendo.");
      } else {
        toast.error(error.response?.data?.message || "Error al registrar usuario. Intenta nuevamente.");
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
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getFieldStatus = (fieldName) => {
    if (errors[fieldName]) return "error";
    if (focusedField === fieldName) return "focused";
    return "default";
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
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-lg opacity-50"></div>
              <UserPlus className="relative text-6xl md:text-7xl text-green-600 dark:text-green-400" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2"
              variants={itemVariants}
            >
              Crear Cuenta
            </motion.h1>

            <motion.p
              className="text-gray-600 dark:text-gray-400 text-sm md:text-base text-center flex items-center gap-2"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4" />
              Regístrate para acceder al sistema de citas
            </motion.p>
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={itemVariants}
          >
            {/* Campo Nombre */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User
                    className={`h-5 w-5 transition-colors ${
                      getFieldStatus("nombre") === "focused"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onFocus={() => setFocusedField("nombre")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.nombre
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : getFieldStatus("nombre") === "focused"
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                  } focus:outline-none`}
                />
                {nombre && !errors.nombre && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.nombre && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.nombre}
                </motion.p>
              )}
            </motion.div>

            {/* Campo Apellido */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="apellido"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Apellido
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User
                    className={`h-5 w-5 transition-colors ${
                      getFieldStatus("apellido") === "focused"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="apellido"
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  onFocus={() => setFocusedField("apellido")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.apellido
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : getFieldStatus("apellido") === "focused"
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                  } focus:outline-none`}
                />
                {apellido && !errors.apellido && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.apellido && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.apellido}
                </motion.p>
              )}
            </motion.div>

            {/* Campo Email */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="correo"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 transition-colors ${
                      getFieldStatus("correo") === "focused"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="correo"
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  onFocus={() => setFocusedField("correo")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.correo
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : getFieldStatus("correo") === "focused"
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                  } focus:outline-none`}
                />
                {correo && !errors.correo && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.correo && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.correo}
                </motion.p>
              )}
            </motion.div>

            {/* Campo Contraseña */}
            <motion.div variants={itemVariants} className="space-y-2">
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
                      getFieldStatus("password") === "focused"
                        ? "text-green-600 dark:text-green-400"
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
                  autoComplete="new-password"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : getFieldStatus("password") === "focused"
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
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
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Campo Confirmar Contraseña */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-colors ${
                      getFieldStatus("confirmPassword") === "focused"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : getFieldStatus("confirmPassword") === "focused"
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                      : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                  } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                  <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            {/* Botón de submit */}
            <motion.button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              variants={itemVariants}
              whileHover={!loading && Object.keys(errors).length === 0 ? { scale: 1.02 } : {}}
              whileTap={!loading && Object.keys(errors).length === 0 ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-6 ${
                loading || Object.keys(errors).length > 0
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 hover:from-green-700 hover:via-emerald-700 hover:to-blue-700 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Registrando...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear cuenta
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

          {/* Link de login */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              ¿Ya tienes una cuenta?
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              <UserCircle2 className="w-4 h-4" />
              Iniciar sesión
            </Link>
          </motion.div>

          {/* Badge de seguridad */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <Shield className="w-4 h-4" />
            <span>Datos protegidos y encriptados</span>
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

export default RegisterPage;

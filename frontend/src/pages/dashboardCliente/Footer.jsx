// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from "lucide-react";

const Footer = () => {
  const links = [
    { name: "Política de Privacidad", to: "/privacy" },
    { name: "Términos de Servicio", to: "/terms" },
    { name: "Soporte", to: "/support" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full py-6 border-t border-gray-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Derechos de Autor */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 order-2 md:order-1">
          <Sparkles className="w-4 h-4" />
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              ortho&mas
            </span>
            . Todos los derechos reservados.
          </p>
          <Heart className="w-4 h-4 text-red-500" />
        </div>

        {/* Enlaces Utilitarios */}
        <div className="flex space-x-4 order-1 md:order-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

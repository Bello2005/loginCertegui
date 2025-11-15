// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10 py-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center"
    >
      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
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
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Versión 1.0.0
      </p>
    </motion.footer>
  );
};

export default Footer;

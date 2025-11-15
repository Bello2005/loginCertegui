// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const utilityLinks = [
    { label: "¿Necesitas ayuda?", to: "/support" },
    { label: "Política de Privacidad", to: "/privacy" },
    { label: "Términos de Servicio", to: "/terms" },
  ];

  return (
    <footer className="w-full mt-10 py-6 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm">
        {/* Derechos de Autor */}
        <p className="mb-3 md:mb-0 text-gray-600 dark:text-gray-400 order-2 md:order-1 text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-brand dark:text-brand-light">
            ortho&mas
          </span>
          . Todos los derechos reservados.
        </p>

        {/* Enlaces Utilitarios */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 order-1 md:order-2">
          {utilityLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-light transition-colors duration-150 underline-offset-4 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

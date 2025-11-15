import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProximaCita from "./ProximaCita";
import AccionesRapidas from "./AccionesRapidas";
import HistorialReciente from "./HistorialReciente";
import Footer from "./Footer";

const DashboardCliente = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex flex-col">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 p-6 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col w-full"
          >
            <motion.div variants={containerVariants}>
              <Header />
            </motion.div>
            
            <div className="flex flex-col gap-8 mt-6">
              <motion.div
                variants={containerVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProximaCita />
              </motion.div>

              <motion.section
                variants={containerVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-8"
              >
                <HistorialReciente />
              </motion.section>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardCliente;

import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SegmentedButtons from "./SegmentedButtons";
import DoctorAppointmentsDashboard from "./DoctorAppointmentsDashboard";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 transition-colors duration-300">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          {/* Header */}
          <motion.div
            variants={containerVariants}
            className="p-6 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md"
          >
            <Header />
          </motion.div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            <motion.div
              variants={containerVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SegmentedButtons />
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DoctorAppointmentsDashboard doctorId={user?.id} />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;

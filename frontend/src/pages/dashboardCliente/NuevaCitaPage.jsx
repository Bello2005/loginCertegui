import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import NuevaCita from "./NuevaCita/NuevaCita";


const NuevaCitaPage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 p-6 md:p-8">
          <div className="flex flex-col w-full">
            <Header />
            <div className="flex flex-col gap-8 mt-6">
              <NuevaCita />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default NuevaCitaPage;

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Perfil from "./Perfil";

const PerfilPages = () => {

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="flex flex-col w-full">
            <Header />
            <div className="flex flex-col gap-8 mt-6">
                <Perfil />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PerfilPages;

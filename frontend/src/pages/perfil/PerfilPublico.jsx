import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PerfilPublicoView from "../../components/perfil/PerfilPublicoView";

// Pagina publica de un perfil de estudiante (enlace compartible). Las
// empresas reutilizaran esta misma vista al consultar perfiles.
export default function PerfilPublico() {
  const { idEstudiante } = useParams();

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1280px] mx-auto pt-24 pb-space-xl px-gutter-mobile lg:px-gutter-desktop">
        <PerfilPublicoView key={idEstudiante} idEstudiante={idEstudiante} />
      </main>
      <Footer />
    </div>
  );
}

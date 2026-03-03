import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { StockMovementProvider } from "@/contexte/StockMovementContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="min-h-screen flex bg-white">
        {/* Navigation latérale */}
        <Sidebar />

        {/* Zone centrale */}
        <div className="flex-1 flex flex-col ml-64">
          {/* Header */}
          <Header />

          {/* Contenu principal */}
          <main
            className="flex-1 p-6 overflow-y-auto"
            role="main"
            aria-label="Contenu principal de l'administration"
          >
            <StockMovementProvider>
              {children}
            </StockMovementProvider>
          </main>
        </div>
      </section>
    </>
  );
}

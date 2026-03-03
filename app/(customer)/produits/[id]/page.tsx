import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import ProductClient from "./ProductClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    throw new Error("Params manquant dans la page produit");
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: "/produits" },
    { label: "Détails" },
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />

        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* On passe JUSTE l'id */}
            <ProductClient productId={id} />
          </div>
        </section>
      </div>
    </main>
  );
}

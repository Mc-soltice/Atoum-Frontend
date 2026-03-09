// app/page.tsx (ou votre page d'accueil)
import Hero from "@/components/customer/Hero";
import ProductGrid from "@/components/customer/products/ProductGrid";
import ProductGridSkeleton from "@/components/customer/products/ProductGridSkeleton";
import Carousel3D from "@/components/customer/PromoCarousel";
import { getProducts } from "@/server/product.server";
import { Suspense } from "react";

export default async function Home() {
  const products = await getProducts();

  const promoProducts = products.filter(
    (product) => product.is_promotional || product.is_is_promotional
  );

  return (
    <>
      {/* Hero masqué sur mobile, visible sur desktop */}
      <div className="hidden md:block">
        <Hero />
      </div>
      <main className="w-full flex justify-center px-4">
        {/* COLONNE MAÎTRESSE */}
        <div className="w-full max-w-7xl flex flex-col gap-15">
          {/* CAROUSEL PROMO - affiché uniquement s'il y a des produits en promotion */}
          {promoProducts.length > 0 && (
            <section className="w-full">
              {/* Passage direct des produits sans contexte */}
              <Carousel3D
                products={promoProducts}
                autoPlay
                interval={4000}
              />
            </section>
          )}

          {/* PRODUITS */}
          <section className="w-full">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid initialProducts={products} />
            </Suspense>
          </section>
        </div>
      </main>
    </>
  );
}
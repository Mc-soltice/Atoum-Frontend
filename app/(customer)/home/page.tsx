// app/(customer)/home/page.tsx
import Hero from "@/components/customer/Hero";
import ProductGrid from "@/components/customer/products/ProductGrid";
import ProductGridSkeleton from "@/components/customer/products/ProductGridSkeleton";
import PromoBanner from "@/components/customer/products/promotions/PromoBanner";
import CarouselP from "@/components/customer/PromoCarousel";

import { getProducts } from "@/server/product.server";
import { Suspense } from "react";

// app/(customer)/home/page.tsx
export default async function Home() {
  const products = await getProducts();
  const promoProducts = products.filter(
    (product) => product.is_promotional || product.is_is_promotional
  );

  return (
    <div className="flex flex-col gap-15">
      <Hero /> {/* Hero prend toute la largeur */}
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-7xl flex flex-col gap-8">
          {/* Le reste du contenu */}
          {promoProducts.length > 0 && (
            <section className="w-full">
              <PromoBanner />
              <CarouselP slides={promoProducts} />
            </section>
          )}

          <section className="w-full">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid initialProducts={products} />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}
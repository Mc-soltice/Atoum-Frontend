"use client";

import Hero from "@/components/customer/Hero";
import ProductGrid from "@/components/customer/products/ProductGrid";
import Carousel3D from "@/components/customer/PromoCarousel";
import { useProducts } from "@/contexte/ProductContext";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { products, fetchProducts } = useProducts();

  // Charger les produits au montage
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtrer les produits en promotion
  const promoProducts = useMemo(() => {
    return products.filter(
      (product) => product.is_promotional || product.is_is_promotional,
    );
  }, [products]);

  return (
    <>
      {/* Hero masqué sur mobile, visible sur desktop */}
      <div className="hidden md:block">
        <Hero />
      </div>
      <main className="w-full flex justify-center px-4">
        {/* COLONNE MAÎTRESSE */}
        <div className="w-full max-w-7xl flex flex-col gap-15">
          {/* HERO */}
          <section className="w-full mt-2"></section>

          {/* CAROUSEL PROMO - affiché uniquement s'il y a des produits en promotion */}
          {promoProducts.length > 0 && (
            <section className="w-full">
              <Carousel3D products={promoProducts} autoPlay interval={4000} />
            </section>
          )}

          {/* PRODUITS */}
          <section className="w-full">
            <ProductGrid />
          </section>
        </div>
      </main>
    </>
  );
}
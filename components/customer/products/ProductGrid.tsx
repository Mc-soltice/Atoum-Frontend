"use client";

import AnimatedContent from "@/components/ui/AnimatedContent";
import { Product } from "@/types/product";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

interface Props {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: Props) {
  const products = initialProducts;
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // 🔹 Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  }, [products, currentPage]);

  // 🔹 Calcul du nombre total de pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleCartClick = () => {
    console.log("Ouvrir le panier");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-5 mb-5">
      {/* Bulle de navigation animée */}
      <AnimatedContent
        direction="vertical"
        distance={30}
        duration={0.6}
        delay={0.1}
        threshold={0.2}
      >
        <div className="flex gap-4 md:gap-6">
          {/* Bulle "Nos produits" */}
          <Link href="/produits" className="group relative">
            <div className="relative">
              {/* Effet de glow avec le dégradé */}
              <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-linear-to-t from-[#558B2F] to-[#8BC34A]" />

              {/* Bulle principale */}
              <div className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-5 md:px-6 py-2 sm:py-3 bg-white rounded-full shadow-md sm:shadow-lg border border-gray-100 hover:border-[#8BC34A] transition-all duration-300 hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 max-w-full">
                {/* Icône */}
                <div className="relative shrink-0">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#558B2F]" />
                  <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 animate-ping bg-[#558B2F]" />
                </div>

                {/* Texte */}
                <span className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base group-hover:text-[#8BC34A] transition-colors duration-300 truncate">
                  Découvrez notre grande variété de produits
                </span>

                {/* Badge avec dégradé */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-md sm:shadow-lg bg-linear-to-t from-[#558B2F] to-[#8BC34A]">
                  {products.length}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </AnimatedContent>

      {/* Grille de produits avec animation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-3">
        {paginatedProducts.map((product, index) => (
          <AnimatedContent
            key={product.id}
            direction="vertical"
            distance={50}
            duration={0.5}
            delay={index * 0.05}
            threshold={0.1}
            scale={0.95}
          >
            <ProductCard product={product} onCartClick={handleCartClick} />
          </AnimatedContent>
        ))}
      </div>

      {/* Pagination animée */}
      {totalPages > 1 && (
        <AnimatedContent
          direction="vertical"
          distance={40}
          duration={0.6}
          delay={0.3}
          threshold={0.2}
        >
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                px-4 py-2 rounded-lg border transition-all duration-300
                ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-gray-300 hover:border-[#8BC34A] hover:text-[#558B2F] hover:shadow-md"
                }
              `}
            >
              Précédent
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`
                    w-10 h-10 rounded-lg border transition-all duration-300
                    ${
                      currentPage === page
                        ? "bg-linear-to-t from-[#558B2F] to-[#8BC34A] text-white border-[#558B2F] shadow-md"
                        : "border-gray-300 hover:border-[#8BC34A] hover:text-[#8BC34A]"
                    }
                  `}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                px-4 py-2 rounded-lg border transition-all duration-300
                ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-gray-300 hover:border-[#8BC34A] hover:text-[#558B2F] hover:shadow-md"
                }
              `}
            >
              Suivant
            </button>
          </div>
        </AnimatedContent>
      )}

      {/* Message si aucun produit avec animation */}
      {paginatedProducts.length === 0 && (
        <AnimatedContent
          direction="vertical"
          distance={30}
          duration={0.5}
          threshold={0.1}
        >
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit disponible</p>
          </div>
        </AnimatedContent>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/product";

interface Props {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: Props) {

  const products = (initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 10;


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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <div className="space-y-8 mb-5">
      {/* Bulles de navigation */}
      <div className="flex gap-4 md:gap-6">
        {/* Bulle "Nos produits" */}
        <Link
          href="/produits"
          className="group relative"
        >
          <div className="relative">
            {/* Effet de glow */}
            <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

            {/* Bulle principale */}
            <div className="relative flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100 hover:border-amber-500 transition-all duration-300 hover:shadow-xl hover:scale-105">
              {/* Icône animée */}
              <div className="relative">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div className="absolute inset-0 bg-amber-500 rounded-full blur-md opacity-0 group-hover:opacity-50 animate-ping" />
              </div>

              {/* Texte */}
              <span className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                Nos produits
              </span>

              {/* Petit indicateur de quantité */}
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {products.length}
              </div>
            </div>
          </div>
        </Link>

        {/* Bulle "Nos promotions" */}
        <Link
          href="/promotions"
          className="group relative"
        >
          <div className="relative">
            {/* Effet de glow */}
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

            {/* Bulle principale */}
            <div className="relative flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:scale-105">
              {/* Icône animée */}
              <div className="relative">
                <Tag className="h-5 w-5 text-emerald-500" />
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-0 group-hover:opacity-50 animate-ping" />
              </div>

              {/* Texte */}
              <span className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                Nos promotions
              </span>

              {/* Petit indicateur "Nouveau" */}
              <div className="absolute -top-2 -right-2 bg-linear-to-r from-amber-500 to-emerald-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-pulse">
                🔥
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onCartClick={handleCartClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              px-4 py-2 rounded-lg border transition-all duration-300
              ${currentPage === 1
                ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
                : 'border-gray-300 hover:border-amber-500 hover:text-amber-600 hover:shadow-md'
              }
            `}
          >
            Précédent
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`
                  w-10 h-10 rounded-lg border transition-all duration-300
                  ${currentPage === page
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                    : 'border-gray-300 hover:border-amber-500 hover:text-amber-600'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              px-4 py-2 rounded-lg border transition-all duration-300
              ${currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
                : 'border-gray-300 hover:border-amber-500 hover:text-amber-600 hover:shadow-md'
              }
            `}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Message si aucun produit */}
      {paginatedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun produit disponible</p>
        </div>
      )}
    </div>
  );
}
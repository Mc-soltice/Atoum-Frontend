"use client";

import ProductImage from "@/components/admin/produit/ProductImage";
import { useCart } from "@/contexte/panier/CartContext";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface Props {
  product: Product;
  onCartClick?: () => void;
}

export default function ProductCard({ product, onCartClick }: Props) {
  const isAvailable = product.stock > 0;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addToCart(product, 1);

    // Ouvre le slider si la fonction est fournie
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl active:scale-[0.99] flex flex-col">

      {/* Barre de progression au scroll */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-100 z-20">
        <div className="h-full bg-linear-to-r from-amber-500 to-emerald-500 w-0 group-hover:w-full transition-all duration-1000 ease-out" />
      </div>

      {/* Image avec zoom dynamique */}
      <Link
        href={`/produits/${product.id}`}
        className="relative aspect-square w-full overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/5 transition-colors duration-300 z-10" />
        <ProductImage
          src={product.main_image}
          alt={product.name}
          className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Badge animé */}
        {isAvailable && (
          <div className="absolute top-3 left-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-emerald-600 border border-white/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                En stock
              </div>
            </div>
          </div>
        )}

        {/* Indicateur de swipe */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <svg className="w-4 h-4 text-gray-600 animate-slide-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Contenu avec animations de texte */}
      <div className="p-4 flex flex-col gap-3">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium tracking-wide flex items-center gap-2">
            <span className="w-4 h-px bg-amber-500 group-hover:w-6 transition-all duration-300" />
            {product.category?.name}
          </p>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:translate-x-1 transition-transform duration-300">
            {product.name}
          </h3>
        </div>

        {/* Prix avec compteur */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1 overflow-hidden">
            <span className="text-xl font-bold text-amber-600 tabular-nums">
              {product.price.toLocaleString()}
            </span>
            <span className="text-xl text-gray-400">€</span>
          </div>

          {/* Bouton avec effet de remplissage */}
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`
          relative overflow-hidden rounded-full
          transition-all duration-300
          ${isAvailable
                ? 'hover:scale-105 active:scale-95'
                : 'opacity-30 cursor-not-allowed'
              }
        `}
          >
            <div className={`
          relative px-4 py-2 text-sm font-medium flex items-center gap-2
          ${isAvailable
                ? 'text-amber-600 group-hover:text-white'
                : 'text-gray-400'
              }
        `}>
              <ShoppingBag className="h-4 w-4" />
              <span>Ajouter</span>

              {/* Remplissage au survol */}
              {isAvailable && (
                <div className="absolute inset-0 bg-amber-500 -z-10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

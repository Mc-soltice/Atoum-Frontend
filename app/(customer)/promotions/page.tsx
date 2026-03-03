"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { useProducts } from "@/contexte/ProductContext";
import { useCart } from "@/contexte/panier/CartContext";
import CartSlider from "@/components/customer/productCategorie/CartSlider";
import ProductCard from "@/components/customer/products/ProductCard";

import { Search } from "lucide-react";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Promotions", href: "/promotions" },
];

export default function PromotionsPage() {
  const router = useRouter();
  const { products, loading, fetchProducts } = useProducts();
  const { addToCart } = useCart();
  const [isCartSliderOpen, setIsCartSliderOpen] = useState(false);
  const [promoProducts, setPromoProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) => product.is_promotional === true);
      setPromoProducts(filtered);
    }
  }, [products]);

  // Filtrer les produits en promotion par recherche
  const filteredPromoProducts = searchQuery.trim()
    ? promoProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : promoProducts;

  const openCartSlider = () => setIsCartSliderOpen(true);
  const closeCartSlider = () => setIsCartSliderOpen(false);
  const handleConsultProducts = () => router.push("/produits");

  // ================= LOADER =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner size="35" speed="0.9" color="#f59e0b" />
        <span className="ml-3">Chargement des promotions</span>
      </div>
    );
  }

  const hasPromotions = promoProducts.length > 0;

  return (
    <div className="min-h-screen bg-white lg:px-50">
      {/* En-tête avec fil d'ariane */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={breadcrumbs} />

          {/* Barre de recherche - seulement si des promotions existent */}
          {hasPromotions && (
            <div className="mt-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans les promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Boutons actions mobile */}
          <div className="mt-4 flex items-center justify-between md:hidden">
            <div className="text-sm text-gray-600">
              {hasPromotions
                ? `${filteredPromoProducts.length} promotion${filteredPromoProducts.length > 1 ? 's' : ''}`
                : "Aucune promotion"
              }
            </div>

            {/* Bouton panier mobile */}
            <button
              onClick={openCartSlider}
              className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg
                       hover:from-amber-600 hover:to-amber-700 transition-colors shadow-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">Voir panier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {!hasPromotions ? (
          // ================= MESSAGE AUCUNE PROMOTION =================
          <div className="bg-white rounded-xl p-8 md:p-12 text-center border border-gray-200 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              En attendant les prochaines promotions...
            </h2>

            <p className="text-gray-600 mb-8 text-lg">
              Nous préparons de nouvelles offres exceptionnelles pour vous.
              En attendant, découvrez tous nos produits naturels et de qualité.
            </p>

            <button
              onClick={handleConsultProducts}
              className="px-8 py-4 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl 
                       hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform 
                       hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Consulter tous nos produits
            </button>

            {/* Icônes décoratives */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Produits bio</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Prix justes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Livraison rapide</p>
              </div>
            </div>
          </div>
        ) : (
          // ================= AFFICHAGE DES PRODUITS EN PROMOTION =================
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Barre latérale avec infos */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-6 space-y-6">
                {/* En-tête promotions */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Promotions
                    </h2>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Effacer
                      </button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-sm text-gray-600 mb-4">
                    <p className="font-medium text-red-600 mb-1">
                      {filteredPromoProducts.length} produit{filteredPromoProducts.length > 1 ? 's' : ''} en promo
                    </p>
                    <p>sur {promoProducts.length} total</p>
                  </div>

                  {/* Bouton panier desktop */}
                  <button
                    onClick={openCartSlider}
                    className="w-full py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-white 
                             font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                             transition-colors shadow-sm mt-3"
                  >
                    Voir mon panier
                  </button>
                </div>

                {/* Badge promotionnel */}
                <div className="bg-linear-to-br from-red-50 to-amber-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Offres limitées</p>
                      <p className="text-xs text-gray-600">Profitez-en maintenant</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConsultProducts}
                    className="w-full text-sm text-amber-600 hover:text-amber-700 font-medium 
                             flex items-center justify-center gap-1"
                  >
                    Voir tous nos produits
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1">
              {/* En-tête produits desktop */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Produits en promotion
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {filteredPromoProducts.length} produit{filteredPromoProducts.length > 1 ? 's' : ''} à prix réduits
                  </p>
                </div>

                {/* Actions desktop */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={openCartSlider}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-amber-600 
                             text-white rounded-lg hover:from-amber-600 hover:to-amber-700 
                             transition-colors shadow-sm"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Panier</span>
                  </button>
                </div>
              </div>

              {/* Grille de produits */}
              {filteredPromoProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPromoProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onCartClick={openCartSlider}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun résultat
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Aucune promotion ne correspond à votre recherche "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white 
                             font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                             transition-all shadow-md hover:shadow-lg"
                  >
                    Effacer la recherche
                  </button>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Slider du panier */}
      <CartSlider isOpen={isCartSliderOpen} onClose={closeCartSlider} />
    </div>
  );
}
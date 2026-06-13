"use client";

import CartSlider from "@/components/customer/productCategorie/CartSlider";
import ProductCard from "@/components/customer/products/ProductCard";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { useProducts } from "@/contexte/ProductContext";
import { useCart } from "@/contexte/panier/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import { Search } from "lucide-react";

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

  const calculateStockPercentage = () => {
    if (!products.length) return 0;

    const totalPromoStock = promoProducts.reduce((sum, product) => {
      return sum + (product.stock || 0);
    }, 0);

    const totalAllStock = products.reduce((sum, product) => {
      return sum + (product.stock || 0);
    }, 0);

    if (totalAllStock === 0) return 0;

    const percentage = (totalPromoStock / totalAllStock) * 100;

    return Math.min(percentage, 100);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) => product.is_promotional === true);
      setPromoProducts(filtered);
    }
  }, [products]);

  const filteredPromoProducts = searchQuery.trim()
    ? promoProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : promoProducts;

  const openCartSlider = () => setIsCartSliderOpen(true);
  const closeCartSlider = () => setIsCartSliderOpen(false);
  const handleConsultProducts = () => router.push("/produits");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <DotSpinner size="35" speed="0.9" color="#f59e0b" />
        <span className="ml-3 text-center">Chargement des promotions</span>
      </div>
    );
  }

  const hasPromotions = promoProducts.length > 0;

  return (
    <div className="min-h-screen  bg-linear-to-br from-amber-50/80 via-orange-50/60 to-rose-50/80">
      {/* En-tête avec fil d'ariane - Correction responsive */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 py-4 sm:py-6">
          <Breadcrumbs items={breadcrumbs} />

          {/* Section promotionnelle - Correction responsive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-amber-100">
              {/* Dégradés décoratifs - Masqués sur mobile */}
              <div className="hidden md:block absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-linear-to-br from-amber-100 to-rose-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              <div className="hidden md:block absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-linear-to-tr from-amber-100 to-orange-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                  {/* Partie gauche - Texte responsive */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-linear-to-r from-amber-500 to-rose-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6"
                    >
                      <span className="text-base sm:text-lg">🎁</span>
                      OFFRE SPÉCIALE
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
                    >
                      Ne manquez pas notre<br className="hidden sm:inline" />
                      <span className="bg-linear-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                        Grande Promotion
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-lg mx-auto lg:mx-0"
                    >
                      Profitez de remises exceptionnelles sur une sélection de produits naturels.
                      Offre valable jusqu'à épuisement des stocks.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
                    >
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium">Livraison offerte</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium">Satisfait ou remboursé</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Partie droite - Promotion responsive */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="flex-1 flex justify-center mt-4 lg:mt-0"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-rose-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>

                      <div className="relative bg-linear-to-br from-amber-400 to-rose-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3">
                          <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg">
                            <span className="text-xl sm:text-2xl">⚡</span>
                          </div>
                        </div>
                        <p className="text-white/80 text-xs sm:text-sm mb-2">Code promo</p>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 mb-3 sm:mb-4">
                          <code className="text-white font-mono text-base sm:text-xl font-bold tracking-wider">PROMO50</code>
                        </div>
                        <p className="text-white text-3xl sm:text-4xl font-bold mb-2">-50%</p>
                        <p className="text-white/80 text-xs sm:text-sm">sur votre première commande</p>
                        <div className="mt-3 sm:mt-4 h-px bg-white/30 my-3 sm:my-4"></div>
                        <p className="text-white/70 text-xs">*Offre valable 48h</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Barre de progression - Responsive */}
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="mt-6 sm:mt-8 pt-3 sm:pt-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 mb-2 gap-1 sm:gap-0">
                    <span>🔥 Plus que</span>
                    <span className="font-bold">{calculateStockPercentage().toFixed(0)}% des stocks disponibles</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateStockPercentage().toFixed(0)}%` }}
                      transition={{ delay: 0.9, duration: 1 }}
                      className="h-full bg-linear-to-r from-amber-500 to-rose-500 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Barre de recherche - Responsive */}
          {hasPromotions && (
            <div className="mt-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans les promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base 
                           border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                           focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Boutons actions mobile - Déjà assez responsive */}
          <div className="mt-4 flex items-center justify-between md:hidden">
            <div className="text-sm text-gray-600">
              {hasPromotions
                ? `${filteredPromoProducts.length} promotion${filteredPromoProducts.length > 1 ? 's' : ''}`
                : "Aucune promotion"
              }
            </div>

            <button
              onClick={openCartSlider}
              className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg
                       hover:from-amber-600 hover:to-amber-700 transition-colors shadow-sm text-sm"
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

      {/* Contenu principal - Responsive */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 py-6 sm:py-8">
        {!hasPromotions ? (
          // Message aucune promotion - Responsive
          <div className="bg-white rounded-xl p-6 sm:p-8 md:p-12 text-center border border-gray-200 max-w-2xl mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-red-400"
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

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              En attendant les prochaines promotions...
            </h2>

            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
              Nous préparons de nouvelles offres exceptionnelles pour vous.
              En attendant, découvrez tous nos produits naturels et de qualité.
            </p>

            <button
              onClick={handleConsultProducts}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold 
                       rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 
                       transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Consulter tous nos produits
            </button>

            {/* Icônes décoratives - Responsive */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">Produits bio</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">Prix justes</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">Livraison rapide</p>
              </div>
            </div>
          </div>
        ) : (
          // Affichage des produits en promotion - Responsive
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Barre latérale - Masquée sur mobile */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-6 space-y-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
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

                  <div className="text-sm text-gray-600 mb-4">
                    <p className="font-medium text-red-600 mb-1">
                      {filteredPromoProducts.length} produit{filteredPromoProducts.length > 1 ? 's' : ''} en promo
                    </p>
                    <p>sur {promoProducts.length} total</p>
                  </div>

                  <button
                    onClick={openCartSlider}
                    className="w-full py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-white 
                             font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                             transition-colors shadow-sm mt-3 text-sm"
                  >
                    Voir mon panier
                  </button>
                </div>

                <div className="bg-linear-to-br from-red-50 to-amber-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Offres limitées</p>
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
              {/* En-tête produits desktop - Masqué sur mobile car déjà visible */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Produits en promotion
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {filteredPromoProducts.length} produit{filteredPromoProducts.length > 1 ? 's' : ''} à prix réduits
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={openCartSlider}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-amber-600 
                             text-white rounded-lg hover:from-amber-600 hover:to-amber-700 
                             transition-colors shadow-sm text-sm"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Panier</span>
                  </button>
                </div>
              </div>

              {/* Grille de produits - Responsive : grid-cols-2 sur mobile, sm:grid-cols-3, md:grid-cols-3, lg:grid-cols-4 */}
              {filteredPromoProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredPromoProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onCartClick={openCartSlider}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 sm:p-8 text-center border border-gray-200">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Aucun résultat
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    Aucune promotion ne correspond à votre recherche "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white 
                             font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                             transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
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
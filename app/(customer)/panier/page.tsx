"use client";

import CartItemsList from "@/components/customer/paniers/cart/CartItemsList";
import CartSummary from "@/components/customer/paniers/cart/CartSummary";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { useCart } from "@/contexte/panier/CartContext"; // Importez useCart
import { useRouter } from "next/navigation";

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Panier", href: "/panier" },
];

export default function CartPage() {
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };
  // Utilisez le contexte du panier
  const { items, getTotalItems, clearCart } = useCart();

  // Transformez les items du contexte en format attendu par CartItemsList
  const cartItems = items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));

  const handleClearCart = () => {
    if (confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
      clearCart();
    }
  };

  const handleContinueShopping = () => {
    // Rediriger vers la page produits
    window.location.href = "/produits";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Header avec fil d'ariane */}
        <div className="mb-3 md:mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="w-full bg-linear-to-r from-amber-400 to-amber-600 text-white flex items-center justify-between px-6 py-4 mb-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Votre Panier
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-xl font-bold text-white">
                {getTotalItems()} {getTotalItems() > 1 ? "articles" : "article"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Liste des articles - occupe 2/3 sur desktop */}
          <div className="lg:col-span-2">
            <div className="space-y-4 sm:space-y-6">
              <CartItemsList items={cartItems} />

              {/* Message si panier vide */}
              {items.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-gray-400"
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
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez par ajouter des produits naturels à votre panier
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              )}

              {/* Actions supplémentaires (mobile only) */}
              {items.length > 0 && (
                <div className="flex flex-col gap-3 sm:hidden">
                  <button
                    onClick={handleContinueShopping}
                    className="w-full py-3 px-4 text-sm font-medium text-blue-600 
                             border border-blue-600 rounded-lg hover:bg-blue-50 
                             active:bg-blue-100 transition-colors"
                  >
                    Continuer mes achats
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="w-full py-3 px-4 text-sm font-medium text-red-600 
                             border border-red-600 rounded-lg hover:bg-red-50  
                             active:bg-red-100 transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Récapitulatif - fixé en haut sur mobile, sticky sur desktop */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <CartSummary onCheckout={handleCheckout} />

                {/* Boutons d'action desktop (cachés sur mobile car déjà présents) */}
                <div className="hidden sm:flex sm:flex-col sm:gap-3 mt-6">
                  <button
                    onClick={handleClearCart}
                    className="w-full py-3 px-4 text-sm font-medium text-red-600 
                             border border-red-600 rounded-lg hover:bg-red-50 
                             active:bg-red-100 transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommandations (seulement si panier non vide) */}
        {/* {items.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vous pourriez aussi aimer
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 group-hover:opacity-90 transition-opacity"></div>
                  <p className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                    Produit recommandé {item}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">12 000 €</p> */}

        {/* Bouton avec icône */}
        {/* <button className="mt-auto px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter
                  </button>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

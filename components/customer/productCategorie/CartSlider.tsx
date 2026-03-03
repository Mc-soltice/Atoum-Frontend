"use client";

import ProductImage from "@/components/admin/produit/ProductImage";
import { useCart } from "@/contexte/panier/CartContext";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSlider({ isOpen, onClose }: CartSliderProps) {
  const {
    items,
    getTotalItems,
    getSubtotal,
    getTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  // Empêche le scroll du body quand le slider est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Animation pour les articles qui entrent
  const getItemAnimationDelay = (index: number) => ({
    animationDelay: `${index * 0.05}s`,
  });

  return (
    <>
      {/* Overlay avec animation */}
      <div
        className={`
          fixed inset-0 z-50 lg:z-40 transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100 visible bg-black/50" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      {/* Slider avec animation */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 lg:z-50
          flex flex-col transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* En-tête avec animation */}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 
                   bg-linear-to-r from-amber-500 to-amber-600 text-white
                   transition-all duration-300"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
          }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag
              className="h-6 w-6"
              style={{ animation: "bounce 1s infinite" }}
            />
            <div>
              <h2 className="text-lg font-bold">Votre Panier</h2>
              <p className="text-sm text-amber-100">
                {totalItems} article{totalItems !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-all duration-200
                     hover:scale-110 active:scale-95"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenu avec animation de scroll */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full p-8 text-center"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "scale(1)" : "scale(0.9)",
                transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              }}
            >
              <div
                className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                <ShoppingBag className="h-12 w-12 text-amber-500" />
              </div>
              <h3
                className="text-lg font-semibold text-gray-900 mb-2"
                style={{
                  animation: "fadeIn 0.5s ease-out forwards",
                  animationDelay: "0.1s",
                  opacity: 0,
                }}
              >
                Votre panier est vide
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{
                  animation: "fadeIn 0.5s ease-out forwards",
                  animationDelay: "0.2s",
                  opacity: 0,
                }}
              >
                Commencez à ajouter des produits naturels à votre panier
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white 
                         font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                         transition-all duration-300 shadow-md hover:shadow-lg
                         hover:scale-105 active:scale-95"
                style={{
                  animation: "fadeIn 0.5s ease-out forwards",
                  animationDelay: "0.3s",
                  opacity: 0,
                }}
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <>
              {/* Liste des articles avec animation stagger */}
              <div className="p-4 space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.product.id}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200
                             hover:shadow-sm transition-all duration-300"
                    style={{
                      animation: "slideInRight 0.3s ease-out forwards",
                      opacity: 0,
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {/* Image avec effet de zoom */}
                    <div
                      className="relative h-16 w-16 rounded overflow-hidden shrink-0
                                   group-hover:scale-105 transition-transform duration-300"
                    >
                      <ProductImage
                        src={item.product.main_image}
                        alt={item.product.name}
                        className="object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-all duration-200
                                   p-1 hover:scale-110 active:scale-95"
                          aria-label={`Supprimer ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div
                          className="text-sm font-bold text-amber-600"
                          style={{ animation: "pulseOnce 0.5s ease-in-out" }}
                        >
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}{" "}
                          €
                        </div>

                        {/* Sélecteur quantité avec animations */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="h-6 w-6 rounded-full border flex items-center justify-center 
                                     hover:bg-gray-100 transition-all duration-200
                                     hover:scale-110 active:scale-95"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span
                            className="text-sm font-medium w-6 text-center"
                            style={{ animation: "bounceIn 0.5s ease-out" }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => addToCart(item.product, 1)}
                            className="h-6 w-6 rounded-full border flex items-center justify-center 
                                     hover:bg-gray-100 transition-all duration-200
                                     hover:scale-110 active:scale-95"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {item.product.price.toLocaleString()} P.U
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton vider le panier avec animation */}
              <div
                className="px-4"
                style={{
                  animation: "fadeIn 0.5s ease-out forwards",
                  animationDelay: "0.3s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <button
                  onClick={clearCart}
                  className="w-full py-2.5 text-red-600 font-medium border border-red-200 
                           rounded-lg hover:bg-red-50 transition-all duration-300
                           hover:shadow-md hover:scale-105 active:scale-95"
                >
                  Vider le panier
                </button>
              </div>
            </>
          )}
        </div>

        {/* Résumé et actions avec animation */}
        {items.length > 0 && (
          <div
            className="border-t border-gray-200 p-4 bg-white"
            style={{
              animation: "fadeIn 0.5s ease-out forwards",
              animationDelay: "0.4s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            {/* Résumé avec animation des montants */}
            <div className="space-y-2 mb-4">
              <div
                className="flex justify-between text-sm"
                style={{
                  animation: "slideUp 0.4s ease-out forwards",
                  animationDelay: "0.45s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <span className="text-gray-600">Sous-total</span>
                <span
                  className="font-medium"
                  style={{ animation: "countUp 0.6s ease-out" }}
                >
                  {subtotal.toLocaleString()} €
                </span>
              </div>

              <div
                className="flex justify-between text-sm"
                style={{
                  animation: "slideUp 0.4s ease-out forwards",
                  animationDelay: "0.5s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium text-emerald-600">
                  Calculée à l&apos;étape suivante
                </span>
              </div>

              <div
                className="border-t border-gray-200 pt-2 mt-2"
                style={{
                  animation: "slideUp 0.4s ease-out forwards",
                  animationDelay: "0.55s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span
                    className="text-xl font-bold text-amber-600"
                    style={{ animation: "pulseOnce 0.5s ease-in-out" }}
                  >
                    {getTotal().toLocaleString()} €
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons d'action avec animations */}
            <div className="space-y-3">
              <Link
                href="/panier"
                onClick={onClose}
                className="block w-full py-3 bg-linear-to-r from-amber-500 to-amber-600 
                         text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                         transition-all duration-300 shadow-md text-center
                         hover:shadow-lg hover:scale-105 active:scale-95"
                style={{
                  animation: "slideUp 0.4s ease-out forwards",
                  animationDelay: "0.6s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                Voir le panier complet
              </Link>

              <Link
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 
                         bg-linear-to-r from-green-500 to-emerald-500 text-white 
                         font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 
                         transition-all duration-300 shadow-md
                         hover:shadow-lg hover:scale-105 active:scale-95"
                style={{
                  animation: "slideUp 0.4s ease-out forwards",
                  animationDelay: "0.65s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <span>Passer commande</span>
                <ArrowRight
                  className="h-4 w-4"
                  style={{ animation: "bounceRight 1s infinite" }}
                />
              </Link>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-amber-600 font-medium border border-amber-600 
                         rounded-lg hover:bg-amber-50 transition-all duration-300
                         hover:shadow-md hover:scale-105 active:scale-95"
                style={{
                  animation: "slideUp 0.4s ease-out forwards",
                  animationDelay: "0.7s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useCart } from "@/contexte/panier/CartContext";
import { ArrowRight, Shield, Truck } from "lucide-react";
import Link from "next/link";

/**
 * Props du composant CartSummary
 * @property onCheckout - Fonction appelée lors du clic sur "Passer la commande"
 * @property showCheckoutButton - Afficher le bouton de commande
 */
interface CartSummaryProps {
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

/**
 * Composant de récapitulatif du panier
 * Affiche le détail des prix, options de livraison et bouton de commande
 */
export default function CartSummary({
  onCheckout,
  showCheckoutButton = true,
}: CartSummaryProps) {
  // ================= CONTEXTE PANIER =================
  const { items, getTotalItems, getSubtotal, getTotal, clearCart } = useCart();

  /**
   * Calcule le total des économies (produits en promo)
   * @returns Montant total économisé
   */
  const calculateSavings = (): number => {
    return items.reduce((total, item) => {
      const product = item.product;

      if (
        "originalPrice" in product &&
        typeof product.originalPrice === "number" &&
        typeof product.price === "number"
      ) {
        const savingPerItem = product.originalPrice - product.price;
        return total + savingPerItem * item.quantity;
      }

      return total;
    }, 0);
  };

  // ================= DONNÉES CALCULÉES =================
  const subtotal = getSubtotal();
  const total = getTotal();
  const totalItems = getTotalItems();
  const totalSavings = calculateSavings();

  return (
    <div className="sticky top-6">
      {/* ================= CARTE DE RÉCAPITULATIF ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* En-tête */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Récapitulatif de la commande
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
          </p>
        </div>

        {/* ================= DÉTAIL DES PRIX ================= */}
        <div className="p-4 space-y-3">
          {/* Sous-total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-semibold text-gray-900">
              {subtotal.toLocaleString()}€
            </span>
          </div>

          {/* Économies (si promotions) */}
          {totalSavings > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Économies</span>
              <span className="font-semibold text-emerald-600">
                -{totalSavings.toLocaleString()}€
              </span>
            </div>
          )}

          {/* Ligne séparatrice */}
          <div className="border-t border-gray-200 pt-3 mt-2"></div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-amber">Total</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {total.toLocaleString()}€
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOUTONS D'ACTION ================= */}
        {showCheckoutButton && (
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Bouton Commander */}
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className={`
                w-full py-3 px-4 rounded-xl  
                transition-all duration-300
                flex items-center justify-center gap-2
                ${items.length === 0
                  ? "text-gray-700 font-semibold border-2 border-orange cursor-not-allowed"
                  : "text-white font-semibold bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg"
                }
                  
              `}
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Lien Continuer les achats */}
            <Link
              href="/produits"
              className={`
                block w-full py-2.5 px-4 text-center rounded-xl
                bg-linear-to-r from-[#BBCB64] to-[#A4BB64] hover:from-[#A0B84F] hover:to-[#8FAE3F]
                text-white font-medium
                hover:border-gray-400 hover:bg-gray-50
                transition-colors duration-200
              `}
            >
              Continuer mes achats
            </Link>

            {/* Bouton Vider le panier */}
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className={`
                  w-full py-2.5 px-4 rounded-xl
                  border-2 border-red-200
                  text-red-600 font-medium
                  hover:border-red-300 hover:bg-red-50
                  transition-colors duration-200
                `}
              >
                Vider le panier
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= GARANTIES ET INFORMATIONS ================= */}
      <div className="mt-4 space-y-3">
        {/* Garanties */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <span>Livraison garantie</span>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="text-xs text-center text-gray-500 p-3 bg-gray-50 rounded-lg">
          <p>
            Les prix incluent la TVA. Livraison offerte à partir de 20 000 €
            d&apos;achat.
          </p>
        </div>
      </div>
    </div>
  );
}

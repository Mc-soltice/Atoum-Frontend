"use client";

import { useCart } from "@/contexte/panier/CartContext";
import { ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import DeliveryOptions from "./DeliveryOptions";

/**
 * Props du composant CartModal
 * @property modalId - ID du modal DaisyUI
 */
interface CartModalProps {
  modalId: string;
}

/**
 * Modal complet du panier
 * Affiche tous les articles, options de livraison et récapitulatif
 */
export default function CartModal({ modalId }: CartModalProps) {
  // ================= CONTEXTE PANIER =================
  const { items, getTotalItems, getTotal, clearCart } = useCart();

  // ================= ÉTATS LOCAUX =================
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Ferme le modal
   */
  const closeModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.close();
    setIsOpen(false);
  };

  /**
   * Ouvre le modal
   */
  const openModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.showModal();
    setIsOpen(true);
  };

  /**
   * Gère le passage en caisse
   * Redirige vers la page de commande
   */
  const handleCheckout = () => {
    closeModal();
    // Redirection vers la page de commande
    window.location.href = "/commande";
  };

  /**
   * Vide le panier après confirmation
   */
  const handleClearCart = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir vider votre panier ? Cette action est irréversible.",
      )
    ) {
      clearCart();
    }
  };

  // ================= EFFETS =================
  useEffect(() => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (!modal) return;

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    modal.addEventListener("show", handleOpen);
    modal.addEventListener("close", handleClose);

    return () => {
      modal.removeEventListener("show", handleOpen);
      modal.removeEventListener("close", handleClose);
    };
  }, [modalId]);

  return (
    <>
      {/* ================= BOUTON D'OUVERTURE DU MODAL ================= */}
      <button
        onClick={openModal}
        className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
        aria-label="Ouvrir le panier"
      >
        <ShoppingBag className="w-6 h-6" />
        {getTotalItems() > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              w-5 h-5
              bg-linear-to-r from-orange-500 to-amber-500
              text-white text-xs font-bold
              rounded-full flex items-center justify-center
            "
          >
            {getTotalItems()}
          </span>
        )}
      </button>

      {/* ================= MODAL DAISYUI ================= */}
      <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          {/* En-tête du modal */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  🛒 Votre Panier
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {getTotalItems()} article{getTotalItems() !== 1 ? "s" : ""} •{" "}
                  {getTotal().toLocaleString()} €
                </p>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={closeModal}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ================= CONTENU DU MODAL ================= */}
          <div className="overflow-y-auto h-[calc(90vh-120px)]">
            <div className="p-4 sm:p-6">
              {/* Panier vide */}
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Votre panier est vide
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Découvrez nos produits naturels et remplissez votre panier
                  </p>
                  <button
                    onClick={closeModal}
                    className="btn bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                  >
                    Découvrir les produits
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* ================= COLONNE GAUCHE : ARTICLES ================= */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Articles dans votre panier
                      </h4>
                      <button
                        onClick={handleClearCart}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Tout supprimer
                      </button>
                    </div>

                    {/* Liste des articles */}
                    <div className="space-y-4">
                      {items.map((item) => (
                        <CartItem
                          key={item.product.id}
                          product={item.product}  // ✅ Passez product au lieu de item
                          quantity={item.quantity} // ✅ Passez quantity séparément
                        />
                      ))}
                    </div>
                  </div>

                  {/* ================= COLONNE DROITE : RÉCAPITULATIF ================= */}
                  <div className="lg:col-span-1">
                    <div className="space-y-6">
                      {/* Options de livraison */}
                      <DeliveryOptions />

                      {/* Récapitulatif */}
                      <CartSummary
                        onCheckout={handleCheckout}
                        showCheckoutButton={true}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= PIED DE PAGE DU MODAL ================= */}
          {items.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total à payer</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getTotal().toLocaleString()} €
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="btn btn-outline btn-gray"
                  >
                    Continuer mes achats
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="btn bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                  >
                    Commander
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fond du modal (ferme au clic) */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal} aria-label="Fermer">
            Fermer
          </button>
        </form>
      </dialog>
    </>
  );
}

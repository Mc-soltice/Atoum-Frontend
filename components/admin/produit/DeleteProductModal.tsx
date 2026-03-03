"use client";

import type { Product } from "@/types/product";
import "ldrs/react/DotSpinner.css";
import { DotSpinner } from "ldrs/react";
import { useProducts } from "@/contexte/ProductContext"; // Import du contexte

interface DeleteProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onProductDeleted?: () => void;
}

/**
 * Modal pour confirmer la suppression d'un produit
 * Utilise le ProductContext pour la suppression
 */
export default function DeleteProductModal({
  isOpen,
  product,
  onClose,
  onProductDeleted,
}: DeleteProductModalProps) {
  // ✅ Utilisation du contexte Product
  const { deleteProduct, loading: contextLoading } = useProducts();

  // ✅ Gère la suppression du produit
  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.id);
      // ✅ Appeler sans argument si optionnel
      if (onProductDeleted) {
        onProductDeleted();
      }
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  if (!isOpen || !product) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-4">Supprimer le produit</h2>
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer le produit{" "}
          <strong>{product.name}</strong> ?
          <br />
          <span className="text-sm text-gray-600">
            Cette action est irréversible. Toutes les données associées à ce
            produit seront définitivement supprimées.
          </span>
        </p>
        <div className="modal-action">
          <button
            onClick={handleDelete}
            className="rounded-lg btn mb-4 text-white bg-slate-800"
            disabled={contextLoading}
            aria-label={`Confirmer la suppression de ${product.name}`}
          >
            {contextLoading ? (
              <DotSpinner size="20" speed="0.9" color="white" />
            ) : null}
            {contextLoading ? "Suppression..." : "Supprimer définitivement"}
          </button>
          <button
            className="btn"
            onClick={onClose}
            disabled={contextLoading}
            aria-label="Annuler la suppression"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

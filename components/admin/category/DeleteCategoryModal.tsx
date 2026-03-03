"use client";

import "ldrs/react/DotSpinner.css";
import { Trash2 } from "lucide-react";
import { DotSpinner } from "ldrs/react";
import type { Category } from "@/types/category";
import { useCategories } from "@/contexte/CategoryContext";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onCategoryDeleted: (id: number) => void;
}

/**
 * Modal pour confirmer la suppression d'une catégorie
 * Props :
 * - isOpen : contrôle l'ouverture du modal
 * - category : catégorie à supprimer
 * - onClose : fonction pour fermer le modal
 * - onCategoryDeleted : callback après suppression réussie
 * Bonnes pratiques :
 * - role="dialog" et aria-modal pour l'accessibilité
 * - Boutons clairement étiquetés
 * - Message de confirmation clair
 */
export default function DeleteCategoryModal({
  isOpen,
  category,
  onClose,
  onCategoryDeleted,
}: DeleteCategoryModalProps) {
  const { deleteCategory, loading } = useCategories();

  const handleDelete = async () => {
    if (!category) return;

    try {
      await deleteCategory(category.id);
      onCategoryDeleted(category.id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    } finally {
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-4">Supprimer la catégorie</h2>
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer la catégorie{" "}
          <strong>{category.name}</strong> ?
          <br />
          <span className="text-sm text-gray-600">
            Cette action est irréversible. Les produits associés à cette
            catégorie pourraient être affectés.
          </span>
        </p>
        <div className="modal-action">
          <button
            aria-label={`Confirmer la suppression de ${category.name}`}
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg btn mb-4 text-white bg-slate-800"
          >
            {loading ? (
              <DotSpinner size="20" speed="0.9" color="white" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {loading ? "Suppression..." : "Supprimer définitivement"}
          </button>

          <button
            className="btn"
            onClick={onClose}
            aria-label="Annuler la suppression"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import "ldrs/react/DotSpinner.css";
import { DotSpinner } from "ldrs/react";
import { useCategories } from "@/contexte/CategoryContext";
import type { Category, UpdateCategoryPayload } from "@/types/category";

interface EditCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onCategoryUpdated?: (updatedCategory: Category) => void;
}

/**
 * Modal pour éditer une catégorie existante
 * Utilise le contexte Category pour les opérations
 */
export default function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onCategoryUpdated,
}: EditCategoryModalProps) {
  // ✅ Utilise le contexte Category
  const { updateCategory } = useCategories();

  // ✅ État du formulaire
  const [form, setForm] = useState<UpdateCategoryPayload>({});
  const [loading, setLoading] = useState(false);

  // ✅ Initialise le formulaire avec les données de la catégorie
  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description,
      });
    }
  }, [category]);

  // ✅ Gère les changements dans les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    const hasChanges =
      form.name !== category.name || form.description !== category.description;

    if (!hasChanges) {
      console.log("Aucune modification détectée");
      onClose();
      return;
    }

    try {
      setLoading(true);
      const updated = await updateCategory(category.id, form); // récupère l'objet mis à jour
      onCategoryUpdated?.(updated); // ⚡ appelez le callback si défini
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    } finally {
      setLoading(false);
    }
  };

  if (!category || !isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">
            <h2 className="font-bold text-lg">Éditer la catégorie</h2>
          </legend>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="floating-label w-full">
              <span>Nom de la catégorie</span>
              <input
                name="name"
                value={form.name || category.name}
                onChange={handleChange}
                placeholder="Nom de la catégorie"
                className="input input-bordered outline-none rounded-lg w-full"
                required
              />
            </label>

            <label className="floating-label w-full">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description || category.description}
                onChange={handleChange}
                placeholder="Description de la catégorie"
                className="textarea textarea-bordered outline-none rounded-lg w-full"
                rows={3}
                required
              />
            </label>

            <div className="modal-action">
              <button
                type="submit"
                className="rounded-lg btn mb-4 text-white bg-slate-800"
                disabled={loading}
              >
                {loading ? (
                  <DotSpinner size="20" speed="0.9" color="white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
              <button
                type="button"
                className="btn rounded-lg"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
}

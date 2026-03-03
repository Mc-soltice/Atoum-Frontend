"use client";

import { categoryService } from "@/services/cat.service";
import type { Category, CreateCategoryPayload } from "@/types/category";
import { DotSpinner } from "ldrs/react";
import { Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (category: Category) => void;
}

/**
 * Modal pour ajouter une nouvelle catégorie
 * Props :
 * - isOpen : contrôle l'ouverture du modal
 * - onClose : fonction pour fermer le modal
 * - onCategoryAdded : callback après création réussie
 * Bonnes pratiques :
 * - Focus sur le premier champ
 * - aria-modal et role="dialog" pour l'accessibilité
 */
export default function AddCategoryModal({
  isOpen,
  onClose,
  onCategoryAdded,
}: AddCategoryModalProps) {
  // ✅ État initial du formulaire
  const initialForm: CreateCategoryPayload = {
    name: "",
    description: "",
  };

  const [form, setForm] = useState<CreateCategoryPayload>(initialForm);
  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true);
      const newCategory = await categoryService.create(form);
      onCategoryAdded(newCategory);
      setForm(initialForm); // Réinitialise le formulaire
      onClose();
      toast.success("Catégorie créée avec succès");
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      toast.error("Impossible de créer la catégorie");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">
            <h2 className="font-bold text-lg">Ajouter une catégorie</h2>
          </legend>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="floating-label w-full">
              <span>Nom de la catégorie</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom de la catégorie"
                className="input input-bordered outline-none rounded-lg w-full"
                required
                aria-required="true"
              />
            </label>

            <label className="floating-label w-full">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description de la catégorie"
                className="textarea textarea-bordered outline-none rounded-lg w-full"
                rows={3}
                required
                aria-required="true"
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
                {loading ? "Création..." : "Ajouter"}
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

"use client";

import "ldrs/react/Waveform.css";
import { Waveform } from "ldrs/react";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import { categoryService } from "@/services/cat.service";
import { CategoryProvider } from "@/contexte/CategoryContext";
import CategoriesTable from "@/components/admin/category/CategoriesTable";
import AddCategoryModal from "@/components/admin/category/AddCategoryModal";
import EditCategoryModal from "@/components/admin/category/EditCategoryModal";
import DeleteCategoryModal from "@/components/admin/category/DeleteCategoryModal";

/**
 * Page Admin Categories
 * Affiche la liste des catégories et permet de gérer CRUD via des modals
 * Structure identique à la page UsersPage
 * Bonnes pratiques SEO : titre de page, heading h1, aria labels
 */
export default function CategoriesPage() {
  // ✅ State pour gérer l'ouverture des modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Stocke la catégorie actuellement sélectionnée pour édition/suppression
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // ✅ État local pour la liste des catégories
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ État pour le chargement des données
  const [loading, setLoading] = useState(true);

  // ✅ useEffect : Récupère les catégories au montage du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true); // ✅ déclenche le loader
        const data = await categoryService.getAll(); // appel API
        setCategories(data); // succès → stocke les catégories
      } catch (err) {
        console.error("Erreur lors du chargement :", err); // erreur → log
      } finally {
        setLoading(false); // fin → arrête le loader
      }
    };

    fetchCategories();
  }, []);

  // ✅ Affiche un loader pendant le chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="black" />
        <span className="ml-3 text-gray-700">Chargement des categories...</span>
      </div>
    );
  }

  return (
    <CategoryProvider>
      <div className="p-6">
        {/* Titre de la page */}
        <h1 className="text-2xl font-bold mb-4">Gestion des Catégories</h1>

        {/* Bouton d'ajout d'une catégorie */}
        <button
          className="flex items-center justify-center gap-2 mb-6 px-6 py-2 rounded-lg font-medium text-white bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transition-all"
          onClick={() => setIsAddOpen(true)}
          aria-label="Ajouter une catégorie"
        >
          <PlusCircle className="w-5 h-5" />
          Ajouter une catégorie
        </button>

        {/* Table des catégories */}
        <CategoriesTable
          categories={categories}
          onEdit={(category) => {
            setSelectedCategory(category);
            setIsEditOpen(true);
          }}
          onDelete={(category) => {
            setSelectedCategory(category);
            setIsDeleteOpen(true);
          }}
        />

        {/* Modals pour CRUD */}
        <AddCategoryModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onCategoryAdded={(newCategory) =>
            setCategories([...categories, newCategory])
          }
        />

        <EditCategoryModal
          key={selectedCategory?.id}
          isOpen={isEditOpen}
          category={selectedCategory}
          onClose={() => setIsEditOpen(false)}
          onCategoryUpdated={(updatedCategory) =>
            setCategories(
              categories.map((c) =>
                c.id === updatedCategory.id ? updatedCategory : c,
              ),
            )
          }
        />

        <DeleteCategoryModal
          isOpen={isDeleteOpen}
          category={selectedCategory}
          onClose={() => setIsDeleteOpen(false)}
          onCategoryDeleted={(id) =>
            setCategories(categories.filter((c) => c.id !== id))
          }
        />
      </div>
    </CategoryProvider>
  );
}

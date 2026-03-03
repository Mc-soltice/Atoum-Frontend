"use client";

import Filter from "@/components/admin/Filter";
import type { Category } from "@/types/category";
import { useEffect, useState } from "react";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

/**
 * Composant pour afficher la table des catégories
 * Gère le filtrage et l'affichage des données
 * Props :
 * - categories : liste des catégories à afficher
 * - onEdit : callback pour éditer une catégorie
 * - onDelete : callback pour supprimer une catégorie
 */
export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  // ✅ État pour les catégories filtrées
  const [filteredCategories, setFilteredCategories] =
    useState<Category[]>(categories);

  // ✅ Synchronise les catégories filtrées quand la liste change
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  return (
    <>
      {/* Filtre générique */}
      <Filter<Category>
        options={{}}
        onFilterChange={(filters) => {
          // ✅ Filtrage côté front
          let result = categories;

          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(
              (c) =>
                c.name.toLowerCase().includes(searchTerm) ||
                c.description.toLowerCase().includes(searchTerm),
            );
          }

          setFilteredCategories(result);
        }}
      />

      {/* Table des catégories */}
      <div className="mt-5 overflow-x-auto overflow-y-auto max-h-150 rounded-lg border border-gray-300">
        <table className="table table-zebra table-pin-rows table-pin-cols">
          <thead className="sticky top-0 bg-base-200 z-10 border-b border-gray-400">
            <tr>
              <th scope="col">#ID</th>
              <th scope="col">Nom</th>
              <th scope="col">Description</th>
              <th scope="col">Date de création</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Aucune catégorie trouvée
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  onClick={() => onEdit(category)}
                  aria-label={`Éditer la catégorie ${category.name}`}
                >
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>{new Date(category.created_at).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm bg-slate-800 text-white rounded-lg"
                      aria-label={`Supprimer la catégorie ${category.name}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Empêche le déclenchement de onEdit
                        onDelete(category);
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pied de tableau avec compteur */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {filteredCategories.length} catégorie(s) sur {categories.length}
      </div>
    </>
  );
}

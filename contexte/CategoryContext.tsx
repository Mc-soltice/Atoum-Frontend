"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "react-hot-toast";

import { categoryService } from "@/services/cat.service";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";

/**
 * Interface du Context Category
 * Définit toutes les actions disponibles
 */
interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (payload: CreateCategoryPayload) => Promise<void>;
  updateCategory: (id: number, payload: UpdateCategoryPayload) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

/**
 * Provider Category
 * Centralise l’état global des catégories
 */
export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 🔹 Charger toutes les catégories
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔹 Créer une catégorie
   */
  const createCategory = async (payload: CreateCategoryPayload) => {
    setLoading(true);
    try {
      const newCategory = await categoryService.create(payload);
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Catégorie créée avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Mettre à jour une catégorie
   */
  const updateCategory = async (id: number, payload: UpdateCategoryPayload): Promise<Category> => {
    setLoading(true);
    try {
      const updated = await categoryService.update(id, payload);
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
      toast.success("Catégorie mise à jour !");
      return updated; // ✅ Retourne la catégorie mise à jour
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour de la catégorie");
      throw error; // Optionnel : relancer l'erreur pour la gestion dans le composant
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Supprimer une catégorie
   */
  const deleteCategory = async (id: number) => {
    setLoading(true);
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Catégorie supprimée !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

/**
 * Hook utilitaire pour accéder au contexte Category
 */
export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategories doit être utilisé à l'intérieur d'un CategoryProvider",
    );
  }
  return context;
};

import api from "@/lib/axios";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";

/**
 * Service de gestion des catégories (Admin)
 * Toutes les méthodes sont typées et sécurisées
 */
export const categoryService = {
  /**
   * Créer une catégorie
   * POST /categories
   */
  async create(payload: CreateCategoryPayload): Promise<Category> {
    try {
      const { data } = await api.post("/categories", payload);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Erreur lors de la création de la catégorie :",
          error.message,
        );
      } else {
        console.error(
          "Erreur inconnue lors de la création de la catégorie :",
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Récupérer toutes les catégories
   * GET /categories
   */
  async getAll(): Promise<Category[]> {
    try {
      const { data } = await api.get("/categories");
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Erreur lors de la récupération des catégories :",
          error.message,
        );
      } else {
        console.error(
          "Erreur inconnue lors de la récupération des catégories :",
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Récupérer une catégorie par ID
   * GET /categories/{id}
   */
  async getById(id: number): Promise<Category> {
    try {
      const { data } = await api.get(`/categories/${id}`);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la récupération de la catégorie ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la récupération de la catégorie ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Mettre à jour une catégorie
   * PATCH /categories/{id}
   */
  async update(id: number, payload: UpdateCategoryPayload): Promise<Category> {
    try {
      const { data } = await api.patch(`/categories/${id}`, payload);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la mise à jour de la catégorie ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la mise à jour de la catégorie ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Supprimer une catégorie
   * DELETE /categories/{id}
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la suppression de la catégorie ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la suppression de la catégorie ${id} :`,
          error,
        );
      }
      throw error;
    }
  },
};

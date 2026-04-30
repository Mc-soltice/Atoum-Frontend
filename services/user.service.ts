import api from "@/lib/axios";
import type { User, UpdateUserPayload, CreateUserPayload } from "@/types/user";

/**
 * Service de gestion des utilisateurs (Admin)
 */
export const userService = {
  /**
   * Récupérer tous les utilisateurs
   * GET /users
   * permission: user.view
   */
  async create(payload: CreateUserPayload): Promise<User> {
    try {
      console.log("User created:", payload);

      const { data } = await api.post("/register", payload);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Erreur lors de la création de l'utilisateur :",
          error.message,
        );

      } else {
        console.error(
          "Erreur inconnue lors de la création de l'utilisateur :",
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Récupérer tous les utilisateurs
   * GET /users
   * permission: user.view
   */
  async getAll(): Promise<User[]> {
    try {
      const { data } = await api.get("/users");
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error.message,
        );
      } else {
        console.error(
          "Erreur inconnue lors de la récupération des utilisateurs :",
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Récupérer un utilisateur
   * GET /users/{id}
   */
  async getById(id: number): Promise<User> {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la récupération de l'utilisateur ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la récupération de l'utilisateur ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Mettre à jour un utilisateur
   * PATCH /users/{id}
   * permission: user.update
   */
  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    try {
      const { data } = await api.patch(`/users/${id}`, payload);
      return data.data ?? data;
    } catch (error: any) {
      console.error(error.response?.data);
      throw error; // ✅ important
    }
  },

  /**
   * Supprimer un utilisateur
   * DELETE /users/{id}
   * permission: user.delete
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la suppression de l'utilisateur ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la suppression de l'utilisateur ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Verrouiller / déverrouiller un utilisateur
   * PATCH /users/{id}/toggle-lock
   * permission: user.toggle-lock
   */
  async toggleLock(id: number): Promise<User> {
    try {
      const { data } = await api.patch(`/users/${id}/toggle-lock`);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors du toggle-lock de l'utilisateur ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors du toggle-lock de l'utilisateur ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Récupérer l'activité d'un utilisateur
   * GET /users/{id}/activity
   */
  async getActivity(id: number) {
    try {
      const { data } = await api.get(`/users/${id}/activity`);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la récupération de l'activité de l'utilisateur ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la récupération de l'activité de l'utilisateur ${id} :`,
          error,
        );
      }
      throw error;
    }
  },
};

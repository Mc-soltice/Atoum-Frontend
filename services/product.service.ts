import api from "@/lib/axios";
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
  UpdateStockPayload,
} from "@/types/product";
import toast from "react-hot-toast";

/**
 * Service de gestion des produits (Admin)
 * Version mise à jour avec gestion complète des images
 */
export const productService = {
  /**
   * Créer un produit AVEC upload d'images
   * POST /products
   */
  async create(payload: CreateProductPayload): Promise<Product> {
    try {
      const formData = new FormData();

      // Champs simples
      formData.append("name", payload.name);
      formData.append("category_id", payload.category_id.toString());
      formData.append("price", payload.price.toString());
      formData.append("stock", payload.stock.toString());

      // Image principale (File)
      if (payload.main_image) {
        formData.append("main_image", payload.main_image);
      }

      // Galerie (File[])
      if (payload.images?.length) {
        payload.images.forEach((file, index) => {
          formData.append(`images[${index}]`, file); // ← MODIFICATION : enlever le 3ème paramètre
        });
      }

      // Champs optionnels
      if (payload.description) formData.append("description", payload.description);
      if (payload.original_price) formData.append("original_price", payload.original_price.toString());
      if (payload.usage_instructions) formData.append("usage_instructions", payload.usage_instructions);

      // Booléen
      formData.append("is_promotional", payload.is_promotional ? "1" : "0");

      if (payload.promo_end_date) {
        formData.append("promo_end_date", payload.promo_end_date);
      }

      // Tableaux
      if (payload.ingredients?.length) {
        payload.ingredients.forEach((ingredient, i) =>
          formData.append(`ingredients[${i}]`, ingredient)
        );
      }

      if (payload.benefits?.length) {
        payload.benefits.forEach((benefit, i) =>
          formData.append(`benefits[${i}]`, benefit)
        );
      }

      // ⚡ Axios POST
      const { data } = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data.data ?? data;

    } catch (error: any) {
      if (error?.response?.status === 422) {
        console.error("❌ VALIDATION LARAVEL 422");
        console.log("➡️ errors:", error.response.data.errors);
        console.log("➡️ message:", error.response.data.message);
      } else {
        console.error("Erreur création produit:", error);
        toast.error("Erreur lors de la création du produit");
      }
      throw error;
    }
  },

  /**
   * Récupérer tous les produits
   * GET /products
   */
  async getAll(): Promise<Product[]> {
    try {
      const { data } = await api.get("/products");
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Erreur lors de la récupération des produits :",
          error.message,
        );
      } else {
        console.error(
          "Erreur inconnue lors de la récupération des produits :",
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Récupérer un produit par ID
   * GET /products/{id}
   */
  async getById(id: string): Promise<Product> {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la récupération du produit ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la récupération du produit ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Mettre à jour un produit avec gestion avancée des images
   * PATCH /products/{id}
   */
  async update(id: string, payload: UpdateProductPayload): Promise<Product> {
    try {
      const formData = new FormData();

      // 🔴 OBLIGATOIRE pour Laravel (PATCH avec fichiers)
      formData.append("_method", "PATCH");

      // 🔹 Conversion payload → FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // 🖼️ Image principale
        if (key === "main_image" && value instanceof File) {
          formData.append("main_image", value);
          return;
        }

        // 🖼️ Images de galerie (nouveaux fichiers)
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append("images[]", file);
            }
          });
          return;
        }

        // 🧹 Galerie existante (URLs)
        if (key === "existing_gallery" && Array.isArray(value)) {
          value.forEach((url) => {
            formData.append("existing_gallery[]", url);
          });
          return;
        }

        // 📜 Tableaux de chaînes (ingredients, benefits…)
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        // 🔢 Booléens
        if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
          return;
        }

        // 🔢 Nombres
        if (typeof value === "number") {
          formData.append(key, value.toString());
          return;
        }

        // ✏️ Chaînes
        formData.append(key, value);
      });

      const { data } = await api.post(`/products/${id}`, formData);

      return data.data ?? data;
    } catch (error: any) {
      // 🧠 Debug Laravel (422)
      if (error?.response?.status === 422) {
        console.error(
          `Validation échouée pour le produit ${id}:`,
          error.response.data?.errors ?? error.response.data,
        );
      } else {
        console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      }

      throw error;
    }
  },

  /**
   * Supprimer un produit
   * DELETE /products/{id}
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la suppression du produit ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la suppression du produit ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Mettre à jour le stock d'un produit
   * PATCH /products/{id}/stock
   */
  async updateStock(id: number, payload: UpdateStockPayload): Promise<Product> {
    try {
      const { data } = await api.patch(`/products/${id}/stock`, payload);
      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de la mise à jour du stock du produit ${id} :`,
          error.message,
        );
      } else {
        console.error(
          `Erreur inconnue lors de la mise à jour du stock du produit ${id} :`,
          error,
        );
      }
      throw error;
    }
  },

  /**
   * Uploader une image unique (pour utilisations spécifiques)
   * POST /upload/image
   */
  async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de l'upload de l'image :", error.message);
      } else {
        console.error("Erreur inconnue lors de l'upload de l'image :", error);
      }
      throw error;
    }
  },

  /**
   * Uploader plusieurs images (pour utilisations spécifiques)
   * POST /upload/images
   */
  async uploadImages(files: File[]): Promise<{ urls: string[] }> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await api.post("/upload/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data.data ?? data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de l'upload des images :", error.message);
      } else {
        console.error("Erreur inconnue lors de l'upload des images :", error);
      }
      throw error;
    }
  },
};

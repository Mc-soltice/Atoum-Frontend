import type { Category } from "./category";

/**
 * Modèle Produit tel que renvoyé par l'API
 */
export interface Product {
  /** Identifiant unique */
  id: string;

  /** Nom du produit */
  name: string;

  /** Catégorie associée */
  category: Category | null;

  /** Prix actuel */
  price: number;

  /** Prix original (avant promotion) */
  original_price: number | null;

  /** Pourcentage de réduction */
  discount_percentage?: number;

  /** Image principale */
  main_image: string;

  /** Galerie d'images */
  gallery: string[];

  /** Description détaillée */
  description: string | null;

  /** Liste des ingrédients */
  ingredients: string[];

  /** Bienfaits */
  benefits: string[];

  /** Mode d'utilisation */
  usage_instructions: string | null;

  /** Stock disponible */
  stock: number;

  /** Indique si le produit est promotionnel */
  is_promotional: boolean;

  /** Indique si la promo est active */
  is_is_promotional: boolean;

  /** Date de fin de promotion */
  promo_end_date: string | null;

  /** Indique un stock faible */
  is_stock_low: boolean;

  /** Indique une rupture de stock */
  is_out_of_stock: boolean;

  created_at?: string;
  updated_at?: string;
}

/**
 * Produit en promotion (avec les champs spécifiques aux promos)
 */
export interface ProductPromo extends Product {
  // Vous pouvez ajouter des champs spécifiques aux promos ici
  promo_label?: string;
  promo_badge_color?: string;
  // Ou simplement utiliser Product si aucun champ spécifique n'est nécessaire
}

/**
 * Payload création produit
 */
export interface CreateProductPayload {
  name: string;
  category_id: number;
  price: number;
  original_price: number | null;

  description?: string;
  ingredients?: string[];
  benefits?: string[];
  usage_instructions?: string;
  stock: number;
  is_promotional?: boolean;
  promo_end_date: string | null;
  main_image?: File;
  images?: File[];
}

/**
 * Payload mise à jour du stock
 */
export interface UpdateStockPayload {
  stock: number;
}

/**
 * Payload mise à jour produit
 */
export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  promo_end_date?: string | null;
  existing_gallery?: string[]; // Pour garder les images existantes lors de l'update
}

export interface ProductFilters {
  search?: string;
  stock_status?: "En stock" | "Stock faible" | "Rupture";
  is_promotional?: "Promo" | "Standard";
}

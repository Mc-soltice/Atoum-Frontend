/**
 * Modèle Category tel que renvoyé par l'API
 */
export interface Category {
  /** Identifiant unique */
  id: number;

  /** Nom de la catégorie */
  name: string;

  /** Description */
  description: string;

  /** Date de création (ISO string) */
  created_at: string;

  /** Date de dernière mise à jour (ISO string) */
  updated_at: string;
}

/**
 * Payload pour la création d'une catégorie
 */
export interface CreateCategoryPayload {
  name: string;
  description: string;
}

/**
 * Payload pour la modification d'une catégorie
 */
export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

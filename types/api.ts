/**
 * Structure standard d'une réponse paginée Laravel
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Réponse API simple
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Erreurs de validation Laravel
 */
export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

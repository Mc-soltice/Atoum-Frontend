import api from "@/lib/axios";
import type {
  Order,
  FullOrder,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  OrderFilters,
  OrderStats,
  CreateOrderFromCartPayload,
} from "@/types/order";
import { StockMovement } from "@/types/stock-movement";

class OrderService {
  private baseUrl = "/orders";

  /**
   * Récupérer toutes les commandes avec filtres
   */
  async getAll(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.user_id) params.append("user_id", filters.user_id);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.reference) params.append("reference", filters.reference);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page)
      params.append("per_page", filters.per_page.toString());

    const url = params.toString()
      ? `${this.baseUrl}?${params.toString()}`
      : this.baseUrl;

    const response = await api.get(url);
    return response.data.data || response.data;
  }

  /**
   * Récupérer une commande par son ID
   */
  async getById(id: string): Promise<FullOrder> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data || response.data;
  }

  /**
   * Créer une nouvelle commande
   */
  async create(payload: CreateOrderPayload): Promise<Order> {
    const response = await api.post(this.baseUrl, payload);
    return response.data.data || response.data;
  }

  /**
   * Créer une commande depuis le panier
   */
  async createFromCart(payload: CreateOrderFromCartPayload): Promise<Order> {
    const response = await api.post(`${this.baseUrl}`, payload);
    return response.data.data || response.data;
  }

  /**
   * Mettre à jour le statut d'une commande
   * Reçoit un payload de type UpdateOrderStatusPayload
   */
  async updateStatus(
    id: string,
    payload: UpdateOrderStatusPayload,
  ): Promise<Order> {
    try {
      console.log("📤 Order ID:", id);
      console.log("📤 Payload reçu:", payload);
      console.log("📤 URL:", `${this.baseUrl}/${id}/status`);

      // Vérifier que l'ID est valide
      if (!id) {
        throw new Error("ID de commande manquant");
      }

      // Vérifier que le statut est présent
      if (!payload.status) {
        throw new Error("Statut manquant dans le payload");
      }

      // Validation supplémentaire - s'assurer que le statut est valide
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(payload.status)) {
        throw new Error(`Statut invalide: ${payload.status}. Valeurs acceptées: ${validStatuses.join(', ')}`);
      }

      // Pour une annulation, s'assurer qu'une raison est fournie
      if (payload.status === 'cancelled') {
        console.warn("⚠️ Annulation sans raison fournie");
      }

      const response = await api.patch(`${this.baseUrl}/${id}/status`, payload);
      console.log("✅ Réponse reçue:", response.data);

      return response.data.data || response.data;

    } catch (error: any) {
      // Afficher les détails complets de l'erreur
      if (error.response) {
        console.error("❌ Status HTTP:", error.response.status);
        console.error("❌ Données d'erreur:", error.response.data);
        console.error("❌ Headers:", error.response.headers);

        // Afficher les erreurs de validation détaillées
        if (error.response.data.errors) {
          console.error("❌ Erreurs de validation:", error.response.data.errors);
        }

        // Afficher l'URL complète qui a échoué
        console.error("❌ URL complète:", error.config?.url);
        console.error("❌ Méthode:", error.config?.method);
        console.error("❌ Payload envoyé:", error.config?.data);

        // Message d'erreur plus explicite
        const errorMessage = error.response.data.message ||
          error.response.data.error ||
          `Erreur ${error.response.status}`;
        throw new Error(errorMessage);

      } else if (error.request) {
        console.error("❌ Pas de réponse du serveur:", error.request);
        throw new Error("Le serveur ne répond pas");

      } else {
        console.error("❌ Erreur:", error.message);
        throw error;
      }
    }
  }

  /**
   * Annuler une commande
   */
  async cancel(id: string): Promise<Order> {
    const response = await api.post(`${this.baseUrl}/${id}`);
    return response.data.data || response.data;
  }

  /**
   * Supprimer une commande définitivement
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Récupérer les statistiques des commandes
   */
  async getStats(): Promise<OrderStats> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data.data || response.data;
  }
  /**
 * Récupérer les mouvements de stock liés à une commande
 */
  async getStockMovements(id: string): Promise<StockMovement[]> {
    const response = await api.get(`${this.baseUrl}/reports/stock-movements`);
    return response.data.data || response.data;
  }

  /**
   * Télécharger la facture d'une commande
   */
  async downloadInvoice(id: string): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/invoice`, {
      responseType: "blob",
    });
    return response.data;
  }

  /**
   * Rechercher une commande par référence
   */
  async searchByReference(reference: string): Promise<Order | null> {
    try {
      const response = await api.get(`${this.baseUrl}/search`, {
        params: { reference },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la recherche de la commande :", error);
      return null;
    }
  }
}
export const orderService = new OrderService();

"use client";

import { orderService } from "@/services/order.service";
import type {
  CreateOrderFromCartPayload,
  CreateOrderPayload,
  FullOrder,
  Order,
  OrderFilters,
  OrderStats,
  OrderStatus,
  UpdateOrderStatusPayload,
} from "@/types/order";
import { StockMovement } from "@/types/stock-movement";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "react-hot-toast";

/**
 * Interface du contexte Order
 */
interface OrderContextType {
  // 🔹 États
  orders: Order[];
  currentOrder: FullOrder | null;
  stats: OrderStats | null;
  loading: boolean;

  // 🔹 Actions principales
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (id: string) => Promise<FullOrder>;
  createOrder: (payload: CreateOrderPayload) => Promise<Order>;
  createOrderFromCart: (payload: CreateOrderFromCartPayload) => Promise<Order>;
  updateOrderStatus: (
    id: string,
    payload: UpdateOrderStatusPayload,
  ) => Promise<Order>;
  cancelOrder: (id: string) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;

  // 🔹 Actions supplémentaires
  fetchStats: () => Promise<void>;
  fetchStockMovements: (id: string) => Promise<StockMovement[]>;
  getOrderByReference: (reference: string) => Order | undefined;
  filterOrdersByStatus: (status: OrderStatus) => Order[];
  getTotalRevenue: () => number;
  downloadInvoice: (id: string) => Promise<void>;
  searchOrderByReference: (reference: string) => Promise<Order | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Provider pour le contexte Order
 */
export function OrderProvider({ children }: { children: ReactNode }) {
  // 🔹 États
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<FullOrder | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * 🔹 Charger toutes les commandes avec filtres optionnels
   */
  const fetchOrders = useCallback(async (filters?: OrderFilters) => {
    setLoading(true);
    try {
      const data = await orderService.getAll(filters);
      setOrders(data);
      toast.success(`✅ ${data.length} commande(s) chargée(s) avec succès`);
    } catch (error) {
      console.error("❌ Erreur fetchOrders:", error);
      toast.error("Erreur lors du chargement des commandes");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔹 Récupérer une commande par son ID
   */
  const fetchOrderById = useCallback(async (id: string): Promise<FullOrder> => {
    setLoading(true);
    try {
      const order = await orderService.getById(id);
      setCurrentOrder(order);
      return order;
    } catch (error) {
      console.error(`❌ Erreur fetchOrderById ${id}:`, error);
      toast.error("Erreur lors de la récupération de la commande");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔹 Créer une nouvelle commande
   */

  const createOrder = useCallback(
    async (payload: CreateOrderPayload): Promise<Order> => {
      setLoading(true);
      try {
        console.log("🧾 CREATE ORDER FROM CART → payload", payload);
        console.log("createOrder payload:", payload);
        const newOrder = await orderService.create(payload);
        setOrders((prev) => [newOrder, ...prev]);
        toast.success("✅ Commande créée avec succès !");
        return newOrder;
      } catch (error) {
        console.error("❌ Erreur createOrder:", error);
        toast.error("Erreur lors de la création de la commande");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * 🔹 Créer une commande depuis le panier
   */
  const createOrderFromCart = useCallback(
    async (payload: CreateOrderFromCartPayload): Promise<Order> => {
      setLoading(true);
      try {
        console.log("🧾 CREATE ORDER FROM CART → payload", payload);
        const newOrder = await orderService.createFromCart(payload);
        setOrders((prev) => [newOrder, ...prev]);
        toast.success("✅ Commande créée depuis le panier avec succès !");
        return newOrder;
      } catch (error) {
        console.error("❌ Erreur createOrderFromCart:", error);
        toast.error("Erreur lors de la création de la commande");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * 🔹 Mettre à jour le statut d'une commande
   */
  const updateOrderStatus = useCallback(
    async (id: string, payload: UpdateOrderStatusPayload): Promise<Order> => {
      setLoading(true);
      try {
        const updatedOrder = await orderService.updateStatus(id, payload);

        // mettre à jour currentOrder directement si c’est le même
        if (currentOrder?.id === id) {
          setCurrentOrder(updatedOrder as FullOrder);
        }

        // mettre à jour la liste
        setOrders(prev =>
          prev.map(order => (order.id === id ? updatedOrder : order))
        );

        toast.success(`✅ Statut mis à jour: ${payload.status}`);
        return updatedOrder;
      } catch (error) {
        console.error(`❌ Erreur updateOrderStatus ${id}:`, error);
        toast.error("Erreur lors de la mise à jour du statut");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentOrder],
  );

  /**
   * 🔹 Annuler une commande
   */
  const cancelOrder = useCallback(
    async (id: string): Promise<Order> => {
      setLoading(true);
      try {
        const cancelledOrder = await orderService.cancel(id);

        // Mettre à jour la liste des commandes
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? cancelledOrder : order)),
        );

        // Mettre à jour la commande courante si c'est celle-ci
        if (currentOrder?.id === id) {
          const fullOrder = await orderService.getById(id);
          setCurrentOrder(fullOrder);
        }

        toast.success("✅ Commande annulée avec succès");
        return cancelledOrder;
      } catch (error) {
        console.error(`❌ Erreur cancelOrder ${id}:`, error);
        toast.error("Erreur lors de l'annulation de la commande");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentOrder],
  );

  /**
   * 🔹 Supprimer définitivement une commande
   */
  const deleteOrder = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      try {
        await orderService.delete(id);

        // Retirer de la liste des commandes
        setOrders((prev) => prev.filter((order) => order.id !== id));

        // Réinitialiser la commande courante si c'est celle-ci
        if (currentOrder?.id === id) {
          setCurrentOrder(null);
        }

        toast.success("🗑️ Commande supprimée définitivement");
      } catch (error) {
        console.error(`❌ Erreur deleteOrder ${id}:`, error);
        toast.error("Erreur lors de la suppression de la commande");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentOrder],
  );

  /**
   * 🔹 Récupérer les statistiques des commandes
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getStats();
      setStats(data);
      toast.success("📊 Statistiques mises à jour");
    } catch (error) {
      console.error("❌ Erreur fetchStats:", error);
      toast.error("Erreur lors du chargement des statistiques");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
 * 🔹 Récupérer les mouvements du stock d'un produit lié à une commande
 */
  const fetchStockMovements = useCallback(async (id: string): Promise<StockMovement[]> => {
    try {
      const movements = await orderService.getStockMovements(id);
      return movements;
    } catch (error) {
      console.error(`❌ Erreur fetchStockMovements ${id}:`, error);
      toast.error("Erreur lors du chargement des mouvements de stock");
      throw error;
    }
  }, []);

  /**
   * 🔹 Trouver une commande par sa référence
   */
  const getOrderByReference = useCallback(
    (reference: string): Order | undefined => {
      return orders.find((order) => order.reference === reference);
    },
    [orders],
  );

  /**
   * 🔹 Filtrer les commandes par statut
   */
  const filterOrdersByStatus = useCallback(
    (status: OrderStatus): Order[] => {
      return orders.filter((order) => order.status.value === status);
    },
    [orders],
  );

  /**
   * 🔹 Calculer le revenu total de toutes les commandes
   */
  const getTotalRevenue = useCallback((): number => {
    return orders.reduce((total, order) => total + order.total_amount, 0);
  }, [orders]);

  /**
   * 🔹 Télécharger la facture d'une commande
   */
  const downloadInvoice = useCallback(async (id: string): Promise<void> => {
    try {
      const blob = await orderService.downloadInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facture-commande-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("📄 Facture téléchargée avec succès");
    } catch (error) {
      console.error(`❌ Erreur downloadInvoice ${id}:`, error);
      toast.error("Erreur lors du téléchargement de la facture");
    }
  }, []);

  /**
   * 🔹 Rechercher une commande par référence
   */
  const searchOrderByReference = useCallback(
    async (reference: string): Promise<Order | null> => {
      try {
        const order = await orderService.searchByReference(reference);
        return order;
      } catch (error) {
        console.error("❌ Erreur searchOrderByReference:", error);
        return null;
      }
    },
    [],
  );

  return (
    <OrderContext.Provider
      value={{
        // 🔹 États
        orders,
        currentOrder,
        stats,
        loading,

        // 🔹 Actions principales
        fetchOrders,
        fetchOrderById,
        createOrder,
        createOrderFromCart,
        updateOrderStatus,
        cancelOrder,
        deleteOrder,
        fetchStockMovements,

        // 🔹 Actions supplémentaires
        fetchStats,
        getOrderByReference,
        filterOrdersByStatus,
        getTotalRevenue,
        downloadInvoice,
        searchOrderByReference,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

/**
 * 🔹 Hook personnalisé pour utiliser le contexte Order
 */
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error(
      "useOrders doit être utilisé à l'intérieur d'un OrderProvider",
    );
  }
  return context;
};

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  variant?: {
    id: string;
    name: string;
    value: string;
  };
}

export interface Order {
  id: string;
  reference: string;
  user_id?: ShippingAddress["email"];
  items: OrderItem[];
  total_amount: number;
  status: { value: OrderStatus; label: string };
  created_at: string;
  updated_at: string;
}

/**
 * Interface pour l'adresse de livraison
 */
export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}

/**
 * Interface pour le paiement
 */
export interface PaymentInfo {
  method: "credit_card" | "mobile_money" | "cash_on_delivery";
  transaction_id?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paid_at?: string;
}

export interface FullOrder extends Order {
  shipping_address: string | ShippingAddress;
  payment_method: string;
  items_total?: number;
  delivery_cost?: number;
  currency?: string;
  payment_status?: string;
  paid_at?: string;
  cancelled_at?: string;
  can_be_cancelled?: boolean;

  delivery: {
    id: string;
    name: string;
    price: number;
    delay_days: number;
    estimated_delivery?: string;
  };
  notes?: string;
}
/**
 * Payload pour créer une commande depuis le panier
 */
export interface CreateOrderFromCartPayload {
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
  }[];
  shipping_address: ShippingAddress;
  delivery_option_id: string;
  delivery_price: number;
  payment_method: PaymentInfo["method"];
  notes?: string;
}

/**
 * Interface pour le récapitulatif de commande
 */
export interface OrderSummaryData {
  subtotal: number;
  shipping_cost: number;
  discount?: number;
  tax?: number;
  total: number;
  items_count: number;
}

/**
 * Payload pour créer une commande
 */
export interface CreateOrderPayload {
  user_id?: string;
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
  }[];
  shipping_address: ShippingAddress;
  payment_method: PaymentInfo["method"];
  delivery_option_id: string;
  delivery_price: number;
  notes?: string;
}

/**
 * Payload pour mettre à jour le statut
 */
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  notes?: string;
}

/**
 * Filtres pour les commandes
 */
export interface OrderFilters {
  status?: OrderStatus;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  reference?: string;
  page?: number;
  per_page?: number;
}

/**
 * Statistiques des commandes
 */
export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  orders_by_status: Record<OrderStatus, number>;
  recent_orders: Order[];
}

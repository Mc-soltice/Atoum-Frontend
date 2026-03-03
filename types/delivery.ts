// types/delivery.ts

export interface DeliveryOption {
  id: string;
  name: string;
  description?: string | null;
  price: string; // Laravel decimal cast → string JSON
  delay_days: number;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryOptionFilters {
  is_active?: boolean;
  search?: string;
  page?: number;
}

export interface PaginatedDeliveryResponse {
  data: DeliveryOption[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

export interface ReorderPayload {
  order: {
    id: string;
    order: number;
  }[];
}

export interface DeliveryOptionPayload {
  name: string;
  description?: string;
  price: number;
  delay_days: number;
  is_active?: boolean;
  order?: number;
}
export type UpdateDeliveryOptionPayload = Partial<DeliveryOptionPayload>;

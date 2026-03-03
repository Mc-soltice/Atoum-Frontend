// services/delivery.service.ts

import api from "@/lib/axios";
import {
  DeliveryOption,
  DeliveryOptionFilters,
  DeliveryOptionPayload,
  PaginatedDeliveryResponse,
  ReorderPayload,
} from "@/types/delivery";

const BASE = "/delivery-options";

export const deliveryService = {
  async getAll(filters?: DeliveryOptionFilters) {
    const { data } = await api.get<PaginatedDeliveryResponse>(BASE, {
      params: filters,
    });
    return data;
  },

  async getAvailable() {
    const { data } = await api.get<DeliveryOption[]>(`${BASE}/available`);
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<DeliveryOption>(`${BASE}/${id}`);
    return data;
  },

  async create(payload: DeliveryOptionPayload) {
    const { data } = await api.post<DeliveryOption>(BASE, payload);
    return data;
  },

  async update(id: string, payload: DeliveryOptionPayload) {
    const { data } = await api.put<DeliveryOption>(`${BASE}/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    await api.delete(`${BASE}/${id}`);
  },

  async toggle(id: string) {
    const { data } = await api.patch<DeliveryOption>(`${BASE}/${id}/toggle`);
    return data;
  },

  async reorder(payload: ReorderPayload) {
    await api.patch(`${BASE}/reorder`, payload);
  },
};

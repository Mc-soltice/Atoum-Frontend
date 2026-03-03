import type { OrderStatus } from "@/types/order";

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing"],
  processing: ["shipped", "delivered"],
  shipped: ["delivered"],
  delivered: [], // ⛔ verrouillé
  cancelled: [], // ⛔ verrouillé
};

export function getNextAllowedStatuses(
  current: OrderStatus
): OrderStatus[] {
  return ORDER_STATUS_FLOW[current] ?? [];
}

export function isFinalStatus(status: OrderStatus): boolean {
  return ["cancelled", "delivered"].includes(status);
}

export function shouldCountAmount(status: OrderStatus): boolean {
  return ["shipped", "delivered"].includes(status);
}
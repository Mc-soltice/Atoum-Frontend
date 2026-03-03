export interface StockMovement {
  id: number;
  product_id: string;
  product?: {
    id: string | null;
    name: string | null;
  } | null;
  order_id: string | null;
  movement_type: 'in' | 'out';
  quantity: number;
  reason: string;
  notes: string | null;
  old_stock: number | null;
  new_stock: number | null;
  unit_price_at_time: number | null;
  metadata: string | null; // Correspond à $this->metadata->order_reference ?? null
  created_at: string | null;
  updated_at: string | null;
}
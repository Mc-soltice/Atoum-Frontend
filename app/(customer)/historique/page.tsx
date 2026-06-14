"use client";

import OrderHistory from "@/components/customer/history/OrderHistory";
import { useOrders } from "@/contexte/OrderContext";
import { useOrderPDF } from "@/hooks/useOrderPDF";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { FullOrder } from "@/types/order";
import { useEffect } from "react";

export default function HistoriquePage() {
  useRequireAuth("/login");
  const { orders: contextOrders, loading, fetchMyOrders } = useOrders();
  const { downloadInvoice } = useOrderPDF();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <OrderHistory
      orders={contextOrders as FullOrder[]}
      loading={loading}
      onDownloadInvoice={downloadInvoice}
      title="Historique des commandes"
    />
  );
}

"use client";

import type { FullOrder } from "@/types/order";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DotSpinner } from "ldrs/react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Hash,
  Package,
  Store,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface OrderHistoryProps {
  orders: FullOrder[];
  loading: boolean;
  onDownloadInvoice?: (
    order: FullOrder,
  ) => Promise<{ success: boolean; error?: unknown }>;
  title?: string;
  standalone?: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);

const getStatusBadgeStyle = (value: string) => {
  switch (value.toLowerCase()) {
    case "delivered":
    case "completed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "processing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (value: string) => {
  switch (value.toLowerCase()) {
    case "delivered":
    case "completed":
      return <Package className="text-amber-600" size={20} />;
    case "pending":
      return <Calendar className="text-yellow-600" size={20} />;
    case "cancelled":
      return <Truck className="text-red-600" size={20} />;
    default:
      return <Package className="text-blue-600" size={20} />;
  }
};

export default function OrderHistory({
  orders,
  loading,
  onDownloadInvoice,
  title,
  standalone = true,
}: OrderHistoryProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const rootClassName = standalone
    ? "min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    : "";
  const wrapperClassName = standalone ? "max-w-6xl mx-auto" : "";

  return (
    <div className={rootClassName}>
      <div className={wrapperClassName}>
        {title ? (
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600">
                Retrouvez toutes vos commandes et suivez leur statut.
              </p>
            </div>

            {orders.length > 0 && (
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm text-gray-600 flex items-center space-x-2"
              >
                <Calendar size={16} />
                <span>Trier par date {sortOrder === "desc" ? "↓" : "↑"}</span>
              </button>
            )}
          </div>
        ) : (
          orders.length > 0 && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm text-gray-600 flex items-center space-x-2"
              >
                <Calendar size={16} />
                <span>Trier par date {sortOrder === "desc" ? "↓" : "↑"}</span>
              </button>
            </div>
          )
        )}

        {loading ? (
          <div className="flex items-center justify-center h-80">
            <DotSpinner size="35" speed="0.9" color="#f59e0b" />
            <span className="ml-3">Chargement de l&apos;historique</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Aucune commande pour le moment
              </h2>
              <p className="text-gray-600 mb-8">
                Découvrez notre collection et passez votre première commande
              </p>

              <Link
                href="/"
                className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 group inline-flex items-center"
              >
                <div className="relative px-6 py-3 text-lg font-medium flex items-center gap-2 text-amber-500 group-hover:text-white transition-colors duration-300">
                  <Store size={16} />
                  <span>Commencer vos achats</span>
                  <div className="absolute inset-0 bg-amber-500 -z-10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              const itemsCount = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div
                    onClick={() => toggleOrderDetails(order.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="bg-blue-50 p-3 rounded-xl">
                          <Package className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <div className="flex items-center text-gray-500 text-sm">
                              <Hash size={14} className="mr-1" />
                              <span className="font-mono">
                                {order.reference}
                              </span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(order.status?.value ?? order.status ?? "pending")}`}
                            >
                              {typeof order.status === "string"
                                ? order.status
                                : order.status?.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              {format(
                                new Date(order.created_at),
                                "d MMMM yyyy",
                                { locale: fr },
                              )}
                            </div>
                            <div className="text-gray-400">•</div>
                            <div className="text-gray-600">
                              {itemsCount} article{itemsCount > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-2xl font-bold text-amber-600">
                            {formatPrice(order.total_amount)}
                          </p>
                        </div>
                        <div className="text-gray-400">
                          {isExpanded ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <div className="p-6">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                            <div className="col-span-5">Produit</div>
                            <div className="col-span-2 text-center">
                              Quantité
                            </div>
                            <div className="col-span-2 text-right">
                              Prix unitaire
                            </div>
                            <div className="col-span-3 text-right">
                              Sous-total
                            </div>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                              >
                                <div className="col-span-5">
                                  <div className="font-medium text-gray-900">
                                    {item.product_name}
                                  </div>
                                </div>
                                <div className="col-span-2 text-center text-gray-600">
                                  {item.quantity}
                                </div>
                                <div className="col-span-2 text-right text-gray-600">
                                  {formatPrice(item.unit_price)}
                                </div>
                                <div className="col-span-3 text-right font-medium text-gray-900">
                                  {formatPrice(
                                    item.subtotal ??
                                      item.unit_price * item.quantity,
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex justify-end">
                              <div className="w-1/3 space-y-2">
                                {order.delivery && (
                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Truck size={14} className="mr-2" />
                                      Livraison ({order.delivery.name})
                                    </span>
                                    <span>
                                      {formatPrice(order.delivery.price)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                  <span>Total TTC</span>
                                  <span className="text-slate-900">
                                    {formatPrice(order.total_amount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {onDownloadInvoice && (
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => onDownloadInvoice(order)}
                              className="relative overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group"
                            >
                              <div className="relative px-4 py-2 text-sm font-medium flex items-center gap-2 text-gray-600 group-hover:text-white transition-colors duration-300">
                                <Download size={16} />
                                <span>Télécharger la facture</span>
                                <div className="absolute inset-0 bg-amber-500 -z-10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

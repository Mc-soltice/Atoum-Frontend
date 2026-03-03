"use client";
import { useOrderPDF } from '@/hooks/useOrderPDF';
// import { useSimpleInvoice } from '@/hooks/useSimpleInvoice';

import { useOrders } from "@/contexte/OrderContext";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Calendar,
  Hash,
  Truck,
  CreditCard,
  Download,
  Store
} from "lucide-react";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import { FullOrder } from '@/types/order';

// Interface pour les commandes avec les détails de livraison
interface OrderWithDetails {
  id: string;
  reference: string;
  created_at: string;
  status: { value: string; label: string };
  total_amount: number;
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  delivery?: {
    name: string;
    price: number;
  };
}

// Fonction utilitaire pour formater les prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Badge de statut stylisé
const StatusBadge = ({ status }: { status: { value: string; label: string } }) => {
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200"
  };

  const style = statusStyles[status.value as keyof typeof statusStyles] || statusStyles.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
      {status.label}
    </span>
  );
};

export default function HistoriquePage() {
  const { orders: contextOrders, loading, fetchOrders } = useOrders();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { downloadInvoice, previewInvoice } = useOrderPDF();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // Transformer les commandes du contexte en format avec détails
    if (contextOrders.length > 0) {
      const transformedOrders: OrderWithDetails[] = contextOrders.map(order => {
        const fullOrder = order as FullOrder; // Typage forcé vers FullOrder
        return {
          id: order.id,
          reference: order.reference,
          created_at: order.created_at,
          status: order.status,
          total_amount: order.total_amount,
          items: order.items.map(item => ({
            id: item.id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal || item.unit_price * item.quantity,
          })),
          // ✅ Gestion sécurisée de la livraison
          delivery: fullOrder.delivery
            ? {
              name: fullOrder.delivery.name,
              price: fullOrder.delivery.price,
            }
            : undefined,
        };
      });

      setOrders(transformedOrders);
    }
  }, [contextOrders]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (

      <div className="flex items-center justify-center h-screen">
        <DotSpinner size="35" speed="0.9" color="#f59e0b" />
        <span className="ml-3">Chargement de l&apos;istorique</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête de page */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Historique des commandes
            </h1>
            <p className="text-gray-600">
              Retrouvez toutes vos commandes et suivez leur statut
            </p>
          </div>

          {orders.length > 0 && (
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm text-gray-600 flex items-center space-x-2"
            >
              <Calendar size={16} />
              <span>Trier par date {sortOrder === 'desc' ? '↓' : '↑'}</span>
            </button>
          )}
        </div>

        {orders.length === 0 ? (
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

                  {/* Remplissage au survol */}
                  <div className="absolute inset-0 bg-amber-500 -z-10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              const itemsCount = order.items.reduce((sum, it) => sum + it.quantity, 0);
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* En-tête de la commande */}
                  <div
                    onClick={() => toggleOrderDetails(order.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Informations principales */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="bg-blue-50 p-3 rounded-xl">
                          <Package className="w-6 h-6 text-slate-900" />
                        </div>

                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <div className="flex items-center text-gray-500 text-sm">
                              <Hash size={14} className="mr-1" />
                              <span className="font-mono">{order.reference}</span>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              {format(new Date(order.created_at), "d MMMM yyyy", { locale: fr })}
                            </div>
                            <div className="text-gray-400">•</div>
                            <div className="text-gray-600">
                              {itemsCount} article{itemsCount > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Montant et actions */}
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-2xl font-bold text-amber-600">
                            {formatPrice(order.total_amount)}
                          </p>
                        </div>

                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Détails de la commande */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <div className="p-6">
                        {/* Version tableau améliorée */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          {/* En-tête du tableau */}
                          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                            <div className="col-span-5">Produit</div>
                            <div className="col-span-2 text-center">Quantité</div>
                            <div className="col-span-2 text-right">Prix unitaire</div>
                            <div className="col-span-3 text-right">Sous-total</div>
                          </div>

                          {/* Corps du tableau */}
                          <div className="divide-y divide-gray-100">
                            {order.items.map((item, index) => (
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
                                  {formatPrice(item.subtotal)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Pied du tableau */}
                          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex justify-end">
                              <div className="w-1/3 space-y-2">
                                {order.delivery && (
                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Truck size={14} className="mr-2" />
                                      Livraison ({order.delivery.name})
                                    </span>
                                    <span>{formatPrice(order.delivery.price)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                  <span>Total TTC</span>
                                  <span className="text-slate-900">{formatPrice(order.total_amount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions supplémentaires */}
                        <div className="mt-4 flex justify-end space-x-3">
                          <button
                            onClick={() => downloadInvoice(order)}
                            className="relative overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group">
                            <div className="relative px-4 py-2 text-sm font-medium flex items-center gap-2 text-gray-600 group-hover:text-white transition-colors duration-300">
                              <Download size={16} />
                              <span>Télécharger la facture</span>

                              {/* Remplissage au survol */}
                              <div className="absolute inset-0 bg-amber-500 -z-10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                            </div>
                          </button>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Résumé des commandes */}
        {orders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Total des commandes</span>
              </div>
              <span className="text-2xl font-bold text-amber-600">
                {formatPrice(orders.reduce((sum, order) => sum + order.total_amount, 0))}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
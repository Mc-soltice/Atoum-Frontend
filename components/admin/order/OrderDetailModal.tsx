"use client";

import { useOrders } from "@/contexte/OrderContext";
import type { FullOrder, OrderStatus } from "@/types/order";
import { getNextAllowedStatuses } from "@/utils/orderStatusFlow";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import { CreditCard, MapPin, Package, Tag, Truck, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface OrderDetailsModalProps {
  isOpen: boolean;
  orderId?: string;
  onClose: () => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

export default function OrderDetailsModal({
  isOpen,
  orderId,
  onClose,
  onStatusChange,
}: OrderDetailsModalProps) {
  const { fetchOrderById, updateOrderStatus } = useOrders();

  const [order, setOrder] = useState<FullOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const allowedStatuses = useMemo(() => {
    if (!order?.status.value) return [];
    return getNextAllowedStatuses(order.status.value).filter(
      (status) => status !== order.status.value
    );
  }, [order?.status.value]);
  // Dans OrderDetailsModal.tsx, ajoutez cette fonction
  const formatPrice = (price: string | number): string => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // ✅ fetch via CONTEXT (plus de service)
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await fetchOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger la commande");
    } finally {
      setLoading(false);
    }
  }, [orderId, fetchOrderById]);

  useEffect(() => {
    if (isOpen) {
      setOrder(null); // reset avant fetch
      if (orderId) fetchOrderDetails();
    }
  }, [isOpen, orderId, fetchOrderDetails]);

  // ✅ statut via CONTEXT
  // Ajoutez cet état
  const [processingStatuses, setProcessingStatuses] = useState<Set<OrderStatus>>(new Set());

  const handleQuickStatusChange = async (newStatus: OrderStatus) => {
    if (!orderId) return;

    // Vérifier si la commande est chargée
    if (!order) {
      toast.error("Commande non chargée");
      return;
    }

    // Vérifier si le statut est identique
    if (order.status.value === newStatus) {
      toast.error(`⚠️ Le statut est déjà "${getStatusLabel(newStatus)}"`);
      return;
    }

    // Vérifier si ce statut est déjà en cours de traitement
    if (processingStatuses.has(newStatus)) {
      toast.loading(`Changement vers ${getStatusLabel(newStatus)} déjà en cours...`, { id: `status-${newStatus}` });
      return;
    }

    // Vérifier si la transition est autorisée
    if (!allowedStatuses.includes(newStatus)) {
      toast.error(`Transition non autorisée de ${order.status.value} vers ${newStatus}`);
      return;
    }

    try {
      setChangingStatus(true);
      setProcessingStatuses(prev => new Set(prev).add(newStatus));

      console.log(`🚀 Tentative de changement de statut: ${order.status.value} → ${newStatus}`);

      const updatedOrder = await updateOrderStatus(orderId, { status: newStatus });

      // Mettre à jour l'état local
      setOrder(prevOrder => {
        if (!prevOrder) return null;
        return {
          ...prevOrder,
          status: {
            value: newStatus,
            label: getStatusLabel(newStatus),
          },
          shipping_address: prevOrder.shipping_address,
        };
      });

      onStatusChange?.(orderId, newStatus);
      toast.success(`Statut changé → ${getStatusLabel(newStatus)}`);

    } catch (error: any) {
      // Afficher l'erreur spécifique du backend
      const errorMessage = error.message || "Erreur lors du changement de statut";
      toast.error(errorMessage);
      console.error("❌ Erreur détaillée:", error);
    } finally {
      setChangingStatus(false);
      setProcessingStatuses(prev => {
        const next = new Set(prev);
        next.delete(newStatus);
        return next;
      });
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal modal-open" role="dialog" aria-modal="true">
        <div className="modal-box">
          <div className="flex justify-center items-center h-64">
            <DotSpinner size="35" speed="0.9" color="black" />
            <span className="ml-3">Chargement des détails...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="modal modal-open" role="dialog" aria-modal="true">
        <div className="modal-box">
          <h2 className="font-bold text-lg mb-4">Commande introuvable</h2>
          <p className="mb-4">
            La commande demandée n&apos;existe pas ou a été supprimée.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-4xl p-0">
        {/* Cadre principal avec bordure */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* En-tête avec cadre */}
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl mb-1">
                  Commande {order.reference}
                </h2>
                <p className="text-gray-600">
                  Créée le{" "}
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status.value)}`}
                >
                  {getStatusLabel(order.status.value)}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu principal avec cadres internes */}
          <div className="p-6 space-y-6">
            {/* Cadre: Informations principales (2 colonnes) */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cadre: Informations de livraison */}
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">
                          Adresse de livraison
                        </h3>
                        <p className="text-sm">
                          {typeof order.shipping_address === "string"
                            ? order.shipping_address
                            : `${order.shipping_address.first_name} ${order.shipping_address.last_name}
                            ${order.shipping_address.address}
                            ${order.shipping_address.email}
                            ${order.shipping_address.phone}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Truck className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Livraison</h3>
                        <p className="text-sm">
                          {order.delivery.name}
                          <br />
                          <span className="text-gray-600">
                            {order.delivery.delay_days} jours estimés
                            <br />
                            {formatPrice(order.delivery.price)} €
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cadre: Informations de paiement et client */}
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Paiement</h3>
                        <p className="text-sm">
                          {order.payment_method || "Non spécifié"}
                          <br />
                          {order.payment_status &&
                            `Statut: ${order.payment_status}`}
                          <br />
                          {order.paid_at && (
                            <span className="text-gray-600">
                              Payé le{" "}
                              {new Date(order.paid_at).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Client</h3>
                        <p className="text-sm">
                          {order.user_id
                            ? `Client ID: ${order.user_id}`
                            : "Commande en tant qu'invité"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadre: Liste des articles */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Articles commandés ({order.items.length})
              </h3>
              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="table w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border-r border-gray-100">Produit</th>
                      <th className="text-right border-r border-gray-100">
                        Quantité
                      </th>
                      <th className="text-right border-r border-gray-100">
                        Prix unitaire
                      </th>
                      <th className="text-right">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border-r border-gray-100">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">
                              {item.product_name}
                            </span>
                          </div>
                        </td>
                        <td className="text-right border-r border-gray-100">
                          {item.quantity}
                        </td>
                        <td className="text-right border-r border-gray-100">
                          {formatPrice(item.unit_price)} €
                        </td>
                        <td className="text-right font-medium">
                          {formatPrice(item.subtotal)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td
                        colSpan={3}
                        className="text-right font-semibold border-r border-gray-200"
                      >
                        Total
                      </td>
                      <td className="text-right font-bold text-lg py-3">
                        {order.total_amount.toFixed(2)} €
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Cadre: Actions rapides de statut */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3">
                Changer le statut rapidement
              </h4>
              <div className="flex flex-wrap gap-2">
                {allowedStatuses.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Aucun changement de statut autorisé
                  </p>
                )}

                {allowedStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleQuickStatusChange(status)}
                    disabled={changingStatus || processingStatuses.has(status)}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium overflow-hidden group ${changingStatus ? "opacity-50 cursor-not-allowed" : ""
                      } ${order.status.value === status
                        ? "bg-gray-900 text-white border-gray-900"
                        : "text-gray-700 bg-gray-100 hover:text-white transition-colors duration-300"
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {getStatusLabel(status)}
                      {processingStatuses.has(status) && " ⏳"}
                    </span>
                    {!changingStatus && !processingStatuses.has(status) && order.status.value !== status && (
                      <div className="absolute inset-0 bg-slate-800 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cadre: Notes (conditionnel) */}
            {order.notes && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Notes
                </h4>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Footer avec cadre */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex justify-end">
              <button
                className="btn border border-gray-300 hover:border-gray-400"
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Fonctions utilitaires
function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: OrderStatus): string {
  const labels = {
    pending: "En attente",
    confirmed: "Confirmée",
    processing: "En traitement",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };
  return labels[status] || status;
}

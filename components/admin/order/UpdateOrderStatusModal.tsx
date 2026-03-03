"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import "ldrs/react/DotSpinner.css";
import { DotSpinner } from "ldrs/react";
import type { Order, OrderStatus } from "@/types/order";
import { orderService } from "@/services/order.service";
import toast from "react-hot-toast";

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onStatusUpdated: (orderId: string, status: OrderStatus) => void;
}

/**
 * Modal pour mettre à jour le statut d'une commande
 */
export default function UpdateOrderStatusModal({
  isOpen,
  order,
  onClose,
  onStatusUpdated,
}: UpdateOrderStatusModalProps) {
  // ✅ Correction : utiliser order?.status.value au lieu de order?.status
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status.value || "pending",
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Options de statut disponibles
  const statusOptions: {
    value: OrderStatus;
    label: string;
    description: string;
  }[] = [
      {
        value: "pending",
        label: "En attente",
        description: "Commande créée, en attente de confirmation",
      },
      {
        value: "confirmed",
        label: "Confirmée",
        description: "Commande confirmée et en préparation",
      },
      {
        value: "processing",
        label: "En traitement",
        description: "Commande en cours de traitement",
      },
      {
        value: "shipped",
        label: "Expédiée",
        description: "Commande expédiée au client",
      },
      {
        value: "delivered",
        label: "Livrée",
        description: "Commande livrée au client",
      },
      { value: "cancelled", label: "Annulée", description: "Commande annulée" },
    ];

  // ✅ Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    // ✅ Correction : comparer avec order.status.value
    if (selectedStatus === order.status.value) {
      toast.error("Le statut est déjà défini à cette valeur");
      return;
    }

    try {
      setLoading(true);
      await orderService.updateStatus(order.id, {
        status: selectedStatus,
        notes: notes.trim() || undefined,
      });

      onStatusUpdated(order.id, selectedStatus);
      toast.success(`Statut de la commande ${order.reference} mis à jour`);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      toast.error("Impossible de mettre à jour le statut");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-4">
          Modifier le statut de la commande
        </h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Commande : {order.reference}</p>
          <p className="text-sm text-gray-600">
            Statut actuel :{" "}
            <span className="font-medium">
              {getStatusLabel(order.status.value)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sélection du statut */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nouveau statut
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${selectedStatus === option.value
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as OrderStatus)
                    }
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez une note sur le changement de statut..."
              className="textarea textarea-bordered w-full outline-none rounded-lg"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              Ces notes seront enregistrées avec l'historique de la commande.
            </p>
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="rounded-lg btn text-white bg-slate-800"
              // ✅ Correction : comparer avec order.status.value
              disabled={loading || selectedStatus === order.status.value}
            >
              {loading ? (
                <DotSpinner size="20" speed="0.9" color="white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ Fonction pour obtenir le label d'un statut
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
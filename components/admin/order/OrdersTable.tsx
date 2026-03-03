"use client";

import Filter from "@/components/admin/Filter";
import type { Order, OrderFilters, OrderStatus } from "@/types/order";
import { Eye } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onChangeStatus: (order: Order) => void;
  onFilteredChange?: (filtered: Order[]) => void;
}

export interface OrdersTableRef {
  getFilteredData: () => Order[];
}

/**
 * Composant pour afficher la table des commandes
 * Gère le filtrage et l'affichage des données
 */
const OrdersTable = forwardRef<OrdersTableRef, OrdersTableProps>(
  ({ orders, onViewDetails, onChangeStatus, onFilteredChange }, ref) => {
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
    const [statusFilter, setStatusFilter] = useState<string>("Tous");
    const [currentFilters, setCurrentFilters] = useState<any>({});

    // ✅ Options de filtre pour les commandes
    const filterOptions = {
      order_status: ["En attente", "Confirmée", "En traitement", "Expédiée", "Livrée", "Annulée"],
    };

    // ✅ Synchronise les commandes filtrées quand la liste change
    useEffect(() => {
      applyAllFilters(currentFilters);
    }, [orders]);

    // ✅ Notifier le parent des changements de filtres
    useEffect(() => {
      onFilteredChange?.(filteredOrders);
    }, [filteredOrders, onFilteredChange]);

    // ✅ Exposer la méthode getFilteredData au parent via la ref
    useImperativeHandle(ref, () => ({
      getFilteredData: () => filteredOrders,
    }));

    // ✅ Fonction pour obtenir le statut en français
    const getStatusLabel = (status: OrderStatus): string => {
      const labels: Record<OrderStatus, string> = {
        pending: "En attente",
        confirmed: "Confirmée",
        processing: "En traitement",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée",
      };
      return labels[status] || status;
    };

    // ✅ Fonction pour obtenir la valeur du statut à partir du label
    const getStatusValueFromLabel = (label: string): OrderStatus | undefined => {
      const mapping: Record<string, OrderStatus> = {
        "En attente": "pending",
        "Confirmée": "confirmed",
        "En traitement": "processing",
        "Expédiée": "shipped",
        "Livrée": "delivered",
        "Annulée": "cancelled",
      };
      return mapping[label];
    };

    const applyAllFilters = (filters: any) => {
      let result = orders;

      // Filtre de recherche
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(
          (o) =>
            o.reference?.toLowerCase().includes(searchTerm) ||
            o.user_id?.toLowerCase().includes(searchTerm)
          // ⚠️ Supprimé l'accès à shipping_address qui n'existe pas dans Order
        );
      }

      // Filtre statut commande via le composant Filter
      if (filters?.order_status) {
        const statusValue = getStatusValueFromLabel(filters.order_status);
        if (statusValue) {
          result = result.filter((o) => o.status.value === statusValue);
        }
      }

      // Filtre par date
      if (filters?.dateFilter && filters.dateFilter !== "all") {
        result = result.filter((order) => {
          const orderDate = new Date(order.created_at);

          if (filters.dateFilter === "exact" && filters.exactDate) {
            const filterDate = new Date(filters.exactDate);
            return (
              orderDate.getFullYear() === filterDate.getFullYear() &&
              orderDate.getMonth() === filterDate.getMonth() &&
              orderDate.getDate() === filterDate.getDate()
            );
          }

          if (filters.dateFilter === "range" && filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            return orderDate >= startDate && orderDate <= endDate;
          }

          return true;
        });
      }

      // Filtre additionnel: statut via le select
      if (statusFilter !== "Tous") {
        const statusValue = getStatusValueFromLabel(statusFilter);
        if (statusValue) {
          result = result.filter((o) => o.status.value === statusValue);
        }
      }

      setFilteredOrders(result);
      setCurrentFilters(filters);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setStatusFilter(value);
      applyAllFilters({ ...currentFilters });
    };

    // ✅ Fonction pour obtenir la couleur du statut
    const getStatusColor = (status: OrderStatus) => {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "confirmed":
          return "bg-blue-100 text-blue-800";
        case "processing":
          return "bg-purple-100 text-purple-800";
        case "shipped":
          return "bg-indigo-100 text-indigo-800";
        case "delivered":
          return "bg-green-100 text-green-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <>
        {/* Filtre générique */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-4">
            <Filter<OrderFilters>
              options={filterOptions}
              onFilterChange={(filters) => {
                setCurrentFilters(filters);
                applyAllFilters(filters);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="
                    appearance-none
                    bg-white
                    border border-gray-200
                    rounded-xl
                    px-4 py-2
                    pr-10
                    text-sm font-medium text-slate-700
                    shadow-sm
                    hover:border-slate-400
                    transition
                    outline-none
                    focus:outline-none
                    focus:border-slate-500
                    ring-0
                  "
                >
                  <optgroup label="— Statut commande —">
                    <option value="Tous">Tous</option>
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="En traitement">En traitement</option>
                    <option value="Expédiée">Expédiée</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
                  </optgroup>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Table des commandes */}
        <div className="mt-5 overflow-x-auto overflow-y-auto max-h-150 rounded-lg border border-gray-300">
          <table className="table table-zebra table-pin-rows table-pin-cols">
            <thead className="sticky top-0 bg-base-200 z-10">
              <tr>
                <th scope="col">Référence</th>
                <th scope="col">Date</th>
                <th scope="col">Client</th>
                <th scope="col">Montant</th>
                <th scope="col">Statut</th>
                <th scope="col">Articles</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono font-medium">{order.reference}</td>
                    <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {/* ⚠️ On ne peut plus afficher le nom complet car shipping_address n'existe pas */}
                      {order.user_id || 'Client inconnu'}
                    </td>
                    <td className="font-medium">
                      {order.total_amount.toLocaleString()} €
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status.value)}`}
                      >
                        {order.status.label}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} articles
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-sm btn-outline rounded-lg"
                          onClick={() => onViewDetails(order)}
                          aria-label={`Voir les détails de la commande ${order.reference}`}
                        >
                          <Eye className="w-4 h-4" />
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pied de tableau avec compteur */}
        <div className="mt-4 text-sm text-gray-600">
          Total: {filteredOrders.length} commande(s) sur {orders.length}
        </div>
      </>
    );
  }
);

OrdersTable.displayName = "OrdersTable";

export default OrdersTable;
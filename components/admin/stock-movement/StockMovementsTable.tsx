// components/admin/stock-movement/StockMovementsTable.tsx
"use client";

import type { StockMovement } from "@/types/stock-movement";
import Filter from "@/components/admin/Filter";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

interface StockMovementsTableProps {
  movements: StockMovement[];
  onFilteredChange?: (filtered: StockMovement[]) => void;
}

/**
 * Composant pour afficher la table des mouvements de stock
 * Gère le filtrage et l'affichage des données
 * Props :
 * - movements : liste des mouvements à afficher
 * - onFilteredChange : callback pour remonter les données filtrées (pour l'export)
 */
const StockMovementsTable = forwardRef<{ getFilteredData: () => StockMovement[] }, StockMovementsTableProps>(
  ({ movements, onFilteredChange }, ref) => {
    // ✅ État pour les mouvements filtrés
    const [filteredMovements, setFilteredMovements] = useState<StockMovement[]>(movements);

    // ✅ Synchronise les mouvements filtrés quand la liste change
    useEffect(() => {
      setFilteredMovements(movements);
      onFilteredChange?.(movements);
    }, [movements, onFilteredChange]);

    // ✅ Expose la méthode getFilteredData au parent via la ref
    useImperativeHandle(ref, () => ({
      getFilteredData: () => filteredMovements
    }));

    // Mise à jour des mouvements filtrés
    const handleFilterChange = (filters: any) => {
      let result = movements;

      // Filtre de recherche
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(
          (m) =>
            m.product?.name?.toLowerCase().includes(searchTerm) ||
            m.reason.toLowerCase().includes(searchTerm) ||
            m.metadata?.toLowerCase().includes(searchTerm)
        );
      }

      // Filtre par type de mouvement
      if (filters.movement_type && filters.movement_type !== '') {
        result = result.filter((m) => m.movement_type === filters.movement_type);
      }

      // ✅ NOUVEAU : Filtre par date
      if (filters?.dateFilter && filters.dateFilter !== "all") {
        result = result.filter((movement) => {
          // Vérifier si la date de création existe
          if (!movement.created_at) return false;

          const movementDate = new Date(movement.created_at);

          // Filtre date précise
          if (filters.dateFilter === "exact" && filters.exactDate) {
            const filterDate = new Date(filters.exactDate);
            return (
              movementDate.getFullYear() === filterDate.getFullYear() &&
              movementDate.getMonth() === filterDate.getMonth() &&
              movementDate.getDate() === filterDate.getDate()
            );
          }

          // Filtre intervalle de dates
          if (filters.dateFilter === "range") {
            // Si les deux dates sont fournies
            if (filters.startDate && filters.endDate) {
              const startDate = new Date(filters.startDate);
              const endDate = new Date(filters.endDate);

              // Normaliser les dates pour une comparaison correcte
              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(23, 59, 59, 999);

              return movementDate >= startDate && movementDate <= endDate;
            }
            // Si seulement la date de début est fournie
            else if (filters.startDate) {
              const startDate = new Date(filters.startDate);
              startDate.setHours(0, 0, 0, 0);
              return movementDate >= startDate;
            }
            // Si seulement la date de fin est fournie
            else if (filters.endDate) {
              const endDate = new Date(filters.endDate);
              endDate.setHours(23, 59, 59, 999);
              return movementDate <= endDate;
            }
          }

          return true;
        });
      }

      setFilteredMovements(result);
      onFilteredChange?.(result);
    };

    return (
      <>
        {/* Filtre générique avec options pour le type de mouvement */}
        <Filter<StockMovement>
          options={{
            movement_type: ["in", "out"]
          }}
          onFilterChange={handleFilterChange}
        />

        {/* Table des mouvements avec scroll */}
        <div className="mt-5 overflow-x-auto overflow-y-auto max-h-150 rounded-lg border border-gray-300">
          <table className="table table-zebra table-pin-rows table-pin-cols">
            <thead className="sticky top-0 bg-base-200 z-10 ">
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">Produit</th>
                <th scope="col">Type</th>
                <th scope="col">Quantité</th>
                <th scope="col">Raison</th>
                <th scope="col">Stock ancien</th>
                <th scope="col">Stock nouveau</th>
                <th scope="col">Référence</th>
                <th scope="col">Date de création</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    Aucun mouvement de stock trouvé
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="hover:bg-base-300 cursor-default"
                  >
                    <td>{movement.id}</td>
                    <td>
                      <div>
                        <div className="font-medium">{movement.product?.name || 'N/A'}</div>
                        {/* <div className="text-xs text-gray-500">ID: {movement.product_id}</div> */}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${movement.movement_type === 'in' ? 'badge-success' : 'badge-error'} text-white`}>
                        {movement.movement_type === 'in' ? 'Entrée' : 'Sortie'}
                      </span>
                    </td>
                    <td className="font-medium">{movement.quantity}</td>
                    <td>{movement.reason}</td>
                    <td>{movement.old_stock ?? '-'}</td>
                    <td>{movement.new_stock ?? '-'}</td>
                    <td>{movement.metadata || '-'}</td>
                    <td>{movement.created_at ? new Date(movement.created_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau avec compteur */}
        <div className="mt-4 text-sm text-gray-600">
          Total: {filteredMovements.length} mouvement(s) sur {movements.length}
        </div>
      </>
    );
  }
);

StockMovementsTable.displayName = 'StockMovementsTable';

export default StockMovementsTable;
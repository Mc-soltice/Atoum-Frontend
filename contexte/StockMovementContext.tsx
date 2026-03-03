"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { StockMovement } from "@/types/stock-movement";
import { toast } from "react-hot-toast";

interface StockMovementContextType {
  movements: StockMovement[];
  loading: boolean;
  error: string | null;

  fetchAllMovements: () => Promise<void>;
  refresh: () => Promise<void>;
}

const StockMovementContext = createContext<StockMovementContextType | undefined>(undefined);

export function StockMovementProvider({ children }: { children: React.ReactNode }) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllMovements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stock-movements");
      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setMovements(data);
    } catch (err) {
      console.error("❌ fetchAllMovements:", err);
      setError("Impossible de charger les mouvements");
      toast.error("Erreur chargement mouvements de stock");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <StockMovementContext.Provider
      value={{
        movements,
        loading,
        error,
        fetchAllMovements,
        refresh: fetchAllMovements,
      }}
    >
      {children}
    </StockMovementContext.Provider>
  );
}

export const useStockMovements = () => {
  const ctx = useContext(StockMovementContext);
  if (!ctx) {
    throw new Error("useStockMovements doit être utilisé dans StockMovementProvider");
  }
  return ctx;
};
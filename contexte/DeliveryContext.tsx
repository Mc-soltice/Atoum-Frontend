"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { deliveryService } from "@/services/delivery.service";
import {
  DeliveryOption,
  DeliveryOptionFilters,
  DeliveryOptionPayload,
} from "@/types/delivery";

interface DeliveryContextType {
  options: DeliveryOption[];
  available: DeliveryOption[];
  loading: boolean;
  error: string | null;

  fetchAll: (filters?: DeliveryOptionFilters) => Promise<void>;
  fetchAvailable: () => Promise<void>;
  create: (data: DeliveryOptionPayload) => Promise<void>;
  update: (id: string, data: DeliveryOptionPayload) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  reorder: (items: { id: string; order: number }[]) => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextType | null>(null);

export const DeliveryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [available, setAvailable] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async (filters?: DeliveryOptionFilters) => {
    setLoading(true);
    setError(null);

    try {
      console.log("📦 Fetch delivery options", filters);
      const res = await deliveryService.getAll(filters);
      setOptions(res.data);
    } catch (err: any) {
      console.error("❌ fetchAll delivery error", err);
      setError(err.response?.data?.message || "Erreur chargement options");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailable = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deliveryService.getAvailable();
      setAvailable(data);
    } catch (err: any) {
      setError("Erreur chargement livraisons");
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: DeliveryOptionPayload) => {
    try {
      console.log("➕ Create delivery option", payload);
      await deliveryService.create(payload);
      await fetchAll();
    } catch (err: any) {
      console.error("❌ create delivery error", err);
      throw err;
    }
  };

  const update = async (id: string, payload: DeliveryOptionPayload) => {
    try {
      console.log("✏️ Update delivery option", id);
      await deliveryService.update(id, payload);
      await fetchAll();
    } catch (err: any) {
      console.error("❌ update delivery error", err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      console.log("🗑️ Delete delivery option", id);
      await deliveryService.remove(id);
      await fetchAll();
    } catch (err: any) {
      console.error("❌ delete delivery error", err);
      throw err;
    }
  };

  const toggle = async (id: string) => {
    try {
      console.log("🔄 Toggle delivery option", id);
      await deliveryService.toggle(id);
      await fetchAll();
    } catch (err: any) {
      console.error("❌ toggle error", err);
    }
  };

  const reorder = async (items: { id: string; order: number }[]) => {
    try {
      console.log("📊 Reorder delivery options", items);
      await deliveryService.reorder({ order: items });
      await fetchAll();
    } catch (err: any) {
      console.error("❌ reorder error", err);
    }
  };

  useEffect(() => {
    fetchAvailable();
  }, []);

  return (
    <DeliveryContext.Provider
      value={{
        options,
        available,
        loading,
        error,
        fetchAll,
        fetchAvailable,
        create,
        update,
        remove,
        toggle,
        reorder,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const ctx = useContext(DeliveryContext);
  if (!ctx) throw new Error("useDelivery must be used inside DeliveryProvider");
  return ctx;
};

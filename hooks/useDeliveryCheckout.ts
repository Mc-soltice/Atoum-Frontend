"use client";

import { useDelivery } from "@/contexte/DeliveryContext";
import { useCart } from "@/contexte/panier/CartContext";
import { DeliveryOption } from "@/types/delivery";
import { useEffect, useCallback } from "react";

export function useDeliveryCheckout() {
  const { deliveryOptionId, setDeliveryOptionId } = useCart();
  const {
    available: deliveryOptions,
    loading,
    error,
    fetchAvailable,
  } = useDelivery();

  // Trouver l'option de livraison correspondant à l'ID stocké
  const selectedOption =
    deliveryOptions.find((option) => option.id === deliveryOptionId) || null;

  // Sélection automatique de la première option disponible
  useEffect(() => {
    if (deliveryOptions.length > 0 && !deliveryOptionId) {
      // Trouver une option active par défaut
      const activeOptions = deliveryOptions.filter(
        (option) => option.is_active,
      );
      if (activeOptions.length > 0) {
        setDeliveryOptionId(activeOptions[0].id);
      }
    }
  }, [deliveryOptions, deliveryOptionId, setDeliveryOptionId]);

  const handleSelectDelivery = useCallback(
    (option: DeliveryOption) => {
      if (option.is_active) {
        setDeliveryOptionId(option.id);
      }
    },
    [setDeliveryOptionId],
  );

  const getDeliveryPrice = useCallback(() => {
    if (!selectedOption) return 0;
    return parseFloat(selectedOption.price);
  }, [selectedOption]);

  return {
    deliveryOptions: deliveryOptions.filter((option) => option.is_active),
    selectedOption,
    loading,
    error,
    selectDelivery: handleSelectDelivery,
    refreshOptions: fetchAvailable,
    getDeliveryPrice,
  };
}

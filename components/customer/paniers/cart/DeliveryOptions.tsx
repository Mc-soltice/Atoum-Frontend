"use client";

// ✅ Importer depuis les bons fichiers
import { useCart } from "@/contexte/panier/CartContext";
import { useDelivery } from "@/contexte/DeliveryContext"; // Importer le hook de livraison
import type { DeliveryOption } from "@/types/delivery"; // Importer le type depuis le bon endroit
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Composant pour sélectionner les options de livraison
 * Affiche les différentes options avec leurs prix et délais
 */
export default function DeliveryOptions() {
  // ================= CONTEXTES =================
  const { deliveryOptionId, setDeliveryOptionId } = useCart();
  const { available, loading, fetchAvailable } = useDelivery(); // Récupérer les options disponibles

  const [selectedOption, setSelectedOption] = useState<DeliveryOption | null>(null);

  // Charger les options de livraison disponibles
  useEffect(() => {
    fetchAvailable();
  }, [fetchAvailable]);

  // Trouver l'option sélectionnée
  useEffect(() => {
    if (deliveryOptionId && available.length > 0) {
      const option = available.find(opt => opt.id === deliveryOptionId);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [deliveryOptionId, available]);

  /**
   * Gère la sélection d'une option de livraison
   * @param option - Option de livraison choisie
   */
  const handleSelectOption = (option: DeliveryOption) => {
    setDeliveryOptionId(option.id);
    setSelectedOption(option);
  };

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Options de livraison
          </h3>
          <p className="text-sm text-gray-600">Chargement des options...</p>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ================= TITRE DE SECTION ================= */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Options de livraison
        </h3>
        <p className="text-sm text-gray-600">
          Choisissez le mode de livraison qui vous convient
        </p>
      </div>

      {/* ================= LISTE DES OPTIONS ================= */}
      <div className="space-y-3">
        {available.map((option) => {
          const isSelected = selectedOption?.id === option.id;

          return (
            <div
              key={option.id}
              onClick={() => handleSelectOption(option)}
              className={`
                relative cursor-pointer
                p-4 rounded-xl border-2
                transition-all duration-300
                ${isSelected
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
                }
                hover:shadow-md
              `}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectOption(option);
                }
              }}
            >
              {/* Indicateur de sélection */}
              {isSelected && (
                <div
                  className="
                    absolute -top-2 -right-2
                    w-6 h-6
                    bg-linear-to-r from-orange-500 to-amber-500
                    text-white
                    rounded-full flex items-center justify-center
                    shadow-md
                  "
                >
                  <Check className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {/* Informations */}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {option.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-700">
                      <span className="font-medium">
                        Délai estimé : {option.delay_days} jour
                        {option.delay_days > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prix */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {Number(option.price) > 0
                      ? `${Number(option.price).toLocaleString()} €`
                      : "Gratuit"}
                  </div>
                  {Number(option.price) === 0 && (
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      Économisez sur la livraison
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
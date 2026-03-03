import { Truck, Store } from "lucide-react";
import { DeliveryOption } from "@/types/delivery";

interface DeliveryOptionsSectionProps {
  options: DeliveryOption[];
  selectedOption: DeliveryOption | null;
  onSelect: (option: DeliveryOption) => void;
  loading: boolean;
}

function DeliveryOptionsSection({
  options,
  selectedOption,
  onSelect,
  loading,
}: DeliveryOptionsSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl mt-4"></div>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="text-center py-8">
        <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucune option de livraison disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <DeliveryOptionCard
            key={option.id}
            option={option}
            selected={selectedOption?.id === option.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// Modifiez DeliveryOptionCard pour utiliser les données du backend :
function DeliveryOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: DeliveryOption;
  selected: boolean;
  onSelect: (option: DeliveryOption) => void;
}) {
  // Fonction pour obtenir une icône basée sur le nom
  const getIcon = (name: string) => {
    if (
      name.toLowerCase().includes("standard") ||
      name.toLowerCase().includes("livraison")
    ) {
      return <Truck className="w-5 h-5 text-primary" />;
    }
    if (
      name.toLowerCase().includes("retrait") ||
      name.toLowerCase().includes("magasin")
    ) {
      return <Store className="w-5 h-5 text-primary" />;
    }
    return <Truck className="w-5 h-5 text-primary" />;
  };

  return (
    <div
      onClick={() => onSelect(option)}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selected
          ? "border-amber-100 bg-primary/5"
          : "border-gray-200 hover:border-gray-300"
        } ${!option.is_active ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getIcon(option.name)}</div>
        <div className="flex-1">
          <div className="font-bold text-gray-800">{option.name}</div>
          <div className="text-sm text-gray-600 mt-1">
            {option.description || "Livraison standard"}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm font-medium text-primary">
              {option.delay_days} jour{option.delay_days > 1 ? "s" : ""}
            </div>
            <div className="font-bold">
              {parseFloat(option.price) > 0
                ? `${parseFloat(option.price).toFixed(2)} €`
                : "Gratuit"}
            </div>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary bg-primary" : "border-gray-300"
            }`}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
      </div>
    </div>
  );
}

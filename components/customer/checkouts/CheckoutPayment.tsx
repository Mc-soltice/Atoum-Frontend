"use client";

import { useState } from "react";
import { PaymentInfo } from "@/types/order";
import { Smartphone, CreditCard, HandCoins } from "lucide-react";

interface Props {
  method: PaymentInfo["method"];
  onChange: (m: PaymentInfo["method"]) => void;
}

export default function CheckoutPayment({ method, onChange }: Props) {
  const [showCardForm, setShowCardForm] = useState(false);

  const options = [
    {
      value: "cash_on_delivery" as const,
      label: "Paiement à la livraison",
      icon: <HandCoins className="w-6 h-6 text-primary" />,
      description: "Payez lorsque vous recevez votre commande",
      popular: true,
    },
    {
      value: "mobile_money" as const,
      label: "Mobile Money",
      icon: <Smartphone className="w-6 h-6 text-primary" />,
      description: "Orange Money, Wave, Free Money",
      popular: false,
    },
    {
      value: "credit_card" as const,
      label: "Carte bancaire",
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      description: "Visa, Mastercard, CB",
      popular: false,
    },
  ];

  const handleMethodChange = (newMethod: PaymentInfo["method"]) => {
    onChange(newMethod);
    setShowCardForm(newMethod === "credit_card");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => handleMethodChange(opt.value)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              method === opt.value
                ? "border-amber-100 bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl shrink-0">{opt.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-gray-800">{opt.label}</div>
                  {opt.popular && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      Populaire
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {opt.description}
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  method === opt.value
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                }`}
              >
                {method === opt.value && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire de carte (conditionnel) */}
      {showCardForm && (
        <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 space-y-4 animate-fadeIn">
          <h3 className="font-bold text-gray-800">Informations de carte</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Numéro de carte</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date d&apos;expiration
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Titulaire de la carte
              </label>
              <input
                type="text"
                placeholder="Nom sur la carte"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sécurité et garanties */}
      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">🛡️</span>
          <div className="text-sm text-green-800">
            <p className="font-medium">Paiement 100% sécurisé</p>
            <p>Vos données bancaires sont chiffrées et protégées</p>
          </div>
        </div>
      </div>
    </div>
  );
}

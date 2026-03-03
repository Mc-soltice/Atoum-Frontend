"use client";

import { ShippingAddress } from "@/types/order";
import { useState } from "react";
import { User, Tag, Mail, PhoneCall, MapPin, AlertCircle } from "lucide-react";

interface Props {
  value: ShippingAddress;
  onChange: (data: ShippingAddress) => void;
}

export default function CheckoutAddressForm({ value, onChange }: Props) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});

  const update = (field: keyof ShippingAddress, v: string) => {
    onChange({ ...value, [field]: v });

    // Validation en temps réel
    if (
      v.trim() === "" &&
      ["first_name", "last_name", "email", "phone", "address"].includes(field)
    ) {
      setErrors((prev) => ({ ...prev, [field]: "Ce champ est requis" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));

      // Validation spécifique pour l'email
      if (field === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        setErrors((prev) => ({ ...prev, email: "Email invalide" }));
      }

      // Validation pour le téléphone
      if (field === "phone" && v && !/^[0-9+\-\s()]{8,}$/.test(v)) {
        setErrors((prev) => ({ ...prev, phone: "Numéro invalide" }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Prénom"
          value={value.first_name}
          onChange={(v) => update("first_name", v)}
          error={errors.first_name}
          required
          icon={<User className="w-4 h-4 text-gray-500" />}
        />

        <InputField
          label="Nom"
          value={value.last_name}
          onChange={(v) => update("last_name", v)}
          error={errors.last_name}
          required
          icon={<Tag className="w-4 h-4 text-gray-500" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Email"
          type="email"
          value={value.email}
          onChange={(v) => update("email", v)}
          error={errors.email}
          required
          icon={<Mail className="w-4 h-4 text-gray-500" />}
          placeholder="votre@email.com"
        />
        <InputField
          label="Téléphone"
          type="tel"
          value={value.phone}
          onChange={(v) => update("phone", v)}
          error={errors.phone}
          required
          icon={<PhoneCall className="w-4 h-4 text-gray-500" />}
          placeholder="+221 XX XXX XX XX"
        />
      </div>

      <InputField
        label="Adresse"
        value={value.address}
        onChange={(v) => update("address", v)}
        error={errors.address}
        required
        icon={<MapPin className="w-4 h-4 text-gray-500" />}
        placeholder="Rue, numéro, appartement"
      />

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-amber-500 mt-1">
            <AlertCircle className="w-7 h-7" />
          </span>
          <div className="text-sm text-amber-800">
            <p className="font-medium">
              Assurez-vous que votre adresse est correcte
            </p>
            <p>
              Les informations erronées peuvent entraîner des retards de
              livraison
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  error,
  required,
  icon,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        className={`w-full border rounded-lg p-3 text-sm transition-all focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:ring-red-200 bg-red-50"
            : "border-gray-300 focus:border-primary focus:ring-primary/20 hover:border-gray-400"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && (
        <div className="text-red-500 text-xs flex items-center gap-1">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

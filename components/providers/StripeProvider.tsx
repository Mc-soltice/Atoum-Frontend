"use client";

import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripe";
import { ReactNode } from "react";

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

/**
 * Wrapper Stripe Elements.
 * À utiliser uniquement quand clientSecret est disponible (après createPaymentIntent).
 * Ne pas monter ce composant sans clientSecret valide.
 */
export default function StripeProvider({
  clientSecret,
  children,
}: StripeProviderProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    locale: "fr", // interface Stripe en français
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#1a1a1a",
        colorBackground: "#ffffff",
        colorText: "#1a1a1a",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      {children}
    </Elements>
  );
}

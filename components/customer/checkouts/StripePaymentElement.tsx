"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

interface StripePaymentElementProps {
  amount: number; // en euros
  onSuccess: (paymentIntentId: string) => void;
  onError: (errorMessage: string) => void;
  // URL de retour après confirmation Stripe (peut contenir order_id en query)
  returnUrl?: string;
}

/**
 * Formulaire de paiement Stripe.
 * Doit être monté à l'intérieur d'un <StripeProvider clientSecret={...}>.
 *
 * Stripe redirige vers /payment-success?payment_intent=pi_xxx après confirmation.
 * La page payment-success s'occupe de la vérification finale côté Laravel.
 */
export default function StripePaymentElement({
  amount,
  onSuccess,
  onError,
  returnUrl,
}: StripePaymentElementProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // confirmPayment redirige vers return_url si 3D Secure est requis
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Utiliser la returnUrl passée depuis la page parente si fournie
          return_url: returnUrl ?? `${window.location.origin}/payment-success`,
        },
        // redirect: "if_required" évite une redirection si le paiement réussit immédiatement
        redirect: "if_required",
      });

      if (error) {
        const msg =
          error.type === "card_error" || error.type === "validation_error"
            ? (error.message ?? "Erreur de paiement.")
            : "Une erreur inattendue est survenue.";
        setErrorMessage(msg);
        onError(msg);
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(paymentIntent.id);
      } else if (paymentIntent?.status === "requires_action") {
        // 3D Secure géré automatiquement par Stripe via return_url
        // Ce cas ne devrait pas arriver avec redirect: "if_required"
        setErrorMessage("Authentification supplémentaire requise.");
      }
    } catch (err) {
      const msg = "Erreur lors du traitement du paiement.";
      setErrorMessage(msg);
      onError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Formulaire de carte Stripe (géré intégralement par Stripe) */}
      <PaymentElement
        options={{
          layout: "tabs", // affiche onglets Card / SEPA / etc.
        }}
      />

      {/* Message d'erreur */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Bouton de paiement */}
      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 00-9.95 9H4z"
              />
            </svg>
            Traitement en cours...
          </span>
        ) : (
          `Payer ${formattedAmount}`
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Paiement sécurisé par{" "}
        <span className="font-semibold text-gray-500">Stripe</span>. Vos données
        ne sont jamais stockées sur nos serveurs.
      </p>
    </form>
  );
}

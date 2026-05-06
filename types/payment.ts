// Réponse de l'endpoint Laravel POST /api/payments/create-intent
export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

// Payload envoyé à Laravel pour créer un intent
export interface CreatePaymentIntentPayload {
  order_id?: string;
  amount: number; // en euros (ex: 49.99)
}

// Réponse de l'endpoint Laravel POST /api/payments/verify
export interface VerifyPaymentResponse {
  success: boolean;
  order_id?: string;
  message?: string;
}

// Résultat local du processus de paiement Stripe
export interface StripePaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

// Mise à jour du type PaymentInfo existant dans types/order.ts
// (à fusionner manuellement avec votre fichier existant)
export interface PaymentInfo {
  method: "stripe" | "mobile_money" | "cash_on_delivery";
  transaction_id?: string;
  stripe_payment_intent_id?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paid_at?: string;
}

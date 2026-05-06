import api from "@/lib/axios";
import {
  CreatePaymentIntentPayload,
  CreatePaymentIntentResponse,
  VerifyPaymentResponse,
} from "@/types/payment";

class PaymentService {
  /**
   * Crée un Payment Intent côté Laravel.
   * Laravel appellera Stripe et retournera le client_secret.
   *
   * Route Laravel attendue : POST /api/payments/create-intent
   * Auth : Sanctum Bearer token (envoyé automatiquement par axios.ts)
   */
  async createPaymentIntent(
    payload: CreatePaymentIntentPayload
  ): Promise<CreatePaymentIntentResponse> {
    const response = await api.post<CreatePaymentIntentResponse>(
      "/payments/create-intent",
      payload
    );
    return response.data;
  }

  /**
   * Vérifie côté Laravel que le paiement est bien "succeeded" chez Stripe.
   * Laravel récupère le PaymentIntent via la clé secrète Stripe.
   *
   * Route Laravel attendue : POST /api/payments/verify
   */
  async verifyPayment(
    paymentIntentId: string
  ): Promise<VerifyPaymentResponse> {
    const response = await api.post<VerifyPaymentResponse>(
      "/payments/verify",
      { payment_intent_id: paymentIntentId }
    );
    return response.data;
  }
}

export const paymentService = new PaymentService();

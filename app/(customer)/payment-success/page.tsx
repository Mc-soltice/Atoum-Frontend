"use client";

import { paymentService } from "@/services/payment.service";
import { orderService } from "@/services/order.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Vérification du paiement...");

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent");
    const orderIdParam = searchParams.get("order_id");
    if (!paymentIntentId) {
      setMessage("Aucun payment_intent fourni.");
      setTimeout(() => router.push("/checkout"), 1500);
      return;
    }

    (async () => {
      try {
        const result = await paymentService.verifyPayment(paymentIntentId);

        if (result.success) {
          const orderId = result.order_id;
          setMessage("Paiement confirmé. Redirection...");
          if (orderId) router.push(`/order-success/${orderId}`);
          else router.push("/order-success");
          return;
        }

        // Si la vérification échoue côté backend (ex: en attente webhook) ou
        // si nous n'avons pas d'order_id, tenter le polling par order_id si
        // disponible dans l'URL.
        if (orderIdParam) {
          setMessage("Vérification en cours côté serveur, attente confirmation...");
          let attempts = 0;
          const maxAttempts = 40; // ~2 minutes

          const intervalId = setInterval(async () => {
            attempts += 1;
            try {
              const order = await orderService.getById(orderIdParam);
              if (order && (order.status === "confirmed" || order.status === "succeeded")) {
                clearInterval(intervalId);
                router.push(`/order-success/${orderIdParam}`);
              } else if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                setMessage("Délai d'attente dépassé. Revenez plus tard ou contactez le support.");
                setTimeout(() => router.push("/checkout"), 4000);
              }
            } catch (pollErr) {
              console.error("Erreur polling commande:", pollErr);
              // continuer à réessayer jusqu'à maxAttempts
            }
          }, 3000);
        } else {
          setMessage(result.message || "Paiement non confirmé.");
          setTimeout(() => router.push("/checkout"), 2000);
        }
      } catch (err) {
        console.error("Erreur vérification paiement:", err);

        // En cas d'erreur réseau, si on a l'order_id param on démarre le polling
        if (orderIdParam) {
          setMessage("Connexion perdue, vérification en cours côté serveur... ");
          let attempts = 0;
          const maxAttempts = 40;
          const intervalId = setInterval(async () => {
            attempts += 1;
            try {
              const order = await orderService.getById(orderIdParam);
              if (order && (order.status === "confirmed" || order.status === "succeeded")) {
                clearInterval(intervalId);
                router.push(`/order-success/${orderIdParam}`);
              } else if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                setMessage("Délai d'attente dépassé. Revenez plus tard ou contactez le support.");
                setTimeout(() => router.push("/checkout"), 4000);
              }
            } catch (pollErr) {
              console.error("Erreur polling commande:", pollErr);
            }
          }, 3000);
        } else {
          setMessage("Erreur de vérification. Retour au checkout...");
          setTimeout(() => router.push("/checkout"), 2000);
        }
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow text-center">
        <h1 className="text-xl font-semibold mb-2">{message}</h1>
        <p className="text-sm text-gray-500">
          Patientez pendant la vérification.
        </p>
      </div>
    </div>
  );
}

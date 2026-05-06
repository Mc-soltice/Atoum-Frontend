# 📋 Sprint d'Intégration Stripe - Atoum E-Commerce

**Date:** 4 mai 2026  
**Version:** 1.0  
**Status:** En planification  
**Durée estimée:** 2-3 sprints (4-6 semaines)

---

## 📌 Vue d'ensemble

Ce document définit les spécifications techniques pour intégrer **Stripe** comme passerelle de paiement principale dans l'application Atoum E-Commerce (Next.js + React).

### Objectifs du sprint

- ✅ Intégrer Stripe Checkout et Stripe Elements
- ✅ Créer des endpoints API pour gérer les paiements
- ✅ Implémenter les webhooks Stripe pour les notifications
- ✅ Sécuriser les données de paiement (PCI compliance)
- ✅ Tester en sandbox et produire

---

## 🏗️ Architecture actuelle

### Stack technologique

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Gestion d'état:** Context API (OrderContext, CartContext)
- **Requêtes HTTP:** Axios
- **Paiements actuels:**
  - Cash on delivery (Paiement à la livraison)
  - Mobile Money
  - Carte bancaire (formulaire statique, non fonctionnel)

### Structure existante pour les paiements

```
app/
  └─ (customer)/checkout/page.tsx          # Page checkout multi-étapes
components/customer/
  └─ checkouts/
     ├─ CheckoutPayment.tsx                 # Sélection méthode paiement
     ├─ CheckoutAddressForm.tsx
     ├─ CheckoutSummary.tsx
     └─ CheckoutActions.tsx
contexte/OrderContext.tsx                   # Gestion commandes
types/order.ts                              # Types paiement
services/order.service.ts                   # API commandes
```

### Types de paiement existants

```typescript
export interface PaymentInfo {
  method: "credit_card" | "mobile_money" | "cash_on_delivery";
  transaction_id?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paid_at?: string;
}
```

---

## 🎯 Fonctionnalités à implémenter

### Phase 1️⃣: Configuration et Setup (Semaine 1-2)

#### 1.1 Installation et configuration Stripe

**Tâche:** Ajouter les dépendances Stripe

```bash
npm install @stripe/react-stripe-js @stripe/js
npm install --save-dev @types/stripe
```

**Fichiers à créer/modifier:**

- `lib/stripe.ts` - Configuration Stripe côté client
- `lib/stripe-server.ts` - Configuration Stripe côté serveur (Node SDK)
- `.env.local` - Variables d'environnement

**Contenu minimum `lib/stripe.ts`:**

```typescript
import { loadStripe } from "@stripe/js";

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
```

**Variables d'environnement:**

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 1.2 Mise à jour des types TypeScript

**Fichier:** `types/payment.ts` (nouveau)

```typescript
export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "succeeded" | "requires_action";
}

export interface StripePaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export interface PaymentWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      metadata: {
        order_id: string;
        user_id: string;
      };
    };
  };
}
```

#### 1.3 Mise à jour du type de paiement existant

**Fichier:** `types/order.ts`

```typescript
// Ajouter:
export interface PaymentInfo {
  method: "stripe" | "mobile_money" | "cash_on_delivery";
  transaction_id?: string;
  stripe_payment_intent_id?: string; // Nouveau
  status: "pending" | "completed" | "failed" | "refunded";
  paid_at?: string;
}
```

---

### Phase 2️⃣: Frontend Stripe Elements (Semaine 2-3)

#### 2.1 Créer le composant Stripe Payment Elements

**Fichier:** `components/customer/checkouts/StripePaymentElement.tsx` (nouveau)

```typescript
'use client';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';

interface Props {
  amount: number;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

export default function StripePaymentElement({
  clientSecret,
  onSuccess,
  onError,
  isProcessing,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        onError(error.message || 'Erreur de paiement');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      onError('Erreur lors du traitement du paiement');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-primary text-white py-3 rounded-lg font-bold"
      >
        {isProcessing ? 'Traitement...' : 'Payer'}
      </button>
    </form>
  );
}
```

#### 2.2 Wrapper Elements Provider

**Fichier:** `components/providers/StripeProvider.tsx` (nouveau)

```typescript
'use client';

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function StripeProvider({ children }: Props) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
```

#### 2.3 Mettre à jour CheckoutPayment.tsx

**Fichier:** `components/customer/checkouts/CheckoutPayment.tsx`

```typescript
// Remplacer le formulaire de carte statique par :
{showCardForm && clientSecret && (
  <StripePaymentElement
    clientSecret={clientSecret}
    amount={total}
    onSuccess={handlePaymentSuccess}
    onError={handlePaymentError}
    isProcessing={isProcessing}
  />
)}
```

#### 2.4 Créer page de confirmation

**Fichier:** `app/(customer)/payment-success/page.tsx` (nouveau)

```typescript
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { orderService } from '@/services/order.service';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    if (paymentIntentId) {
      // Vérifier le statut du paiement
      validatePayment(paymentIntentId);
    }
  }, [paymentIntentId]);

  const validatePayment = async (intentId: string) => {
    try {
      // Appel API pour confirmer le paiement
      const result = await fetch('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ payment_intent_id: intentId }),
      });
      const data = await result.json();

      if (data.success) {
        router.push(`/order-success/${data.order_id}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      router.push('/checkout');
    }
  };

  return <div>Vérification du paiement...</div>;
}
```

---

### Phase 3️⃣: Backend API Endpoints (Semaine 2-3)

#### 3.1 Créer endpoint POST /api/payments/create-intent

**Fichier:** `app/api/payments/create-intent/route.ts` (nouveau)

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { amount, orderId, metadata } = await request.json();

    // Créer Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les cents
      currency: "usd",
      metadata: {
        order_id: orderId,
        user_id: session.user?.email,
        ...metadata,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Erreur création Payment Intent:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

#### 3.2 Créer endpoint POST /api/payments/verify

**Fichier:** `app/api/payments/verify/route.ts` (nouveau)

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { payment_intent_id } = await request.json();

    // Récupérer les détails du Payment Intent
    const paymentIntent =
      await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === "succeeded") {
      // Mettre à jour le statut de la commande
      const { order_id } = paymentIntent.metadata;

      // Appeler l'API backend pour mettre à jour la commande
      // await updateOrderPaymentStatus(order_id, 'completed');

      return NextResponse.json({
        success: true,
        order_id,
      });
    }

    return NextResponse.json(
      { success: false, error: "Paiement non confirmé" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Erreur vérification paiement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

#### 3.3 Créer endpoint Webhook POST /api/webhooks/stripe

**Fichier:** `app/api/webhooks/stripe/route.ts` (nouveau)

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "stream/consumers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await buffer(request.body!);
    const signature = request.headers.get("stripe-signature")!;

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Erreur signature webhook:", err.message);
      return NextResponse.json(
        { error: "Signature invalide" },
        { status: 400 },
      );
    }

    // Traiter les événements
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Événement non traité: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Paiement réussi:", paymentIntent.id);
  const { order_id } = paymentIntent.metadata;

  // Appeler votre API backend pour:
  // 1. Mettre à jour le statut du paiement
  // 2. Marquer la commande comme confirmée
  // 3. Envoyer email de confirmation
  // await updateOrderPaymentStatus(order_id, 'completed', paymentIntent.id);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Paiement échoué:", paymentIntent.id);
  const { order_id } = paymentIntent.metadata;

  // Mettre à jour le statut de la commande
  // await updateOrderPaymentStatus(order_id, 'failed', paymentIntent.id);
}

async function handleRefund(charge: Stripe.Charge) {
  console.log("Remboursement traité:", charge.id);
  // Mettre à jour les données de remboursement
}
```

---

### Phase 4️⃣: Mise à jour des services (Semaine 3)

#### 4.1 Créer PaymentService

**Fichier:** `services/payment.service.ts` (nouveau)

```typescript
import api from "@/lib/axios";

interface CreatePaymentIntentPayload {
  amount: number;
  orderId: string;
  metadata?: Record<string, any>;
}

interface VerifyPaymentPayload {
  payment_intent_id: string;
}

class PaymentService {
  async createPaymentIntent(
    payload: CreatePaymentIntentPayload,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const response = await api.post("/payments/create-intent", payload);
    return response.data;
  }

  async verifyPayment(
    payload: VerifyPaymentPayload,
  ): Promise<{ success: boolean; order_id?: string }> {
    const response = await api.post("/payments/verify", payload);
    return response.data;
  }

  async getPaymentHistory(): Promise<any[]> {
    const response = await api.get("/payments/history");
    return response.data.data || response.data;
  }

  async refundPayment(paymentIntentId: string): Promise<any> {
    const response = await api.post("/payments/refund", {
      payment_intent_id: paymentIntentId,
    });
    return response.data;
  }
}

export const paymentService = new PaymentService();
```

#### 4.2 Mettre à jour OrderContext

**Fichier:** `contexte/OrderContext.tsx` (mise à jour)

```typescript
// Ajouter dans l'interface OrderContextType:
interface OrderContextType {
  // ... existing fields

  // Paiement Stripe
  createPaymentIntent: (orderId: string, amount: number) => Promise<string>;
  verifyPayment: (paymentIntentId: string) => Promise<boolean>;
  initiateStripePayment: (order: CreateOrderFromCartPayload) => Promise<void>;
}

// Ajouter les implémentations:
const createPaymentIntent = useCallback(
  async (orderId: string, amount: number) => {
    try {
      const result = await paymentService.createPaymentIntent({
        amount,
        orderId,
      });
      return result.clientSecret;
    } catch (error) {
      console.error("Erreur création Payment Intent:", error);
      throw error;
    }
  },
  [],
);

const verifyPayment = useCallback(async (paymentIntentId: string) => {
  try {
    const result = await paymentService.verifyPayment({
      payment_intent_id: paymentIntentId,
    });
    return result.success;
  } catch (error) {
    console.error("Erreur vérification paiement:", error);
    return false;
  }
}, []);
```

---

### Phase 5️⃣: Intégration Checkout (Semaine 4)

#### 5.1 Mettre à jour le flux de Checkout

**Fichier:** `app/(customer)/checkout/page.tsx`

```typescript
'use client';

import StripeProvider from "@/components/providers/StripeProvider";
import StripePaymentElement from "@/components/customer/checkouts/StripePaymentElement";
import { useState } from "react";
import { paymentService } from "@/services/payment.service";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cash_on_delivery">("cash_on_delivery");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleSelectStripe = async (amount: number, orderId: string) => {
    try {
      const { clientSecret } = await paymentService.createPaymentIntent({
        amount,
        orderId,
      });
      setClientSecret(clientSecret);
      setPaymentMethod("stripe");
    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error);
    }
  };

  return (
    <StripeProvider>
      {/* ... checkout content ... */}
      {paymentMethod === "stripe" && clientSecret && (
        <StripePaymentElement
          clientSecret={clientSecret}
          amount={orderSummary.total}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          isProcessing={loading}
        />
      )}
    </StripeProvider>
  );
}
```

#### 5.2 Mettre à jour CheckoutPayment.tsx pour Stripe

**Fichier:** `components/customer/checkouts/CheckoutPayment.tsx`

```typescript
// Remplacer les options par:
const options = [
  {
    value: "cash_on_delivery" as const,
    label: "Paiement à la livraison",
    icon: <HandCoins className="w-6 h-6 text-primary" />,
    description: "Payez lorsque vous recevez votre commande",
  },
  {
    value: "stripe" as const,  // Nouveau
    label: "Carte bancaire (Stripe)",
    icon: <CreditCard className="w-6 h-6 text-primary" />,
    description: "Visa, Mastercard, AMEX - Paiement sécurisé",
  },
  {
    value: "mobile_money" as const,
    label: "Mobile Money",
    icon: <Smartphone className="w-6 h-6 text-primary" />,
    description: "Orange Money, Wave, Free Money",
  },
];
```

---

### Phase 6️⃣: Webhooks et Synchronisation (Semaine 4-5)

#### 6.1 Configuration des événements Stripe

**À faire dans Stripe Dashboard:**

```
https://yourdomain.com/api/webhooks/stripe

Events à activer:
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded
- charge.dispute.created
```

#### 6.2 Logger les webhooks (Dev)

**Fichier:** `utils/stripe-webhook-logger.ts` (nouveau)

```typescript
export interface WebhookLog {
  id: string;
  eventType: string;
  status: "processed" | "failed";
  payload: any;
  error?: string;
  createdAt: Date;
}

// Pour le développement, logger localement
const webhookLogs: WebhookLog[] = [];

export function logWebhookEvent(
  eventType: string,
  status: "processed" | "failed",
  payload: any,
  error?: string,
) {
  webhookLogs.push({
    id: Date.now().toString(),
    eventType,
    status,
    payload,
    error,
    createdAt: new Date(),
  });

  // Garder seulement les 1000 derniers
  if (webhookLogs.length > 1000) {
    webhookLogs.shift();
  }
}

export function getWebhookLogs() {
  return webhookLogs;
}
```

---

### Phase 7️⃣: Tests (Semaine 5)

#### 7.1 Test en mode Sandbox

**Cartes de test Stripe:**

```
✅ Paiement réussi: 4242 4242 4242 4242
❌ Paiement échoué: 4000 0000 0000 0002
🔐 3D Secure: 4000 0025 0000 3155
```

#### 7.2 Tests à effectuer

- [ ] Créer Payment Intent
- [ ] Paiement réussi
- [ ] Paiement échoué
- [ ] Annulation du paiement
- [ ] Webhook success
- [ ] Webhook failure
- [ ] Remboursement
- [ ] Test avec email correct
- [ ] Test validation formulaire
- [ ] Test avec montant invalide

#### 7.3 Fichier de tests Jest

**Fichier:** `__tests__/payment.test.ts` (nouveau)

```typescript
import { paymentService } from "@/services/payment.service";

describe("PaymentService", () => {
  it("devrait créer un Payment Intent", async () => {
    const result = await paymentService.createPaymentIntent({
      amount: 100,
      orderId: "order-123",
    });

    expect(result.clientSecret).toBeDefined();
    expect(result.paymentIntentId).toBeDefined();
  });

  it("devrait vérifier un paiement réussi", async () => {
    // Test avec Payment Intent réelle
    const result = await paymentService.verifyPayment({
      payment_intent_id: "pi_test_success",
    });

    expect(result.success).toBe(true);
  });
});
```

---

### Phase 8️⃣: Sécurité et Compliance (Semaine 5-6)

#### 8.1 PCI Compliance Checklist

- [ ] Ne pas stocker les données de carte en clair
- [ ] Utiliser Stripe.js et Elements (approuvé par Stripe)
- [ ] HTTPS obligatoire
- [ ] Valider les montants côté serveur
- [ ] Signer les webhooks
- [ ] Rate limiting sur les endpoints

#### 8.2 Variables d'environnement sécurisées

```env
# .env.local (JAMAIS commiter)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_... (seulement serveur)
STRIPE_WEBHOOK_SECRET=whsec_... (seulement serveur)
```

#### 8.3 Middleware de sécurité

**Fichier:** `middleware/payment-security.ts` (nouveau)

```typescript
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

export async function validatePaymentRequest(request: NextRequest) {
  // Vérifier l'authentification
  const session = await getServerSession();
  if (!session) {
    return { valid: false, error: "Non authentifié" };
  }

  // Rate limiting (basique)
  // TODO: Implémenter avec Redis

  // Valider les montants
  const body = await request.json();
  if (body.amount <= 0 || body.amount > 999999) {
    return { valid: false, error: "Montant invalide" };
  }

  return { valid: true };
}
```

---

## 📊 Structure des fichiers finaux

```
app/
├─ api/
│  └─ payments/
│     ├─ create-intent/route.ts        [NOUVEAU]
│     └─ verify/route.ts               [NOUVEAU]
└─ webhooks/
   └─ stripe/route.ts                  [NOUVEAU]

components/
├─ providers/
│  └─ StripeProvider.tsx               [NOUVEAU]
└─ customer/checkouts/
   ├─ CheckoutPayment.tsx              [MODIFIÉ]
   ├─ StripePaymentElement.tsx         [NOUVEAU]
   └─ ... (existants)

contexte/
└─ OrderContext.tsx                    [MODIFIÉ]

lib/
├─ stripe.ts                           [NOUVEAU]
└─ stripe-server.ts                    [NOUVEAU]

services/
├─ payment.service.ts                  [NOUVEAU]
└─ order.service.ts                    [EXISTANT]

types/
├─ payment.ts                          [NOUVEAU]
└─ order.ts                            [MODIFIÉ]

utils/
└─ stripe-webhook-logger.ts            [NOUVEAU]

__tests__/
└─ payment.test.ts                     [NOUVEAU]
```

---

## 🔄 Flux de paiement complet

```
1. Utilisateur sélectionne "Paiement Stripe"
   ↓
2. Frontend crée un Payment Intent
   ↓
3. Backend retourne client_secret
   ↓
4. Afficher Stripe Payment Element
   ↓
5. Utilisateur entre ses données
   ↓
6. Frontend envoie confirmPayment() à Stripe
   ↓
7. Stripe traite le paiement
   ↓
8. Webhook notification → Backend
   ↓
9. Backend met à jour la commande (status = "completed")
   ↓
10. Redirection vers page success
```

---

## 📱 UX/UI Considerations

### États à gérer

- **Initialisation:** Chargement de Stripe.js
- **Attente:** Génération du Payment Intent
- **Saisie:** Affichage du formulaire Stripe
- **Traitement:** Désactiver boutons, afficher spinner
- **Succès:** Afficher checkmark, message confirmation
- **Erreur:** Afficher message erreur, option réessai

### Messages utilisateur

```
EN_COURS: "Traitement de votre paiement..."
SUCCES: "Paiement reçu! Votre commande est confirmée."
ERREUR: "Le paiement a échoué. Veuillez réessayer ou utiliser une autre méthode."
DECLINE: "Votre banque a refusé ce paiement."
```

---

## 🧪 Checklist de déploiement

### Avant le déploiement

- [ ] Tests unitaires passent (Jest)
- [ ] Tests d'intégration OK
- [ ] Tests manuels sandbox OK
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] Webhook test depuis Stripe CLI
- [ ] Error handling complet
- [ ] Logs et monitoring en place

### Déploiement progressif

1. **Étape 1:** Déployer avec Stripe en mode Sandbox
2. **Étape 2:** Tester en production avec cartes de test
3. **Étape 3:** Activer les clés production graduellement (10% trafic)
4. **Étape 4:** 100% du trafic en production
5. **Étape 5:** Surveiller les erreurs et métriques

### Monitoring

- Erreurs de paiement par type
- Taux de conversion
- Temps de traitement moyen
- Webhooks manqués
- Taux de refund

---

## 💰 Gestion des erreurs Stripe

### Erreurs courantes et résolutions

| Erreur                 | Cause             | Solution                       |
| ---------------------- | ----------------- | ------------------------------ |
| `card_declined`        | Carte refusée     | Essayer autre carte ou méthode |
| `insufficient_funds`   | Solde insuffisant | Charger le compte              |
| `expired_card`         | Carte expirée     | Utiliser nouvelle carte        |
| `incorrect_cvc`        | CVC incorrect     | Vérifier code sécurité         |
| `rate_limit`           | Trop de requêtes  | Attendre et réessayer          |
| `authentication_error` | Auth échouée      | Vérifier clés Stripe           |

---

## 📞 Support et Ressources

### Documentation Stripe

- [Stripe Payment Intent Docs](https://stripe.com/docs/payments/payment-intents)
- [Stripe Elements Docs](https://stripe.com/docs/stripe-js/elements/payment-element)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Test Cards](https://stripe.com/docs/testing)

### Outils

- **Stripe CLI:** `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- **Dashboard:** https://dashboard.stripe.com
- **Webhook Testing:** Stripe CLI local testing
- **Logs:** Tableau de bord Stripe → Logs

---

## 📝 Critères d'acceptation

### Phase 1 ✅

- [ ] Dépendances Stripe installées
- [ ] Types TypeScript définis
- [ ] Variables d'environnement configurées

### Phase 2 ✅

- [ ] Composant StripePaymentElement fonctionne
- [ ] Affichage du formulaire de paiement
- [ ] Page payment-success fonctionnelle

### Phase 3 ✅

- [ ] API /api/payments/create-intent répond correctement
- [ ] API /api/payments/verify fonctionne
- [ ] Webhook /api/webhooks/stripe reçoit les événements

### Phase 4 ✅

- [ ] PaymentService implémenté
- [ ] OrderContext mis à jour
- [ ] Intégration checkout fonctionnelle

### Phase 5 ✅

- [ ] Flux complet fonctionne en sandbox
- [ ] Messages d'erreur pertinents
- [ ] Confirmation de paiement reçue

### Phase 6 ✅

- [ ] Webhooks traités correctement
- [ ] Statut de commande mis à jour automatiquement
- [ ] Logs disponibles

### Phase 7 ✅

- [ ] Tests manuels sandbox réussis
- [ ] Tests automatisés OK
- [ ] Tous les scénarios testés

### Phase 8 ✅

- [ ] PCI compliance vérifiée
- [ ] Sécurité validée
- [ ] Production ready

---

## 🚀 Notes importantes

⚠️ **Ne jamais commiter:**

- `.env.local` avec clés secrètes
- Données de test en dur

✅ **Toujours faire:**

- Valider les montants côté serveur
- Vérifier les signatures webhooks
- Logger les transactions
- Tester les cas d'erreur

🔒 **Sécurité:**

- Stripe s'occupe du chiffrement
- Vous: authentification + montants
- HTTPS obligatoire en prod

---

**Document créé:** 4 mai 2026  
**Dernière mise à jour:** 4 mai 2026  
**Status:** En attente de démarrage du sprint

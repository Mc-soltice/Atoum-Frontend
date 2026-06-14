# Documentation technique — Flux de paiement Stripe

## Aperçu

Cette documentation décrit le flux de paiement implémenté dans l'application (Stripe PaymentIntent + Webhooks) et l'impact sur l'entité `Order`.

Fichiers clés:

- Contrôleur paiement: `app/Modules/Order/Controllers/PaymentController.php`
- Service paiement: `app/Modules/Order/Services/PaymentService.php`
- Migration champs Stripe: `database/migrations/2026_05_04_000000_add_stripe_fields_to_orders_table.php`
- Variables d'environnement: `.env` (`STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)

## Endpoints exposés

- `POST /api/payments/create-intent` — Crée un `PaymentIntent` pour une commande.
  - Entrée: `{ amount?, order_id? }` (le contrôleur utilise l'`order_id` pour récupérer `order->total_amount` si fourni).
  - Réponse (succès): `{ success:true, client_secret, payment_intent_id, amount, currency }`.
- `POST /api/payments/verify` — Vérifie un `payment_intent_id` (optionnel si webhook utilisé).
  - Entrée: `{ payment_intent_id }`.
  - Réponse: succès/erreur et `order_id` si la commande a été mise à jour.
- `GET /api/payments/{payment_intent_id}/status` — Récupère le statut du PaymentIntent (succeeded/processing/requires_action/failed).
- Endpoint webhook (route publique) traité par `PaymentController::handleWebhook` — reçoit événements Stripe (ex. `payment_intent.succeeded`, `payment_intent.payment_failed`).

## Flux détaillé

1. Création du PaymentIntent
   - Le client (frontend) demande `create-intent` ; le backend appelle `PaymentService::createPaymentIntent`.
   - `PaymentIntent` est créé avec `amount` (en centimes), `currency`, `payment_method_types`, et `metadata.order_id` si fourni.
   - L'application stocke `stripe_payment_intent_id` dans la commande (`orders.stripe_payment_intent_id`).
   - Le backend renvoie `client_secret` au frontend pour finaliser le paiement.

2. Paiement côté client
   - Le frontend utilise `client_secret` (Stripe Elements / Stripe.js) pour confirmer le paiement (`confirmCardPayment` ou Checkout).

3. Notification via webhook
   - Stripe appelle l'endpoint webhook configuré.
   - Le contrôleur vérifie la signature (`Stripe-Signature`) en utilisant `STRIPE_WEBHOOK_SECRET`.
   - Pour `payment_intent.succeeded` → `PaymentService::verifyAndUpdateOrder(payment_intent_id)`.
   - Pour `payment_intent.payment_failed` → `PaymentService::handlePaymentFailed(payment_intent_id)`.

4. Vérification et mise à jour de la commande
   - `PaymentService::verifyAndUpdateOrder` récupère le PaymentIntent depuis Stripe.
   - Associe la transaction à une commande par `stripe_payment_intent_id` ou `paymentIntent.metadata.order_id`.
   - Vérifie que `paymentIntent->amount` == `order->total_amount * 100`.
   - Si `status === 'succeeded'` et montants concordent:
     - Met à jour: `payment_status` = `succeeded`, `stripe_payment_intent_id`, `paid_at` = now(), `is_paid` = true, `status` = `OrderStatus::CONFIRMED`.
     - Envoie notification via `NotificationService` si nécessaire.
   - Si échec: met `payment_status` = `failed` et logge l'événement.

## Schéma / Champs impactés (Order)

- `payment_status` (string) — `pending|succeeded|failed|cancelled` (nouveau champ)
- `stripe_payment_intent_id` (string, unique, nullable) — référence Stripe
- `paid_at` (timestamp nullable)
- `is_paid` (bool) — flag métier (mis à true sur succès)
- `status` (enum) — passe à `CONFIRMED` quand paiement validé

Voir la migration: `database/migrations/2026_05_04_000000_add_stripe_fields_to_orders_table.php`.

## Sécurité et validations

- Vérification de signature webhook via `config('services.stripe.webhook_secret')`.
- Vérification d'unicité / idempotence: application stocke `stripe_payment_intent_id` et empêche double paiement si `is_paid` ou `payment_status === 'succeeded'`.
- Vérification d'intégrité: comparaison du montant Stripe (en centimes) et du `order->total_amount` pour empêcher fraudes/incohérences.

## Configuration requise

- `.env`:
  - `STRIPE_PUBLIC_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- `config/services.php` doit référencer ces variables (déjà présent dans le projet).

## Erreurs communes et traitement

- Signature webhook invalide → réponse 400 et log.
- Montant non concordant → log d'erreur et exception, la commande n'est pas confirmée automatiquement.
- PaymentIntent non trouvé → réponse 404 côté vérification.
- Double paiement tenté → 400 avec message "Cette commande a déjà été payée".

## Tests recommandés

- Tests unitaires pour `PaymentService::createPaymentIntent`, `verifyAndUpdateOrder`, `handlePaymentFailed` (moquer Stripe PHP client).
- Tests d'intégration pour l'endpoint webhook (simuler payload & signature).
- Test e2e frontend ↔ backend pour scénario de paiement réussi/échoué.

## Observabilité

- Logger (déjà utilisé) pour: création PaymentIntent, webhooks reçus, erreurs de montant, échecs Stripe.
- Metriques/alertes à surveiller: taux d'échec `payment_intent.payment_failed`, échecs de signature webhook, incohérences de montant.

## Exemple: payload webhook (simplifié)

```
{
	"id": "evt_1xxx",
	"type": "payment_intent.succeeded",
	"data": {
		"object": {
			"id": "pi_xxx",
			"amount": 9900,
			"currency": "eur",
			"metadata": { "order_id": "uuid-order" },
			"status": "succeeded"
		}
	}
}
```

## Intégration frontend — points clés

- Utiliser le `client_secret` renvoyé par `create-intent` et appeler `stripe.confirmCardPayment(client_secret, ...)`.
- Après confirmation côté client, appeler `POST /api/payments/verify` (optionnel) ou se fier au webhook serveur pour la finalisation.

## Recommandations opérationnelles

- Déployer et protéger l'URL webhook (TLS + validation signature).
- Mettre en place des retries backoff pour le webhook si l'application est temporairement indisponible.
- Ajouter des tests automatisés CI pour couvrir webhooks et vérification de montant.

---

Documentation générée automatiquement. Pour modifications, éditez `paiement.md`.

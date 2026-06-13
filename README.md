# Guide de conception générique — Flux de données et requêtes

Ce guide fournit une méthodologie réutilisable pour concevoir l'architecture frontend d'applications web modernes (React / Next.js). Il décrit des règles, patterns et séquences à appliquer pour organiser les pages, composants, gestion d'état, services et appels API. Le but : pouvoir réutiliser la même démarche sur d'autres projets.

**Principes généraux**

- **Séparation des responsabilités** : UI, orchestration d'état et communication réseau sont clairement séparés.
- **Services stateless** : la logique métier côté client et les appels HTTP sont encapsulés dans des services réutilisables, sans état interne.
- **Contexts pour l'état partagé** : React Context (ou solution équivalente) gère l'état global et expose une API stable aux composants.
- **Hooks comme API publique** : exposer l'utilisation des contexts via des hooks (`useAuth`, `useCart`) pour simplifier l'adoption.
- **Types et validation** : utiliser des types (TypeScript) et valider/normaliser les données côté service.

**Structure recommandée**

- `app/` ou `pages/` : routes et pages.
- `components/` : composants UI réutilisables.
- `contexts/` ou `contexte/` : providers et gestion d'état global.
- `services/` : appel réseau, logique métier, transformation des données.
- `lib/` : clients centraux (ex. `axios`, helpers commons).
- `hooks/` : wrappers pratiques autour des contexts/services.
- `types/` : interfaces et types partagés.

## Modèle de flux (générique)

1. UI (page/composant) déclenche une action (clic, formulaire).
2. L'action appelle un `hook` public (`useX().action()`), qui délègue au `Context`.
3. Le `Context` applique une mise à jour locale (optionnelle) puis appelle le `service` responsable.
4. Le `service` réalise l'appel HTTP via le client central (`lib/axios`) et normalise la réponse.
5. Le `service` renvoie le résultat au `Context` qui met à jour l'état global.
6. Les composants abonnés re-rendent automatiquement.

Ce modèle fonctionne pour les requêtes synchrones, les actions asynchrones et les flux de données entrants (webhooks, SSE, polling).

## Design détaillé par couche

**1) Composants / Pages**

- Rôle : affichage et déclenchement d'actions.
- Ne pas : implémenter de logique métier ou d'appels HTTP.
- Faire : consommer des hooks, afficher `loading`/`error`, déclencher des callbacks injectés.

**2) Hooks**

- Implémentation : très mince — wrapper autour de `useContext` + helpers.

**3) Context / Provider**

- Rôle : état partagé, gestion des side-effects contrôlés.
- Exposer : état, méthodes, métadonnées (`loading`, `error`, `lastUpdated`).
- Patterns :
  - Optimistic updates : appliquer changement local puis confirmer via API.
  - Rollback : prévoir revert en cas d'erreur.
  - Debounce/batch updates pour éviter appels excessifs.

**4) Services**

- Rôle : encapsuler tous les appels réseau et logique de transformation.
- Caractéristiques :
  - Stateless, testables, exprimés en fonctions pures autant que possible.
  - Gérer erreurs standardisées, retries exponentiels, timeouts.
  - Normaliser schémas de réponse (DTO → domain models).

**5) Client HTTP central (`lib/axios`)**

- Rôle : configuration globale (baseURL, interceptors d'auth, gestion d'erreurs centralisée).
- Ajouter interceptors pour :
  - rafraîchissement de token
  - journalisation
  - gestion globale des erreurs (mapping code → erreur utilisateur)

## Gestion des erreurs et états

- Normaliser les réponses d'erreur (code, message, details).
- Exposer via context : `status: 'idle' | 'loading' | 'success' | 'error'`.
- Afficher erreurs utilisateur-friendly dans les composants.
- Log côté client pour monitoring (ex. `utils/logger.ts`).

## Caching, invalidation et performance

- Caching local (in-memory) pour listes lourdes, avec TTL.
- Invalidation basée sur événements (ex. après création/édition d'une ressource).
- Utiliser SWR / React Query si besoin pour features avancées (revalidation, pagination, mutations optimistes).

## Sécurité et authentification

- Centraliser tokens dans `lib/axios` (interceptor) et `AuthContext`.
- Ne jamais stocker tokens sensibles en localStorage sans précautions ; préférer httpOnly cookies si possible.
- Valider côté backend toute opération sensible (rôles/permissions).

## Types, contrats et validation

- Définir DTOs et types dans `types/`.
- Valider les payloads entrants côté service (zod/io-ts) avant de les exposer au context.

## Observabilité et tests

- Tests unitaires : services (mocks d'HTTP), contexts (tests d'actions), hooks (renderHook).
- Tests d'intégration : endpoints API, flows majeurs (checkout, login).
- Monitoring : erreurs non gérées remontées (Sentry, LogRocket).

## Stratégie de migration et réutilisation

- Extraire patterns dans un template ou starter repo.
- Documenter conventions : nommage, dossiers, exports, prefix des services.
- Fournir snippets de base : `axios` client, `AuthContext` template, `useApi` hook.

## Checklist de conception à réutiliser (avant de commencer un nouveau projet)

- [ ] Définir le modèle de données et types partagés.
- [ ] Configurer `lib/axios` avec interceptors de sécurité.
- [ ] Créer providers/core contexts (`Auth`, `Cart`, `Product` si e-commerce).
- [ ] Rédiger services pour chaque domaine métier.
- [ ] Exposer hooks simples pour l'UI.
- [ ] Écrire tests unitaires pour services & contexts.
- [ ] Documenter les endpoints API et contrats (OpenAPI si possible).

## Exemples de séquence générique (succinct)

- Ajouter ressource : UI → hook → context (optimistic) → service POST → API → response → context confirme.
- Charger liste : page mount → service GET → service normalise → context set → UI affiche.

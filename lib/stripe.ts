import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      console.error(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined. Stripe.js cannot initialize.",
      );
      stripePromise = Promise.resolve(null);
    } else {
      stripePromise = loadStripe(stripeKey);
    }
  }
  return stripePromise;
};

"use client";

import { CartProvider, CartToaster } from "@/contexte/panier/CartContext";
import Footer from "../customer/Footer";
import Header from "../customer/Header";
import { OrderProvider } from "@/contexte/OrderContext";
import "@/app/globals.css";



export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="background-wrapper">
      <CartProvider>
        <CartToaster />
        <Header />
        <OrderProvider>
          <main className="min-h-screen ">{children}</main>
        </OrderProvider>
        <Footer />
      </CartProvider>
    </div>
  );
}

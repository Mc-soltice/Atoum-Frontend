"use client";

import { Product } from "@/types/product";
import CartItem from "./CartItem";

interface CartLine {
  product: Product;
  quantity: number;
}

interface Props {
  items: CartLine[];
}

export default function CartItems({ items }: Props) {
  return (
    <div className="lg:col-span-2 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 self-start">
      {items.map((item) => (
        <CartItem
          key={item.product.id}
          product={item.product}
          quantity={item.quantity}
        />
      ))}
    </div>
  );
}

"use client";

import { Product, ProductPromo } from "@/types/product";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";

interface ProductWithStock extends Product {
  stock: number;
}
interface CartItem {
  product: Product | ProductPromo;
  quantity: number;
}

interface ProductPromoWithStock extends ProductPromo {
  stock: number;
}

/**
 * Type guard pour vérifier si un produit a une propriété stock
 */
function hasStock(
  product: Product | ProductPromo,
): product is ProductWithStock | ProductPromoWithStock {
  return "stock" in product && typeof product.stock === "number";
}

/**
 * Interface du contexte du panier
 */
interface CartContextType {
  items: CartItem[];
  deliveryOptionId: string | null; // Stocke seulement l'ID de l'option de livraison
  addToCart: (product: Product | ProductPromo, quantity?: number) => void;
  removeFromCart: (productId: string, showToast?: boolean) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    showToast?: boolean,
  ) => void;
  clearCart: () => void;
  setDeliveryOptionId: (optionId: string) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  getDeliveryPrice: (deliveryPrice: number) => number;
  canAddToCart: (productId: string, quantityToAdd?: number) => boolean;
}

/**
 * Création du contexte avec des valeurs par défaut
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Props du fournisseur de contexte
 */
interface CartProviderProps {
  children: ReactNode;
}

/**
 * Clé pour le stockage localStorage
 */
const CART_STORAGE_KEY = "atoumra_cart";
const DELIVERY_OPTION_KEY = "atoumra_delivery_option";

/**
 * Composant Toaster pour afficher les notifications
 */
export function CartToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 500,
        style: {
          background: "transparent",
          color: "#fff",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        success: {
          style: {
            background:
              "linear-gradient(to right, rgba(187,203,100,0.5), rgba(164,187,100,0.5))",
            border: "1px solid rgba(164,187,100,0.7)",
            color: "#fff",
          },
        },
        error: {
          style: {
            background:
              "linear-gradient(to right, rgba(249,115,22,0.5), rgba(251,191,36,0.5))",
            border: "1px solid rgba(251,191,36,0.7)",
            color: "#fff",
          },
        },
      }}
    />
  );
}

/**
 * Fournisseur de contexte du panier
 */
export function CartProvider({ children }: CartProviderProps) {
  // ================= ÉTAT DU PANIER =================
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryOptionId, setDeliveryOptionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ================= PERSISTANCE =================
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Charger les items du panier
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }

      // Charger l'ID de l'option de livraison
      const savedDeliveryOption = localStorage.getItem(DELIVERY_OPTION_KEY);
      if (savedDeliveryOption) {
        setDeliveryOptionId(savedDeliveryOption);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(DELIVERY_OPTION_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  /**
   * Sauvegarde automatique du panier dans localStorage
   */
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (deliveryOptionId) {
        localStorage.setItem(DELIVERY_OPTION_KEY, deliveryOptionId);
      } else {
        localStorage.removeItem(DELIVERY_OPTION_KEY);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
    }
  }, [items, deliveryOptionId, isInitialized]);

  // ================= FONCTIONS DU PANIER =================

  const canAddToCart = (
    productId: string,
    quantityToAdd: number = 1,
  ): boolean => {
    const existingItem = items.find((item) => item.product.id === productId);

    if (!existingItem) {
      return true;
    }

    if (hasStock(existingItem.product)) {
      const availableStock = existingItem.product.stock;
      const newTotalQuantity = existingItem.quantity + quantityToAdd;
      return newTotalQuantity <= availableStock;
    }

    return true;
  };

  const getProductStock = (product: Product | ProductPromo): number => {
    if (hasStock(product)) {
      return product.stock;
    }
    return Infinity;
  };

  const showAddToCartToast = (productName: string, quantity: number = 1) => {
    toast.success(
      <div className="flex items-center gap-3">
        <div>
          <div className="font-semibold">{productName}</div>
          <div className="text-sm opacity-90">Ajouté avec succès au panier</div>
          {quantity > 1 && (
            <div className="text-xs opacity-80">Quantité : {quantity}</div>
          )}
        </div>
      </div>,
      {
        duration: 3000,
        style: {
          background: "#10B981",
          color: "#fff",
        },
      },
    );
  };

  const showRemoveFromCartToast = (productName: string) => {
    toast.error(
      <div className="flex items-center gap-3">
        <div>
          <div className="font-semibold">{productName}</div>
          <div className="text-sm opacity-90">Retiré du panier</div>
        </div>
      </div>,
      {
        duration: 2000,
      },
    );
  };

  const showQuantityUpdateToast = (
    productName: string,
    newQuantity: number,
  ) => {
    toast.success(
      <div className="flex items-center gap-3">
        <div>
          <div className="font-semibold">{productName}</div>
          <div className="text-sm opacity-90">
            Quantité mise à jour : {newQuantity}
          </div>
        </div>
      </div>,
      {
        duration: 2000,
      },
    );
  };

  const showStockErrorToast = (productName: string, availableStock: number) => {
    toast.error(
      <div className="flex items-center gap-3">
        <span className="text-lg">⚠️</span>
        <div>
          <div className="font-semibold">{productName}</div>
          <div className="text-sm opacity-90">
            Stock insuffisant ! Disponible : {availableStock}
          </div>
        </div>
      </div>,
      {
        duration: 3000,
      },
    );
  };

  const addToCart = (product: Product | ProductPromo, quantity: number = 1) => {
    const availableStock = getProductStock(product);
    const existingItem = items.find((item) => item.product.id === product.id);
    const currentQuantity = existingItem?.quantity || 0;
    const newTotalQuantity = currentQuantity + quantity;

    if (availableStock !== Infinity && newTotalQuantity > availableStock) {
      showStockErrorToast(product.name, availableStock);
      return;
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const existingQuantity = updatedItems[existingItemIndex].quantity;
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: existingQuantity + quantity,
        };
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });

    showAddToCartToast(product.name, quantity);
  };

  const removeFromCart = (productId: string, showToast: boolean = true) => {
    const itemToRemove = items.find((item) => item.product.id === productId);

    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );

    if (showToast && itemToRemove) {
      showRemoveFromCartToast(itemToRemove.product.name);
    }
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    showToast: boolean = true,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, showToast);
      return;
    }

    const existingItem = items.find((item) => item.product.id === productId);
    if (existingItem) {
      const availableStock = getProductStock(existingItem.product);
      if (availableStock !== Infinity && quantity > availableStock) {
        showStockErrorToast(existingItem.product.name, availableStock);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );

      if (showToast) {
        showQuantityUpdateToast(existingItem.product.name, quantity);
      }
    }
  };

  const clearCart = () => {
    if (items.length === 0) return;

    setItems([]);
    setDeliveryOptionId(null);
  };

  /**
   * Sélectionne une option de livraison par son ID
   */
  const handleSetDeliveryOptionId = (optionId: string) => {
    setDeliveryOptionId(optionId);

    toast.success(
      <div className="flex items-center gap-3">
        <div>
          <div className="font-semibold">Option de livraison mise à jour</div>
          <div className="text-sm opacity-90">ID: {optionId}</div>
        </div>
      </div>,
      {
        duration: 2000,
      },
    );
  };

  // ================= CALCULS =================
  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = (): number => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const getTotal = (): number => {
    const subtotal = getSubtotal();
    // Note: Le prix de livraison doit être fourni par le hook useDeliveryCheckout
    return subtotal;
  };

  const getDeliveryPrice = (deliveryPrice: number): number => {
    return deliveryPrice;
  };

  // ================= VALEUR DU CONTEXTE =================
  const contextValue: CartContextType = {
    items,
    deliveryOptionId, // Retourne seulement l'ID
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setDeliveryOptionId: handleSetDeliveryOptionId,
    getTotalItems,
    getSubtotal,
    getTotal,
    getDeliveryPrice,
    canAddToCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte du panier
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart doit être utilisé à l'intérieur d'un CartProvider",
    );
  }
  return context;
}

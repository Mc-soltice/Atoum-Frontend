"use client";

import ProductImage from "@/components/admin/produit/ProductImage";
import CheckoutActions from "@/components/customer/checkouts/CheckoutActions";
import CheckoutAddressForm from "@/components/customer/checkouts/CheckoutAddressForm";
import CheckoutPayment from "@/components/customer/checkouts/CheckoutPayment";
import CheckoutSummary from "@/components/customer/checkouts/CheckoutSummary";
import { useOrders } from "@/contexte/OrderContext";
import { CartToaster, useCart } from "@/contexte/panier/CartContext";
import { PaymentInfo, ShippingAddress } from "@/types/order";
import { useDeliveryCheckout } from "@/hooks/useDeliveryCheckout";
import { DeliveryOption } from "@/types/delivery";
import {
  ListCheck,
  MailIcon,
  Map,
  PhoneCall,
  Store,
  Truck,
  WalletMinimalIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/contexte/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const { createOrderFromCart, loading } = useOrders();
  const {
    deliveryOptions,
    selectedOption: deliveryOption,
    loading: deliveryLoading,
    selectDelivery,
    getDeliveryPrice,
  } = useDeliveryCheckout();


  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuthContext();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const computedShippingAddress = {
    first_name: shippingAddress.first_name || user?.first_name || "",
    last_name: shippingAddress.last_name || user?.last_name || "",
    email: shippingAddress.email || user?.email || "",
    phone: shippingAddress.phone || user?.phone || "",
    address: shippingAddress.address,
  };

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentInfo["method"]>("cash_on_delivery");

  const steps = [
    { id: 1, name: "Adresse", icon: "📍" },
    { id: 2, name: "Livraison", icon: "🚚" },
    { id: 3, name: "Paiement", icon: "💳" },
    { id: 4, name: "Confirmation", icon: "✅" },
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!shippingAddress.first_name &&
          !!shippingAddress.last_name &&
          !!shippingAddress.email &&
          !!shippingAddress.phone &&
          !!shippingAddress.address
        );
      case 2:
        return !!deliveryOption;
      case 3:
        return !!paymentMethod;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    if (!validateStep(1) || !deliveryOption || !paymentMethod) {
      alert("Veuillez compléter toutes les informations requises");
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const order = await createOrderFromCart({
        items: orderItems,
        shipping_address: shippingAddress,
        delivery_option_id: deliveryOption.id,
        payment_method: paymentMethod,
        delivery_price: getDeliveryPrice(),
      });

      clearCart();
      router.push(`/order-success/${order.id}`);
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue lors de la création de la commande");
    }
  };

  const orderSummary = {
    items_count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: getSubtotal(),
    shipping_cost: getDeliveryPrice(),
    discount: 0,
    tax: 0,
    total: getSubtotal() + getDeliveryPrice(),
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-8 px-4">
      <CartToaster />
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Finaliser votre commande
          </h1>
          <p className="text-gray-600">
            Remplissez vos informations pour terminer votre achat
          </p>
        </div>

        {/* Étapes */}
        <div className="mb-10">
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-0.5 bg-gray-200 z-0"></div>
            <div
              className="hidden lg:block absolute top-1/2 left-0 transform -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                maxWidth: "100%",
              }}
            ></div>

            <div className="flex justify-between items-center relative z-10">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      border-2 transition-all duration-500 ease-out
                      relative overflow-hidden
                      ${currentStep >= step.id
                        ? "bg-primary text-white border-primary scale-110"
                        : "bg-white text-gray-500 border-gray-300"
                      }
                      ${currentStep === step.id ? "ring-4 ring-primary/30" : ""}
                    `}
                  >
                    {currentStep === step.id && (
                      <div className="absolute inset-0 rounded-full animate-bounce-subtle bg-primary opacity-20"></div>
                    )}
                    <div className="relative z-10">{step.id}</div>
                    {currentStep > step.id && (
                      <div
                        className="absolute inset-0 bg-primary rounded-full"
                        style={{
                          animation: `fillCircle 0.5s ease-out forwards`,
                        }}
                      ></div>
                    )}
                  </div>
                  <div
                    className={`
                      h-1 w-1 rounded-full mt-1 transition-all duration-300
                      ${currentStep === step.id
                        ? "bg-primary scale-150"
                        : "bg-transparent"
                      }
                    `}
                  ></div>
                </div>
              ))}
            </div>

            <div className="mt-6 lg:hidden">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                >
                  <div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg"
                    style={{
                      transition: "right 0.7s ease-out",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contenu principal */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-slate-600">
                      <Map className="w-7 h-7" />
                    </span>
                    Adresse de livraison
                  </h2>
                  <CheckoutAddressForm
                    value={computedShippingAddress}
                    onChange={setShippingAddress}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-slate-600">
                      <Truck className="w-7 h-7" />
                    </span>
                    Mode de livraison
                  </h2>
                  <DeliveryOptionsSection
                    options={deliveryOptions}
                    selectedOption={deliveryOption}
                    onSelect={selectDelivery}
                    loading={deliveryLoading}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-slate-600">
                      <WalletMinimalIcon className="h-7 w-7" />
                    </span>
                    Méthode de paiement
                  </h2>
                  <CheckoutPayment
                    method={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-slate-600">
                      <ListCheck className="w-7 h-7" />
                    </span>
                    Récapitulatif
                  </h2>
                  <div className="space-y-4">
                    {/* Articles */}
                    <div className="rounded-xl p-4 border border-gray-200 shadow-sm bg-white">
                      <h3 className="font-semibold mb-3">Articles</h3>
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center shadow-inner">
                              {item.product.main_image ? (
                                <ProductImage
                                  src={item.product.main_image}
                                  alt={item.product.name}
                                  className="object-cover transition-opacity duration-300 group-hover:opacity-90 rounded-lg"
                                />
                              ) : (
                                <span className="text-gray-400">📦</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {item.product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Quantité: {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold">
                            {item.product.price * item.quantity}€
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Adresse */}
                    <div className="rounded-xl p-4 border border-gray-200 shadow-sm bg-white">
                      <h3 className="font-semibold mb-3">
                        Adresse de livraison
                      </h3>
                      <div className="text-gray-600">
                        <p>
                          {shippingAddress.first_name}{" "}
                          {shippingAddress.last_name}
                        </p>
                        <p>{shippingAddress.address}</p>
                        <p className="mt-2">
                          <PhoneCall className="w-4 h-4 inline mr-2" />{" "}
                          {shippingAddress.phone}
                        </p>
                        <p>
                          <MailIcon className="w-4 h-4 inline mr-2" />{" "}
                          {shippingAddress.email}
                        </p>
                      </div>
                    </div>

                    {/* Paiement */}
                    <div className="rounded-xl p-4 border border-gray-200 shadow-sm bg-white">
                      <h3 className="font-semibold mb-3">
                        Méthode de paiement
                      </h3>
                      <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg shadow-inner">
                        {paymentMethod === "cash_on_delivery" && "💵"}
                        {paymentMethod === "credit_card" && "💳"}
                        {paymentMethod === "mobile_money" && "📱"}
                        <span className="font-medium">
                          {paymentMethod === "cash_on_delivery" &&
                            "Paiement à la livraison"}
                          {paymentMethod === "credit_card" && "Carte bancaire"}
                          {paymentMethod === "mobile_money" && "Mobile Money"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  ← Retour
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={!validateStep(currentStep)}
                    className={`px-8 py-3 rounded-lg font-medium transition-all ${validateStep(currentStep)
                      ? "bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Continuer →
                  </button>
                ) : (
                  <CheckoutActions
                    loading={loading}
                    disabled={!validateStep(currentStep)}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <CheckoutSummary summary={orderSummary} />

              {/* Aide */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Besoin d&apos;aide ?
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">📞</span>
                    <div>
                      <div className="font-medium">Service client</div>
                      <div>+221 33 123 45 67</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">⏰</span>
                    <div>
                      <div className="font-medium">Horaires</div>
                      <div>Lun - Sam: 8h - 20h</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">🔒</span>
                    <div>
                      <div className="font-medium">Paiement sécurisé</div>
                      <div>Vos données sont protégées</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DeliveryOptionsSectionProps {
  options: DeliveryOption[];
  selectedOption: DeliveryOption | null;
  onSelect: (option: DeliveryOption) => void;
  loading: boolean;
}

function DeliveryOptionsSection({
  options,
  selectedOption,
  onSelect,
  loading,
}: DeliveryOptionsSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl mt-4"></div>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="text-center py-8">
        <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucune option de livraison disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <DeliveryOptionCard
            key={option.id}
            option={option}
            selected={selectedOption?.id === option.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function DeliveryOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: DeliveryOption;
  selected: boolean;
  onSelect: (option: DeliveryOption) => void;
}) {
  const getIcon = (name: string) => {
    if (
      name.toLowerCase().includes("standard") ||
      name.toLowerCase().includes("livraison")
    ) {
      return <Truck className="w-5 h-5 text-primary" />;
    }
    if (
      name.toLowerCase().includes("retrait") ||
      name.toLowerCase().includes("magasin")
    ) {
      return <Store className="w-5 h-5 text-primary" />;
    }
    return <Truck className="w-5 h-5 text-primary" />;
  };

  return (
    <div
      onClick={() => onSelect(option)}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selected
        ? "border-amber-100 bg-primary/5"
        : "border-gray-200 hover:border-gray-300"
        } ${!option.is_active ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getIcon(option.name)}</div>
        <div className="flex-1">
          <div className="font-bold text-gray-800">{option.name}</div>
          <div className="text-sm text-gray-600 mt-1">
            {option.description || "Livraison standard"}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm font-medium text-primary">
              {option.delay_days} jour{option.delay_days > 1 ? "s" : ""}
            </div>
            <div className="font-bold">
              {parseFloat(option.price) > 0
                ? `${parseFloat(option.price).toFixed(2)} €`
                : "Gratuit"}
            </div>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary bg-primary" : "border-gray-300"
            }`}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
      </div>
    </div>
  );
}

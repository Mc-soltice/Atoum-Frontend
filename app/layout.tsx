import "./globals.css";
import { AuthProvider } from "@/contexte/AuthContext";
import { UserProvider } from "@/contexte/UserContext";
import { OrderProvider } from "@/contexte/OrderContext";
import { ProductProvider } from "@/contexte/ProductContext";
import { CategoryProvider } from "@/contexte/CategoryContext";
import { DeliveryProvider } from "@/contexte/DeliveryContext";
import SessionProviderWrapper from "@/components/customer/users/SessionProviderWrapper";

export const metadata = {
  title: "Mon site e-commerce",
  description: "Une plateforme moderne construite avec Next.js et Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="lemonade">
      <body>
        <div className="min-h-screen flex flex-col">
          <SessionProviderWrapper>
            <AuthProvider>
              <UserProvider>
                <CategoryProvider>
                  <ProductProvider>
                    <DeliveryProvider>
                      <OrderProvider>{children}</OrderProvider>
                    </DeliveryProvider>
                  </ProductProvider>
                </CategoryProvider>
              </UserProvider>
            </AuthProvider>
          </SessionProviderWrapper>
        </div>
      </body>
    </html>
  );
}

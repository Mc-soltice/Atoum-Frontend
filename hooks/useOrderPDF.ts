import { generateOrderPDF } from '@/utils/orderGenerator';
import { useCallback } from 'react';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  reference: string;
  created_at: string;
  status: { value: string; label: string } | string;
  total_amount: number;
  items: OrderItem[];
  delivery?: {
    name: string;
    price: number;
  };
  companyLogo?: string;
}
export const useOrderPDF = () => {
  // Cache the fetched logo data URL to avoid repeated network requests
  let cachedLogo: string | null = null;

  const getClientLogoDataUrl = async (): Promise<string | null> => {
    if (cachedLogo) return cachedLogo;
    try {
      const res = await fetch('/images/Logo.png');
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          cachedLogo = dataUrl;
          resolve(dataUrl);
        };
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  };

  const downloadInvoice = useCallback(async (order: Order) => {
    try {
      const logo = await getClientLogoDataUrl();
      const orderWithLogo = logo ? { ...order, companyLogo: logo } : order;
      const doc = generateOrderPDF(orderWithLogo as any);

      // Formater le nom du fichier
      const fileName = `commande-${order.reference}.pdf`;

      // Télécharger le PDF
      doc.save(fileName);

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la génération de la facture PDF:', error);
      return { success: false, error };
    }
  }, []);

  const previewInvoice = useCallback(async (order: Order) => {
    try {
      const logo = await getClientLogoDataUrl();
      const orderWithLogo = logo ? { ...order, companyLogo: logo } : order;
      const doc = generateOrderPDF(orderWithLogo as any);

      // Ouvrir dans un nouvel onglet
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      // Nettoyer l'URL après ouverture
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la prévisualisation de la facture:', error);
      return { success: false, error };
    }
  }, []);

  return {
    downloadInvoice,
    previewInvoice
  };
};
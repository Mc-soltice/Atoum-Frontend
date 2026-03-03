import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to load company logo from disk as a data URL when running in Node
export const getCompanyLogoDataUrlSync = (relativePath = 'public/images/Logo.png'): string | null => {
  try {
    if (typeof window !== 'undefined') return null;
    // require here to avoid bundler issues on the client
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    const abs = path.resolve(process.cwd(), relativePath);
    if (!fs.existsSync(abs)) return null;
    const ext = path.extname(abs).slice(1).toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const data = fs.readFileSync(abs);
    const base64 = data.toString('base64');
    return `data:${mime};base64,${base64}`;
  } catch (e) {
    return null;
  }
};

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  reference: string;
  created_at: string;
  status: { value: string; label: string } | string;
  total_amount: number;
  items: OrderItem[];
  delivery?: {
    name: string;
    price: number;
  };
  // Optional base64 or data-URL image for company logo (PNG/JPEG)
  companyLogo?: string;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const generateOrderPDF = (order: Order): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Palette de couleurs minimaliste - Amber 600 (#d97706)
  const colors = {
    primary: [217, 119, 6] as [number, number, number], // Amber-600
    primaryLight: [254, 243, 199] as [number, number, number], // Amber-100
    success: [16, 185, 129] as [number, number, number], // Emerald-500 (gardé pour le succès)
    successLight: [236, 253, 245] as [number, number, number], // Emerald-50
    gray900: [17, 24, 39] as [number, number, number],
    gray700: [55, 65, 81] as [number, number, number],
    gray500: [107, 114, 128] as [number, number, number],
    gray400: [156, 163, 175] as [number, number, number],
    gray300: [209, 213, 219] as [number, number, number],
    gray200: [229, 231, 235] as [number, number, number],
    gray100: [243, 244, 246] as [number, number, number],
    gray50: [249, 250, 251] as [number, number, number],
    white: [255, 255, 255] as [number, number, number]
  };

  let yPos = margin;

  // If no companyLogo provided, try to load the default logo from public/images (server-side)
  if (!order.companyLogo) {
    const logo = getCompanyLogoDataUrlSync();
    if (logo) order.companyLogo = logo;
  }

  // === EN-TÊTE MINIMALISTE ===
  // Company name (left) and invoice title + reference (right)
  const COMPANY_NAME = 'Atoum-ra Mbianga';

  // Try to draw logo if provided (expects data URL or base64 string)
  const hasLogo = !!order.companyLogo;
  // Render a more compact header: smaller logo and tighter spacing
  const imgWidth = hasLogo ? 24 : 0; // mm (reduced)
  const imgHeight = hasLogo ? 24 : 0; // mm (reduced)
  const headerHeight = Math.max(14, imgHeight);

  if (hasLogo) {
    try {
      // Place logo at top-left (align top with header area)
      doc.addImage(order.companyLogo as string, 'PNG', margin, yPos, imgWidth, imgHeight);
    } catch (e) {
      // ignore image errors, continue with text-only header
    }
  }

  // Compute vertical center for header texts
  const centerY = yPos + headerHeight / 2 + 2;

  // Company name to the right of the logo (or at margin if no logo)
  const companyTextX = hasLogo ? margin + imgWidth + 4 : margin;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text(COMPANY_NAME, companyTextX, centerY);

  // Invoice title and reference on the right, vertically centered (smaller)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.gray900);
  doc.text('COMMANDE', pageWidth - margin, centerY - 3, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray500);
  doc.text(`N° ${order.reference}`, pageWidth - margin, centerY + 6, { align: 'right' });

  // Ligne fine décorative juste sous l'en-tête
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.25);
  const lineY = yPos + headerHeight + 4;
  doc.line(margin, lineY, pageWidth - margin, lineY);

  yPos += headerHeight + 8;

  // === BANDEAU DE STATUT MINIMAL ===
  doc.setFillColor(...colors.successLight);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 25, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.success);
  doc.text('✓', margin + 8, yPos + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray700);
  doc.text('Commande confirmée - Un email vous a été envoyé', margin + 18, yPos + 16);

  yPos += 40;

  // === INFORMATIONS COMMANDE EN GRILLE SIMPLE ===
  const col1X = margin;
  const col2X = pageWidth / 2;

  // Date
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray500);
  doc.text('Date', col1X, yPos);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.gray900);
  const formattedDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(formattedDate, col1X, yPos + 8);

  // Statut
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray500);
  doc.text('Statut', col2X, yPos);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const statusLabel = typeof order.status === 'string' ? order.status : order.status.label;
  doc.setTextColor(...colors.success);
  doc.text(statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1), col2X, yPos + 8);

  yPos += 25;

  // Montant total
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray500);
  doc.text('Montant total', col1X, yPos);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text(`${formatPrice(order.total_amount)} €`, col1X, yPos + 15);

  yPos += 35;

  // === LIGNE DE SÉPARATION ===
  doc.setDrawColor(...colors.gray200);
  doc.setLineWidth(0.2);
  doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);

  // === TITRE ARTICLES SIMPLE ===
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.gray900);
  doc.text('Articles', margin, yPos);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray500);
  doc.text(`${order.items.length} article${order.items.length > 1 ? 's' : ''}`, margin + 45, yPos);

  yPos += 8;

  // === TABLEAU DES ARTICLES ULTRA MINIMAL ===
  const tableData = order.items.map(item => [
    item.product_name,
    item.quantity.toString(),
    `${formatPrice(item.unit_price)} €`,
    `${formatPrice(item.subtotal)} €`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Produit', 'Qté', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 6,
      lineColor: [...colors.gray200],
      lineWidth: 0.1,
      textColor: [...colors.gray700]
    },
    headStyles: {
      fillColor: [...colors.gray50],
      textColor: [...colors.gray500],
      fontStyle: 'normal',
      fontSize: 8,
      cellPadding: 4
    },
    bodyStyles: {
      fillColor: [...colors.white]
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35, fontStyle: 'bold', textColor: [...colors.primary] }
    },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.fontStyle = 'normal';
      }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY;

  // === FRAIS DE LIVRAISON ===
  let recapY = finalY + 10;

  if (order.delivery) {
    doc.setDrawColor(...colors.gray200);
    doc.setLineWidth(0.1);
    doc.line(margin, recapY - 5, pageWidth - margin, recapY - 5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray700);
    doc.text('Livraison', margin, recapY);
    doc.text(order.delivery.name, margin + 50, recapY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray900);
    doc.text(`${formatPrice(order.delivery.price)} €`, pageWidth - margin, recapY, { align: 'right' });

    recapY += 15;
  }

  // === TOTAL FINAL MINIMAL ===
  doc.setDrawColor(...colors.gray200);
  doc.setLineWidth(0.3);
  doc.line(margin, recapY - 2, pageWidth - margin, recapY - 2);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.gray900);
  doc.text('TOTAL TTC', margin, recapY + 5);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text(`${formatPrice(order.total_amount)} €`, pageWidth - margin, recapY + 5, { align: 'right' });

  // === PIED DE PAGE MINIMAL ===
  const footerY = pageHeight - 15;

  doc.setDrawColor(...colors.gray200);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray400);
  doc.text(
    new Date().toLocaleDateString('fr-FR'),
    margin,
    footerY
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray400);
  doc.text(
    'Commande générée automatiquement - Atoum-ra Mbianga',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray400);
  doc.text(
    `#${order.reference.slice(-6)}`,
    pageWidth - margin,
    footerY,
    { align: 'right' }
  );

  return doc;
};
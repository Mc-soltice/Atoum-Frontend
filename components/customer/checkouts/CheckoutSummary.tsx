"use client";

interface Props {
  summary: {
    items_count: number;
    subtotal: number;
    shipping_cost: number;
    discount: number;
    tax: number;
    total: number;
  };
}

export default function CheckoutSummary({ summary }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">
        Récapitulatif
      </h2>

      <div className="space-y-4">
        {/* Articles */}
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Articles ({summary.items_count})</span>
            <span>{summary.subtotal.toLocaleString()}€</span>
          </div>

          {summary.shipping_cost > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>{summary.shipping_cost.toLocaleString()}€</span>
            </div>
          )}

          {summary.discount && summary.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Remise</span>
              <span>-{summary.discount.toLocaleString()}€</span>
            </div>
          )}

          {summary.tax && summary.tax > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Taxes</span>
              <span>{summary.tax.toLocaleString()}€</span>
            </div>
          )}
        </div>

        {/* Séparateur */}
        <div className="border-t pt-4"></div>

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold text-gray-800">
          <span>Total TTC</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{summary.total.toLocaleString()}</span>
            <span className="text-sm text-gray-600">€</span>
          </div>
        </div>

        {/* Économies estimées */}
        {summary.discount && summary.discount > 0 && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <span>🎉</span>
              <span>
                Vous économisez{" "}
                <span className="font-bold">
                  {summary.discount.toLocaleString()}€
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

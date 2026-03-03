// components/admin/dashboard/SalesChart.tsx
"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Fév', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Avr', sales: 4500 },
  { month: 'Mai', sales: 6000 },
  { month: 'Jun', sales: 5500 },
  { month: 'Jul', sales: 7000 },
  { month: 'Aoû', sales: 6500 },
  { month: 'Sep', sales: 8000 },
  { month: 'Oct', sales: 7500 },
  { month: 'Nov', sales: 9000 },
  { month: 'Déc', sales: 8500 },
];

export default function SalesChart() {
  const [timeRange, setTimeRange] = useState('year');

  const maxSales = Math.max(...chartData.map(d => d.sales));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ventes</h3>
          <p className="text-gray-600">Performances des ventes</p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                timeRange === range
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === 'week' && 'Semaine'}
              {range === 'month' && 'Mois'}
              {range === 'year' && 'Année'}
            </button>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center mb-8">
        <div className="flex items-center mr-6">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Ventes 2024</span>
        </div>
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">+12.5% vs dernière année</span>
        </div>
      </div>

      {/* Graphique */}
      <div className="h-64 flex items-end space-x-2">
        {chartData.map((data, index) => {
          const height = (data.sales / maxSales) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-linear-to-t from-emerald-500 to-emerald-300 rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
              <span className="mt-2 text-xs text-gray-500">{data.month}</span>
              <span className="text-xs font-medium text-gray-700">
                {data.sales.toLocaleString()}€
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
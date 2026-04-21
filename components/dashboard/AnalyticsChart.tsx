"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

interface ChartData {
  date: string;
  value: number;
  amount?: number;
}

interface AnalyticsChartProps {
  title: string;
  data: ChartData[];
  color: string;
  hasValueToggle?: boolean;
}

const CustomTooltip = ({ active, payload, label, mode }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  mode: "quantity" | "value";
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-right">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">
          {mode === "value" ? `₪${payload[0].value.toLocaleString()}` : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ title, data, color, hasValueToggle = false }: AnalyticsChartProps) {
  const [mode, setMode] = useState<"quantity" | "value">("quantity");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        {hasValueToggle && (
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setMode("quantity")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                mode === "quantity" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              כמות
            </button>
            <button
              onClick={() => setMode("value")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                mode === "value" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              שווי
            </button>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip mode={mode} />}
            cursor={{ fill: "#f8fafc" }}
          />
          <Bar
            dataKey={mode === "value" ? "amount" : "value"}
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

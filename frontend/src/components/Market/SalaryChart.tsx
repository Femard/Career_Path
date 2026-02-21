'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { MarketInsight } from '@/types/career';

interface SalaryChartProps {
  salaryData: MarketInsight['salaryByCity'];
}

const COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#fb923c', '#f472b6'];

export default function SalaryChart({ salaryData }: SalaryChartProps) {
  if (!salaryData || salaryData.length === 0) return null;

  const formatted = salaryData.map((d) => ({
    city: d.city,
    min: Math.round(d.min / 1000),
    avg: Math.round(d.avg / 1000),
    max: Math.round(d.max / 1000),
  }));

  return (
    <div className="mt-3">
      <p className="text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">
        Salaires par ville (k€/an)
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="city"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#1e293b' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#1e293b' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #1e293b',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 12,
            }}
            formatter={(value: number | string | undefined, name: string | undefined) => [
              `${value}k€`,
              name === 'avg' ? 'Médian' : name === 'min' ? 'Min' : 'Max',
            ] as [string, string]}
          />
          <Bar dataKey="min" fill="#1e3a5f" radius={[2, 2, 0, 0]} />
          <Bar dataKey="avg" radius={[2, 2, 0, 0]}>
            {formatted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
          <Bar dataKey="max" fill="#1e3a5f" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function ImpactTracker({ orders = [], user }) {
  // Calculate real totals directly from orders (not stale user object)
  const totalTrees = orders.reduce((sum, o) => sum + (o.treesPlanted || 0), 0);
  const totalCarbon = orders.reduce((sum, o) => sum + (o.carbonSaved || 0), 0);
  const totalCredits = orders.reduce((sum, o) => sum + (o.ecoCreditsEarned || 0), 0);

  // Build monthly data from orders
  const monthlyData = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    const existing = acc.find((d) => d.month === month);
    if (existing) {
      existing.carbon += order.carbonSaved || 0;
      existing.trees += order.treesPlanted || 0;
      existing.credits += order.ecoCreditsEarned || 0;
      existing.spent += order.totalAmount || 0;
    } else {
      acc.push({
        month,
        carbon: order.carbonSaved || 0,
        trees: order.treesPlanted || 0,
        credits: order.ecoCreditsEarned || 0,
        spent: order.totalAmount || 0,
      });
    }
    return acc;
  }, []);

  const pieData = [
    { name: 'Trees Planted', value: totalTrees },
    { name: 'CO₂ Offset (kg)', value: parseFloat(totalCarbon.toFixed(2)) },
    { name: 'Eco Credits', value: totalCredits },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trees Planted', value: totalTrees, icon: '🌳', color: 'bg-green-50 text-green-700' },
          { label: 'CO₂ Offset', value: `${totalCarbon.toFixed(2)} kg`, icon: '☁️', color: 'bg-blue-50 text-blue-700' },
          { label: 'Eco Credits', value: totalCredits, icon: '🌱', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Orders', value: orders.length, icon: '📦', color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <div key={stat.label} className={`card p-4 text-center ${stat.color}`}>
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* No orders yet */}
      {orders.length === 0 && (
        <div className="card p-10 text-center text-gray-400">
          <div className="text-5xl mb-3">🌱</div>
          <p className="font-semibold text-gray-500">No impact yet</p>
          <p className="text-sm mt-1">Place your first order to start tracking your eco impact!</p>
        </div>
      )}

      {/* Area Chart — Carbon */}
      {monthlyData.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-gray-700 mb-4">📈 Monthly CO₂ Saved (kg)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v} kg`, 'CO₂ Saved']} />
              <Area type="monotone" dataKey="carbon" stroke="#10b981" fill="url(#carbonGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Chart — Trees */}
      {monthlyData.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-gray-700 mb-4">🌳 Trees Planted Per Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v, 'Trees']} />
              <Bar dataKey="trees" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Chart — Eco Credits */}
      {monthlyData.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-gray-700 mb-4">🌱 Eco Credits Earned Per Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v, 'Credits']} />
              <Bar dataKey="credits" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie Chart */}
      {(totalTrees > 0 || totalCarbon > 0 || totalCredits > 0) && (
        <div className="card p-5">
          <h3 className="font-bold text-gray-700 mb-4">🌍 Your Total Impact</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

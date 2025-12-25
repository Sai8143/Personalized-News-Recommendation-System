
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, UserCheck, Shield, Globe } from 'lucide-react';

const data = [
  { name: 'Politics', count: 12 },
  { name: 'Tech', count: 19 },
  { name: 'Sports', count: 7 },
  { name: 'Finance', count: 15 },
  { name: 'Health', count: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Articles Read', val: '43', icon: <TrendingUp className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Credibility Score', val: '92%', icon: <Shield className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Indian Content', val: '65%', icon: <UserCheck className="text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Global Insight', val: '35%', icon: <Globe className="text-orange-600" />, bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-xs font-semibold uppercase">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Your Reading Interests</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Verification Accuracy</h3>
          <div className="h-64 flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Verified', value: 35 },
                    { name: 'Debunked', value: 5 },
                    { name: 'Suspicious', value: 8 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Verified
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Debunked
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Suspicious
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

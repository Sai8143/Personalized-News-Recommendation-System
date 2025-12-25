
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, UserCheck, Shield, Globe, Target, Fingerprint, Activity, Filter } from 'lucide-react';

const ctrHistory = [
  { day: 'Mon', ctr: 12, accuracy: 88 },
  { day: 'Tue', ctr: 15, accuracy: 91 },
  { day: 'Wed', ctr: 14, accuracy: 89 },
  { day: 'Thu', ctr: 22, accuracy: 94 },
  { day: 'Fri', ctr: 19, accuracy: 92 },
  { day: 'Sat', ctr: 25, accuracy: 95 },
  { day: 'Sun', ctr: 24, accuracy: 96 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Fix: Defining pieData outside to be used in Pie component and its children
const pieData = [
  { name: 'Neural Verified', value: 75 },
  { name: 'Grounding Pending', value: 20 },
  { name: 'Isolated', value: 5 },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Premium Parameter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Rec. Accuracy', val: '96.2%', icon: <Target className="text-indigo-600" />, sub: '+4.1% Neural Drift', color: 'indigo' },
          { label: 'Avg. Engagement', val: '28.4%', icon: <Activity className="text-emerald-600" />, sub: 'Top 2% Globally', color: 'emerald' },
          { label: 'Diversity Metric', val: '0.89', icon: <Fingerprint className="text-amber-600" />, sub: 'High Coverage', color: 'amber' },
          { label: 'Filtering Acc.', val: '99.9%', icon: <Filter className="text-rose-600" />, sub: 'Zero Leaks', color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 bg-${stat.color}-50 rounded-3xl group-hover:scale-110 transition-transform duration-500`}>{stat.icon}</div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full uppercase tracking-widest">Active</div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">{stat.val}</p>
            <p className="text-xs text-slate-400 mt-2 font-bold">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Performance Graph */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Reliability Index</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">NLP Precision over 7 days</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                <span className="text-[10px] font-black uppercase tracking-widest">Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-indigo-200 rounded-full"></span>
                <span className="text-[10px] font-black uppercase tracking-widest">CTR</span>
              </div>
            </div>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ctrHistory}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="day" fontSize={11} fontWeight={800} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis fontSize={11} fontWeight={800} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorAcc)" />
                <Area type="monotone" dataKey="ctr" stroke="#e2e8f0" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Performance Indicators */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black mb-8 text-slate-900 tracking-tight">Trust Distribution</h3>
            <div className="h-64 flex flex-col items-center justify-center relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {/* Fix: Using pieData instead of the undefined 'data' variable */}
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">99.9%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reliability</span>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {[
                { label: 'Neural Verified', color: 'indigo-600', val: '75%' },
                { label: 'Grounding Pending', color: 'emerald-500', val: '20%' },
                { label: 'Isolated Claims', color: 'amber-500', val: '5%' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full bg-${item.color}`}></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

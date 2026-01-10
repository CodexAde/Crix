import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const userData = [
  { name: 'Sun', users: 2 },
  { name: 'Mon', users: 1 },
  { name: 'Tue', users: 0 },
  { name: 'Wed', users: 5 },
  { name: 'Thu', users: 1 },
  { name: 'Fri', users: 25 },
  { name: 'Sat', users: 12 },
];

const tokenData = [
  { name: 'Sun', tokens: 1000 },
  { name: 'Mon', tokens: 2000 },
  { name: 'Tue', tokens: 1500 },
  { name: 'Wed', tokens: 200 },
  { name: 'Thu', tokens: 2000 },
  { name: 'Fri', tokens: 9000 },
  { name: 'Sat', tokens: 3490 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl">
        <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">{label}</p>
        <p className="text-white text-sm font-bold">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* User Join Graph */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 min-h-[400px] flex flex-col"
      >
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white tracking-tight">User Acquisition</h3>
          <p className="text-zinc-500 text-sm mt-1">Daily new users joined this week</p>
        </div>
        
        <div className="flex-1 w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff453a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff453a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#52525b', fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#ff453a" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Token Usage Graph */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 min-h-[400px] flex flex-col"
      >
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white tracking-tight">Token Consumption</h3>
          <p className="text-zinc-500 text-sm mt-1">Daily token utilization by AI</p>
        </div>
        
        <div className="flex-1 w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tokenData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#52525b', fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tokens" radius={[10, 10, 10, 10]}>
                {tokenData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#ff453a' : 'rgba(255,255,255,0.08)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartSection;

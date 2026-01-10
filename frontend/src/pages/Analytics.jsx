import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Zap, Clock } from 'lucide-react';
import AnalyticsHeader from '../components/Analytics/Header';
import StatCard from '../components/Analytics/StatCard';
import ChartSection from '../components/Analytics/ChartSection';

const Analytics = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '45',
      subtext: '12 new today',
      icon: Users,
      trend: 425.3
    },
    {
      title: 'Active Chats',
      value: '124',
      subtext: '3 currently online',
      icon: MessageSquare,
      trend: 128.2
    },
    {
      title: 'Tokens Utilized',
      value: '19.2k',
      subtext: 'Estimated cost < ₹3000',
      icon: Zap,
      trend: 154.6
    },
    {
      title: 'Avg. Time Spent',
      value: '24m',
      subtext: 'Per user session',
      icon: Clock,
      trend: -3.2
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AnalyticsHeader />
      
      <main className="max-w-[1400px] mx-auto px-6 py-10">
 

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <ChartSection />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">Recent Activity</h3>
              <p className="text-zinc-500 text-sm mt-1">Live platform events</p>
            </div>
            <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 border border-white/10">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-transparent hover:border-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Users className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">New user registered</h4>
                    <p className="text-[11px] text-zinc-500">Student from Engineering Dept.</p>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-600 font-medium">2 mins ago</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;

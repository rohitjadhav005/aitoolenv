import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Wrench, Star, Bookmark, TrendingUp, ArrowUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { adminStats, tools } from '../data/mockData';
import { formatNumber, pricingColor, pricingLabel } from '../lib/utils';
import { Link } from 'react-router-dom';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CHART_COLORS = ['#7c3aed', '#a78bfa', '#10b981', '#f59e0b', '#ef4444'];

const chartData = adminStats.monthlyGrowth.map((v, i) => ({
  month: MONTHS[i],
  users: v,
}));

const StatCard = ({ icon: Icon, label, value, change, color = 'text-violet-400' }: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  color?: string;
}) => (
  <div className="glass p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      {change && (
        <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
          +{change}%
        </span>
      )}
    </div>
    <div className="text-2xl font-black text-white mb-0.5">{value}</div>
    <div className="text-sm text-white/40">{label}</div>
  </div>
);

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: adminStats.totalUsers,
    totalTools: adminStats.totalTools,
    totalReviews: adminStats.totalReviews,
    totalBookmarks: adminStats.totalBookmarks
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.totalUsers !== undefined) {
          setStats(prev => ({ ...prev, totalUsers: data.totalUsers, totalTools: data.totalTools }));
        }
      })
      .catch(console.error);
  }, []);

  const topTools = [...tools].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-white/40 text-sm">Platform analytics and management</p>
            </div>
            <Link to="/submit" className="btn-accent text-sm">
              + Add Tool Manually
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <StatCard icon={Users} label="Total Users" value={formatNumber(stats.totalUsers)} change="12.4" color="text-violet-400" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <StatCard icon={Wrench} label="Total Tools" value={formatNumber(stats.totalTools)} change="8.2" color="text-blue-400" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              <StatCard icon={Star} label="Total Reviews" value={formatNumber(stats.totalReviews)} change="22.1" color="text-amber-400" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
              <StatCard icon={Bookmark} label="Bookmarks" value={formatNumber(stats.totalBookmarks)} change="18.7" color="text-emerald-400" />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Growth Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 h-full"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">User Growth</h2>
                  <p className="text-sm text-white/40">Monthly new users over the past year</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <TrendingUp size={16} />
                  <span>+12.4%</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a30', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                    cursor={{ stroke: 'rgba(124,58,237,0.3)', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Categories Pie */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">By Category</h2>
              <p className="text-sm text-white/40 mb-5">Tool distribution</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={adminStats.topCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {adminStats.topCategories.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a30', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {adminStats.topCategories.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i] }} />
                    <span className="text-xs text-white/60 flex-1">{cat.name}</span>
                    <span className="text-xs font-medium text-white">{cat.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Top Tools Table */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/8 flex items-center gap-2">
              <ArrowUp size={16} className="text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Most Upvoted Tools</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['#', 'Tool', 'Category', 'Pricing', 'Upvotes', 'Rating', 'Views'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topTools.map((tool, i) => (
                    <tr key={tool.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 text-white/40 text-sm font-medium">{i + 1}</td>
                      <td className="px-6 py-4">
                        <Link to={`/tool/${tool.id}`} className="flex items-center gap-2.5 hover:text-violet-400 transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm p-0.5">
                            <img
                              src={tool.logo}
                              alt={tool.name}
                              className="w-full h-full object-contain"
                              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=7c3aed&color=fff&size=28`; }}
                            />
                          </div>
                          <span className="font-medium text-white text-sm">{tool.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/50">{tool.category}</td>
                      <td className="px-6 py-4">
                        <span className={pricingColor(tool.pricing)}>{pricingLabel(tool.pricing)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">{formatNumber(tool.upvotes)}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-amber-400 text-sm">
                          <Star size={12} fill="currentColor" /> {tool.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40">{formatNumber(tool.views)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

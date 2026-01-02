
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, AreaChart, Area
} from 'recharts';
import { Task } from '../types';

interface StatsDashboardProps {
  tasks: Task[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const categories = ['Work', 'Business', 'Gaming', 'Study', 'Workout'];
    const catData = categories.map(name => {
      const catTasks = tasks.filter(t => t.category === name);
      const completed = catTasks.filter(t => {
        if (t.taskType === 'daily') return (t.completionHistory?.length || 0) > 0;
        return t.completed;
      }).length;
      return { 
        name, 
        completed, 
        total: catTasks.length,
        rate: catTasks.length > 0 ? (completed / catTasks.length) * 100 : 0
      };
    });

    // Simple streak calculation for Daily tasks
    const today = new Date().toISOString().split('T')[0];
    const streaks = tasks.filter(t => t.taskType === 'daily').map(t => {
      let current = 0;
      if (!t.completionHistory) return 0;
      const history = [...t.completionHistory].sort().reverse();
      // Very basic streak: consecutive days from today/yesterday
      // For this simple app, we just count total completions as "Consistency Score"
      return t.completionHistory.length;
    });
    const maxStreak = streaks.length > 0 ? Math.max(...streaks) : 0;

    return { catData, maxStreak };
  }, [tasks]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Efficiency</p>
          <h4 className="text-4xl font-black">{Math.round(stats.catData.reduce((acc, curr) => acc + curr.rate, 0) / 5)}%</h4>
          <div className="mt-4 h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.round(stats.catData.reduce((acc, curr) => acc + curr.rate, 0) / 5)}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Routines</p>
          <h4 className="text-4xl font-black text-slate-800">{tasks.filter(t => t.taskType === 'daily').length}</h4>
          <p className="text-xs text-green-500 font-bold mt-2"><i className="fas fa-sync-alt mr-1"></i> Tracking Daily</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Consistency Score</p>
          <h4 className="text-4xl font-black text-slate-800">{stats.maxStreak}</h4>
          <p className="text-xs text-blue-500 font-bold mt-2"><i className="fas fa-fire mr-1"></i> Lifetime completions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Performance by Routine</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.catData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {stats.catData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.catData}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRate)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;

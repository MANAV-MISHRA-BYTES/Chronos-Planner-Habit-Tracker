
import React, { useMemo } from 'react';
import { Task } from '../types';

interface ContributionGraphProps {
  tasks: Task[];
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ tasks }) => {
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    // Show last 24 weeks for precision
    for (let i = 167; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayCompletions = tasks.reduce((count, task) => {
        if (task.taskType === 'daily') {
          return count + (task.completionHistory?.includes(dateString) ? 1 : 0);
        } else {
          const isSameDay = task.scheduledTime.startsWith(dateString);
          return count + (isSameDay && task.completed ? 1 : 0);
        }
      }, 0);

      result.push({
        date: dateString,
        count: dayCompletions,
        intensity: dayCompletions > 0 ? Math.min(dayCompletions, 4) : 0
      });
    }
    return result;
  }, [tasks]);

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-slate-100';
      case 1: return 'bg-green-200';
      case 2: return 'bg-green-400';
      case 3: return 'bg-green-600';
      case 4: return 'bg-green-800';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Precision Consistency</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Activity Matrix</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
          <span>Less</span>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`w-2.5 h-2.5 rounded-sm ${getColor(i)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-max">
          {days.map((day, idx) => (
            <div
              key={idx}
              title={`${day.date}: ${day.count} activities completed`}
              className={`w-3 h-3 rounded-[2px] transition-all duration-300 ${getColor(day.intensity)} cursor-crosshair hover:scale-125 hover:ring-2 hover:ring-blue-300`}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-tighter">
        <span>{days[0].date}</span>
        <span>{days[days.length - 1].date}</span>
      </div>
    </div>
  );
};

export default ContributionGraph;

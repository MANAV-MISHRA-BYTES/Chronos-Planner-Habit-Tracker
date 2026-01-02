
import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = task.taskType === 'daily' 
    ? task.completionHistory?.includes(today) 
    : task.completed;

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'text-red-600 bg-red-50 ring-1 ring-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 ring-1 ring-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 ring-1 ring-blue-200';
      default: return 'text-slate-500 bg-slate-50 ring-1 ring-slate-200';
    }
  };

  const getCategoryIcon = () => {
    switch (task.category) {
      case 'Work': return 'fa-briefcase';
      case 'Business': return 'fa-chart-line';
      case 'Gaming': return 'fa-gamepad';
      case 'Study': return 'fa-book';
      case 'Workout': return 'fa-dumbbell';
      default: return 'fa-tasks';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className={`group relative flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${isCompletedToday ? 'bg-slate-50/50' : ''}`}>
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
            isCompletedToday 
              ? 'bg-green-500 border-green-500 shadow-lg shadow-green-200' 
              : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-50'
          }`}
        >
          <i className={`fas ${isCompletedToday ? 'fa-check text-white' : 'fa-plus text-slate-300'} transition-all`}></i>
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold transition-all ${isCompletedToday ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
              {task.title}
            </h4>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${getPriorityColor()}`}>
              {task.priority}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">
              <i className={`fas ${getCategoryIcon()}`}></i>
              {task.category}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-clock"></i>
              {new Date(task.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {task.taskType === 'daily' ? (
              <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                <i className="fas fa-redo-alt mr-1"></i> Routine
              </span>
            ) : (
              <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                One-time
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center bg-slate-50/50"
          title="Delete task"
        >
          <i className="fas fa-trash-alt text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

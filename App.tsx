
import React, { useState, useEffect, useMemo } from 'react';
import { Task, AppData, TaskPriority, TaskType } from './types';
import TaskItem from './components/TaskItem';
import ContributionGraph from './components/ContributionGraph';
import StatsDashboard from './components/StatsDashboard';
import ChatInterface from './components/ChatInterface';
import CustomDropdown from './components/CustomDropdown';

const CATEGORIES = ['Work', 'Business', 'Gaming', 'Study', 'Workout'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const TASK_TYPES: TaskType[] = ['normal', 'daily'];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'planner' | 'coach' | 'stats'>('planner');
  
  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newType, setNewType] = useState<TaskType>('normal');

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('chronos_v2_data');
    if (saved) {
      try {
        const parsed: AppData = JSON.parse(saved);
        setTasks(parsed.tasks || []);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    const data: AppData = {
      tasks,
      userName: "User",
      version: "2.1.0"
    };
    localStorage.setItem('chronos_v2_data', JSON.stringify(data));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTime) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTitle,
      scheduledTime: new Date(newTime).toISOString(),
      completed: false,
      taskType: newType,
      priority: newPriority,
      category: newCategory,
      completionHistory: []
    };

    setTasks(prev => [...prev, newTask]);
    setNewTitle('');
    setNewTime('');
  };

  const toggleTask = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (t.taskType === 'daily') {
          const history = t.completionHistory || [];
          const isDoneToday = history.includes(today);
          return {
            ...t,
            completionHistory: isDoneToday 
              ? history.filter(d => d !== today) 
              : [...history, today]
          };
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ tasks, exportedAt: new Date().toISOString() }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `chronos_precision_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (json.tasks && Array.isArray(json.tasks)) {
          setTasks(json.tasks);
          alert('Activity records synced successfully!');
        } else {
          alert('Invalid activity backup format.');
        }
      } catch (err) {
        alert('Failed to read backup file.');
      }
      // CRITICAL: Reset the input value so the same file can be imported again if needed
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.taskType !== b.taskType) return a.taskType === 'daily' ? -1 : 1;
      return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
    });
  }, [tasks]);

  const efficiencyRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(t => {
      if (t.taskType === 'daily') return (t.completionHistory && t.completionHistory.length > 0);
      return t.completed;
    }).length;
    return (completedCount / tasks.length) * 100;
  }, [tasks]);

  return (
    <div className="min-h-screen pb-20 bg-[#fafafa] text-slate-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 transition-transform hover:scale-105">
              <i className="fas fa-bolt text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">Chronos</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Precision Routine Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="group cursor-pointer bg-white hover:bg-slate-50 text-slate-500 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 flex items-center gap-2 shadow-sm">
              <i className="fas fa-cloud-upload-alt group-hover:scale-110 transition-transform text-blue-500"></i>
              Import
              <input type="file" className="hidden" onChange={importData} accept=".json" />
            </label>
            <button 
              onClick={exportData}
              className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-slate-300 flex items-center gap-2"
            >
              <i className="fas fa-download text-blue-400"></i>
              Backup
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Dashboard Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-visible">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-30 pointer-events-none"></div>
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <i className="fas fa-plus-circle text-blue-500"></i>
                Define Activity
              </h3>
              <form onSubmit={addTask} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Activity Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., Deep Work Session"
                    autoComplete="off"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 shadow-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <CustomDropdown 
                    label="Category" 
                    value={newCategory} 
                    options={CATEGORIES} 
                    onChange={setNewCategory} 
                  />
                  <CustomDropdown 
                    label="Priority" 
                    value={newPriority} 
                    options={PRIORITIES} 
                    onChange={setNewPriority} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <CustomDropdown 
                    label="Activity Type" 
                    value={newType} 
                    options={TASK_TYPES} 
                    onChange={setNewType} 
                    colorClass="bg-blue-50/50 border-blue-100"
                  />
                  <div className="flex flex-col">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Due Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-[9px] text-[13px] font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm min-h-[46px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/30 active:scale-[0.98]"
                >
                  Register Activity
                </button>
              </form>
            </div>

            <ContributionGraph tasks={tasks} />
          </div>

          {/* Productivity Views */}
          <div className="lg:col-span-8 space-y-8">
            <nav className="flex gap-2 p-1.5 bg-slate-100/50 backdrop-blur rounded-[24px] w-fit border border-slate-200/50">
              {[
                { id: 'planner', icon: 'fa-calendar-day', label: 'Timeline' },
                { id: 'stats', icon: 'fa-chart-pie', label: 'Precision Stats' },
                { id: 'coach', icon: 'fa-brain', label: 'AI Strategist' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-sm font-black transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-md scale-105' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <i className={`fas ${tab.icon}`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'planner' && (
                <div className="space-y-6">
                  <div className="flex items-end justify-between px-2">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Timeline</h2>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Activity Sequence</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Efficiency</span>
                      <div className="h-3 w-40 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                          style={{ width: `${efficiencyRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {sortedTasks.length > 0 ? (
                    <div className="grid gap-4">
                      {sortedTasks.map(task => (
                        <TaskItem 
                          key={task.id} 
                          task={task} 
                          onToggle={toggleTask} 
                          onDelete={deleteTask} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200 shadow-sm">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-200 text-3xl mb-6 animate-pulse">
                        <i className="fas fa-layer-group"></i>
                      </div>
                      <p className="text-slate-800 font-black text-xl">Chronos is idle.</p>
                      <p className="text-slate-400 font-bold text-sm max-w-[240px] text-center mt-2">Initialize your first activity routine in the left panel.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stats' && (
                <StatsDashboard tasks={tasks} />
              )}

              {activeTab === 'coach' && (
                <ChatInterface tasks={tasks} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

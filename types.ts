
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskType = 'daily' | 'normal';

export interface Task {
  id: string;
  title: string;
  description?: string;
  scheduledTime: string; // ISO String for date/time
  completed: boolean;
  taskType: TaskType;
  priority: TaskPriority;
  category: string;
  completionHistory?: string[]; // Array of dates for daily tasks
}

export interface AppData {
  tasks: Task[];
  userName: string;
  version: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

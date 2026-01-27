import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Task } from '../types';
import { CheckCircle2, AlertCircle, Clock, AlertTriangle, CalendarOff } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progress = Math.round((completedTasks / totalTasks) * 100) || 0;

  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
  const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'High').length;

  const phaseData = [
    { name: 'A - Fiscal', total: tasks.filter(t => t.phase === 'A').length, completed: tasks.filter(t => t.phase === 'A' && t.completed).length },
    { name: 'B - Services', total: tasks.filter(t => t.phase === 'B').length, completed: tasks.filter(t => t.phase === 'B' && t.completed).length },
    { name: 'C - RH/DP', total: tasks.filter(t => t.phase === 'C').length, completed: tasks.filter(t => t.phase === 'C' && t.completed).length },
    { name: 'D - Contábil', total: tasks.filter(t => t.phase === 'D').length, completed: tasks.filter(t => t.phase === 'D' && t.completed).length },
  ];

  const pieData = [
    { name: 'Concluído', value: completedTasks },
    { name: 'Pendente', value: pendingTasks },
  ];

  const COLORS = ['#10b981', '#cbd5e1'];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Visão Geral do Projeto</h2>
        <p className="text-slate-500">Acompanhamento da implementação do Lucro Real</p>
      </header>

      {/* Metric Cards - Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Clock size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progresso</p>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{progress}%</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concluídas</p>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{completedTasks} <span className="text-sm font-normal text-slate-400">/ {totalTasks}</span></h3>
        </div>

        <div className={`p-5 rounded-xl shadow-sm border flex flex-col justify-between h-full ${overdueTasks > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${overdueTasks > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
              <CalendarOff size={20} />
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider ${overdueTasks > 0 ? 'text-red-700' : 'text-slate-500'}`}>Atrasadas</p>
          </div>
          <h3 className={`text-3xl font-bold ${overdueTasks > 0 ? 'text-red-700' : 'text-slate-800'}`}>{overdueTasks}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Críticas Pendentes</p>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{highPriorityPending}</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Phase Progress Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Progresso por Fase</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="total" fill="#f1f5f9" radius={[0, 4, 4, 0]} barSize={20} stackId="a" />
                <Bar dataKey="completed" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} stackId="a" className="-ml-full" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
             {phaseData.map(p => (
               <div key={p.name} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                  <span className="font-medium text-slate-700">{p.name.split('-')[1]}</span>
                  <span className="text-blue-600 font-bold">{Math.round((p.completed / p.total) * 100) || 0}%</span>
               </div>
             ))}
          </div>
        </div>

        {/* Overall Completion Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 self-start w-full">Status Global</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
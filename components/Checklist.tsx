import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Square, User, AlertTriangle, Plus, Edit2, Trash2, X, Save, Users, Search, Calendar, Link as LinkIcon, FileText, Filter } from 'lucide-react';

interface ChecklistProps {
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  responsibles: string[];
  onAddResponsible: (name: string) => void;
  onDeleteResponsible: (name: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ 
  tasks, toggleTask, addTask, updateTask, deleteTask, 
  responsibles, onAddResponsible, onDeleteResponsible 
}) => {
  const phases = ['A', 'B', 'C', 'D'] as const;
  const phaseNames = {
    A: 'Fase A: Revisão Fiscal',
    B: 'Fase B: Empresa de Serviços',
    C: 'Fase C: RH e Portabilidade',
    D: 'Fase D: Rotinas e Dedutibilidade'
  };

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRespModalOpen, setIsRespModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [newResponsible, setNewResponsible] = useState('');

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResponsible, setFilterResponsible] = useState('');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showHighPriorityOnly, setShowHighPriorityOnly] = useState(false);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Task Modal Handlers
  const openNewTaskModal = () => {
    setEditingTask(null);
    setFormData({
      id: '',
      phase: 'A',
      activity: '',
      responsible: responsibles[0] || '',
      priority: 'Normal',
      completed: false
    });
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setFormData({ ...task });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.activity || !formData.phase) {
      alert("Por favor, preencha ID, Atividade e Fase.");
      return;
    }
    const taskToSave = formData as Task;
    if (editingTask) {
      updateTask(taskToSave);
    } else {
      if (tasks.some(t => t.id === taskToSave.id)) {
        alert("Já existe uma tarefa com este ID. Por favor, escolha outro.");
        return;
      }
      addTask(taskToSave);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade permanentemente?')) {
      deleteTask(id);
    }
  };

  const handleAddResp = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResponsible.trim()) {
      onAddResponsible(newResponsible.trim());
      setNewResponsible('');
    }
  };

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.activity.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResp = filterResponsible ? task.responsible === filterResponsible : true;
    const matchesPending = showPendingOnly ? !task.completed : true;
    const matchesPriority = showHighPriorityOnly ? task.priority === 'High' : true;
    const matchesOverdue = showOverdueOnly ? (!task.completed && task.dueDate && task.dueDate < today) : true;

    return matchesSearch && matchesResp && matchesPending && matchesPriority && matchesOverdue;
  });

  const isOverdue = (task: Task) => !task.completed && task.dueDate && task.dueDate < today;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Checklist de Execução</h2>
          <p className="text-slate-500">Gerencie, edite e acompanhe as atividades do projeto.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <button 
                onClick={() => setIsRespModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
                <Users size={16} />
                Resp.
            </button>
            <button 
                onClick={openNewTaskModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
                <Plus size={16} />
                Nova
            </button>
        </div>
      </header>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Buscar tarefa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            <select 
                value={filterResponsible} 
                onChange={(e) => setFilterResponsible(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="">Todos Resp.</option>
                {responsibles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            
            <button 
                onClick={() => setShowPendingOnly(!showPendingOnly)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${showPendingOnly ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-600'}`}
            >
                Pendentes
            </button>
            <button 
                onClick={() => setShowHighPriorityOnly(!showHighPriorityOnly)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${showHighPriorityOnly ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-300 text-slate-600'}`}
            >
                Alta Prioridade
            </button>
             <button 
                onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${showOverdueOnly ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-300 text-slate-600'}`}
            >
                Atrasadas
            </button>
        </div>
      </div>

      {phases.map(phase => {
        const phaseTasks = filteredTasks.filter(t => t.phase === phase);
        if (phaseTasks.length === 0) return null;

        const originalPhaseTasks = tasks.filter(t => t.phase === phase);
        const progress = Math.round((originalPhaseTasks.filter(t => t.completed).length / originalPhaseTasks.length) * 100);

        return (
          <div key={phase} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-slate-700 text-lg">{phaseNames[phase]}</h3>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-slate-600 w-10 text-right">{progress}%</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {phaseTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-4 transition-colors duration-200 flex gap-4 items-start group ${task.completed ? 'bg-slate-50' : 'hover:bg-blue-50/50'}`}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
                  >
                    {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${task.completed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {task.id}
                        </span>
                        {task.priority === 'High' && !task.completed && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                            <AlertTriangle size={10} strokeWidth={3} />
                            Prioridade Alta
                          </span>
                        )}
                        {isOverdue(task) && (
                           <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                            Atrasada
                          </span> 
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditTaskModal(task)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(task.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <p className={`text-sm md:text-base font-medium transition-all cursor-pointer ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`} onClick={() => toggleTask(task.id)}>
                      {task.activity}
                    </p>
                    
                    <div className="mt-2 flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <User size={12} />
                            <span>{task.responsible || 'Não atribuído'}</span>
                        </div>
                        {task.dueDate && (
                            <div className={`flex items-center gap-2 text-xs ${isOverdue(task) ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                                <Calendar size={12} />
                                <span>{new Date(task.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</span>
                            </div>
                        )}
                        {task.evidenceUrl && (
                            <a href={task.evidenceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                                <LinkIcon size={12} />
                                <span>Evidência</span>
                            </a>
                        )}
                         {task.notes && (
                            <div className="flex items-center gap-2 text-xs text-slate-500" title={task.notes}>
                                <FileText size={12} />
                                <span className="max-w-[150px] truncate">{task.notes}</span>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {editingTask ? 'Editar Atividade' : 'Nova Atividade'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
                <form id="taskForm" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código / ID</label>
                    <input 
                        type="text" 
                        value={formData.id} 
                        onChange={(e) => setFormData({...formData, id: e.target.value})}
                        disabled={!!editingTask} 
                        placeholder="Ex: A-99"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                    </div>
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fase</label>
                    <select 
                        value={formData.phase} 
                        onChange={(e) => setFormData({...formData, phase: e.target.value as any})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="A">Fase A - Fiscal</option>
                        <option value="B">Fase B - Services</option>
                        <option value="C">Fase C - RH</option>
                        <option value="D">Fase D - Contábil</option>
                    </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição da Atividade</label>
                    <textarea 
                    value={formData.activity} 
                    onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    rows={2}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva o que precisa ser feito..."
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Responsável</label>
                    <select 
                        value={formData.responsible} 
                        onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        {responsibles.map(r => (
                        <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prioridade</label>
                    <select 
                        value={formData.priority || 'Normal'} 
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Normal">Normal</option>
                        <option value="High">Alta</option>
                    </select>
                    </div>
                     <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prazo (Due Date)</label>
                    <input 
                        type="date" 
                        value={formData.dueDate || ''}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                </div>
                
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link da Evidência</label>
                    <input 
                        type="url" 
                        value={formData.evidenceUrl || ''} 
                        onChange={(e) => setFormData({...formData, evidenceUrl: e.target.value})}
                        placeholder="https://drive.google.com/..."
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas / Observações</label>
                    <textarea 
                    value={formData.notes || ''} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Detalhes adicionais..."
                    ></textarea>
                </div>
                </form>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" form="taskForm" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"><Save size={16} /> Salvar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Responsibles Modal (simplified for brevity, assume similar structure as before but kept) */}
      {isRespModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col max-h-[80vh]">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
               <h3 className="font-bold text-lg text-slate-800">Gerenciar Responsáveis</h3>
               <button onClick={() => setIsRespModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
             </div>
             <div className="p-6 flex-1 overflow-y-auto">
               <form onSubmit={handleAddResp} className="flex gap-2 mb-6">
                 <input type="text" value={newResponsible} onChange={(e) => setNewResponsible(e.target.value)} placeholder="Novo Responsável" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"/>
                 <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={!newResponsible.trim()}><Plus size={20} /></button>
               </form>
               <div className="space-y-2">
                 {responsibles.map(resp => (
                   <div key={resp} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-blue-200">
                     <span className="text-sm font-medium text-slate-700">{resp}</span>
                     <button onClick={() => onDeleteResponsible(resp)} className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                   </div>
                 ))}
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Checklist from './components/Checklist';
import Docs from './components/Docs';
import ProjectSettings from './components/ProjectSettings';
import Report from './components/Report';
import AutoUpdateNotification from './components/AutoUpdateNotification';
import { ViewState, Task, ProjectSettings as IProjectSettings } from './types';
import { INITIAL_RESPONSIBLES } from './constants';
import { useFirebaseTasks } from './hooks/useFirebaseTasks';

const STORAGE_KEY = 'lr_planner_state_v1';

const DEFAULT_SETTINGS: IProjectSettings = {
  uf: 'GO',
  segmento: 'Máquinas, Equipamentos e Peças',
  empresaOperacional: { nome: '', cnpj: '', municipio: '' },
  empresaServices: { nome: '', cnpj: '', municipio: '' },
  observacoes: ''
};

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Firebase Hooks
  const { tasks, addTask, updateTask, deleteTask, loading: tasksLoading } = useFirebaseTasks('default_user');

  // Initialize State from LocalStorage or Defaults (Only for Responsibles and Settings)
  const [responsibles, setResponsibles] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).responsibles; } catch (e) { return INITIAL_RESPONSIBLES; }
    }
    return INITIAL_RESPONSIBLES;
  });

  const [settings, setSettings] = useState<IProjectSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).settings || DEFAULT_SETTINGS; } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  // Persistence Effect (Only for Responsibles and Settings)
  useEffect(() => {
    // We don't save tasks to localStorage anymore
    const stateToSave = { responsibles, settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [responsibles, settings]);

  // Handlers
  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask({ ...task, completed: !task.completed });
    }
  };

  const handleAddTask = (newTask: Task) => addTask(newTask);

  const handleUpdateTask = (updatedTask: Task) => updateTask(updatedTask);
  const handleDeleteTask = (taskId: string) => deleteTask(taskId);

  const handleAddResponsible = (name: string) => {
    if (!responsibles.includes(name)) setResponsibles(prev => [...prev, name].sort());
  };
  const handleDeleteResponsible = (name: string) => setResponsibles(prev => prev.filter(r => r !== name));

  // Settings Handlers
  const handleReset = () => {
    if (window.confirm('Tem certeza? Isso apagará as configurações locais.')) {
      localStorage.removeItem(STORAGE_KEY);
      setResponsibles(INITIAL_RESPONSIBLES);
      setSettings(DEFAULT_SETTINGS);
      window.location.reload();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ tasks, responsibles, settings }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LucroReal_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.responsibles && json.settings) {
          if (window.confirm('Isso substituirá suas configurações atuais. Continuar?')) {
            setResponsibles(json.responsibles);
            setSettings(json.settings);

            // Note: Importing tasks is more complex with Firebase as we'd need to batch create them
            // For now, we only import local settings
            alert('Configurações importadas com sucesso! (Tarefas não são importadas para o banco de dados nesta versão)');
          }
        } else {
          alert('Arquivo inválido: Estrutura de dados incorreta.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const renderContent = () => {
    if (tasksLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} />;
      case 'checklist':
        return (
          <Checklist
            tasks={tasks}
            toggleTask={toggleTask}
            addTask={handleAddTask}
            updateTask={handleUpdateTask}
            deleteTask={handleDeleteTask}
            responsibles={responsibles}
            onAddResponsible={handleAddResponsible}
            onDeleteResponsible={handleDeleteResponsible}
          />
        );
      case 'settings':
        return (
          <ProjectSettings
            settings={settings}
            setSettings={setSettings}
            onReset={handleReset}
            onExport={handleExport}
            onImport={handleImport}
            taskCount={tasks.length}
            completedCount={tasks.filter(t => t.completed).length}
            responsibleCount={responsibles.length}
          />
        );
      case 'report':
        return <Report tasks={tasks} settings={settings} responsibles={responsibles} />;
      case 'phases':
      case 'models':
      case 'tips':
        return <Docs view={currentView} />;
      default:
        return <Dashboard tasks={tasks} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      <Sidebar
        currentView={currentView}
        setView={setView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Notificação automática de atualização */}
      <AutoUpdateNotification />
    </div>
  );
};

export default App;
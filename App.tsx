import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Checklist from './components/Checklist';
import Docs from './components/Docs';
import ProjectSettings from './components/ProjectSettings';
import Report from './components/Report';
import AutoUpdateNotification from './components/AutoUpdateNotification';
import { ConfirmModal, AlertModal } from './components/Modal';
import { ViewState, Task, ProjectSettings as IProjectSettings } from './types';
import { INITIAL_RESPONSIBLES } from './constants';
import { useFirebaseTasks } from './hooks/useFirebaseTasks';
import { useFirebaseResponsibles } from './hooks/useFirebaseResponsibles';

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

  // Modais de confirmação e alerta
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, action?: 'reset' | 'import', importData?: any}>({ isOpen: false });
  const [alertModal, setAlertModal] = useState<{isOpen: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info', title: string}>({ isOpen: false, message: '', type: 'info', title: '' });

  // Firebase Hooks
  const { tasks, addTask, updateTask, deleteTask, loading: tasksLoading } = useFirebaseTasks('default_user');
  const { responsibles, saveResponsibles, loading: responsiblesLoading } = useFirebaseResponsibles('default_user');

  // Initialize State from LocalStorage or Defaults (Only for Settings)
  const [settings, setSettings] = useState<IProjectSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).settings || DEFAULT_SETTINGS; } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  // Persistence Effect (Only for Settings, responsibles are now in Firebase)
  useEffect(() => {
    const stateToSave = { settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [settings]);

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

  const handleAddResponsible = async (name: string) => {
    if (!responsibles.includes(name)) {
      const newList = [...responsibles, name].sort();
      await saveResponsibles(newList);
    }
  };
  
  const handleDeleteResponsible = async (name: string) => {
    const newList = responsibles.filter(r => r !== name);
    await saveResponsibles(newList);
  };

  // Settings Handlers
  const handleReset = () => {
    setConfirmModal({ isOpen: true, action: 'reset' });
  };

  const confirmReset = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await saveResponsibles(INITIAL_RESPONSIBLES);
    setSettings(DEFAULT_SETTINGS);
    window.location.reload();
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
          setConfirmModal({ isOpen: true, action: 'import', importData: json });
        } else {
          setAlertModal({ isOpen: true, message: 'Arquivo inválido: Estrutura de dados incorreta.', type: 'error', title: 'Erro ao Importar' });
        }
      } catch (err) {
        setAlertModal({ isOpen: true, message: 'Erro ao ler arquivo JSON.', type: 'error', title: 'Erro ao Importar' });
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const confirmImport = () => {
    if (confirmModal.importData) {
      setResponsibles(confirmModal.importData.responsibles);
      setSettings(confirmModal.importData.settings);
      setAlertModal({ isOpen: true, message: 'Configurações importadas com sucesso! (Tarefas não são importadas para o banco de dados nesta versão)', type: 'success', title: 'Importado' });
    }
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

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmModal.action === 'reset' ? confirmReset : confirmImport}
        title={confirmModal.action === 'reset' ? 'Resetar Configurações' : 'Importar Configurações'}
        message={
          confirmModal.action === 'reset'
            ? 'Tem certeza? Isso apagará as configurações locais.'
            : 'Isso substituirá suas configurações atuais. Continuar?'
        }
        confirmText="Sim, confirmar"
        cancelText="Cancelar"
        type="warning"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default App;
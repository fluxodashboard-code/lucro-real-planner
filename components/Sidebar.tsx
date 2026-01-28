import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, Layers, FileText, Lightbulb, Menu, Settings, ClipboardList, RefreshCw, Download } from 'lucide-react';
import { ViewState } from '../types';
import { useUpdater } from '../hooks/useUpdater';
import UpdateModal from './UpdateModal';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { currentVersion, isChecking, updateAvailable, updateInfo, checkForUpdates, performUpdate } = useUpdater();

  const menuItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'settings', label: 'Configuração', icon: <Settings size={20} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'checklist', label: 'Checklist & Execução', icon: <CheckSquare size={20} /> },
    { id: 'report', label: 'Relatório', icon: <ClipboardList size={20} /> },
    { id: 'phases', label: 'Fases do Projeto', icon: <Layers size={20} /> },
    { id: 'models', label: 'Modelos & Docs', icon: <FileText size={20} /> },
    { id: 'tips', label: 'Dicas Técnicas', icon: <Lightbulb size={20} /> },
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCheckUpdates = async () => {
    await checkForUpdates();
    if (updateAvailable) {
      setShowUpdateModal(true);
    } else {
      alert('Você está na versão mais recente!');
    }
  };

  const handleUpdate = async () => {
    await performUpdate();
    setShowUpdateModal(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 p-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-800 text-white rounded-md shadow-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 w-64 bg-slate-900 text-slate-100 flex flex-col shadow-xl`}
      >
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-blue-400">Lucro Real</h1>
          <p className="text-xs text-slate-400 mt-1">Planejamento Tributário GO</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setView(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-4">
          <button 
            onClick={handleCheckUpdates}
            disabled={isChecking}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Download size={16} />
            {isChecking ? 'Verificando...' : 'Verificar Atualizações'}
          </button>

          <button 
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-slate-700"
          >
            <RefreshCw size={16} />
            Recarregar
          </button>

          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Versão & Status</p>
            <div className="space-y-2">
              <div className="text-xs text-slate-300">
                v{currentVersion}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-300">Online</span>
              </div>
              {updateAvailable && (
                <div className="mt-2 p-2 bg-blue-900 rounded text-xs text-blue-200 font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  Atualização disponível
                </div>
              )}
            </div>
          </div>
        </div>

        <UpdateModal
          isOpen={showUpdateModal}
          version={updateInfo?.version || ''}
          changes={updateInfo?.changes || []}
          isUpdating={isChecking}
          downloadUrl={updateInfo?.downloadUrl}
          onUpdate={handleUpdate}
          onClose={() => setShowUpdateModal(false)}
        />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
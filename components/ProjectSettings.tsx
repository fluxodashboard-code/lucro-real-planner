import React, { useRef, useState } from 'react';
import { ProjectSettings as IProjectSettings, Task } from '../types';
import { Download, Upload, RotateCcw, Save, Building2, MapPin, FileText, Database, Edit2, Trash2, Check, X } from 'lucide-react';
import { useFirebaseProjects } from '../hooks/useFirebaseProjects';
import { ConfirmModal, AlertModal } from './Modal';

interface ProjectSettingsProps {
  settings: IProjectSettings;
  setSettings: (settings: IProjectSettings) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  taskCount: number;
  completedCount: number;
  responsibleCount: number;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ 
  settings, setSettings, onReset, onExport, onImport,
  taskCount, completedCount, responsibleCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectName, setProjectName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Modais de confirmação e alerta
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, projectId?: string, projectName?: string, action?: 'delete' | 'reset'}>({ isOpen: false });
  const [alertModal, setAlertModal] = useState<{isOpen: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info', title: string}>({ isOpen: false, message: '', type: 'info', title: '' });
  
  const { projects, loading, saveProject, updateProject, deleteProject } = useFirebaseProjects('default_user');

  const handleChange = (section: keyof IProjectSettings | null, field: string, value: string) => {
    if (section === 'empresaOperacional' || section === 'empresaServices') {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };

  const handleSaveToDatabase = async () => {
    if (!projectName.trim()) {
      setAlertModal({ isOpen: true, message: 'Digite um nome para o projeto!', type: 'warning', title: 'Nome obrigatório' });
      return;
    }

    if (editingProjectId) {
      const result = await updateProject(editingProjectId, projectName, settings);
      if (result.success) {
        setAlertModal({ isOpen: true, message: 'Projeto atualizado com sucesso!', type: 'success', title: 'Sucesso' });
        setShowSaveModal(false);
        setProjectName('');
        setEditingProjectId(null);
      } else {
        setAlertModal({ isOpen: true, message: 'Erro ao atualizar projeto. Tente novamente.', type: 'error', title: 'Erro' });
      }
    } else {
      const result = await saveProject(projectName, settings);
      if (result.success) {
        setAlertModal({ isOpen: true, message: 'Projeto salvo no banco de dados!', type: 'success', title: 'Sucesso' });
        setShowSaveModal(false);
        setProjectName('');
      } else {
        setAlertModal({ isOpen: true, message: 'Erro ao salvar projeto. Tente novamente.', type: 'error', title: 'Erro' });
      }
    }
  };

  const handleLoadProject = (project: any) => {
    setSettings(project.settings);
    setAlertModal({ isOpen: true, message: `Projeto "${project.name}" carregado!`, type: 'success', title: 'Projeto Carregado' });
  };

  const handleEditProject = (project: any) => {
    setEditingProjectId(project.id);
    setProjectName(project.name);
    setSettings(project.settings);
    setShowSaveModal(true);
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    setConfirmModal({ isOpen: true, projectId, projectName, action: 'delete' });
  };

  const confirmDeleteProject = async () => {
    if (confirmModal.projectId) {
      const result = await deleteProject(confirmModal.projectId);
      if (result.success) {
        setAlertModal({ isOpen: true, message: 'Projeto excluído com sucesso!', type: 'success', title: 'Excluído' });
      } else {
        setAlertModal({ isOpen: true, message: 'Erro ao excluir projeto. Tente novamente.', type: 'error', title: 'Erro' });
      }
      setConfirmModal({ isOpen: false });
    }
  };

  const handleResetConfirm = () => {
    setConfirmModal({ isOpen: true, action: 'reset' });
  };

  const confirmReset = () => {
    onReset();
    setConfirmModal({ isOpen: false });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Configuração do Projeto</h2>
        <p className="text-slate-500">Perfil das empresas, salvamento automático e importação/exportação.</p>
      </header>

      {/* Modal de Salvar */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {editingProjectId ? 'Atualizar Projeto' : 'Salvar Projeto no Banco'}
            </h3>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Projeto</label>
            <input 
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ex: Projeto Cliente ABC"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSaveToDatabase}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Check size={16} />
                {editingProjectId ? 'Atualizar' : 'Salvar'}
              </button>
              <button 
                onClick={() => {
                  setShowSaveModal(false);
                  setProjectName('');
                  setEditingProjectId(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Building2 size={20} />
              <h3 className="font-bold text-lg">Perfil (GO – Máquinas/Peças)</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Essas informações aparecem no relatório e ajudam a padronizar projetos futuros.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">UF</label>
                <input 
                  type="text" 
                  value={settings.uf}
                  onChange={(e) => handleChange(null, 'uf', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Segmento</label>
                <input 
                  type="text" 
                  value={settings.segmento}
                  onChange={(e) => handleChange(null, 'segmento', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Empresa Operacional</label>
                <input 
                  type="text" 
                  placeholder="Razão Social"
                  value={settings.empresaOperacional.nome}
                  onChange={(e) => handleChange('empresaOperacional', 'nome', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <input 
                  type="text" 
                  placeholder="Município"
                  value={settings.empresaOperacional.municipio}
                  onChange={(e) => handleChange('empresaOperacional', 'municipio', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CNPJ (Operacional)</label>
                <input 
                  type="text" 
                  placeholder="00.000.000/0000-00"
                  value={settings.empresaOperacional.cnpj}
                  onChange={(e) => handleChange('empresaOperacional', 'cnpj', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Empresa Services</label>
                <input 
                  type="text" 
                  placeholder="Razão Social"
                  value={settings.empresaServices.nome}
                  onChange={(e) => handleChange('empresaServices', 'nome', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <input 
                  type="text" 
                  placeholder="Município"
                  value={settings.empresaServices.municipio}
                  onChange={(e) => handleChange('empresaServices', 'municipio', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CNPJ (Services)</label>
                <input 
                  type="text" 
                  placeholder="00.000.000/0000-00"
                  value={settings.empresaServices.cnpj}
                  onChange={(e) => handleChange('empresaServices', 'cnpj', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observações do Projeto</label>
              <textarea 
                rows={3}
                value={settings.observacoes}
                onChange={(e) => handleChange(null, 'observacoes', e.target.value)}
                placeholder="Ex: ERP utilizado, início no Lucro Real, peculiaridades, riscos..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Save size={14} />
                Salvamento automático ativo (localStorage).
            </div>
          </div>
        </div>

        {/* Actions Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <FileText size={20} />
              <h3 className="font-bold text-lg">Dados do Projeto</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Leve o projeto para outro PC ou crie um "template" por cliente.</p>

            <div className="space-y-3">
              <button 
                onClick={() => setShowSaveModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Database size={18} />
                Salvar no Banco
              </button>

              <button 
                onClick={onExport}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Download size={18} />
                Exportar (.json)
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Upload size={18} />
                Importar (.json)
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={onImport}
                accept=".json"
                className="hidden"
              />

              <hr className="border-slate-100 my-2" />

              <button 
                onClick={handleResetConfirm}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RotateCcw size={18} />
                Resetar tudo
              </button>
            </div>

            <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Resumo</h4>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Tarefas</span>
                        <span className="font-medium text-slate-900">{taskCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Concluídas</span>
                        <span className="font-medium text-slate-900">{completedCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Responsáveis</span>
                        <span className="font-medium text-slate-900">{responsibleCount}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Projetos Salvos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <Database size={20} />
              <h3 className="font-bold text-lg">Projetos Salvos</h3>
            </div>
            
            {loading ? (
              <p className="text-sm text-slate-400">Carregando projetos...</p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhum projeto salvo ainda.</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 text-sm">{project.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {project.settings.empresaOperacional.nome || 'Sem empresa'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleLoadProject(project)}
                          className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors"
                          title="Carregar"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmModal.action === 'delete' ? confirmDeleteProject : confirmReset}
        title={confirmModal.action === 'delete' ? 'Excluir Projeto' : 'Resetar Configurações'}
        message={
          confirmModal.action === 'delete' 
            ? `Tem certeza que deseja excluir o projeto "${confirmModal.projectName}"?`
            : 'Tem certeza? Isso apagará as configurações locais.'
        }
        confirmText="Sim, confirmar"
        cancelText="Cancelar"
        type="danger"
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

export default ProjectSettings;
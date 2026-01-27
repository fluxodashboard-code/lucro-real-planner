import React, { useRef } from 'react';
import { ProjectSettings as IProjectSettings, Task } from '../types';
import { Download, Upload, RotateCcw, Save, Building2, MapPin, FileText } from 'lucide-react';

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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Configuração do Projeto</h2>
        <p className="text-slate-500">Perfil das empresas, salvamento automático e importação/exportação.</p>
      </header>

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
                onClick={onReset}
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
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
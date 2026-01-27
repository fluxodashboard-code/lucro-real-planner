import React from 'react';
import { Download, AlertCircle, X } from 'lucide-react';

interface UpdateModalProps {
  isOpen: boolean;
  version: string;
  changes: string[];
  isUpdating: boolean;
  onUpdate: () => void;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  version,
  changes,
  isUpdating,
  onUpdate,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-white" />
            <h2 className="text-lg font-bold text-white">Atualização Disponível</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="text-white hover:bg-blue-800 p-1 rounded disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 mb-4">
            Uma nova versão <span className="font-bold text-blue-600">v{version}</span> está disponível!
          </p>

          {changes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-2">Alterações:</h3>
              <ul className="space-y-1">
                {changes.map((change, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-blue-600 flex-shrink-0">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-slate-500 mb-6">
            Clique em "Atualizar Agora" para instalar a nova versão.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 font-medium transition-colors"
          >
            Depois
          </button>
          <button
            onClick={onUpdate}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Download size={16} />
            {isUpdating ? 'Atualizando...' : 'Atualizar Agora'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;

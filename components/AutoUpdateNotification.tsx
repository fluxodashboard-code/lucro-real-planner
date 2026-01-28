import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';

interface AutoUpdateNotificationProps {
  onClose?: () => void;
}

const AutoUpdateNotification: React.FC<AutoUpdateNotificationProps> = ({ onClose }) => {
  const [updateState, setUpdateState] = useState<'checking' | 'downloading' | 'ready' | 'none'>('none');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  useEffect(() => {
    // Verificar se está no Electron
    if (!window.electron) return;

    // Listener: Atualização disponível
    window.electron.onUpdateAvailable((info) => {
      console.log('Nova atualização disponível:', info.version);
      setUpdateInfo(info);
      setUpdateState('downloading');
    });

    // Listener: Progresso do download
    window.electron.onDownloadProgress((percent) => {
      setDownloadProgress(percent);
    });

    // Listener: Download completo
    window.electron.onUpdateDownloaded((info) => {
      console.log('Atualização baixada:', info.version);
      setUpdateState('ready');
    });
  }, []);

  const handleInstallNow = () => {
    if (window.electron) {
      window.electron.installUpdate();
    }
  };

  // Não mostrar se não houver update
  if (updateState === 'none') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-2xl p-4 max-w-sm">
        {/* Downloading */}
        {updateState === 'downloading' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <RefreshCw size={24} className="animate-spin" />
              <div className="flex-1">
                <h3 className="font-bold text-sm">Baixando Atualização</h3>
                <p className="text-xs text-blue-100">v{updateInfo?.version}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-blue-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <p className="text-xs text-blue-100 text-center">
              {downloadProgress.toFixed(0)}% concluído
            </p>
          </div>
        )}

        {/* Ready to Install */}
        {updateState === 'ready' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-green-300" />
              <div className="flex-1">
                <h3 className="font-bold text-sm">Atualização Pronta!</h3>
                <p className="text-xs text-blue-100">v{updateInfo?.version} baixada</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleInstallNow}
                className="flex-1 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Instalar Agora
              </button>
              <button
                onClick={() => setUpdateState('none')}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg text-sm transition-colors"
              >
                Depois
              </button>
            </div>
            
            <p className="text-xs text-blue-100 text-center">
              Será instalado ao fechar o app
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Tipos para window.electron
declare global {
  interface Window {
    electron?: {
      checkForUpdates: () => void;
      installUpdate: () => void;
      onUpdateAvailable: (callback: (info: any) => void) => void;
      onDownloadProgress: (callback: (percent: number) => void) => void;
      onUpdateDownloaded: (callback: (info: any) => void) => void;
    };
  }
}

export default AutoUpdateNotification;

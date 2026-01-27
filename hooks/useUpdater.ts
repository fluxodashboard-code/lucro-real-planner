import { useState, useCallback, useEffect } from 'react';

interface UpdateInfo {
  version: string;
  releaseDate: string;
  changes: string[];
}

export const useUpdater = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Versão atual (mesmo do package.json)
  const currentVersion = '0.0.2';

  // Função para verificar atualizações
  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      // Tenta buscar o arquivo de versão do servidor/storage
      // Se houver uma URL remota configurada, usa ela. Caso contrário, usa o caminho local.
      const updateUrl = import.meta.env.VITE_UPDATE_URL
        ? `${import.meta.env.VITE_UPDATE_URL.replace(/\/$/, '')}/version.json`
        : '/version.json';

      const response = await fetch(updateUrl, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Falha ao verificar versão');
      }

      const data = await response.json() as UpdateInfo;

      // Compara versões (formato semântico)
      const isNewer = compareVersions(data.version, currentVersion) > 0;

      if (isNewer) {
        setUpdateAvailable(true);
        setUpdateInfo(data);
      } else {
        setUpdateAvailable(false);
        setUpdateInfo(null);
      }
    } catch (err) {
      console.warn('Erro ao verificar atualizações:', err);
      // Não mostra erro ao usuário - é apenas um check em background
      setError(null);
    } finally {
      setIsChecking(false);
    }
  }, [currentVersion]);

  // Função para fazer update
  const performUpdate = useCallback(async () => {
    try {
      setIsChecking(true);

      // Se for Electron
      if (window.electronAPI?.updateApp) {
        await window.electronAPI.updateApp();
      } else {
        // Caso contrário, faz hard refresh
        // Limpa cache e recarrega
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });

        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      setError('Erro ao atualizar aplicação');
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Check automático a cada 5 minutos
  useEffect(() => {
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkForUpdates]);

  return {
    currentVersion,
    isChecking,
    updateAvailable,
    updateInfo,
    error,
    checkForUpdates,
    performUpdate,
  };
};

// Função auxiliar para comparar versões semânticas
function compareVersions(version1: string, version2: string): number {
  const parts1 = version1.split('.').map(Number);
  const parts2 = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

// Tipo para window.electronAPI
declare global {
  interface Window {
    electronAPI?: {
      updateApp: () => Promise<void>;
    };
  }
}

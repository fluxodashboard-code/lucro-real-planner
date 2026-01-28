import { useState, useCallback, useEffect } from 'react';
import { getLatestVersionFromGithub, compareVersions, UpdateInfoFromGithub } from '../services/githubService';

interface UpdateInfo extends UpdateInfoFromGithub {
  downloadUrl?: string;
}

// Função para obter versão do app meta tag injetada no build
const getCurrentVersion = (): string => {
  // Tenta ler do meta tag (injetado no HTML durante o build)
  const metaTag = document.querySelector('meta[name="app-version"]');
  if (metaTag?.getAttribute('content')) {
    return metaTag.getAttribute('content')!;
  }
  
  // Fallback: tenta ler de import.meta.env (disponível em tempo de build com Vite)
  const envVersion = import.meta.env.VITE_APP_VERSION;
  if (envVersion) {
    return envVersion;
  }

  // Último recurso: versão padrão (não deve ser usado)
  return '0.0.0';
};

export const useUpdater = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Versão atual - lida dinamicamente
  const currentVersion = getCurrentVersion();
  
  // Configuração do GitHub (você pode usar variáveis de ambiente)
  const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'seu-usuario';
  const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'lucro-real-planner';

  // Função para verificar atualizações
  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      let updateData: UpdateInfo | null = null;
      let errorOccurred = false;

      // Tenta buscar do GitHub primeiro
      try {
        const githubData = await getLatestVersionFromGithub(GITHUB_OWNER, GITHUB_REPO);
        if (githubData) {
          updateData = githubData as UpdateInfo;
        }
      } catch (githubError) {
        console.warn('Erro ao buscar do GitHub, tentando URL customizada:', githubError);
        errorOccurred = true;
      }

      // Se GitHub falhou ou não retornou dados, tenta URL alternativa
      if (!updateData) {
        try {
          const updateUrl = import.meta.env.VITE_UPDATE_URL
            ? `${import.meta.env.VITE_UPDATE_URL.replace(/\/$/, '')}/version.json`
            : '/version.json';

          const response = await fetch(updateUrl, {
            cache: 'no-store'
          });

          if (response.ok) {
            updateData = await response.json() as UpdateInfo;
          }
        } catch (fallbackError) {
          console.warn('Erro ao buscar versão de URL alternativa:', fallbackError);
        }
      }

      // Se conseguiu dados, verifica versão
      if (updateData) {
        const isNewer = compareVersions(updateData.version, currentVersion) > 0;

        if (isNewer) {
          setUpdateAvailable(true);
          setUpdateInfo(updateData);
        } else {
          setUpdateAvailable(false);
          setUpdateInfo(null);
        }
      } else if (errorOccurred) {
        setError('Não foi possível verificar atualizações');
      }
    } catch (err) {
      console.warn('Erro ao verificar atualizações:', err);
      setError(null); // Não mostra erro ao usuário - é apenas um check em background
    } finally {
      setIsChecking(false);
    }
  }, [currentVersion, GITHUB_OWNER, GITHUB_REPO]);

  // Função para fazer update
  const performUpdate = useCallback(async () => {
    try {
      setIsChecking(true);

      // Se tem URL de download (do GitHub), oferece para o usuário fazer download
      if (updateInfo?.downloadUrl) {
        // Abre o navegador para fazer download
        window.open(updateInfo.downloadUrl, '_blank');
        
        // Se for Electron, pode auto-atualizar depois
        if (window.electronAPI?.updateApp) {
          setTimeout(() => {
            window.electronAPI?.updateApp?.();
          }, 1000);
        }
      } else if (window.electronAPI?.updateApp) {
        // Se for Electron e não tem URL, usa API do electron
        await window.electronAPI.updateApp();
      } else {
        // Caso contrário, faz hard refresh
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
  }, [updateInfo?.downloadUrl]);

  // Check automático ao abrir e a cada 5 minutos
  useEffect(() => {
    // Verifica imediatamente ao abrir o app
    checkForUpdates();
    
    // Depois verifica a cada 5 minutos
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
    githubUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
  };
};

// Função auxiliar para comparar versões semânticas (mantida para compatibilidade)
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

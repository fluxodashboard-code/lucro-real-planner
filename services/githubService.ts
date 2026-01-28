/**
 * Serviço para integração com GitHub
 * Busca releases e versões do repositório automaticamente
 */

export interface GithubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

export interface UpdateInfoFromGithub {
  version: string;
  releaseDate: string;
  changes: string[];
  downloadUrl?: string;
}

/**
 * Busca as releases do repositório GitHub
 * @param owner - Proprietário do repositório (ex: "seu-usuario")
 * @param repo - Nome do repositório (ex: "lucro-real-planner")
 * @returns Releases encontradas
 */
export async function fetchGithubReleases(
  owner: string,
  repo: string
): Promise<GithubRelease[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar releases do GitHub:', error);
    throw error;
  }
}

/**
 * Busca a versão mais recente do GitHub
 * @param owner - Proprietário do repositório
 * @param repo - Nome do repositório
 * @returns Informações da versão mais recente
 */
export async function getLatestVersionFromGithub(
  owner: string,
  repo: string
): Promise<UpdateInfoFromGithub | null> {
  try {
    const releases = await fetchGithubReleases(owner, repo);
    
    // Filtra releases que não são draft ou prerelease
    const validReleases = releases.filter(
      release => !release.draft && !release.prerelease
    );

    if (validReleases.length === 0) {
      console.warn('Nenhuma release válida encontrada no GitHub');
      return null;
    }

    const latestRelease = validReleases[0];

    // Procura por arquivo .exe ou .zip
    const downloadUrl = latestRelease.assets.find(asset =>
      asset.name.endsWith('.exe') || asset.name.endsWith('.zip')
    )?.browser_download_url;

    // Extrai mudanças do corpo da release
    const changes = parseChangesFromBody(latestRelease.body);

    return {
      version: sanitizeVersion(latestRelease.tag_name),
      releaseDate: latestRelease.published_at.split('T')[0],
      changes: changes,
      downloadUrl: downloadUrl
    };
  } catch (error) {
    console.error('Erro ao buscar versão mais recente do GitHub:', error);
    throw error;
  }
}

/**
 * Limpa a tag da versão para formato semântico (ex: v1.0.0 -> 1.0.0)
 */
function sanitizeVersion(tagName: string): string {
  return tagName.replace(/^v/, '');
}

/**
 * Extrai mudanças do corpo da release
 * Procura por:
 * - Listas com * ou -
 * - Seção "## Changes" ou similar
 */
function parseChangesFromBody(body: string): string[] {
  if (!body) return [];

  const lines = body.split('\n');
  const changes: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Pega linhas que começam com * ou -
    if ((trimmed.startsWith('* ') || trimmed.startsWith('- ')) && trimmed.length > 2) {
      changes.push(trimmed.substring(2));
    }
  }

  // Se não encontrou mudanças, usa as primeiras linhas não-vazias
  if (changes.length === 0) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.length > 0) {
        changes.push(trimmed);
        if (changes.length >= 3) break;
      }
    }
  }

  return changes.length > 0 ? changes : ['Veja as mudanças no GitHub'];
}

/**
 * Valida se o repositório GitHub é válido
 */
export async function validateGithubRepo(
  owner: string,
  repo: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Erro ao validar repositório GitHub:', error);
    return false;
  }
}

/**
 * Comparador de versões semânticas
 * Retorna: 1 se v1 > v2, -1 se v1 < v2, 0 se igual
 */
export function compareVersions(version1: string, version2: string): number {
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

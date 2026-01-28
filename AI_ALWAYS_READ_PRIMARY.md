# AI — Arquivo principal de instruções para releases (FOCO: EXE)

Este arquivo deve ser lido pela IA antes de qualquer operação de release/build/publicação.

PRINCIPAL: use o script PowerShell `scripts/auto-deploy.ps1` para automatizar todo o fluxo de release.

Comando de exemplo (executar a partir da raiz do projeto):
```powershell
.\scripts\auto-deploy.ps1 -Version 0.0.4 -Notes "Correções e melhorias" -RepoOwner fluxodashboard-code -RepoName lucro-real-planner
```

Resumo dos passos que o script realiza:
- `npm install`
- `node scripts/update-version.js` (atualiza `package.json` e `public/version.json`)
- `npm run build`
- `npx electron-builder --win --publish=never` (gera o EXE)
- `git add/commit/tag` e `git push`
- instala/usa `gh` para criar a Release e anexar o EXE

Se preferir seguir manualmente, siga os passos listados em `Always readme.txt`.

---

> IMPORTANTE (PRIMEIRO PASSO): Como enviar os arquivos para o seu repositório no GitHub

Siga estes passos primeiro, antes de executar o script de build/release.

1) Se ainda não tem repositório remoto criado no GitHub
- Crie um novo repositório no GitHub (Settings → New repository) ou use a URL do repositório existente.

2) Com o repositório local pronto, execute (na raiz do projeto):

```bash
# inicializa o repositório local (pulável se já existir)
git init

# adiciona o remoto
git remote add origin https://github.com/fluxodashboard-code/lucro-real-planner.git

# adiciona todos os arquivos e faz o primeiro commit
git add .
git commit -m "Initial commit"

# envia a branch principal (use 'main' ou 'master' conforme seu repo)
git push -u origin main
```

3) Para enviar alterações futuras e criar uma tag de release:

```bash
# adicionar mudanças e commitar
git add .
git commit -m "Descrição da alteração"

# empurrar branch
git push origin main

# criar uma tag de versão (ex: v0.0.4) e enviar a tag
git tag -a v0.0.4 -m "Notas da versão"
git push origin v0.0.4
```

4) Criar a Release e anexar o EXE (usando GitHub CLI `gh`):

```bash
# exemplo: criar release e anexar o executável gerado
gh release create v0.0.4 "dist\Lucro Real Planner 0.0.4.exe" --title "v0.0.4" --notes "Notas da versão" --repo fluxodashboard-code/lucro-real-planner
```

Se não quiser usar `gh`, faça upload manual do EXE pela interface web do GitHub (Releases → Draft a new release → Upload files).


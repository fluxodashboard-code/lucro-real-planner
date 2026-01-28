# ARQUIVO PRINCIPAL DE LEITURA: AI_ALWAYS_READ_PRIMARY.md

# 1. Atualizar versão
## Instruções Rápidas de Release (AI deve ler sempre)

# 2. Compilar como EXE
1) Atualizar versão (atualiza `package.json` e `public/version.json`)
```
node scripts/update-version.js X.Y.Z "Descrição curta"
```

# 3. Marcar no Git
2) Gerar build web
```
npm run build
```

# 4. Enviar para GitHub
3) Gerar EXE (empacotar com Electron)
```
npx electron-builder --win --publish=never
```

4) Commit e tag
```
git add .
git commit -m "vX.Y.Z: Mensagem da release"
git tag -a vX.Y.Z -m "Mensagem da release"
```

5) Enviar para o GitHub
```
## Instruções Rápidas de Release (FOCO: EXE)

Siga este fluxo para gerar um instalador/portable `.exe` que usuários poderão baixar e executar.

1) Atualizar versão (atualiza `package.json` e `public/version.json`)
```
node scripts/update-version.js X.Y.Z "Descrição curta"
```

2) Gerar build (pré-requisito para empacotar)
```
npm run build
```

3) Gerar o EXE (empacotar com Electron) — este é o arquivo que os usuários baixarão
```
# opção direta (recomendado)
npx electron-builder --win --publish=never

# ou usar o script do package.json
npm run build:exe
```

4) Commit e tag
```
git add .
git commit -m "vX.Y.Z: Mensagem da release"
git tag -a vX.Y.Z -m "Mensagem da release"
```

5) Enviar para o GitHub
```
git push origin main
git push origin vX.Y.Z
```

6) Criar Release e subir EXE
- Manual: abra a página de Releases do repositório e arraste `dist\Lucro Real Planner X.Y.Z.exe` para a release criada.
- Automático (recomendado): usar GitHub CLI (`gh`):
```
winget install --id GitHub.cli -e --source winget
gh auth login --web
gh release create vX.Y.Z "dist\\Lucro Real Planner X.Y.Z.exe" --title "vX.Y.Z" --notes "Notas curtas" --repo SEU_USUARIO/SEU_REPO
```

Observações importantes:
- O arquivo que os usuários baixarão é `dist\Lucro Real Planner X.Y.Z.exe`.
- Se o package.json script usa `&&`, PowerShell pode reclamar. Rode `npm run build` e depois `npx electron-builder` separadamente.
- Para repositórios privados, autentique com `gh auth login` ou use um token com escopo `repo`.

Este arquivo contém as instruções que a IA deve ler antes de executar operações de release (priorize criar o EXE para distribuição).
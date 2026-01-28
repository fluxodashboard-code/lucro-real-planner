# AI - Instruções que devem ser lidas antes de executar releases

Este arquivo é a fonte oficial de instruções que a IA (assistente) deve ler ANTES de executar qualquer operação de release, build ou publicação.

Resumo mínimo (passos executáveis):

1) Atualizar versão
```
node scripts/update-version.js X.Y.Z "Descrição curta"
```

2) Gerar build web
```
npm run build
```

3) Gerar EXE
```
npx electron-builder --win --publish=never
```

4) Commit + tag
```
git add .
git commit -m "vX.Y.Z: Mensagem da release"
git tag -a vX.Y.Z -m "Mensagem da release"
```

5) Push
```
## AI - Instruções que devem ser lidas antes de executar releases (FOCO: EXE)

Este arquivo é a fonte oficial de instruções que a IA (assistente) deve ler ANTES de executar qualquer operação de release, build ou publicação.

Resumo mínimo (passos executáveis) — fluxo para gerar o EXE que será distribuído aos usuários:

1) Atualizar versão
```
node scripts/update-version.js X.Y.Z "Descrição curta"
```

2) Gerar build (pré-requisito para empacotar)
```
npm run build
```

3) Gerar o EXE (empacotar com Electron)
```
npx electron-builder --win --publish=never
```

Nota: você também pode usar o script `npm run build:exe`, mas no PowerShell pode ser necessário executar os comandos separadamente.

4) Commit + tag
```
git add .
git commit -m "vX.Y.Z: Mensagem da release"
git tag -a vX.Y.Z -m "Mensagem da release"
```

5) Push
```
git push origin main
git push origin vX.Y.Z
```

6) Criar Release e subir EXE
 - Manual: use a página de Releases do GitHub e arraste o `.exe` gerado
 - Automático: use GitHub CLI (`gh`) autenticado

Observações de segurança e ambiente:
 - Nunca inclua tokens em commits. Use `gh auth login --web` ou variáveis de ambiente locais.
 - Confirme que `dist/` contém o executável antes de criar a release.
 - Em PowerShell, evite usar `&&` em npm scripts — execute comandos separadamente.

Localizações importantes no repositório:
 - `public/version.json` — versão usada para checks
 - `dist/` — arquivos gerados após `npm run build` e `electron-builder`
 - `scripts/update-version.js` — script que atualiza versão e changelog

Se qualquer passo falhar, pare e mostre o erro; não prossiga automaticamente.

-- Fim --

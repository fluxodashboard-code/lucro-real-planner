# 🔧 Guia de Build - Lucro Real Planner

## ⚠️ IMPORTANTE: Sem Certificado de Assinatura

Este projeto **NÃO possui certificado de assinatura de código (código signing)**. O ambiente foi configurado para contornar a assinatura usando fake signtool.

### 🚨 Problema Original
- **electron-builder** tenta assinar arquivos com `signtool.exe` por padrão
- Sem certificado, ele fica bloqueado indefinidamente aguardando um certificado que não existe
- **Solução implementada**: Usar um fake `signtool.exe` que apenas retorna sucesso (exit code 0)

---

## 📦 Como Fazer Build

### Opção 1: Build Completo (Recomendado)
```bash
cd "c:\Users\MARKETING01\Desktop\lucro-real-planner (1)"
.\build-no-sign.ps1
```

**O que faz:**
1. Cria um fake `signtool.exe` no diretório do projeto
2. Configura variáveis de ambiente para desabilitar signing
3. Executa `npx electron-builder --win --publish=never`
4. Exibe tamanho final do EXE

### Opção 2: Build Manual
```bash
npx vite build
npx electron-builder --win --publish=never
```

---

## 🔑 Configurações Críticas

### `.npmrc` (NUNCA adicionar `production=true`)
```properties
legacy-peer-deps=true
# ❌ NÃO adicione: production=true
# Isso bloquearia instalação de devDependencies (vite, typescript, etc)
```

### `electron-builder.json` - Seção Windows
```json
{
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ],
    "verifyUpdateCodeSignature": false,
    "requestedExecutionLevel": "asInvoker"
    // ❌ NÃO adicione certificateFile, sign, ou outras propriedades de signing
  }
}
```

### `electron-builder.json` - NSIS
```json
{
  "nsis": {
    // ... outras configurações ...
    // ❌ NÃO adicione "sign": false aqui
    // Propriedades de signing não são suportadas no NSIS
  }
}
```

---

## 📊 Tamanho do Build Otimizado

**Versão Atual (v0.1.0):**
- **EXE com asar + exclusões: 195.51 MB**

**Histórico:**
- Sem asar (todos os arquivos): ~401 MB
- Com asar original: ~581 MB
- Com asar + otimizações: **195.51 MB** ✅

### Otimizações Aplicadas
1. **asar: true** - Compacta node_modules em arquivo único
2. **Exclusões de arquivo** - Remove README, tests, .d.ts, docs, etc:
   ```json
   "!node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,test,tests,testing,*.d.ts,docs,examples,*.md,*.tgz,*.tar.gz,.git,script}",
   "!node_modules/**/*.{md,map,ts,tsx}",
   "!**/node_modules/**/test/**",
   "!**/node_modules/**/tests/**",
   "!**/node_modules/**/.bin/**",
   "!**/node_modules/**/.github/**",
   "!**/node_modules/**/examples/**",
   "!**/node_modules/**/docs/**"
   ```

---

## 🛠️ Arquivos de Build Criados

### `build-no-sign.ps1` (Script Principal)
- Cria fake `signtool.exe` no PATH
- Limpa todas as variáveis de environment de signing
- Executa electron-builder
- Exibe tamanho final do EXE

### `sign.js` (Não utilizado)
- Arquivo vazio deixado como backup
- electron-builder não suporta propriedade "sign" no JSON
- Se precisar, usar este arquivo com `"sign": "./sign.js"` em package.json scripts

### `signtool.bat` (Fake, no PATH)
- Arquivo batch que retorna sucesso (exit 0)
- Criado dinamicamente pelo `build-no-sign.ps1`
- Intercepta chamadas a `signtool.exe` do electron-builder

---

## 🔄 Próximos Passos Para IA

Se precisar fazer changes e gerar novo build:

1. **Editar código React/TypeScript** → Ok, sem problemas
2. **Atualizar version** em `package.json` e `public/version.json`
3. **Fazer novo build:**
   ```bash
   npx vite build
   npx electron-builder --win --publish=never
   # OU simplesmente:
   .\build-no-sign.ps1
   ```
4. **Testar EXE** gerado em `dist/`
5. **Fazer commit e push** para GitHub

### ⚠️ Armadilhas Comuns
- ❌ NÃO adicione `certificateFile` ao config do Windows
- ❌ NÃO mude `asar` para `false` (aumenta de 195 MB para 401 MB)
- ❌ NÃO adicione `production=true` ao `.npmrc`
- ❌ NÃO execute `npm prune --production` sem reinstalar depois
- ✅ **SEMPRE execute `.\build-no-sign.ps1`** para builds, não apenas `electron-builder`

---

## 📝 Exemplo de Novo Build

```bash
# 1. Fazer mudanças no código

# 2. Atualizar versão
# Editar package.json: "version": "0.2.0"
# Editar public/version.json: "version": "0.2.0"

# 3. Build
.\build-no-sign.ps1
# Aguardar ~5 minutos
# Resultado: dist/Lucro Real Planner Setup 0.2.0.exe

# 4. Upload para GitHub
gh release create v0.2.0 "dist/Lucro Real Planner Setup 0.2.0.exe" --title "v0.2.0" --notes "Changelog aqui..."

# 5. Commit
git add -A
git commit -m "Release v0.2.0"
git push origin main
```

---

## 🔗 Links Úteis
- [Electron Builder Windows](https://www.electron.build/win)
- [Electron Builder NSIS](https://www.electron.build/nsis)
- [GitHub Releases API](https://docs.github.com/en/rest/reference/repos#create-a-release)

---

**Última atualização:** 28/01/2026
**Versão do projeto:** 0.1.0
**Build sem assinatura:** ✅ Funcionando

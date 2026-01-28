# 📦 Upload Manual do EXE no GitHub

Como `gh` não está disponível no PATH, faça upload manual:

## Passo 1: Acessar GitHub
1. Abra https://github.com/fluxodashboard-code/lucro-real-planner/releases
2. Clique em **"Draft a new release"** ou **"Create a new release"**

## Passo 2: Preencher dados da release
- **Tag version:** `v0.0.3` (ou próxima versão)
- **Release title:** `v0.0.3 - Lucro Real Planner Funcional`
- **Description:** Copie o conteúdo abaixo:

```
## ✨ Novidades

### 🎨 UI/UX
- [x] Tailwind CSS offline (funciona sem internet)
- [x] Design responsivo restaurado
- [x] Menu removido (File, Edit, View, etc)

### 🐛 Correções
- [x] Tela branca corrigida
- [x] Electron path corrigido em produção
- [x] CSS compilado em desenvolvimento
- [x] Importação de assets corrigida

### 📱 Funcionalidades
- Dashboard com visão geral do projeto
- Checklist de tarefas interativo
- Configurações de empresa
- Relatórios detalhados
- Integração Firebase

## 📥 Como Instalar

1. Clique em **"Lucro Real Planner Setup 0.0.3.exe"** abaixo
2. Execute o instalador
3. Se Windows avisar, clique "Mais informações" → "Executar assim mesmo"
4. Siga os passos da instalação

## 📚 Documentação

- [Como Usar](COMO_USAR.md)
- [Debug de Tela Branca](TELA_BRANCA_DEBUG.md)
- [Guia de Git](GIT_HELP.md)
```

## Passo 3: Upload do EXE
1. Clique em **"Attach binaries by dropping them here or selecting them"**
2. Selecione: `dist\Lucro Real Planner Setup 0.0.3.exe`
3. Aguarde o upload (pode levar alguns minutos)

## Passo 4: Publicar
1. Clique em **"Publish release"**
2. Pronto! A release está disponível para download

---

**Arquivo do EXE:**
```
C:\Users\MARKETING01\Desktop\lucro-real-planner (1)\dist\Lucro Real Planner Setup 0.0.3.exe
```

**Tamanho:** ~217 MB
**Tipo:** NSIS Installer (com suporte a desinstalar)


# 🚀 Guia Completo: Como Lançar Atualizações

## 📋 Visão Geral

Este guia explica o processo completo para lançar uma nova versão do **Lucro Real Planner** após fazer mudanças no projeto.

O sistema foi otimizado para **sincronização automática de versão**, garantindo que todos os arquivos fiquem sincronizados.

---

## 🔄 Fluxo de Lançamento de Atualização

### **Etapa 1: Fazer Mudanças no Código**

Faça todas as alterações necessárias no projeto:
- Novos componentes
- Correções de bugs
- Melhorias de interface
- Etc.

**Exemplo:**
```tsx
// src/components/Sidebar.tsx
// Mova "Configuração" para o final da lista
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', ... },
  { id: 'settings', label: 'Configuração', ... }, // Movido para final
];
```

---

### **Etapa 2: Atualizar Versão (Sincroniza Automaticamente Tudo!)**

```powershell
node scripts/update-version.js <nova_versão> "<descrição1>" "<descrição2>"
```

**Exemplo:**
```powershell
node scripts/update-version.js 0.0.5 "Dashboard redesenhado" "Performance melhorada" "Novo tema escuro"
```

**O que faz automaticamente:**
- ✅ Atualiza `package.json` → `0.0.5`
- ✅ Atualiza `public/version.json` → `0.0.5`
- ✅ Atualiza `metadata.json` → `0.0.5`
- ✅ Registra todas as mudanças

---

### **Etapa 3: Fazer Build do React**

```powershell
npm run build
```

**O que faz:**
- ✅ Vite compila TypeScript + React
- ✅ Injeta versão no HTML (`<meta name="app-version" content="0.0.5" />`)
- ✅ Injeta em `import.meta.env.VITE_APP_VERSION`
- ✅ Gera arquivos otimizados em `dist/`

**Saída esperada:**
```
✓ 2373 modules transformed.
✓ built in ~6s
```

---

### **Etapa 4: Fazer Build do EXE (Windows)**

```powershell
npm run build:exe
```

**O que faz:**
- ✅ Electron-builder compila o app desktop
- ✅ Assina digitalmente com `signtool.exe`
- ✅ Gera NSIS installer
- ✅ Nome: `Lucro Real Planner Setup 0.0.5.exe`
- ✅ Cria `blockmap` para atualizações incrementais

**Saída esperada:**
```
• building target=nsis file=dist\Lucro Real Planner Setup 0.0.5.exe
✓ Completo em ~2-5min
```

O arquivo fica em: `dist/Lucro Real Planner Setup 0.0.5.exe`

---

### **Etapa 5: Fazer Commit + Push para GitHub**

```powershell
git add .
git commit -m "v0.0.5: Dashboard redesenhado"
git push origin main
```

**O que faz:**
- ✅ Salva as mudanças no Git
- ✅ Envia para GitHub
- ✅ Atualiza histórico

---

### **Etapa 6: Criar Tag e Fazer Release**

```powershell
git tag -a v0.0.5 -m "v0.0.5: Dashboard redesenhado"
git push origin v0.0.5
```

**O que faz:**
- ✅ Cria marcação (tag) no Git
- ✅ Envia tag para GitHub

---

### **Etapa 7: Criar Release no GitHub (COM EXE)**

1. Acesse: https://github.com/fluxodashboard-code/lucro-real-planner/releases
2. Clique: **"Create a new release"**
3. Preencha:
   - **Tag version**: `v0.0.5`
   - **Release title**: `v0.0.5 - Dashboard Redesenhado`
   - **Description**:
     ```markdown
     ## Novidades v0.0.5

     ### ✨ Novas Funcionalidades
     - Dashboard completamente redesenhado
     - Novo tema escuro disponível

     ### 🚀 Melhorias
     - Performance +50% mais rápido
     - Carregamento de gráficos otimizado

     ### 🐛 Correções
     - Corrigido bug ao editar configurações
     - Sincronização de dados melhorada
     ```

4. **Fazer Upload do EXE**:
   - Clique: **"Attach binaries..."**
   - Selecione: `dist\Lucro Real Planner Setup 0.0.5.exe`
   - Clique: **"Publish release"**

---

## 🎯 Resumo do Comando Único (Opcional)

Se quiser fazer **tudo em uma sequência** (sem aguardar):

```powershell
node scripts/update-version.js 0.0.5 "Nova feature"; npm run build; npm run build:exe; git add .; git commit -m "v0.0.5: Nova feature"; git push origin main; git tag -a v0.0.5 -m "v0.0.5: Nova feature"; git push origin v0.0.5
```

> ⚠️ Use com cuidado - se der erro em alguma etapa, pode ficar em estado inconsistente.

---

## ✅ Checklist Antes de Lançar

- [ ] Código testado localmente
- [ ] Sem erros no `npm run build`
- [ ] Versão sincronizada em 3 lugares (package.json, version.json, metadata.json)
- [ ] EXE gerado sem erros
- [ ] Commit com mensagem descritiva
- [ ] Tag criada
- [ ] Release com EXE anexado

---

## 🔍 Verificação Rápida

Após completar todas as etapas, verifique:

### 1. Arquivo HTML (dist/index.html)
```bash
# Procure por:
<meta name="app-version" content="0.0.5" />
```

### 2. Nome do EXE
```
Lucro Real Planner Setup 0.0.5.exe ✅
```

### 3. Na Interface do App
- Abra a versão anterior
- Clique: **"Verificar Atualizações"**
- Deve mostrar: `v0.0.5 está disponível`
- Após atualizar: Version & Status mostra `v0.0.5` ✅

---

## ❌ Troubleshooting

### Problema: "Ainda aparece versão antiga"
**Solução:**
1. Verifique se `update-version.js` foi executado
2. Verifique 3 arquivos:
   - `package.json` (version)
   - `public/version.json` (version)
   - `metadata.json` (version)
3. Limpe cache: `rm -r dist`
4. Refaça: `npm run build`

### Problema: "EXE com versão errada"
**Solução:**
1. Delete `dist/` e `out/` (se existir)
2. Rode novamente: `npm run build:exe`
3. Verifique nome do arquivo

### Problema: "Windows Defender avisa ao instalar"
**Solução:**
Veja: [WINDOWS_DEFENDER_FIX.md](WINDOWS_DEFENDER_FIX.md)

---

## 📊 Histórico de Versões

| Versão | Data | Principais Mudanças |
|--------|------|-------------------|
| 0.0.4 | 28/01/2026 | Sidebar: Configuração no final |
| 0.0.3 | 28/01/2026 | Sincronização automática de versão |
| 0.0.2 | - | - |
| 0.0.1 | - | - |

---

## 🚀 Próximas Features

- [ ] Auto-update automático (sem prompt do usuário)
- [ ] Certificado de código pago (para evitar Windows Defender)
- [ ] Publicação no Microsoft Store
- [ ] Analytics de uso
- [ ] Tema escuro

---

**Dúvidas?** Veja os arquivos:
- [VERSION_SYNC_GUIDE.md](VERSION_SYNC_GUIDE.md) - Sincronização de versão
- [WINDOWS_DEFENDER_FIX.md](WINDOWS_DEFENDER_FIX.md) - Problemas com antivírus

---

*Última atualização: 28/01/2026*

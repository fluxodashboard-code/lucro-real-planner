# 🚀 Integração GitHub Ativada!

## ✅ O que foi implementado

A aplicação agora **verifica automaticamente por atualizações no GitHub** quando aberta e a cada 5 minutos!

### Funcionalidades:

- ✅ Busca automática de releases do GitHub
- ✅ Notificação visual quando há atualização
- ✅ Download automático do novo .exe
- ✅ Fallback para URL customizada se GitHub falhar
- ✅ Comparação semântica de versões
- ✅ Integração com Electron (para desktop)

---

## 🔧 Próximos Passos

### 1️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_GITHUB_OWNER=seu-usuario-github
VITE_GITHUB_REPO=lucro-real-planner
```

**Exemplo:**
```env
VITE_GITHUB_OWNER=marketing01
VITE_GITHUB_REPO=lucro-real-planner
```

### 2️⃣ Testar Localmente

```bash
npm run dev
```

Clique em "Verificar Atualizações" no sidebar para testar.

### 3️⃣ Publicar Primeira Release no GitHub

**Option A: Linha de Comando**
```bash
# Criar tag
git tag -a v0.0.2 -m "Primeira release com GitHub integration"

# Push
git push origin v0.0.2
```

**Option B: GitHub Web Interface**
- Vá para: `https://github.com/SEU_USUARIO/lucro-real-planner/releases/new`
- Clique "Draft a new release"
- Preencha: Tag `v0.0.2`, Title e Description
- Publique!

### 4️⃣ Próxima Atualização

Quando quiser lançar uma nova versão:

```bash
# 1. Fazer mudanças no código
# ... edite os arquivos ...

# 2. Atualizar versão
node scripts/update-version.js 0.0.3 "Sua mudança aqui"

# 3. Build
npm run build

# 4. Commit e tag
git add .
git commit -m "v0.0.3: Sua mudança"
git tag -a v0.0.3 -m "Sua mudança"
git push origin main
git push origin v0.0.3
```

---

## 📚 Documentação Completa

Veja o arquivo **GITHUB_SETUP.md** para:
- ✅ Guia completo passo-a-passo
- ✅ Como criar releases no GitHub
- ✅ Formato de descrição de mudanças
- ✅ Troubleshooting
- ✅ Variáveis de ambiente

---

## 🎯 Fluxo Final para Usuários

### Com EXE Instalado:
1. Usuário abre o app
2. App verifica automaticamente por atualizações (GitHub API)
3. Se há versão mais recente:
   - Notificação aparece no sidebar
   - Usuário clica "Verificar Atualizações"
   - Modal mostra as mudanças
   - Clica "Atualizar Agora"
   - Download automático do novo .exe
   - Instalação automática

### Com App Web:
1. Mesmo fluxo
2. Ao clicar "Atualizar", faz refresh e carrega nova versão

---

## 🔄 Arquivos Modificados

- ✅ `services/githubService.ts` - Nova! Integração com GitHub
- ✅ `hooks/useUpdater.ts` - Atualizado com GitHub
- ✅ `components/UpdateModal.tsx` - Melhorado
- ✅ `components/Sidebar.tsx` - Integrado
- ✅ `.env.example` - Adicionado GitHub config
- ✅ `GITHUB_SETUP.md` - Nova! Guia completo

---

## 💡 Dicas

- **Sempre teste localmente** antes de publicar no GitHub
- **Use versionamento semântico**: v0.0.1, v0.1.0, v1.0.0
- **Descreva as mudanças** para que usuários entendam o que há de novo
- **Faça backup** antes de grandes atualizações

---

**Versão:** 0.0.2  
**Data:** 28/01/2026  
**Status:** ✅ Pronto para produção

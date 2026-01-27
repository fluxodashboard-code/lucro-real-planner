# 🔄 Sistema de Atualização - Guia Rápido

## ✨ O que foi implementado

Um **sistema completo de atualização de versão** para o seu app:

### 1️⃣ **Botão no Sidebar**
- Novo botão azul **"Verificar Atualizações"** no sidebar esquerdo
- Mostra a versão atual (v0.0.1)
- Indicador visual quando atualização está disponível

### 2️⃣ **Verificação Automática**
- A cada 5 minutos, o app verifica automaticamente se há nova versão
- Sem intervenção do usuário
- Discreto e eficiente

### 3️⃣ **Modal de Notificação**
- Quando atualização é disponível, aparece um modal elegante
- Mostra a nova versão
- Lista as mudanças/features
- Botões: "Depois" ou "Atualizar Agora"

---

## 🚀 Como Usar (Passo a Passo)

### **Quando você fizer mudanças no código:**

#### 1. Modifique o que precisar
```tsx
// Edite components, hooks, etc...
```

#### 2. Execute o script de versão
```bash
node scripts/update-version.js 0.0.2 "Novos componentes" "Fixes de bugs"
```

#### 3. Make build para produção
```bash
npm run build
```

#### 4. Deploy a nova versão

---

## 📋 Exemplos de Uso

### Exemplo 1: Atualização simples
```bash
node scripts/update-version.js 0.0.2 "Bugfix no dashboard"
```

### Exemplo 2: Múltiplas mudanças
```bash
node scripts/update-version.js 0.1.0 "Nova tela de relatórios" "Melhor performance" "Dashboard redesenhado"
```

### Exemplo 3: Incremento de patch
```bash
node scripts/update-version.js 1.0.0 "Release oficial"
```

---

## 📁 Arquivos Criados/Modificados

| Arquivo | Descrição |
|---------|-----------|
| `hooks/useUpdater.ts` | Hook para gerenciar atualização |
| `components/UpdateModal.tsx` | Modal de notificação |
| `components/Sidebar.tsx` | Atualizado com botões |
| `public/version.json` | Arquivo de versão (gerado automaticamente) |
| `scripts/update-version.js` | Script para atualizar versão |
| `UPDATE_SYSTEM.md` | Documentação técnica completa |

---

## 🧪 Testando o Sistema

### Teste Local:

1. **Modifique `public/version.json`** manualmente:
```json
{
  "version": "0.0.2",
  "releaseDate": "2026-01-27",
  "changes": [
    "Nova feature X",
    "Bugfix Y"
  ]
}
```

2. **Recarregue o navegador** (Ctrl+R)

3. **Clique em "Verificar Atualizações"** no sidebar

4. **Veja o modal aparecer!** ✨

---

## 💡 Como Funciona (Técnico)

```
┌─────────────────────┐
│   App aberto        │
└──────────┬──────────┘
           │
           v
┌─────────────────────────────────────┐
│  useUpdater Hook                    │
│  - Verificação automática (5min)   │
│  - Fetch /public/version.json      │
│  - Compara com versão atual        │
└──────────┬──────────────────────────┘
           │
           v
     ┌─────────────┐
     │ Atualização │
     │ disponível? │
     └┬────────┬───┘
      │        │
     SIM      NÃO
      │        │
      v        v
 UpdateModal  Silencioso
 (aparece)    (continua)
      │
      v
 Usuário clica
 "Atualizar"
      │
      v
 Hard refresh
 (limpa cache)
      │
      v
 Carrega versão nova
```

---

## 📦 Próximas Melhorias (Opcional)

- [ ] Integração com Electron auto-updater
- [ ] Check de atualizações via servidor backend
- [ ] Histórico de versões
- [ ] Rollback automático em caso de erro
- [ ] Notificações de browser push

---

## ❓ FAQ

**P: O usuário é obrigado a atualizar?**
R: Não, ele pode clicar "Depois" e continuar usando a versão anterior.

**P: E se ele recusar por muito tempo?**
R: A cada 5 minutos ele recebe a notificação novamente.

**P: Funciona com executável (.exe)?**
R: Sim! Basta compilar com Electron e as mesmas regras se aplicam.

**P: Como saber se o usuário atualizou?**
R: Verifique no browser: `localStorage.getItem('lr_planner_state_v1')` incluirá a versão.

---

## 🎉 Pronto!

Seu sistema de atualização está **100% funcional** e pronto para usar!

**Próxima vez que fizer mudanças:**
```bash
node scripts/update-version.js 0.0.2 "Suas mudanças aqui"
npm run build
# Deploy!
```

Enjoy! 🚀

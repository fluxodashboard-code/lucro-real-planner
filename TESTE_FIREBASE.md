# 🧪 Guia de Teste - Firebase + App

## ✅ Checklist Pré-Teste

- [ ] `.env.local` preenchido com credenciais
- [ ] App rodando em `http://localhost:3000/`
- [ ] DevTools abertos (F12)
- [ ] Sem erros no console

---

## 🚀 TESTE 1: Verificar Conexão com Firebase

### Passo 1: Abra DevTools
- Pressione **F12**
- Vá para **Console**

### Passo 2: Verificar Conexão
Cole no console:
```javascript
// Verificar se Firebase foi carregado
console.log('Firebase Config:', window.firebase ? 'Carregado' : 'Não carregado');

// Testar conexão
import { db } from './src/firebase.ts';
console.log('Firestore:', db);
```

**Resultado esperado:**
```
Firebase Config: Carregado
Firestore: Firestore {_key: FirestoreKey, ...}
```

✅ Se aparecer: **Conexão OK!**

---

## 🎯 TESTE 2: Adicionar Tarefa (Teste de Escrita)

### Passo 1: Abra a App
- Vá para **Checklist & Execução**

### Passo 2: Adicione Nova Tarefa
- Clique botão **"+ Nova Tarefa"** (ou similar)
- Preencha:
  - **ID:** `TEST-001`
  - **Atividade:** `Tarefa de Teste Firebase`
  - **Responsável:** `Fiscal`
  - **Fase:** `A`
  - **Prioridade:** `Normal`

### Passo 3: Salve
- Clique **"Salvar"**

**Resultado esperado:**
- [ ] Tarefa aparece na lista
- [ ] Sem erros no console
- [ ] Tarefa persiste (recarregue a página)

✅ Se funcionou: **Escrita no Firebase OK!**

---

## 📊 TESTE 3: Verificar no Firebase Console

### Passo 1: Abra Firebase Console
- Acesse: https://console.firebase.google.com/
- Projeto: `lucro-real-planner`

### Passo 2: Vá para Firestore Database
- Painel esquerdo > **Firestore Database**

### Passo 3: Procure Collection `tasks`
- Deve haver uma collection chamada **`tasks`**
- Dentro deve ter o documento com sua tarefa

**Resultado esperado:**
```
tasks (collection)
  └─ TEST-001 (documento)
      ├─ activity: "Tarefa de Teste Firebase"
      ├─ completed: false
      ├─ phase: "A"
      └─ userId: "..."
```

✅ Se viu: **Dados estão no Firestore!**

---

## ♻️ TESTE 4: Real-Time Sync (Sincronização)

### Passo 1: Abra App em 2 Abas
- Aba 1: App em `http://localhost:3000/`
- Aba 2: App em `http://localhost:3000/` (nova aba)

### Passo 2: Modifique Tarefa na Aba 1
- Na Aba 1, marque tarefa como "Concluída"
- Clique no checkbox

### Passo 3: Observe Aba 2
**Resultado esperado:**
- Tarefa é atualizada automaticamente na Aba 2
- Sem você recarregar página

✅ Se funcionou: **Real-time Sync OK!**

---

## 🔄 TESTE 5: Atualizar Tarefa

### Passo 1: Edite Tarefa
- Clique em **Editar** na tarefa de teste
- Altere algo (ex: descrição, responsável)

### Passo 2: Salve
- Clique **Salvar**

### Passo 3: Verifique
- Tarefa deve estar atualizada na lista
- Verifique no Firebase Console também

**Resultado esperado:**
```
Alteração visível imediatamente no app
Alteração aparece no Firebase Console
```

✅ Se funcionou: **Atualização OK!**

---

## 🗑️ TESTE 6: Deletar Tarefa

### Passo 1: Abra Tarefa de Teste
- Procure: `TEST-001`

### Passo 2: Clique Deletar
- Botão **Deletar** (ou ícone 🗑️)
- Confirme: "Sim, deletar"

### Passo 3: Verifique
**Resultado esperado:**
- Tarefa some da lista
- Nenhum erro no console
- Desaparece do Firebase Console também

✅ Se funcionou: **Deleção OK!**

---

## 📱 TESTE 7: LocalStorage vs Firebase

### Teste de Fallback

Se por algum motivo Firebase não funcionar:
1. App continua funcionando com localStorage ✅
2. Dados são salvos localmente
3. Ao reconectar com Firebase, sincroniza automaticamente

**Para testar:**
- DevTools > Network > **Offline**
- Adicione tarefa
- App deve funcionar normalmente
- Dados salvos localmente

✅ **Fallback funciona!**

---

## 🔍 TESTE 8: Console de Erros

### Passo 1: F12 > Console
- Procure por erros vermelhos
- Procure por warnings

**Erros Esperados = 0**

### Erros Comuns e Soluções:

**Erro:** `"Firebase not configured"`
- ✅ Solução: Verifique `.env.local`

**Erro:** `"Permission denied"`
- ✅ Solução: Verifique regras de segurança no Firebase

**Erro:** `"Quota exceeded"`
- ✅ Solução: Esperou 24h ou atualizou plano

---

## ✨ TESTE FINAL: Teste Completo

### Simulação Real:
1. ✅ Adicionar 5 tarefas diferentes
2. ✅ Marcar 2 como concluídas
3. ✅ Editar 1 tarefa
4. ✅ Deletar 1 tarefa
5. ✅ Recarregar página
6. ✅ Verificar se dados persistem

**Resultado esperado:**
- 4 tarefas na lista (5 - 1 deletada)
- 2 marcadas como concluídas
- 1 com alterações salvas
- Tudo sincronizado no Firebase

✅ **Se tudo passou: SUCESSO!** 🎉

---

## 📊 Checklist de Testes

| Teste | Status | Observações |
|-------|--------|------------|
| Conexão Firebase | ⬜ | DevTools console |
| Adicionar Tarefa | ⬜ | Apareça na lista |
| Verificar Firestore | ⬜ | Console Firebase |
| Real-time Sync | ⬜ | 2 abas abertas |
| Atualizar Tarefa | ⬜ | Editar e salvar |
| Deletar Tarefa | ⬜ | Remover da lista |
| LocalStorage Fallback | ⬜ | Offline mode |
| Console Limpo | ⬜ | Sem erros |

---

## 🐛 Se Algo Não Funcionar:

### Passo 1: Verificar Console (F12)
- Qual é o erro exato?
- Copie a mensagem

### Passo 2: Verificar .env.local
```bash
# Deve ter:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Passo 3: Reiniciar App
```bash
# Terminal:
npm run dev
```

### Passo 4: Limpar Cache
- DevTools > Application > Storage
- Limpar LocalStorage
- Recarregar página

---

## ✅ Parabéns!

Se todos os 8 testes passarem, seu **Firebase está 100% funcional!** 🔥

Agora você tem:
- ✅ Banco de dados em nuvem
- ✅ Sincronização em tempo real
- ✅ Multi-usuário pronto
- ✅ Backup automático
- ✅ App funcionando offline

**Próximos passos (opcional):**
1. Adicionar autenticação de usuários
2. Configurar regras de segurança mais rigorosas
3. Setup de múltiplos usuários com permissões

Sucesso! 🚀

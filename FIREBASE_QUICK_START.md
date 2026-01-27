# ⚡ Firebase Setup Rápido (5 minutos)

## O que foi feito automaticamente:

✅ Arquivo de config: `src/firebase.ts`
✅ Hook para tarefas: `hooks/useFirebaseTasks.ts`
✅ Env template: `.env.example`
✅ Documentação: `FIREBASE_SETUP.md`

---

## O que você precisa fazer:

### 1. Criar Projeto Firebase (2 min)
- Abra: https://console.firebase.google.com/
- **Nova Projeto** > Nome: `lucro-real-planner`
- Espere criar...

### 2. Ativar Firestore (1 min)
- Painel esquerdo > **Firestore Database**
- **Criar banco de dados**
- Modo: **Teste** (desenvolvimento)
- Local: **South America (São Paulo)**

### 3. Copiar Credenciais (1 min)
- Engrenagem ⚙️ > **Configurações**
- Role até **"Seus aplicativos"**
- Clique em ícone **Web** (</> )
- Copie a configuração do Firebase

### 4. Colar em .env.local (1 min)
```bash
# Copie .env.example para .env.local
copy .env.example .env.local

# Abra .env.local e preencha:
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 5. Pronto! ✅

---

## Checklist
- [ ] Criei projeto no Firebase
- [ ] Ativei Firestore Database
- [ ] Copiei credenciais
- [ ] Preenchi .env.local
- [ ] Reiniciei app (npm run dev)

---

## Próximo: Integração no App.tsx (você fará depois)

Para agora, o sistema **funciona com localStorage** como fallback.

Quando colocar as credenciais corretas, passará automaticamente a usar Firebase!

---

Consultedocumentação completa: `FIREBASE_SETUP.md`

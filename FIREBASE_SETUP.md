# 🔥 Guia de Configuração Firebase

## 1️⃣ Criar Projeto Firebase

### Passo 1: Acessar Firebase Console
- Abra https://console.firebase.google.com/
- Faça login com sua conta Google
- Clique em **"Criar Projeto"**

### Passo 2: Preencher Informações
```
Nome do Projeto: lucro-real-planner
Localização: Brazil (ou sua localização)
```

### Passo 3: Ativar Firestore
- No painel esquerdo, clique em **"Firestore Database"**
- Clique em **"Criar banco de dados"**
- Modo: **Iniciar no modo de teste** (para desenvolvimento)
- Local: **South America (São Paulo)** ou **us-central1**

---

## 2️⃣ Obter Credenciais

### Passo 1: Acessar Configurações
- Clique na engrenagem ⚙️ > **Configurações do Projeto**
- Abra a aba **"Geral"**

### Passo 2: Encontrar SDK Config
Role para baixo até **"Seus aplicativos"**
- Clique em **"Web" (</> ícone)**
- Copie a configuração do `firebaseConfig`

### Passo 3: Copiar Valores
Você verá algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

## 3️⃣ Configurar no App

### Passo 1: Copiar .env.example
```bash
copy .env.example .env.local
```

### Passo 2: Preencher .env.local
```
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

---

## 4️⃣ Criar Estrutura do Banco

### Collection: `tasks`
Cada documento tem:
```json
{
  "id": "auto-gerado",
  "activity": "Nome da atividade",
  "responsible": "Responsável",
  "phase": "A|B|C|D",
  "completed": false,
  "priority": "High|Normal",
  "dueDate": "2026-01-27",
  "userId": "user-id",
  "createdAt": "2026-01-27T...",
  "updatedAt": "2026-01-27T..."
}
```

### Collection: `settings`
Cada documento tem:
```json
{
  "userId": "user-id",
  "uf": "GO",
  "segmento": "Máquinas, Equipamentos e Peças",
  "empresaOperacional": {
    "nome": "",
    "cnpj": "",
    "municipio": ""
  },
  "empresaServices": {
    "nome": "",
    "cnpj": "",
    "municipio": ""
  },
  "updatedAt": "2026-01-27T..."
}
```

---

## 5️⃣ Regras de Segurança (Importante!)

### Para Desenvolvimento (teste):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Qualquer um pode ler e escrever (APENAS PARA TESTE!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Para Produção (seguro):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas o usuário pode acessar seus dados
    match /tasks/{taskId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    match /settings/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 6️⃣ Testar Conexão

### Reiniciar App
```bash
npm run dev
```

### Verificar Console
- Abra DevTools (F12)
- Vá para **Console**
- Procure por mensagens de erro
- Se não houver erro, Firebase está conectado! ✅

### Verificar no Firebase Console
- Vá para **Firestore Database**
- Você deve ver os dados em tempo real quando mudar algo no app

---

## 🚀 Próximos Passos

1. **Autenticação**: Adicionar login com Google/Email
2. **Multi-usuário**: Permitir múltiplos usuários acessarem
3. **Backup**: Configurar backups automáticos
4. **Segurança**: Implementar regras de segurança

---

## ❓ Troubleshooting

### "Firebase não definido"
- Verifique se `.env.local` está preenchido corretamente
- Reinicie o servidor: `npm run dev`

### "Permissão negada"
- Atualize as regras de segurança no Console Firebase
- Para teste, use a regra permissiva acima

### "Coleção vazia"
- As coleções são criadas automaticamente quando você adiciona dados
- Tente adicionar uma tarefa no app

### "Erro de CORS"
- Isso é normal - Firebase permite requisições de navegadores
- Não precisa fazer nada

---

## 📚 Documentação

- Firebase Docs: https://firebase.google.com/docs
- Firestore: https://firebase.google.com/docs/firestore
- Rules: https://firebase.google.com/docs/rules

Sucesso! 🎉

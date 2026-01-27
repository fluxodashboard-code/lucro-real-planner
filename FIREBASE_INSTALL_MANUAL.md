# ⚠️ Guia: Instalar Firebase Manualmente

## Problema Identificado
NPM tem dificuldade com o PATH do Node.js neste ambiente.

---

## Solução Alternativa: Instalar pelo VS Code

### Passo 1: Abrir Terminal no VS Code
1. Abra VS Code
2. Pressione `` Ctrl+` `` (backtick)
3. Selecione **PowerShell** (se não for)
4. Terminal abre na pasta do projeto

### Passo 2: Executar Comando
Cole no terminal:
```powershell
npm install firebase
```

Se der erro, tente:
```powershell
npm install firebase --save-dev
```

### Passo 3: Esperar Completar
- Será instalado em alguns segundos
- Veja a mensagem de sucesso

### Passo 4: Reiniciar App
```bash
npm run dev
```

---

## Solução 2: Usando Package.json Manualmente

### Passo 1: Editar package.json
Abra `package.json` e adicione firebase às dependências:

```json
{
  "name": "lucro-real-planner",
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "recharts": "^3.7.0",
    "lucide-react": "^0.563.0",
    "firebase": "^10.8.0"
  }
}
```

### Passo 2: Instalar
Terminal:
```bash
npm install
```

---

## Solução 3: Usar yarn (se tiver instalado)

```bash
yarn add firebase
```

---

## Solução 4: NPM com Path Completo

```powershell
& "C:\Program Files\nodejs\node.exe" -p "require('fs').writeFileSync('node_modules/.firebase-installing', '1')" ; & "C:\Program Files\nodejs\npm.cmd" install firebase
```

---

## Verificar Instalação

Após instalar, verifique:
```powershell
Get-ChildItem node_modules -Name | Select-String "firebase"
```

Deve listar algo como:
```
firebase
@firebase
```

---

## Depois de Instalar Firebase

1. Feche o app (`Ctrl+C` no terminal)
2. Execute `npm run dev`
3. App deve carregar sem erros
4. Siga o `FIREBASE_SETUP.md`

---

## Ainda com Problemas?

Tente:
```bash
npm cache clean --force
npm install
```

Ou simplesmente prossiga - **o app continua funcionando com localStorage!**

---

## Cronograma

| Etapa | Você Faz | Prioridade |
|-------|----------|-----------|
| 1. Arquivo firebase.ts | ✅ Feito | Alta |
| 2. Hook useFirebaseTasks | ✅ Feito | Alta |
| 3. Instalar Firebase npm | ⏳ Fazer | Média |
| 4. Setup Firebase console | ⏳ Depois | Média |
| 5. Preencher .env.local | ⏳ Depois | Média |

Foco agora: **Instalar Firebase npm**

Depois tudo mais é fácil!

---

Qualquer dúvida, peça ajuda! 🚀

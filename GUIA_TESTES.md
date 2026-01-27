# 🧪 Guia de Testes - Sistema de Atualização

## Teste Rápido (5 minutos)

### ✅ Teste 1: Verificar botão no UI

1. **Abra o app** em http://localhost:3000/
2. **Olhe para o sidebar esquerdo** (preto)
3. **Procure pelo botão azul** com ícone ↓ e texto "Verificar Atualizações"
4. **Resultado esperado:** Botão visível ✅

---

## ✅ Teste 2: Verificação Manual

### Passos:
1. Clique no botão **"Verificar Atualizações"** 
2. Espere 2-3 segundos (verificando versão...)
3. **Se versão é 0.0.2:** Modal aparecerá! 🎉
4. **Se versão é 0.0.1:** Alerta dirá "Você está na versão mais recente"

### O que você verá:
```
┌─────────────────────────────────┐
│ 🔔 Atualização Disponível       │ ← Modal grande e bonito
│ v0.0.2 está disponível!         │
│                                 │
│ Alterações:                     │
│ • Sistema de atualização        │
│ • Modal de notificação          │
│ • Sidebar melhorado             │
│                                 │
│ [ Depois ]  [ Atualizar Agora ] │ ← Dois botões
└─────────────────────────────────┘
```

---

## ✅ Teste 3: Botões do Modal

### 3a. Clique "Depois"
- Modal fecha
- App continua normal
- Próxima notificação em ~5 minutos

### 3b. Clique "Atualizar Agora"
- Botão fica desabilitado
- Texto muda para "Atualizando..."
- Page reload automático

---

## ✅ Teste 4: Versão Atual Visível

1. Abra o sidebar
2. Vá ao final (ao lado dos botões)
3. Veja a seção **"Versão & Status"**
4. Deve mostrar:
   - `v0.0.2` (versão atual)
   - `● Online` (status)
   - `🔔 Atualização disponível` (se houver)

---

## ✅ Teste 5: Verificação Automática

### Setup:
1. Abra duas abas do app (tabs)
2. Em um terminal, execute:
   ```bash
   node scripts/update-version.js 0.0.3 "Nova feature"
   ```
3. **Não recarregue a página ainda**
4. **Espere 5 minutos** ou clique "Verificar Atualizações"

### Resultado:
- Modal aparecerá com v0.0.3
- Mudanças listadas: "Nova feature"

---

## ✅ Teste 6: Teste Manual de Versão

### Simule uma atualização maior:

1. **Terminal:**
   ```bash
   node scripts/update-version.js 0.1.0 "Dashboard redesenhado" "Nova tela de relatórios" "Performance melhorada"
   ```

2. **Resultado esperado:**
   ```
   ✅ package.json atualizado para v0.1.0
   ✅ version.json atualizado para v0.1.0
   
   📦 Alterações registradas:
     • Dashboard redesenhado
     • Nova tela de relatórios
     • Performance melhorada
   ```

3. **No app:**
   - Clique "Verificar Atualizações"
   - Modal mostrará v0.1.0 com 3 mudanças

---

## 🔍 Checklist de Validação

| Teste | Status | Observações |
|-------|--------|-------------|
| Botão visível no sidebar | ⬜ | Azul com ícone de download |
| Clique funciona | ⬜ | Sem erros no console |
| Modal aparece | ⬜ | Quando há versão nova |
| Mudanças listadas | ⬜ | De acordo com version.json |
| Botão "Atualizar" funciona | ⬜ | Recarrega a página |
| Botão "Depois" funciona | ⬜ | Fecha o modal |
| Versão exibida corretamente | ⬜ | v0.0.2 atual |
| Check automático a cada 5min | ⬜ | (esperar ou força check) |
| Script update-version funciona | ⬜ | Atualiza package.json |
| version.json criado | ⬜ | Na pasta public/ |

---

## 🐛 Solução de Problemas

### Problema: "Módulo não encontrado"
**Solução:** Certifique-se de que rode `npm install` antes

### Problema: Modal não aparece
**Solução:** Verifique se `public/version.json` existe e tem versão > 0.0.1

### Problema: Botão não aparece
**Solução:** Recarregue a página (Ctrl+R) ou limpe cache (Ctrl+Shift+Del)

### Problema: Script falha
**Solução:** Verifique o formato: `node scripts/update-version.js 0.0.X "mudança"`

---

## 📝 Exemplo Completo de Fluxo

### Cenário: Você quer atualizar de 0.0.2 para 0.0.3

#### Passo 1: Modifique seu código
```tsx
// Edite components, hooks, etc...
// Exemplo: adicione um novo botão, conserte um bug, etc
```

#### Passo 2: Atualize a versão
```bash
node scripts/update-version.js 0.0.3 "Novo botão" "Bugfix no dashboard"
```

**Output esperado:**
```
✅ package.json atualizado para v0.0.3
✅ version.json atualizado para v0.0.3

📦 Alterações registradas:
  • Novo botão
  • Bugfix no dashboard

✨ Versão atualizada com sucesso!
```

#### Passo 3: Build
```bash
npm run build
```

#### Passo 4: Deploy
- Faça upload do arquivo gerado em `dist/`
- Ou distribua o executável (se usando Electron)

#### Passo 5: Usuários veem:
1. Notificação automática em até 5 minutos
2. Modal mostrando v0.0.3
3. Listando: "Novo botão" e "Bugfix no dashboard"
4. Opção de atualizar ou esperar

---

## 🎯 Testes de Estresse (Opcional)

### Teste: Múltiplas atualizações
```bash
node scripts/update-version.js 0.0.3 "v1"
node scripts/update-version.js 0.0.4 "v2"
node scripts/update-version.js 0.0.5 "v3"
```

### Teste: Versão com muitas mudanças
```bash
node scripts/update-version.js 0.2.0 \
  "Feature A" \
  "Feature B" \
  "Feature C" \
  "Bugfix 1" \
  "Bugfix 2" \
  "Performance"
```

---

## ✨ Dicas Profissionais

1. **Use versionamento semântico:**
   - `0.0.X` = bug fixes
   - `0.X.0` = novas features
   - `X.0.0` = mudanças maiores

2. **Descrições claras:**
   - ✅ "Dashboard redesenhado"
   - ❌ "Coisas"
   - ✅ "Botão de export em PDF"
   - ❌ "Novo botão"

3. **Teste antes de fazer deploy:**
   - Sempre rode `npm run build`
   - Verifique errors no terminal
   - Teste a versão localmente

---

## 🎉 Tudo Funcionando?

Se todos os testes passarem, você está 100% pronto para:
- ✅ Desenvolver novos features
- ✅ Corrigir bugs
- ✅ Atualizar automaticamente seus usuários
- ✅ Compilar como executável

Parabéns! 🚀

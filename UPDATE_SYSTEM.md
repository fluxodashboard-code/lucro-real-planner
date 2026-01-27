# Sistema de Atualização - Lucro Real Planner

## Como Funciona

O aplicativo possui um sistema automático de verificação de atualizações que:

1. **Verifica automaticamente a cada 5 minutos** se há nova versão disponível
2. **Notifica o usuário** quando uma atualização está disponível
3. **Permite atualizar** com um clique no botão "Verificar Atualizações"

## Para Desenvolvedores

### Atualizar Versão do App

Quando você fizer mudanças no código e quiser criar uma nova versão:

```bash
node scripts/update-version.js 0.0.2 "Bugfix de login" "Melhor performance"
```

**Formato:**
```bash
node scripts/update-version.js <VERSÃO> <MUDANÇA1> <MUDANÇA2> ...
```

**Exemplos:**

```bash
# Versão com uma mudança
node scripts/update-version.js 0.0.2 "Novos recursos"

# Versão com múltiplas mudanças
node scripts/update-version.js 0.1.0 "Dashboard redesenhado" "Novo sistema de relatórios" "Fixes de bugs"
```

Este comando irá:
- ✅ Atualizar `package.json` com a nova versão
- ✅ Atualizar `public/version.json` com nova versão, data e mudanças
- ✅ Exibir as mudanças registradas

### Workflow Recomendado

1. **Desenvolva e teste suas mudanças** localmente
2. **Execute o script de atualização** com a nova versão:
   ```bash
   node scripts/update-version.js 0.0.2 "Suas mudanças aqui"
   ```
3. **Faça build para produção**:
   ```bash
   npm run build
   ```
4. **Deploy a nova versão** (salve em servidor ou na pasta do executável)

Quando os usuários abrirem o app, eles verão a notificação de atualização!

## Arquivos Importantes

- `hooks/useUpdater.ts` - Hook que gerencia as atualizações
- `components/UpdateModal.tsx` - Modal de notificação
- `public/version.json` - Arquivo de versão (atualizado automaticamente)
- `package.json` - Versão principal do app
- `scripts/update-version.js` - Script para atualizar versão

## Integração com Executável (Electron)

Se você compilar como executável com Electron, a atualização pode ser feita via:

1. **Auto-updater do Electron** (recomendado para apps de desktop)
2. **Verificação manual** com novo download (versão web atual)

Para Electron, edite `hooks/useUpdater.ts` e implemente a integração com `electron-updater`.

## Testando Localmente

1. Modifique seu código
2. Execute: `node scripts/update-version.js 0.0.2 "Teste de atualização"`
3. Recarregue o navegador
4. Clique em "Verificar Atualizações" no sidebar
5. Veja o modal aparecer com a nova versão!

## Arquitetura

```
Sidebar
  ↓
[Botão "Verificar Atualizações"]
  ↓
useUpdater Hook
  ├─ Fetch de public/version.json
  ├─ Comparação de versões (semântica)
  └─ Notifica UpdateModal
      └─ Usuário clica "Atualizar Agora"
          └─ Hard refresh do navegador
```

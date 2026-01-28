# Guia de Integração com GitHub - Lucro Real Planner

## 🚀 Visão Geral

O Lucro Real Planner agora verifica automaticamente por atualizações direto do seu repositório GitHub. Quando você publicar uma nova versão, todos os usuários com o app instalado receberão uma notificação de atualização.

## 📋 Pré-requisitos

1. Repositório no GitHub (público ou privado)
2. Node.js instalado
3. Git configurado

## 🔧 Configuração Inicial

### Passo 1: Configurar Variáveis de Ambiente

Crie um arquivo `.env` (ou `.env.local` se estiver com Vite) na raiz do projeto:

```env
VITE_GITHUB_OWNER=seu-usuario
VITE_GITHUB_REPO=lucro-real-planner
VITE_UPDATE_URL=https://seu-dominio.com/updates
```

**Explicação:**
- `VITE_GITHUB_OWNER`: Seu usuário do GitHub
- `VITE_GITHUB_REPO`: Nome do repositório
- `VITE_UPDATE_URL`: (Opcional) URL alternativa para fallback

### Passo 2: Atualizar package.json

O arquivo `package.json` já contém a versão `0.0.2`. Você pode manter ou atualizar conforme necessário.

## 📦 Publicando Uma Nova Versão

### Workflow Recomendado

#### 1. Desenvolver e Testar Localmente

```bash
npm run dev
```

#### 2. Atualizar Versão e Registrar Mudanças

```bash
node scripts/update-version.js 0.0.3 "Novo recurso X" "Correção de bug Y"
```

**Formato:**
```bash
node scripts/update-version.js <VERSÃO> <MUDANÇA1> <MUDANÇA2> ...
```

**Exemplos:**

```bash
# Versão com uma mudança
node scripts/update-version.js 0.0.3 "Dashboard melhorado"

# Versão com múltiplas mudanças
node scripts/update-version.js 0.1.0 "Novo sistema de relatórios" "Melhor performance" "Correção de bugs"
```

Este script atualiza:
- ✅ `package.json` com a nova versão
- ✅ `public/version.json` com versão, data e mudanças

#### 3. Fazer Build para Produção

```bash
npm run build
```

#### 4. Criar Release no GitHub

**Opção A: Usar Git Commands**

```bash
# Fazer commit das mudanças
git add .
git commit -m "v0.0.3: Dashboard melhorado"

# Criar tag
git tag -a v0.0.3 -m "Dashboard melhorado"

# Push para GitHub
git push origin main
git push origin v0.0.3
```

**Opção B: Criar Release via GitHub Web**

1. Vá para: `https://github.com/seu-usuario/lucro-real-planner/releases/new`
2. Clique em "Draft a new release"
3. Preencha os dados:
   - **Tag**: `v0.0.3`
   - **Title**: `Dashboard Melhorado`
   - **Description**: Descreva as mudanças (pode usar o formato Markdown)

```markdown
## 🎉 Novidades

### Novas Funcionalidades
- Nova dashboard com gráficos interativos
- Sistema de exportação melhorado

### Correções
- Corrigido bug de login
- Melhorada performance

### Alterações Técnicas
- Atualizado React para v19
- Melhorado sistema de cache
```

4. Se quiser distribuir o executável, faça upload do `.exe` (opcional)
5. Clique em "Publish release"

## 📥 Como Funciona Para Usuários

### Com App Instalado (EXE)

1. **Verificação Automática**: O app verifica por atualizações:
   - Ao abrir o aplicativo (imediatamente)
   - A cada 5 minutos em background

2. **Notificação**: Quando há nova versão, o usuário vê:
   - Badge no sidebar indicando atualização disponível
   - Botão "Verificar Atualizações"

3. **Atualizar**: Usuário clica "Atualizar Agora" e:
   - Modal mostra as mudanças
   - App faz download automático (abre link no GitHub)
   - Usuário instala a nova versão

### Com App Web (Browser)

1. Mesma verificação automática
2. Ao clicar "Atualizar", faz hard refresh do navegador
3. Usuário obtém a nova versão

## 🏗️ Estrutura de Versões

Usamos **Semantic Versioning**: `MAJOR.MINOR.PATCH`

Exemplos:
- `0.0.1` → `0.0.2` (patch: bugfixes)
- `0.1.0` → `0.2.0` (minor: novas funcionalidades)
- `0.x.x` → `1.0.0` (major: mudanças importantes)

## 📝 Descrição de Mudanças

Use o script para descrever as mudanças:

```bash
node scripts/update-version.js 0.1.0 \
  "Dashboard com gráficos interativos" \
  "Exportação de relatórios em PDF" \
  "Melhorada performance de carga"
```

As mudanças aparecem:
1. Em `public/version.json`
2. No modal de atualização do usuário
3. Podem ser refletidas na release do GitHub

## 🔍 Testando Localmente

### Simular Atualização Disponível

1. **Versão Atual**: `0.0.2`
2. **Execute**:
   ```bash
   node scripts/update-version.js 0.0.3 "Teste de atualização"
   npm run build
   ```
3. **Abra o app** e clique em "Verificar Atualizações"
4. **Veja o modal** com a nova versão

### Verificar arquivo version.json

```bash
cat public/version.json
```

Deve mostrar:
```json
{
  "version": "0.0.3",
  "releaseDate": "2026-01-28",
  "changes": [
    "Teste de atualização"
  ]
}
```

## 🐛 Troubleshooting

### "Erro ao verificar atualizações"

**Verificar:**
1. ✅ Variáveis de ambiente estão corretas
2. ✅ Repositório existe no GitHub
3. ✅ GitHub API está acessível
4. ✅ Sem rate limiting do GitHub (60 requisições/hora para anônimo)

**Solução:**
- Usar GitHub Token para mais requisições:
  ```env
  VITE_GITHUB_TOKEN=seu_token_github
  ```

### Atualização não aparece

**Verificar:**
1. ✅ `public/version.json` foi atualizado
2. ✅ Build foi feito (`npm run build`)
3. ✅ Versão no JSON é maior que a atual
4. ✅ Cache do app foi limpo

**Limpar Cache:**
```bash
# No Dev Tools (F12)
Application → Clear Storage → Clear All
```

### "Release não aparece no GitHub"

**Verificar:**
1. ✅ Tag foi criada: `git tag -a v0.0.3 -m "mensagem"`
2. ✅ Tag foi pushada: `git push origin v0.0.3`
3. ✅ Release foi publicada (não é draft)

## 🎯 Próximas Etapas

### 1. Auto-update com Electron (Opcional)

Para distribuir atualizações automáticas sem reabrir o app:

```bash
npm install electron-updater
```

Depois edite `hooks/useUpdater.ts` para usar `electron-updater`.

### 2. Publicar Executável no Release

```bash
npm run build:exe
```

Upload o `.exe` gerado para a release no GitHub.

### 3. Usar GitHub Pages para Documentação

Crie um site com as instruções de instalação e changelog.

## 📚 Referências

- [GitHub Releases API](https://docs.github.com/pt/rest/releases/releases)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Electron Updater](https://github.com/electron-userland/electron-builder/wiki/Auto-Update)

## ❓ Dúvidas Frequentes

**P: Posso usar um repositório privado?**
A: Sim, mas precisa de token. Configure: `VITE_GITHUB_TOKEN`

**P: Com que frequência verifica atualizações?**
A: A cada 5 minutos + ao abrir o app

**P: Usuários são obrigados a atualizar?**
A: Não, podem clicar "Depois". Mas a notificação aparece sempre até atualizar.

**P: Funciona offline?**
A: Não. O app precisa de conexão para verificar atualizações.

---

**Últimas atualizações:** 28/01/2026
**Versão do app:** 0.0.2

# Git — Ajuda e Comandos Úteis

## Remover arquivos deletados do repositório

Se você deletou arquivos do projeto, mas eles ainda existem no repositório Git remoto, use:

### Opção 1: Remover todos os arquivos deletados (recomendado)

```bash
# identifica e remove todos os arquivos deletados
git add -A
git commit -m "Remove arquivos deletados"
git push origin main
```

### Opção 2: Remover um arquivo específico

```bash
# remover um arquivo específico do repositório
git rm nome-do-arquivo.txt
git commit -m "Remove nome-do-arquivo.txt"
git push origin main
```

### Opção 3: Remover do repo mas manter o arquivo localmente

Se você quer que o arquivo local seja ignorado daqui pra frente (apenas para de rastrear):

```bash
# para de rastrear o arquivo, mas mantém localmente
git rm --cached nome-do-arquivo.txt
git commit -m "Para de rastrear nome-do-arquivo.txt"
git push origin main
```

Depois, adicione o arquivo ao `.gitignore` para evitar que ele seja commitado novamente:

```bash
echo "nome-do-arquivo.txt" >> .gitignore
git add .gitignore
git commit -m "Adiciona nome-do-arquivo.txt ao .gitignore"
git push origin main
```

## Verificar status antes de enviar

Sempre verifique o que vai ser commitado:

```bash
# ver arquivos modificados e deletados
git status

# ver diferenças antes de adicionar
git diff
```

## Desfazer último commit (se necessário)

```bash
# desfaz o último commit, mas mantém as mudanças locais
git reset --soft HEAD~1

# desfaz o último commit e descarta as mudanças
git reset --hard HEAD~1
```

# 1. Atualizar versão
node scripts/update-version.js 0.0.3 "Dashboard novo"

# 2. Compilar como EXE
npm run build:exe

# 3. Marcar no Git
git tag -a v0.0.3 -m "Dashboard novo"

# 4. Enviar para GitHub
git push origin v0.0.3
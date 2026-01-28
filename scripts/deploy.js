#!/usr/bin/env node

/**
 * Script de Deploy Automático
 * Automatiza todo o processo: versão → build → git → push → GitHub
 * 
 * Uso: node scripts/deploy.js 0.0.3 "Dashboard melhorado"
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Erro: Especifique versão e descrição');
  console.error('Uso: node scripts/deploy.js <versão> <descrição>');
  console.error('');
  console.error('Exemplo: node scripts/deploy.js 0.0.3 "Dashboard melhorado"');
  process.exit(1);
}

const version = args[0];
const description = args[1];

console.log('');
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║        🚀 DEPLOY AUTOMÁTICO - Lucro Real Planner      ║');
console.log('╚════════════════════════════════════════════════════════╝');
console.log('');

// Validar versão
if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error('❌ Formato de versão inválido. Use: X.X.X');
  process.exit(1);
}

const steps = [
  {
    name: '📝 Atualizando versão',
    command: `node scripts/update-version.js ${version} "${description}"`,
  },
  {
    name: '🏗️  Compilando React/TypeScript',
    command: 'npm run build',
  },
  {
    name: '📦 Gerando EXE com Electron',
    command: 'npm run build:exe',
  },
  {
    name: '📦 Adicionando arquivos ao Git',
    command: 'git add .',
  },
  {
    name: '💾 Fazendo commit',
    command: `git commit -m "v${version}: ${description}"`,
  },
  {
    name: '🏷️  Criando tag',
    command: `git tag -a v${version} -m "${description}"`,
  },
  {
    name: '📤 Fazendo push para GitHub',
    command: 'git push origin main',
  },
  {
    name: '🔖 Enviando tag para GitHub',
    command: `git push origin v${version}`,
  },
];

let currentStep = 0;

try {
  for (const step of steps) {
    currentStep++;
    console.log(`[${currentStep}/${steps.length}] ${step.name}`);
    console.log(`   $ ${step.command}`);
    
    try {
      execSync(step.command, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('   ✅ Sucesso!\n');
    } catch (error) {
      console.error(`   ❌ Erro ao executar: ${step.command}\n`);
      throw error;
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                  ✨ DEPLOY COMPLETO!                   ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Versão v${version} publicada com sucesso!`);
  console.log('');
  console.log('📚 Próximos passos:');
  console.log(`   1. Vá para: https://github.com/fluxodashboard-code/lucro-real-planner/releases`);
  console.log(`   2. Clique na release v${version}`);
  console.log(`   3. Clique "Edit"`);
  console.log(`   4. Upload do arquivo: dist/Lucro Real Planner.exe`);
  console.log('');
  console.log('🎉 Usuários receberão notificação de atualização automaticamente!');
  console.log('');

} catch (error) {
  console.error('');
  console.error('╔════════════════════════════════════════════════════════╗');
  console.error('║                    ❌ DEPLOY FALHOU                    ║');
  console.error('╚════════════════════════════════════════════════════════╝');
  console.error('');
  console.error(`Erro na etapa ${currentStep}`);
  console.error(error.message);
  process.exit(1);
}

#!/usr/bin/env node

/**
 * Script para atualizar versão da aplicação
 * Uso: node scripts/update-version.js <version> <change1> <change2> ...
 * 
 * Exemplo:
 * node scripts/update-version.js 0.0.2 "Bugfix de login" "Melhor performance"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('❌ Erro: Especifique uma versão');
  console.error('Uso: node scripts/update-version.js <version> [change1] [change2] ...');
  process.exit(1);
}

const newVersion = args[0];
const changes = args.slice(1);

// Validar formato de versão
if (!/^\d+\.\d+\.\d+/.test(newVersion)) {
  console.error('❌ Erro: Formato de versão inválido. Use: X.X.X');
  process.exit(1);
}

try {
  // Atualizar package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ package.json atualizado para v${newVersion}`);

  // Atualizar version.json (public)
  const versionPath = path.join(__dirname, '../public/version.json');
  const versionJson = {
    version: newVersion,
    releaseDate: new Date().toISOString().split('T')[0],
    changes: changes.length > 0 ? changes : ['Atualização de versão']
  };
  fs.writeFileSync(versionPath, JSON.stringify(versionJson, null, 2) + '\n');
  console.log(`✅ version.json atualizado para v${newVersion}`);

  console.log('\n📦 Alterações registradas:');
  versionJson.changes.forEach(change => {
    console.log(`  • ${change}`);
  });

  console.log('\n✨ Versão atualizada com sucesso!');
  console.log('Execute "npm run build" para gerar a build de produção.');

} catch (error) {
  console.error('❌ Erro ao atualizar versão:', error.message);
  process.exit(1);
}

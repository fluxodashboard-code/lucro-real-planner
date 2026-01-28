#!/usr/bin/env node

/**
 * Script para atualizar versão da aplicação
 * Sincroniza automaticamente: package.json → version.json → HTML (via vite)
 * 
 * Uso: node scripts/update-version.js <version> <change1> <change2> ...
 * 
 * Exemplo:
 * node scripts/update-version.js 0.0.3 "Nova dashboard" "Performance melhorada"
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
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║          🔄 SINCRONIZANDO VERSÃO - Todas as files     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');

  // 1. Atualizar package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ package.json atualizado para v${newVersion}`);

  // 2. Atualizar version.json (public) - para fallback em runtime
  const versionPath = path.join(__dirname, '../public/version.json');
  const versionJson = {
    version: newVersion,
    releaseDate: new Date().toISOString().split('T')[0],
    changes: changes.length > 0 ? changes : ['Atualização de versão']
  };
  fs.writeFileSync(versionPath, JSON.stringify(versionJson, null, 2) + '\n');
  console.log(`✅ public/version.json atualizado para v${newVersion}`);

  // 3. Verificar se metadata.json existe e atualizar também (para compatibilidade)
  const metadataPath = path.join(__dirname, '../metadata.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    metadata.version = newVersion;
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
    console.log(`✅ metadata.json atualizado para v${newVersion}`);
  }

  console.log('');
  console.log('📦 Alterações registradas:');
  versionJson.changes.forEach(change => {
    console.log(`  • ${change}`);
  });

  console.log('');
  console.log('✨ Versão sincronizada com sucesso!');
  console.log('');
  console.log('📌 Próximas etapas:');
  console.log(`   1. npm run build     (Vite injetará v${newVersion} automaticamente no HTML)`);
  console.log(`   2. npm run build:exe (Electron-builder usará v${newVersion})`);
  console.log('');
  console.log('🎯 A versão agora é lida dinamicamente do package.json em runtime!');
  console.log('');

} catch (error) {
  console.error('❌ Erro ao atualizar versão:', error.message);
  process.exit(1);
}


import * as builder from 'electron-builder';

// Desabilitar completamente o signing
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
process.env.WIN_CSC_LINK = '';
process.env.CSC_LINK = '';

const config = {
  "appId": "com.lucroreal.planner",
  "productName": "Lucro Real Planner",
  "copyright": "Copyright © 2026 Lucro Real",
  "asar": true,
  "asarUnpack": ["**/*.node"],
  "files": [
    "dist/**/*",
    "electron/**/*",
    "node_modules/**/*",
    "!node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,test,tests,testing,*.d.ts,docs,examples,*.md,*.tgz,*.tar.gz,.git,script}",
    "!node_modules/**/*.{md,map,ts,tsx}",
    "!**/node_modules/**/test/**",
    "!**/node_modules/**/tests/**",
    "!**/node_modules/**/.bin/**",
    "!**/node_modules/**/.github/**",
    "!**/node_modules/**/examples/**",
    "!**/node_modules/**/docs/**"
  ],
  "directories": {
    "buildResources": "assets"
  },
  "win": {
    "target": [{
      "target": "nsis",
      "arch": ["x64"]
    }],
    "artifactName": "${productName} Setup ${version}.exe",
    "verifyUpdateCodeSignature": false,
    "requestedExecutionLevel": "asInvoker",
    "sign": null,
    "signingHashAlgorithms": []
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Lucro Real Planner",
    "displayLanguageSelector": false,
    "installerLanguages": ["pt_BR"],
    "language": "1046",
    "deleteAppDataOnUninstall": false,
    "runAfterFinish": true,
    "menuCategory": true,
    "allowElevation": true,
    "warningsAsErrors": false,
    "artifactName": "${productName} Setup ${version}.exe"
  },
  "publish": {
    "provider": "github",
    "owner": "fluxodashboard-code",
    "repo": "lucro-real-planner"
  }
};

builder.build({
  config: config,
  targets: builder.Platform.windows.createTarget(['nsis'], builder.Arch.x64),
  publish: 'never'
}).then(() => {
  console.log('✓ Build completed successfully');
  process.exit(0);
}).catch(err => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { config } from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Firebase config (usar as mesmas variáveis do .env.local)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const INITIAL_RESPONSIBLES = [
  'Fiscal',
  'Contábil',
  'Financeiro',
  'DP',
  'TI',
  'Jurídico',
  'Societário',
  'Gestão',
  'Compras',
  'Estoque',
  'Fiscal/TI',
  'Fiscal/Contábil',
  'Societário/DP',
  'Fiscal/Societário',
  'Jurídico/Contábil',
  'Financeiro/Contábil',
  'Fiscal/Estoque'
];

async function seedResponsibles() {
  try {
    console.log('🔥 Salvando responsáveis no Firebase...');
    
    const responsiblesRef = doc(db, 'users', 'default_user', 'settings', 'responsibles');
    await setDoc(responsiblesRef, { list: INITIAL_RESPONSIBLES }, { merge: true });
    
    console.log('✅ Responsáveis salvos com sucesso!');
    console.log('📋 Total:', INITIAL_RESPONSIBLES.length, 'responsáveis');
    console.log('📍 Caminho:', 'users/default_user/settings/responsibles');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao salvar responsáveis:', error);
    process.exit(1);
  }
}

seedResponsibles();

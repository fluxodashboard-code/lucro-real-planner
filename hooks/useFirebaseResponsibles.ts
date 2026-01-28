import { useState, useEffect } from 'react';
import { db } from '../src/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const useFirebaseResponsibles = (userId: string) => {
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to responsibles from Firebase
  useEffect(() => {
    if (!userId) return;

    try {
      const responsiblesRef = doc(db, 'users', userId, 'settings', 'responsibles');
      
      const unsubscribe = onSnapshot(responsiblesRef, (docSnap) => {
        if (docSnap.exists()) {
          setResponsibles(docSnap.data().list || []);
        }
        setLoading(false);
      }, (err) => {
        console.error('Erro ao carregar responsáveis:', err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Erro ao setup responsibles listener:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading(false);
    }
  }, [userId]);

  // Save responsibles to Firebase
  const saveResponsibles = async (newResponsibles: string[]) => {
    if (!userId) return;

    try {
      const responsiblesRef = doc(db, 'users', userId, 'settings', 'responsibles');
      await setDoc(responsiblesRef, { list: newResponsibles }, { merge: true });
      setResponsibles(newResponsibles);
      return true;
    } catch (err) {
      console.error('Erro ao salvar responsáveis:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  };

  return { responsibles, saveResponsibles, loading, error };
};

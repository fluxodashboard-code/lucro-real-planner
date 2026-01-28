import { useState, useEffect } from 'react';
import { db } from '../src/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ProjectSettings } from '../types';

export interface SavedProject {
  id: string;
  name: string;
  settings: ProjectSettings;
  createdAt: string;
  updatedAt: string;
}

export const useFirebaseProjects = (userId: string) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsCollection = collection(db, `users/${userId}/projects`);
    const q = query(projectsCollection, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProjects: SavedProject[] = [];
      snapshot.forEach((doc) => {
        fetchedProjects.push({
          id: doc.id,
          ...doc.data(),
        } as SavedProject);
      });
      setProjects(fetchedProjects);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar projetos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const saveProject = async (name: string, settings: ProjectSettings) => {
    try {
      const projectsCollection = collection(db, `users/${userId}/projects`);
      const now = new Date().toISOString();
      
      await addDoc(projectsCollection, {
        name,
        settings,
        createdAt: now,
        updatedAt: now,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      return { success: false, error };
    }
  };

  const updateProject = async (projectId: string, name: string, settings: ProjectSettings) => {
    try {
      const projectDoc = doc(db, `users/${userId}/projects`, projectId);
      await updateDoc(projectDoc, {
        name,
        settings,
        updatedAt: new Date().toISOString(),
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return { success: false, error };
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const projectDoc = doc(db, `users/${userId}/projects`, projectId);
      await deleteDoc(projectDoc);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      return { success: false, error };
    }
  };

  return {
    projects,
    loading,
    saveProject,
    updateProject,
    deleteProject,
  };
};

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db } from '../src/firebase';
import { Task } from '../types';

export const useFirebaseTasks = (userId: string = 'default_user') => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar tarefas do Firebase em tempo real
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Query para tarefas do usuário atual
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      );

      // Listener em tempo real
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData: Task[] = [];
        snapshot.forEach((doc) => {
          tasksData.push({
            id: doc.id,
            ...doc.data()
          } as Task);
        });
        setTasks(tasksData);
        setLoading(false);
      }, (err) => {
        console.error('Erro no listener:', err);
        setError('Erro de conexão com o banco de dados');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      setError('Erro ao carregar tarefas');
      setLoading(false);
    }
  }, [userId]);

  // Adicionar tarefa
  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Tarefa adicionada com ID:', docRef.id);
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      setError('Erro ao salvar tarefa');
      throw err;
    }
  }, [userId]);

  // Atualizar tarefa
  const updateTask = useCallback(async (task: Task) => {
    try {
      // Separa o ID dos dados
      const { id, ...data } = task;

      if (!id) throw new Error("ID da tarefa inválido");

      await updateDoc(doc(db, 'tasks', id), {
        ...data,
        updatedAt: new Date()
      });

      console.log('Tarefa atualizada:', id);
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      setError('Erro ao atualizar tarefa');
      throw err;
    }
  }, []);

  // Deletar tarefa
  const deleteTask = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      console.log('Tarefa deletada:', id);
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      setError('Erro ao deletar tarefa');
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    isUsingFirebase: true
  };
};

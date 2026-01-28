import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  getDoc
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
          const data = doc.data();
          // Agora o doc.id é o mesmo que task.id (A-01, B-02, etc)
          tasksData.push(data as Task);
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
  const addTask = useCallback(async (task: Task) => {
    try {
      // Verifica se já existe uma tarefa com este ID
      const taskRef = doc(db, 'tasks', task.id);
      const taskDoc = await getDoc(taskRef);
      
      if (taskDoc.exists()) {
        throw new Error('Já existe uma tarefa com este ID. Por favor, escolha outro.');
      }

      // Usa setDoc com o ID customizado (A-01, B-02, etc)
      await setDoc(taskRef, {
        ...task,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Tarefa adicionada com ID:', task.id);
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar tarefa');
      throw err;
    }
  }, [userId]);

  // Atualizar tarefa
  const updateTask = useCallback(async (task: Task) => {
    try {
      // Usa o ID customizado (A-01, B-02, etc)
      const docId = task.id;

      if (!docId) throw new Error("ID da tarefa inválido");

      await updateDoc(doc(db, 'tasks', docId), {
        ...task,
        updatedAt: new Date()
      });

      console.log('Tarefa atualizada:', docId);
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      setError('Erro ao atualizar tarefa');
      throw err;
    }
  }, []);

  // Deletar tarefa
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      // Usa o ID customizado diretamente (A-01, B-02, etc)
      await deleteDoc(doc(db, 'tasks', taskId));
      console.log('Tarefa deletada:', taskId);
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

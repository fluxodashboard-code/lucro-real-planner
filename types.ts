export interface Task {
  id: string; // ID da tarefa (A-01, B-02, etc) - usado também como ID do documento no Firebase
  activity: string;
  responsible: string;
  phase: 'A' | 'B' | 'C' | 'D';
  completed: boolean;
  priority?: 'High' | 'Normal';
  dueDate?: string; // ISO yyyy-mm-dd
  evidenceUrl?: string;
  notes?: string;
}

export interface PhaseInfo {
  id: 'A' | 'B' | 'C' | 'D';
  title: string;
  description: string;
  steps: string[];
}

export interface ModelDoc {
  id: string;
  title: string;
  content: string;
}

export interface ProjectSettings {
  uf: string;
  segmento: string;
  empresaOperacional: {
    nome: string;
    cnpj: string;
    municipio: string;
  };
  empresaServices: {
    nome: string;
    cnpj: string;
    municipio: string;
  };
  observacoes: string;
}

export type ViewState = 'dashboard' | 'checklist' | 'phases' | 'models' | 'tips' | 'settings' | 'report';
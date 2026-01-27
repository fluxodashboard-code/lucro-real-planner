import React from 'react';
import { Task, ProjectSettings } from '../types';
import { Download, Copy, FileText } from 'lucide-react';

interface ReportProps {
  tasks: Task[];
  settings: ProjectSettings;
  responsibles: string[];
}

const Report: React.FC<ReportProps> = ({ tasks, settings, responsibles }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100) || 0;
  
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today);
  const criticalTasks = tasks.filter(t => !t.completed && t.priority === 'High');

  const generateMarkdown = () => {
    return `# Relatório de Implantação - Lucro Real

**Data:** ${new Date().toLocaleDateString('pt-BR')}
**Projeto:** ${settings.segmento || 'Não informado'}
**Local:** ${settings.uf}

---

## 1. Dados das Empresas

**Operacional**
- Razão Social: ${settings.empresaOperacional.nome || '-'}
- CNPJ: ${settings.empresaOperacional.cnpj || '-'}
- Município: ${settings.empresaOperacional.municipio || '-'}

**Services (Intercompany)**
- Razão Social: ${settings.empresaServices.nome || '-'}
- CNPJ: ${settings.empresaServices.cnpj || '-'}
- Município: ${settings.empresaServices.municipio || '-'}

---

## 2. Status Executivo

- **Progresso Global:** ${progress}% (${completedCount}/${tasks.length} tarefas)
- **Tarefas Atrasadas:** ${overdueTasks.length}
- **Pendências de Alta Prioridade:** ${criticalTasks.length}

### 2.1 Atenção Imediata (Atrasadas ou Alta Prioridade)
${[...new Set([...overdueTasks, ...criticalTasks])].map(t => (
  `- [ ] **${t.id}** (${t.priority === 'High' ? 'ALTA' : 'Normal'}) ${t.dueDate && t.dueDate < today ? '[ATRASADO]' : ''}: ${t.activity} (${t.responsible})`
)).join('\n') || 'Nenhuma pendência crítica.'}

---

## 3. Detalhamento por Fase

### Fase A - Fiscal
${tasks.filter(t => t.phase === 'A' && !t.completed).map(t => `- [ ] ${t.id}: ${t.activity}`).join('\n') || 'Fase concluída.'}

### Fase B - Services
${tasks.filter(t => t.phase === 'B' && !t.completed).map(t => `- [ ] ${t.id}: ${t.activity}`).join('\n') || 'Fase concluída.'}

### Fase C - RH
${tasks.filter(t => t.phase === 'C' && !t.completed).map(t => `- [ ] ${t.id}: ${t.activity}`).join('\n') || 'Fase concluída.'}

### Fase D - Contábil
${tasks.filter(t => t.phase === 'D' && !t.completed).map(t => `- [ ] ${t.id}: ${t.activity}`).join('\n') || 'Fase concluída.'}

---

## 4. Observações
${settings.observacoes || 'Sem observações registradas.'}
`;
  };

  const markdownContent = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    alert('Relatório copiado para a área de transferência!');
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_LucroReal_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatório de Status</h2>
          <p className="text-slate-500">Documento gerado automaticamente para status report.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
                <Copy size={18} />
                Copiar
            </button>
            <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                <Download size={18} />
                Baixar .md
            </button>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <FileText size={18} className="text-slate-500" />
            <span className="text-sm font-bold text-slate-600">Pré-visualização (Markdown)</span>
        </div>
        <div className="p-0">
            <textarea 
                className="w-full h-[600px] p-6 font-mono text-sm text-slate-700 bg-white resize-none focus:outline-none"
                value={markdownContent}
                readOnly
            ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Report;
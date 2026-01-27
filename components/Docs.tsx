import React, { useState } from 'react';
import { PHASES, MODELS, TIPS } from '../constants';
import { ViewState } from '../types';
import { Copy, Check, FileText, ArrowRight, Lightbulb } from 'lucide-react';

interface DocsProps {
  view: ViewState;
}

const Docs: React.FC<DocsProps> = ({ view }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (view === 'phases') {
    return (
      <div className="space-y-6 animate-fade-in">
        <header>
          <h2 className="text-2xl font-bold text-slate-800">Fases do Projeto</h2>
          <p className="text-slate-500">Detalhamento técnico de cada etapa da implementação.</p>
        </header>

        <div className="grid gap-6">
          {PHASES.map((phase) => (
            <div key={phase.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {phase.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{phase.title}</h3>
                  <p className="text-sm text-slate-500">{phase.description}</p>
                </div>
              </div>
              <ul className="space-y-3 pl-4 border-l-2 border-slate-100 ml-6">
                {phase.steps.map((step, idx) => (
                  <li key={idx} className="text-slate-700 text-sm flex gap-3 items-start">
                    <span className="mt-1 text-blue-400"><ArrowRight size={14} /></span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'models') {
    return (
      <div className="space-y-6 animate-fade-in">
        <header>
          <h2 className="text-2xl font-bold text-slate-800">Modelos & Documentos</h2>
          <p className="text-slate-500">Templates prontos para copiar e utilizar na operação.</p>
        </header>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {MODELS.map((model) => (
            <div key={model.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <FileText size={18} />
                  {model.title}
                </div>
                <button
                  onClick={() => handleCopy(model.content, model.id)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all ${
                    copiedId === model.id 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {copiedId === model.id ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar Modelo</>}
                </button>
              </div>
              <div className="p-4 flex-1 bg-slate-50/30">
                <pre className="text-xs md:text-sm text-slate-600 font-mono whitespace-pre-wrap leading-relaxed p-4 bg-white border border-slate-200 rounded-lg shadow-inner h-full overflow-auto max-h-[400px]">
                  {model.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'tips') {
    return (
      <div className="space-y-6 animate-fade-in">
        <header>
          <h2 className="text-2xl font-bold text-slate-800">Dicas & Pontos de Atenção</h2>
          <p className="text-slate-500">Recomendações técnicas para mitigar riscos fiscais.</p>
        </header>

        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {TIPS.map((tip, idx) => (
            <div key={idx} className="break-inside-avoid bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg mt-1">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight pt-1">{tip.title}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mt-3 pl-12">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Docs;
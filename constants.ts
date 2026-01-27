import { Task, PhaseInfo, ModelDoc } from './types';

export const INITIAL_RESPONSIBLES = [
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

export const INITIAL_TASKS: Task[] = [
  // Phase A
  { id: 'A-01', phase: 'A', activity: 'Exportar cadastro de produtos do ERP (com NCM/CEST/GTIN/unidade/origem/família)', responsible: 'Fiscal/TI', completed: false },
  { id: 'A-02', phase: 'A', activity: 'Mapear itens ICMS-ST e validar CEST e enquadramento', responsible: 'Fiscal', completed: false, priority: 'High' },
  { id: 'A-03', phase: 'A', activity: 'Mapear itens PIS/COFINS monofásicos e validar enquadramento', responsible: 'Fiscal/Contábil', completed: false, priority: 'High' },
  { id: 'A-04', phase: 'A', activity: 'Criar famílias fiscais (somente com critérios técnicos iguais) + rastreabilidade', responsible: 'Fiscal', completed: false },
  { id: 'A-05', phase: 'A', activity: 'Parametrizar CFOP/CST por cenário (venda/devolução/bonificação/garantia/remessa)', responsible: 'Fiscal/TI', completed: false },
  { id: 'A-06', phase: 'A', activity: 'Testar emissão NF-e e validações internas (campos obrigatórios/bloqueios)', responsible: 'Fiscal/TI', completed: false },
  // Phase B
  { id: 'B-01', phase: 'B', activity: 'Validar/definir CNAEs da Services conforme cargos/serviços prestados', responsible: 'Societário/DP', completed: false },
  { id: 'B-02', phase: 'B', activity: 'Habilitar NFS-e, inscrição municipal e alvará da Services', responsible: 'Fiscal/Societário', completed: false, priority: 'High' },
  { id: 'B-03', phase: 'B', activity: 'Abrir/validar conta bancária da Services e fluxo de transferência', responsible: 'Financeiro', completed: false },
  { id: 'B-04', phase: 'B', activity: 'Contrato de prestação de serviços intercompany (sem preço fixo; com relatório mensal)', responsible: 'Jurídico/Contábil', completed: false, priority: 'High' },
  { id: 'B-05', phase: 'B', activity: 'Planilha de formação de preço da NFS-e (salários + encargos + fee + margem)', responsible: 'Contábil', completed: false },
  { id: 'B-06', phase: 'B', activity: 'Implantar relatório mensal e procedimento de aprovação entre as partes', responsible: 'Gestão', completed: false },
  // Phase C
  { id: 'C-01', phase: 'C', activity: 'Levantamento do quadro de funcionários por empresa e cargo', responsible: 'DP', completed: false },
  { id: 'C-02', phase: 'C', activity: 'Executar portabilidade/transferência para a Services (quando aplicável)', responsible: 'DP', completed: false },
  { id: 'C-03', phase: 'C', activity: 'Revisar fichas de alteração de cargos/lotação eSocial', responsible: 'DP', completed: false },
  // Phase D
  { id: 'D-01', phase: 'D', activity: 'Coletar contratos de empréstimos/financiamentos e extratos de juros', responsible: 'Financeiro/Contábil', completed: false },
  { id: 'D-02', phase: 'D', activity: 'Consolidar taxas/juros de cartões e contabilizar com lastro', responsible: 'Financeiro/Contábil', completed: false },
  { id: 'D-03', phase: 'D', activity: 'Mapear despesas recorrentes e criar rotina "só entra com nota"', responsible: 'Compras', completed: false },
  { id: 'D-04', phase: 'D', activity: 'Imóvel: verificar PF/PJ e formalizar contrato de locação (se PF)', responsible: 'Jurídico/Contábil', completed: false },
  { id: 'D-05', phase: 'D', activity: 'PDD: listar inadimplentes e montar dossiê de cobrança/documentação', responsible: 'Financeiro/Contábil', completed: false },
  { id: 'D-06', phase: 'D', activity: 'Perdas de estoque: procedimento + evidências + NF de baixa (CFOP 5.927)', responsible: 'Fiscal/Estoque', completed: false, priority: 'High' },
  { id: 'D-07', phase: 'D', activity: 'Conciliação bancária mensal 100% + fechamento contábil', responsible: 'Contábil', completed: false, priority: 'High' },
];

export const PHASES: PhaseInfo[] = [
  {
    id: 'A',
    title: 'Fase A — Revisão Cadastral e Matriz Fiscal',
    description: 'Foco em ICMS-ST e PIS/COFINS monofásico. Padronização de NCM, CEST e GTIN.',
    steps: [
      'Exportar o cadastro completo de produtos do ERP.',
      'Classificar cada item em "perfil tributário".',
      'Criar "famílias fiscais" (agrupamento somente com critérios técnicos iguais).',
      'Padronizar descrição/abreviações.',
      'Criar Matriz Fiscal por cenário (compra, venda, devolução, etc.).',
      'Implementar validações no ERP.',
      'Rodar testes de emissão (NF-e).'
    ]
  },
  {
    id: 'B',
    title: 'Fase B — Implantação da Empresa de Serviços',
    description: 'Estruturação da Intercompany, emissão de NFS-e e contratos.',
    steps: [
      'Checklist de habilitação (CNAEs, inscrição municipal, alvará).',
      'Conta bancária e rotina de fluxo financeiro.',
      'Modelo de contrato de prestação de serviços intercompany (sem preço fixo).',
      'Modelo de Relatório Mensal de Serviços.',
      'Parametrizar emissão de NFS-e por natureza do serviço.',
      'Definir margem de lucro mínima e memorial de cálculo.',
      'Criar política de rateio.'
    ]
  },
  {
    id: 'C',
    title: 'Fase C — Portabilidade e Governança de RH',
    description: 'Migração de funcionários para a empresa de serviços e ajustes no eSocial.',
    steps: [
      'Levantamento do quadro atual por empresa.',
      'Definir quem ficará registrado na Services.',
      'Executar portabilidade/transferência conforme regras trabalhistas.',
      'Conferir fichas de alteração de cargos/lotação.',
      'Revisar contratos/rotinas de prestação de serviços.'
    ]
  },
  {
    id: 'D',
    title: 'Fase D — Rotinas de Lucro Real e Dedutibilidade',
    description: 'Conciliação contábil, registro de despesas, PDD e perdas de estoque.',
    steps: [
      'Balanço contábil e balancetes mensais.',
      'Padronizar compras "com nota" para despesas recorrentes.',
      'Formalizar contrato de locação (Imóvel PF/PJ).',
      'Contabilização de energia por centro de custo.',
      'Classificar juros e tarifas de empréstimos e cartões.',
      'PDD/Perdas com clientes (dossiê de cobrança).',
      'Perdas de estoque (NF de baixa CFOP 5.927).',
      'Conciliação bancária 100%.'
    ]
  }
];

export const MODELS: ModelDoc[] = [
  {
    id: 'relatorio-servicos',
    title: 'Relatório Mensal de Serviços',
    content: `RELATÓRIO MENSAL DE SERVIÇOS (INTERCOMPANY)

Mês/Competência: ____/____
Empresa Prestadora (Services): _______________________  CNPJ: _______________
Empresa Tomadora (Operacional): ______________________  CNPJ: _______________

1. Resumo do quadro alocado no mês:
(Cargo • Qtde • Salário base total)
...

2. Composição de Custos e Faturamento:
(+) Encargos: FGTS/INSS/Outros: R$ ________
(+/-) Ajustes do mês anterior: R$ ________ (Motivo: ____________)
(+) Fee/Honorários administrativos: R$ ________
(+) Margem de lucro (%): ____%  |  Margem (R$): R$ ________

= TOTAL A FATURAR (NFS-e): R$ ________

Aprovação:
( ) Prestadora
( ) Tomadora

Assinaturas/Responsáveis: __________________________________________`
  },
  {
    id: 'baixa-estoque',
    title: 'Procedimento de Baixa de Estoque',
    content: `PROCEDIMENTO DE BAIXA DE ESTOQUE POR PERDAS

1. Evidência da Perda
   - Laudo interno técnico
   - Fotos do produto avariado
   - Boletim de Ocorrência (obrigatório em caso de roubo/furto)
   - Aprovação formal da gerência

2. Ajuste no Sistema (ERP)
   - Dar baixa no item (quantidade/custo)
   - Inserir justificativa no histórico

3. Emissão de Documento Fiscal
   - Emitir NF-e de Baixa de Estoque
   - Destinatário: A própria empresa (Emissão Própria)
   - CFOP: 5.927 (Lançamento efetuado a título de baixa de estoque decorrente de perda, roubo ou deterioração)
   - ICMS: Sem destaque (estorno de crédito deve ser analisado conforme UF)

4. Arquivamento
   - Anexar dossiê da perda junto ao fechamento contábil do mês.`
  }
];

export const TIPS = [
  {
    title: 'ICMS-ST em Goiás',
    text: 'Exige consistência de NCM/CEST e regras por produto/segmento. Agrupar "similares" é válido somente com enquadramento idêntico. Atenção aos benefícios fiscais e o código cBenef.'
  },
  {
    title: 'PIS/COFINS Monofásico',
    text: 'Depende estritamente do enquadramento do produto e NCM. Não confunda com ST, são legislações diferentes. Revisar cadastro para evitar pagamento em duplicidade na saída.'
  },
  {
    title: 'Controle de Perdas (CFOP 5.927)',
    text: 'Trate como procedimento controlado e com evidências robustas. A baixa sem lastro pode ser considerada venda sem nota pelo fisco.'
  },
  {
    title: 'Intercompany',
    text: 'Política formal é essencial: memorial de cálculo, comparabilidade e evidências (relatórios) para afastar risco de "simulação" ou falta de substância econômica.'
  },
  {
    title: 'PDD / Perdas com Clientes',
    text: 'Para dedutibilidade no Lucro Real, o controle documental é tão importante quanto o valor. Mantenha lista de títulos, datas de vencimento, e provas das medidas de cobrança administrativa ou judicial.'
  }
];
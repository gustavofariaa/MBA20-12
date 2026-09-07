import { ChaosCard } from '@/types/game';

export const CHAOS_CARDS: ChaosCard[] = [
  {
    id: 1,
    title: 'Envolvimento Ativo dos Usuários',
    category: 'Sucesso',
    description: 'Os usuários finais participaram ativamente da validação do protótipo e esclareceram requisitos críticos precocemente.',
    chaosMetric: 'Relatório CHAOS: O apoio dos usuários aumenta em 80% as chances de sucesso do projeto.',
    effectType: 'ACCELERATION',
    effectValue: 3,
    flavorText: 'Feedback rápido gera valor imediato na Sprint!'
  },
  {
    id: 2,
    title: 'Mudança Repentina de Escopo',
    category: 'Falha',
    description: 'Requisitos de última hora foram adicionados sem refinamento técnico pela equipe.',
    chaosMetric: 'Relatório CHAOS: 45% do estouro de orçamento vem de estouros de escopo não gerenciados.',
    effectType: 'IMPEDIMENT',
    effectValue: -2,
    flavorText: 'Retrabalho obriga a equipe a recuar no pipeline.'
  },
  {
    id: 3,
    title: 'Pipeline CI/CD Automatizado',
    category: 'Sucesso',
    description: 'Testes e builds integrados reduziram drasticamente os bugs de integração no deploy.',
    chaosMetric: 'Relatório CHAOS: Automação reduz o tempo de ciclo de release em até 65%.',
    effectType: 'ACCELERATION',
    effectValue: 2,
    flavorText: 'Deploy automatizado sem fricção!'
  },
  {
    id: 4,
    title: 'Falta de Patrocínio Executivo',
    category: 'Falha',
    description: 'A liderança cortou temporariamente os recursos essenciais do projeto.',
    chaosMetric: 'Relatório CHAOS: Ausência de apoio executivo causa 30% dos cancelamentos de projetos.',
    effectType: 'SKIP_TURN',
    effectValue: 0,
    flavorText: 'Aguardando liberação de orçamento... Pule a próxima vez.'
  },
  {
    id: 5,
    title: 'Refatoração Orientada a Limpeza',
    category: 'Sucesso',
    description: 'Eliminação de débito técnico permitiu que novas funcionalidades fossem desenvolvidas 2x mais rápido.',
    chaosMetric: 'Relatório CHAOS: Redução de débito técnico melhora a manutenibilidade em 50%.',
    effectType: 'ACCELERATION',
    effectValue: 2,
    flavorText: 'Código limpo é código veloz!'
  },
  {
    id: 6,
    title: 'Expectativas Não Alinhadas',
    category: 'Falha',
    description: 'O cliente esperava uma funcionalidade e o time entregou outra por falha de comunicação.',
    chaosMetric: 'Relatório CHAOS: Requisitos mal definidos representam 35% das causas de falha.',
    effectType: 'IMPEDIMENT',
    effectValue: -3,
    flavorText: 'Volte ao planejamento para alinhar a visão.'
  },
  {
    id: 7,
    title: 'Metodologia Ágil Disciplinada',
    category: 'Sucesso',
    description: 'Dailies eficientes e reuniões de planejamento focadas garantiram entregas contínuas.',
    chaosMetric: 'Relatório CHAOS: Projetos ágeis têm 2x mais chances de sucesso que projetos em cascata.',
    effectType: 'ACCELERATION',
    effectValue: 2,
    flavorText: 'Cadência constante e ritmo sustentável.'
  },
  {
    id: 8,
    title: 'Rotatividade da Equipe (Turnover)',
    category: 'Falha',
    description: 'Um desenvolvedor chave saiu no meio da Sprint, demandando tempo de integração de novo membro.',
    chaosMetric: 'Relatório CHAOS: Perda de conhecimento de domínio reduz o ritmo em até 40%.',
    effectType: 'SKIP_TURN',
    effectValue: 0,
    flavorText: 'Onboarding de novos membros em andamento... Perde 1 turno.'
  },
  {
    id: 9,
    title: 'Pair Programming & Code Review',
    category: 'Sucesso',
    description: 'Erros foram detectados antes de chegar em produção graças à revisão entre pares.',
    chaosMetric: 'Relatório CHAOS: Inspeção contínua de código previne 70% dos bugs críticos.',
    effectType: 'ACCELERATION',
    effectValue: 1,
    flavorText: 'Qualidade garantida na origem.'
  },
  {
    id: 10,
    title: 'Gargalo em Testes Manuais',
    category: 'Falha',
    description: 'Ausência de testes automatizados fez a validação travar a entrega da versão.',
    chaosMetric: 'Relatório CHAOS: Testes manuais tardios atrasam entregas em média 3 semanas.',
    effectType: 'IMPEDIMENT',
    effectValue: -1,
    flavorText: 'Fila de testes acumulada. Recue 1 casa.'
  },
  {
    id: 11,
    title: 'Infraestrutura em Nuvem Escalável',
    category: 'Sucesso',
    description: 'Ambientes de homologação provisionados instantaneamente permitiram testes paralelos.',
    chaosMetric: 'Relatório CHAOS: Infraestrutura elástica diminui o tempo de disponibilização em 60%.',
    effectType: 'ACCELERATION',
    effectValue: 3,
    flavorText: 'Ambiente pronto com 1 clique!'
  },
  {
    id: 12,
    title: 'Especificações Ambíguas',
    category: 'Falha',
    description: 'Estórias de usuário sem critérios de aceitação claros causaram interpretações duvidosas.',
    chaosMetric: 'Relatório CHAOS: Objetivos obscuros aumentam o retrabalho em 50%.',
    effectType: 'IMPEDIMENT',
    effectValue: -2,
    flavorText: 'Dúvidas nos critérios travaram a tarefa. Recue 2 casas.'
  },
  {
    id: 13,
    title: 'Gerenciamento Proativo de Riscos',
    category: 'Sucesso',
    description: 'A equipe antecipou uma falha de dependência e implementou um plano de contingência a tempo.',
    chaosMetric: 'Relatório CHAOS: Mitigação antecipada reduz estouro de prazo em 75%.',
    effectType: 'ACCELERATION',
    effectValue: 2,
    flavorText: 'Risco neutralizado com maestria!'
  },
  {
    id: 14,
    title: 'Incidente Crítico de Segurança',
    category: 'Falha',
    description: 'Vulnerabilidade em biblioteca de terceiros exigiu atualização emergencial de infraestrutura.',
    chaosMetric: 'Relatório CHAOS: Falhas de segurança severas interrompem a Sprint imediatamente.',
    effectType: 'SKIP_TURN',
    effectValue: 0,
    flavorText: 'Parada emergencial para patch de segurança. Perde o próximo turno.'
  },
  {
    id: 15,
    title: 'Design System Consistente',
    category: 'Sucesso',
    description: 'Componentes reusáveis aceleraram a construção da interface do produto.',
    chaosMetric: 'Relatório CHAOS: Reuso de software aumenta a eficiência do time em 40%.',
    effectType: 'ACCELERATION',
    effectValue: 1,
    flavorText: 'Desenvolvimento modular ágil!'
  },
  {
    id: 16,
    title: 'Estimação Irrealista (Planning Poker Falho)',
    category: 'Falha',
    description: 'Uma tarefa estimada em 2 SP levou 8 SP devido à complexidade oculta.',
    chaosMetric: 'Relatório CHAOS: 52% dos projetos estouram a estimativa inicial em mais de 100%.',
    effectType: 'IMPEDIMENT',
    effectValue: -2,
    flavorText: 'Complexidade subestimada! Recue 2 casas.'
  },
  {
    id: 17,
    title: 'Sprint Backlog Priorizado pelo PO',
    category: 'Sucesso',
    description: 'Foco exclusivo nas funcionalidades de maior valor de negócio para o usuário final.',
    chaosMetric: 'Relatório CHAOS: Priorização de valor garante ROI positivo no lançamento.',
    effectType: 'ACCELERATION',
    effectValue: 2,
    flavorText: 'Foco total no MVP!'
  },
  {
    id: 18,
    title: 'Sobrecarga de Reuniões (Meeting Fatigue)',
    category: 'Falha',
    description: 'Excesso de reuniões sem pauta roubou horas de codificação da equipe.',
    chaosMetric: 'Relatório CHAOS: Interrupções constantes reduzem a produtividade diária em 25%.',
    effectType: 'IMPEDIMENT',
    effectValue: -1,
    flavorText: 'Menos reuniões, mais código. Recue 1 casa.'
  },
  {
    id: 19,
    title: 'Arquitetura de Microsserviços Desacoplada',
    category: 'Sucesso',
    description: 'Permitiu que o time fizesse deploys independentes sem afetar o resto do sistema.',
    chaosMetric: 'Relatório CHAOS: Desacoplamento técnico aumenta a velocidade de release em 50%.',
    effectType: 'ACCELERATION',
    effectValue: 3,
    flavorText: 'Salto quântico em direção ao Deploy!'
  },
  {
    id: 20,
    title: 'Dependência de Fornecedor Externo',
    category: 'Falha',
    description: 'A API de terceiros atrasou a entrega da chave de acesso em 1 semana.',
    chaosMetric: 'Relatório CHAOS: Bloqueios externos representam 20% dos atrasos em TI.',
    effectType: 'SKIP_TURN',
    effectValue: 0,
    flavorText: 'Aguardando resposta do fornecedor... Perde a próxima vez.'
  }
];

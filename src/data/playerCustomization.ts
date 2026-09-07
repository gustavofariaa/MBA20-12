export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export interface IconOption {
  id: string;
  symbol: string;
  label: string;
}

export const VINTAGE_COLOR_OPTIONS: ColorOption[] = [
  { id: 'red', name: 'Vermelho Rubro', hex: '#EF4444', bgClass: 'bg-[#EF4444]', borderClass: 'border-[#1C1917]', textClass: 'text-[#EF4444]' },
  { id: 'blue', name: 'Azul Elétrico', hex: '#3B82F6', bgClass: 'bg-[#3B82F6]', borderClass: 'border-[#1C1917]', textClass: 'text-[#3B82F6]' },
  { id: 'yellow', name: 'Amarelo Sol', hex: '#EAB308', bgClass: 'bg-[#EAB308]', borderClass: 'border-[#1C1917]', textClass: 'text-[#CA8A04]' },
  { id: 'green', name: 'Verde Esmeralda', hex: '#10B981', bgClass: 'bg-[#10B981]', borderClass: 'border-[#1C1917]', textClass: 'text-[#10B981]' },
  { id: 'purple', name: 'Roxo Violeta', hex: '#A855F7', bgClass: 'bg-[#A855F7]', borderClass: 'border-[#1C1917]', textClass: 'text-[#A855F7]' },
  { id: 'pink', name: 'Rosa Chiclete', hex: '#F472B6', bgClass: 'bg-[#F472B6]', borderClass: 'border-[#1C1917]', textClass: 'text-[#F472B6]' },
  { id: 'orange', name: 'Laranja Tangerina', hex: '#F97316', bgClass: 'bg-[#F97316]', borderClass: 'border-[#1C1917]', textClass: 'text-[#F97316]' },
  { id: 'sepia', name: 'Castanho Sépia', hex: '#78350F', bgClass: 'bg-[#78350F]', borderClass: 'border-[#1C1917]', textClass: 'text-[#78350F]' }
];

export const VINTAGE_ICON_OPTIONS: IconOption[] = [
  { id: 'rocket', symbol: 'rocket', label: 'Foguete' },
  { id: 'bolt', symbol: 'bolt', label: 'Raio' },
  { id: 'star', symbol: 'star', label: 'Estrela' },
  { id: 'clover', symbol: 'clover', label: 'Trevo' },
  { id: 'cup', symbol: 'cup', label: 'Xícara' },
  { id: 'glass', symbol: 'glass', label: 'Copo' },
  { id: 'monster', symbol: 'monster', label: 'Monstrinho' },
  { id: 'fire', symbol: 'fire', label: 'Fogo' },
  { id: 'crown', symbol: 'crown', label: 'Coroa' },
  { id: 'target', symbol: 'target', label: 'Alvo' }
];

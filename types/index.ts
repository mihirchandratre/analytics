export interface Reagent {
  name: string;
  mm: number; // molar mass
}

export interface Buffer {
  name: string;
  pKa: number;
  acid: string;
  base: string;
}

export interface Density {
  name: string;
  d: number; // density g/mL
}

export interface Calculation {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  formula?: string;
  result?: string;
}

export interface LabConstant {
  name: string;
  symbol: string;
  value: string;
}

export interface Indicator {
  name: string;
  pHRange: string;
  colorChange: string;
}

export interface Solubility {
  salt: string;
  solubility: string;
}
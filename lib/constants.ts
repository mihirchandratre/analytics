import { Reagent, Buffer, Density, LabConstant, Indicator, Solubility } from '@/types';

export const reagents: Reagent[] = [
  { name: "NaCl", mm: 58.44 },
  { name: "KCl", mm: 74.55 },
  { name: "NaOH", mm: 39.997 },
  { name: "HCl", mm: 36.46 },
  { name: "Tris base", mm: 121.14 },
  { name: "Acetic acid", mm: 60.05 },
  { name: "Glucose", mm: 180.16 },
  { name: "EDTA", mm: 292.24 },
  { name: "KH2PO4", mm: 136.09 },
  { name: "Na2HPO4", mm: 141.96 },
  { name: "CaCl2", mm: 110.98 },
  { name: "MgSO4", mm: 120.37 },
  { name: "NH4Cl", mm: 53.49 },
  { name: "K2HPO4", mm: 174.18 }
];

export const buffers: Buffer[] = [
  { name: "Acetate", pKa: 4.76, acid: "Acetic acid", base: "Sodium acetate" },
  { name: "Phosphate", pKa: 7.21, acid: "KH2PO4", base: "Na2HPO4" },
  { name: "Tris", pKa: 8.06, acid: "Tris-HCl", base: "Tris base" },
  { name: "Citrate", pKa: 6.4, acid: "Citric acid", base: "Sodium citrate" },
  { name: "Glycine", pKa: 9.6, acid: "Glycine-HCl", base: "Glycine" },
  { name: "HEPES", pKa: 7.5, acid: "HEPES", base: "HEPES Na+" },
  { name: "Bis-Tris", pKa: 6.5, acid: "Bis-Tris-HCl", base: "Bis-Tris" }
];

export const densities: Density[] = [
  { name: "Water", d: 1.00 },
  { name: "Ethanol", d: 0.789 },
  { name: "Methanol", d: 0.792 },
  { name: "Glycerol", d: 1.26 },
  { name: "Chloroform", d: 1.49 },
  { name: "Acetone", d: 0.79 },
  { name: "DMSO", d: 1.10 },
  { name: "Isopropanol", d: 0.786 }
];

export const labConstants: LabConstant[] = [
  { name: "Avogadro's number", symbol: "N₀", value: "6.022×10²³ mol⁻¹" },
  { name: "Gas constant", symbol: "R", value: "8.314 J·mol⁻¹·K⁻¹" },
  { name: "Faraday constant", symbol: "F", value: "96485 C·mol⁻¹" },
  { name: "Boltzmann constant", symbol: "k₈", value: "1.381×10⁻²³ J·K⁻¹" },
  { name: "Planck constant", symbol: "h", value: "6.626×10⁻³⁴ J·s" },
  { name: "Speed of light", symbol: "c", value: "2.998×10⁸ m·s⁻¹" }
];

export const indicators: Indicator[] = [
  { name: "Methyl Orange", pHRange: "3.1–4.4", colorChange: "Red → Yellow" },
  { name: "Bromocresol Green", pHRange: "3.8–5.4", colorChange: "Yellow → Blue" },
  { name: "Methyl Red", pHRange: "4.8–6.0", colorChange: "Red → Yellow" },
  { name: "Bromothymol Blue", pHRange: "6.0–7.6", colorChange: "Yellow → Blue" },
  { name: "Neutral Red", pHRange: "6.8–8.0", colorChange: "Red → Yellow" },
  { name: "Phenolphthalein", pHRange: "8.2–10.0", colorChange: "Colorless → Pink" },
  { name: "Thymol Blue", pHRange: "8.0–9.6", colorChange: "Yellow → Blue" }
];

export const solubilities: Solubility[] = [
  { salt: "NaCl", solubility: "36.0" },
  { salt: "KCl", solubility: "34.2" },
  { salt: "AgCl", solubility: "0.00019" },
  { salt: "CaSO₄", solubility: "0.21" },
  { salt: "BaSO₄", solubility: "0.0002" },
  { salt: "PbSO₄", solubility: "0.004" },
  { salt: "CaCO₃", solubility: "0.0013" },
  { salt: "AgBr", solubility: "0.000012" }
];
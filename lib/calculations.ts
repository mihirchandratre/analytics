export const calculateMoles = (mass: number, molarMass: number): number => {
  return mass / molarMass;
};

export const calculateMolarity = (moles: number, volumeL: number): number => {
  return moles / volumeL;
};

export const calculateNormality = (molarity: number, equivalents: number): number => {
  return molarity * equivalents;
};

export const calculateMolality = (massSolute: number, molarMass: number, massSolventKg: number): number => {
  const moles = massSolute / molarMass;
  return moles / massSolventKg;
};

export const calculateDilution = (C1: number, V1: number, C2: number): number => {
  return (C1 * V1) / C2;
};

export const calculateStockVolume = (C1: number, C2: number, V2: number): number => {
  return (C2 * V2) / C1;
};

export const calculateTitrationNormality = (
  titrantNormality: number, 
  titrantVolume: number, 
  unknownVolume: number, 
  stoichiometricFactor: number = 1
): number => {
  return (titrantNormality * titrantVolume) / (unknownVolume * stoichiometricFactor);
};

export const calculateBeerLambert = (absorbance: number, molarAbsorptivity: number, pathLength: number): number => {
  return absorbance / (molarAbsorptivity * pathLength);
};

export const calculatePercent = (percentage: number, totalAmount: number): number => {
  return (percentage / 100) * totalAmount;
};

export const convertDensity = (value: number, density: number, fromGrams: boolean): number => {
  return fromGrams ? value / density : value * density;
};

export const calculateDilutionFactor = (initial: number, final: number): number => {
  return initial / final;
};

export const calculateMoistureContent = (wetMass: number, dryMass: number): number => {
  return ((wetMass - dryMass) / wetMass) * 100;
};

export const calculateTabletAssay = (activeMass: number, totalMass: number): number => {
  return (activeMass / totalMass) * 100;
};

export const absorbanceToTransmittance = (absorbance: number): number => {
  return Math.pow(10, -absorbance) * 100;
};

export const transmittanceToAbsorbance = (transmittance: number): number => {
  return -Math.log10(transmittance / 100);
};

export const calculateBuffer = (pKa: number, pH: number, totalConcentration: number, volume: number) => {
  const ratio = Math.pow(10, pH - pKa);
  const baseFraction = ratio / (1 + ratio);
  const acidFraction = 1 / (1 + ratio);
  
  const baseMoles = baseFraction * totalConcentration * volume;
  const acidMoles = acidFraction * totalConcentration * volume;
  
  return { baseMoles, acidMoles, baseFraction, acidFraction };
};

export const generateSerialDilution = (
  startingConc: number, 
  foldDilution: number, 
  steps: number, 
  volumePerTube: number
) => {
  const dilutions = [];
  let currentConc = startingConc;
  
  for (let i = 1; i <= steps; i++) {
    const takeVolume = volumePerTube / foldDilution;
    const addVolume = volumePerTube - takeVolume;
    
    dilutions.push({
      tube: i,
      concentration: currentConc,
      takeVolume,
      addVolume,
      instruction: `Take ${takeVolume.toPrecision(4)} mL of ${i === 1 ? 'stock' : 'previous tube'} and add ${addVolume.toPrecision(4)} mL diluent`
    });
    
    currentConc = currentConc / foldDilution;
  }
  
  return dilutions;
};
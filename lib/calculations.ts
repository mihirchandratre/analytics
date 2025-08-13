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

export const solveMolesSet = (params: { mass?: number; molarMass?: number; moles?: number }) => {
  const { mass, molarMass, moles } = params;
  const missing = [mass, molarMass, moles].filter(v => v === undefined || isNaN(v)).length;
  if (missing !== 1) throw new Error('Provide exactly two of mass, molarMass, moles');
  if (moles === undefined) return { mass: mass!, molarMass: molarMass!, moles: mass! / molarMass! };
  if (mass === undefined) return { mass: moles * molarMass!, molarMass: molarMass!, moles };
  return { mass: mass!, molarMass: mass! / moles, moles };
};

export const solveMolaritySet = (params: { moles?: number; volumeL?: number; molarity?: number }) => {
  const { moles, volumeL, molarity } = params;
  const missing = [moles, volumeL, molarity].filter(v => v === undefined || isNaN(v)).length;
  if (missing !== 1) throw new Error('Provide exactly two of moles, volume, molarity');
  if (molarity === undefined) return { moles: moles!, volumeL: volumeL!, molarity: moles! / volumeL! };
  if (moles === undefined) return { moles: molarity * volumeL!, volumeL: volumeL!, molarity };
  return { moles: moles!, volumeL: moles! / molarity!, molarity };
};

export const solveNormalitySet = (params: { normality?: number; molarity?: number; equivalents?: number }) => {
  const { normality, molarity, equivalents } = params;
  const missing = [normality, molarity, equivalents].filter(v => v === undefined || isNaN(v)).length;
  if (missing !== 1) throw new Error('Provide exactly two of normality, molarity, equivalents');
  if (normality === undefined) return { normality: molarity! * equivalents!, molarity: molarity!, equivalents: equivalents! };
  if (molarity === undefined) return { normality: normality!, molarity: normality! / equivalents!, equivalents: equivalents! };
  return { normality: normality!, molarity: molarity!, equivalents: normality! / molarity! };
};

export const solveDilutionSet = (params: { C1?: number; V1?: number; C2?: number; V2?: number }) => {
  const { C1, V1, C2, V2 } = params;
  const list = [C1, V1, C2, V2];
  const missing = list.filter(v => v === undefined || isNaN(v)).length;
  if (missing !== 1) throw new Error('Provide exactly three of C1,V1,C2,V2');
  if (C1 === undefined) return { C1: (C2! * V2!) / V1!, V1: V1!, C2: C2!, V2: V2! };
  if (V1 === undefined) return { C1: C1!, V1: (C2! * V2!) / C1!, C2: C2!, V2: V2! };
  if (C2 === undefined) return { C1: C1!, V1: V1!, C2: (C1! * V1!) / V2!, V2: V2! };
  return { C1: C1!, V1: V1!, C2: C2!, V2: (C1! * V1!) / C2! };
};

export const solveMolalitySet = (params: { massSolute?: number; molarMass?: number; massSolventKg?: number; molality?: number }) => {
  const { massSolute, molarMass, massSolventKg, molality } = params;
  const arr = [massSolute, molarMass, massSolventKg, molality];
  const missing = arr.filter(v => v === undefined || isNaN(v)).length;
  if (missing !== 1) throw new Error('Provide exactly three of massSolute, molarMass, massSolventKg, molality');
  if (molality === undefined) return { massSolute: massSolute!, molarMass: molarMass!, massSolventKg: massSolventKg!, molality: (massSolute! / molarMass!) / massSolventKg! };
  if (massSolute === undefined) return { massSolute: molality! * molarMass! * massSolventKg!, molarMass: molarMass!, massSolventKg: massSolventKg!, molality };
  if (molarMass === undefined) return { massSolute: massSolute!, molarMass: massSolute! / (molality! * massSolventKg!), massSolventKg: massSolventKg!, molality };
  return { massSolute: massSolute!, molarMass: molarMass!, massSolventKg: (massSolute! / molarMass!) / molality!, molality };
};

export const solveBeerLambertSet = (params: { absorbance?: number; molarAbsorptivity?: number; pathLength?: number; concentration?: number }) => {
  const { absorbance, molarAbsorptivity, pathLength, concentration } = params;
  const arr = [absorbance, molarAbsorptivity, pathLength, concentration];
  const missing = arr.filter(v => v === undefined || isNaN(v)).length;
  if (missing !== 1) throw new Error('Provide exactly three of A, ε, l, c');
  if (concentration === undefined) return { absorbance: absorbance!, molarAbsorptivity: molarAbsorptivity!, pathLength: pathLength!, concentration: absorbance! / (molarAbsorptivity! * pathLength!) };
  if (absorbance === undefined) return { absorbance: molarAbsorptivity! * concentration! * pathLength!, molarAbsorptivity: molarAbsorptivity!, pathLength: pathLength!, concentration: concentration! };
  if (molarAbsorptivity === undefined) return { absorbance: absorbance!, molarAbsorptivity: absorbance! / (concentration! * pathLength!), pathLength: pathLength!, concentration: concentration! };
  return { absorbance: absorbance!, molarAbsorptivity: molarAbsorptivity!, pathLength: absorbance! / (molarAbsorptivity! * concentration!), concentration: concentration! };
};

export const massForMolarSolution = (molarity: number, volumeL: number, molarMass: number): number => {
  return molarity * volumeL * molarMass; // g
};

export const massForNormalSolution = (normality: number, volumeL: number, molarMass: number, equivalents: number): number => {
  const eqWeight = molarMass / equivalents;
  return normality * volumeL * eqWeight; // g
};
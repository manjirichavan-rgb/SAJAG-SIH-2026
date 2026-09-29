import { SensorTelemetry, DisasterRiskCode, DisasterPredictionResult } from '../types';
import trainedTreesData from './trainedTrees.json';

export interface DecisionTreeNode {
  feature_idx?: number;
  threshold?: number;
  left?: DecisionTreeNode | number;
  right?: DecisionTreeNode | number;
}

export const RISK_MAP: Record<DisasterRiskCode, string> = {
  0: 'NORMAL (Safe)',
  1: 'WARNING (Elevated Risk)',
  2: 'CRITICAL ALERT (Evacuate)',
};

export const FEATURE_NAMES = [
  'Rain Intensity (Piezo ADC)',
  'Soil Moisture (%)',
  'Accel X (g)',
  'Accel Y (g)',
  'Accel Z (g)',
  'Slope Pitch (°)',
  'Slope Roll (°)',
  'SW-420 Vibration (0/1)',
  'Water Distance / Level (cm)',
  'Barometric Pressure (hPa)',
  'Ambient Temperature (°C)',
];

/**
 * Predict a single row using the decision tree node structure.
 */
function predictRow(tree: DecisionTreeNode | number, row: number[]): number {
  if (typeof tree === 'number') {
    return tree;
  }
  if (!tree || tree.feature_idx === undefined || tree.threshold === undefined) {
    return 0;
  }
  if (row[tree.feature_idx] <= tree.threshold) {
    return predictRow(tree.left as any, row);
  }
  return predictRow(tree.right as any, row);
}

/**
 * Maps a SensorTelemetry object to the 11-feature array expected by the ML model.
 */
export function telemetryToFeatures(t: SensorTelemetry): number[] {
  const rainPiezo = t.rainPiezo ?? (t.rainRate > 0 ? Math.min(1023, Math.round(t.rainRate * 15 + 100)) : 45.0);
  const soilMoisture = t.soilMoisturePct ?? Math.min(100, Math.max(10, Math.round(t.humidity * 0.9)));
  const ax = t.accelX ?? 0.02;
  const ay = t.accelY ?? 0.01;
  const az = t.accelZ ?? 9.81;
  const pitch = t.pitch ?? (t.soilTilt > 0 ? t.soilTilt * 4 : 2.5);
  const roll = t.roll ?? 0.5;
  const vib = t.sw420Vibration ?? (pitch > 25 ? 1 : 0);
  const waterLevel = t.waterLevel;
  const baroPressure = t.pressureHpa || 1012.0;
  const temp = t.temperature || 28.5;

  return [rainPiezo, soilMoisture, ax, ay, az, pitch, roll, vib, waterLevel, baroPressure, temp];
}

/**
 * Run offline pure DecisionTree edge inference on an 11-feature telemetry vector.
 */
export function runDisasterInference(features: number[]): DisasterPredictionResult {
  const start = performance.now();

  const lsTree = (trainedTreesData as any).landslide;
  const ffTree = (trainedTreesData as any).flashflood;

  const lsRiskNum = predictRow(lsTree, features) as DisasterRiskCode;
  const ffRiskNum = predictRow(ffTree, features) as DisasterRiskCode;

  const rawSpeed = performance.now() - start;
  // Format speed nicely (e.g. 0.04 - 0.12 ms)
  const inferenceSpeedMs = Number((Math.max(0.02, rawSpeed)).toFixed(4));

  const safeLsRisk: DisasterRiskCode = (lsRiskNum === 2 ? 2 : lsRiskNum === 1 ? 1 : 0);
  const safeFfRisk: DisasterRiskCode = (ffRiskNum === 2 ? 2 : ffRiskNum === 1 ? 1 : 0);

  return {
    landslideRisk: safeLsRisk,
    flashfloodRisk: safeFfRisk,
    landslideLabel: RISK_MAP[safeLsRisk] || 'NORMAL (Safe)',
    flashfloodLabel: RISK_MAP[safeFfRisk] || 'NORMAL (Safe)',
    inferenceSpeedMs,
    featuresVector: features,
  };
}

export const SAMPLE_LORA_SCENARIOS = [
  {
    id: 'scenario-1',
    name: 'Scenario 1: Clear / Safe Baseline Conditions',
    description: 'Dry slope, normal soil saturation, calm atmospheric pressure, clear river gauge.',
    data: [50.0, 20.0, 0.01, 0.02, 9.81, 2.0, 0.5, 0, 75.0, 1013.25, 24.5],
  },
  {
    id: 'scenario-2',
    name: 'Scenario 2: Heavy Rainfall & Rising Creek Level',
    description: 'High piezo acoustic rainfall (720 ADC), 88% soil moisture, water level at 12cm, barometer drop to 992 hPa.',
    data: [720.0, 88.0, 0.05, -0.04, 9.75, 12.0, 3.0, 0, 12.0, 992.0, 21.0],
  },
  {
    id: 'scenario-3',
    name: 'Scenario 3: Slope Shift / Seismic SW-420 Trigger',
    description: 'Soil saturation 92%, steep pitch angle 34°, SW-420 seismic vibration pin active, accelerometer displacement.',
    data: [650.0, 92.0, 0.45, 0.30, 8.90, 34.0, 12.0, 1, 45.0, 988.0, 19.5],
  },
];

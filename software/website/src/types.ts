export type RiskLevel = 'SAFE' | 'WATCH' | 'RISK';

export type AlertSeverity = 'RISK' | 'WATCH' | 'SAFE';

export type HazardType = 'FLOOD' | 'TEMPERATURE' | 'PRESSURE' | 'SOIL_MOISTURE' | 'VIBRATION' | 'SYSTEM';

export interface SensorTelemetry {
  temperature: number;      // °C (Ambient Temperature)
  pressure: number;         // hPa (Barometric Pressure)
  waterLevel: number;       // cm (Water Level / Inundation)
  soilMoisture: number;     // % (Volumetric Soil Moisture)
  vibration: number;        // mm/s (Peak Ground / Structural Vibration)
}

export interface NodeHealth {
  isOnline: boolean;
  batteryPercent: number;
  batteryVoltage: number;    // V
  signalRssi: number;        // dBm
  signalQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  commProtocol: string;      // "LoRaWAN 868MHz" | "Direct USB/Serial" | "NB-IoT"
  lastUpdated: string;       // ISO or readable timestamp
  uptimeDays: number;
  packetsReceived: number;
  packetLossPercent: number;
}

export interface VillageNode {
  id: string;
  name: string;
  marathiName?: string;
  zone: string;
  isPrototype: boolean;      // True for NODE-01 physical prototype
  mapCoords: { x: number; y: number }; // Percentage 0-100 on schematic map
  status: RiskLevel;
  telemetry: SensorTelemetry;
  health: NodeHealth;
}

export interface EdgeAiEvaluation {
  overallRisk: RiskLevel;
  confidencePercent: number;
  inferenceTimeMs: number;
  primaryRiskNodeId: string;
  contributingFactors: string[];
  summaryCondition: string;
  hazardDetected: boolean;
  detectedHazards: HazardType[];
  modelInfo: string;
}

export interface AlertRecord {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  severity: AlertSeverity;
  hazardType: HazardType;
  title: string;
  description: string;
  acknowledged: boolean;
}

export interface SirenState {
  status: 'ACTIVE' | 'INACTIVE';
  triggerMode: 'AUTO (Event-Triggered)' | 'MANUAL OVERRIDE' | 'STANDBY';
  activatedAt?: string;
  lastEventTrigger?: string;
  relayStatus: 'ENERGIZED' | 'NORMAL';
  audioMuted: boolean;
}

export interface SmsRecipient {
  role: string;
  name: string;
  mobile: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  deliveryTime?: string;
}

export interface SmsDispatchState {
  status: 'SENT' | 'PENDING' | 'FAILED' | 'IDLE';
  lastDispatchedAt?: string;
  incidentId?: string;
  messageText?: string;
  recipients: SmsRecipient[];
  gatewayResponse?: string;
}

export interface SystemStatus {
  edgeAiActive: boolean;
  edgeModelVersion: string;
  internetOnline: boolean;
  localNetworkActive: boolean;
  gatewayHost: string;
  lastHeartbeat: string;
}

export interface TelemetryHistoryPoint {
  timestamp: string;
  timeLabel: string;
  temperature: number;
  pressure: number;
  waterLevel: number;
  soilMoisture: number;
  vibration: number;
}

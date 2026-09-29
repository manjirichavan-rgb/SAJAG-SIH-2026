import { VillageNode, TelemetryHistoryPoint } from '../types';

/**
 * Clean mock data adapter for SAJAG Village Environmental Intelligence Dashboard.
 * Simulates realistic micro-fluctuations on pre-fed calibrated grid nodes (NODE-02 through NODE-06)
 * across the 5 monitored physical parameters (temperature, pressure, waterLevel, soilMoisture, vibration)
 * while keeping NODE-01 dedicated for the Physical Trigger Calibrator.
 */

export function simulatePreFedNodes(nodes: VillageNode[]): VillageNode[] {
  return nodes.map((node) => {
    // NODE-01 is the physical prototype node; its telemetry is updated only via the Physical Trigger Calibrator
    if (node.isPrototype) {
      return node;
    }

    // Realistic micro-fluctuations within nominal environmental boundaries
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const updatedTelemetry = {
      temperature: Number((node.telemetry.temperature + rand(-0.15, 0.15)).toFixed(1)),
      pressure: Number((node.telemetry.pressure + rand(-0.05, 0.05)).toFixed(1)),
      waterLevel: Math.max(0, Number((node.telemetry.waterLevel + rand(-0.2, 0.2)).toFixed(1))),
      soilMoisture: Math.min(99, Math.max(5, Number((node.telemetry.soilMoisture + rand(-0.3, 0.3)).toFixed(1)))),
      vibration: Math.max(0.05, Number((node.telemetry.vibration + rand(-0.02, 0.02)).toFixed(2))),
    };

    return {
      ...node,
      telemetry: updatedTelemetry,
      health: {
        ...node.health,
        packetsReceived: node.health.packetsReceived + 1,
        lastUpdated: '12s ago (Pre-fed Grid)',
      },
    };
  });
}

export function createTrendPointFromNode(node: VillageNode): TelemetryHistoryPoint {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');

  return {
    timestamp: now.toISOString(),
    timeLabel: `${hour}:${min}`,
    temperature: node.telemetry.temperature,
    pressure: node.telemetry.pressure,
    waterLevel: node.telemetry.waterLevel,
    soilMoisture: node.telemetry.soilMoisture,
    vibration: node.telemetry.vibration,
  };
}

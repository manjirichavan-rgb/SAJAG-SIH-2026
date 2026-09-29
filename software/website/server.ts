import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_NODES, INITIAL_HISTORICAL_ALERTS, DEFAULT_SMS_RECIPIENTS } from './src/utils/mockNodes';
import { evaluateNodeRisk, evaluateVillageRisk } from './src/utils/edgeAi';
import { VillageNode, AlertRecord, SirenState, SmsDispatchState, SystemStatus, RiskLevel } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory application state
let nodes: VillageNode[] = JSON.parse(JSON.stringify(INITIAL_NODES));
let alerts: AlertRecord[] = JSON.parse(JSON.stringify(INITIAL_HISTORICAL_ALERTS));

let sirenState: SirenState = {
  status: 'INACTIVE',
  triggerMode: 'STANDBY',
  relayStatus: 'NORMAL',
  audioMuted: false,
};

let smsState: SmsDispatchState = {
  status: 'IDLE',
  recipients: JSON.parse(JSON.stringify(DEFAULT_SMS_RECIPIENTS)),
};

let systemStatus: SystemStatus = {
  edgeAiActive: true,
  edgeModelVersion: 'SAJAG-EdgeTinyML-v2.4',
  internetOnline: true,
  localNetworkActive: true,
  gatewayHost: 'PANCHAYAT-GW-NODE01.local (192.168.1.10)',
  lastHeartbeat: new Date().toISOString(),
};

// SSE Clients for real-time telemetry pushing
const sseClients: express.Response[] = [];

function broadcastUpdate(type: string, data: unknown) {
  const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(payload);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

// Background simulation for the PRE-FED nodes (NODE-02 to NODE-06)
// Keeps them updating realistically while NODE-01 remains dedicated to the physical prototype!
setInterval(() => {
  nodes = nodes.map((node) => {
    if (node.isPrototype) {
      // Prototype node only updates via real/tested telemetry
      return node;
    }

    // Micro-fluctuation for pre-fed simulated nodes (5 parameters only)
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const updatedTelemetry = {
      temperature: Number((node.telemetry.temperature + rand(-0.2, 0.2)).toFixed(1)),
      pressure: Number((node.telemetry.pressure + rand(-0.1, 0.1)).toFixed(1)),
      waterLevel: Math.max(0, Number((node.telemetry.waterLevel + rand(-0.3, 0.3)).toFixed(1))),
      soilMoisture: Math.min(99, Math.max(5, Number((node.telemetry.soilMoisture + rand(-0.4, 0.4)).toFixed(1)))),
      vibration: Math.max(0.05, Number((node.telemetry.vibration + rand(-0.02, 0.02)).toFixed(2))),
    };

    const nodeEval = evaluateNodeRisk(updatedTelemetry);

    return {
      ...node,
      status: nodeEval.risk,
      telemetry: updatedTelemetry,
      health: {
        ...node.health,
        packetsReceived: node.health.packetsReceived + 1,
        lastUpdated: '12s ago (Pre-fed Grid)',
      },
    };
  });

  broadcastUpdate('NODES_UPDATED', { nodes });
}, 7000);

// API ROUTES
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), edgeAiActive: true });
});

app.get('/api/status', (req, res) => {
  const villageEval = evaluateVillageRisk(nodes);
  res.json({
    nodes,
    villageEval,
    sirenState,
    smsState,
    systemStatus,
    activeAlerts: alerts.filter((a) => !a.acknowledged),
    historicalAlerts: alerts,
  });
});

app.get('/api/nodes', (req, res) => {
  res.json({ nodes });
});

app.get('/api/nodes/:id', (req, res) => {
  const node = nodes.find((n) => n.id.toLowerCase() === req.params.id.toLowerCase());
  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }
  res.json({ node });
});

// Primary Telemetry Ingestion Endpoint for Physical Prototype (or any node)
app.post(['/api/telemetry', '/api/nodes/prototype/telemetry'], (req, res) => {
  const payload = req.body || {};
  const targetNodeId = (payload.nodeId || 'NODE-01').toUpperCase();

  const nodeIndex = nodes.findIndex((n) => n.id === targetNodeId);
  if (nodeIndex === -1) {
    return res.status(404).json({ error: `Node ${targetNodeId} not configured in Gram Panchayat grid` });
  }

  const targetNode = nodes[nodeIndex];
  const oldRisk = targetNode.status;

  // Merge new telemetry parameters with defaults/existing (5 parameters only)
  const updatedTelemetry = {
    temperature: payload.temperature !== undefined ? Number(payload.temperature) : targetNode.telemetry.temperature,
    pressure: payload.pressure !== undefined ? Number(payload.pressure) : targetNode.telemetry.pressure,
    waterLevel: payload.waterLevel !== undefined ? Number(payload.waterLevel) : targetNode.telemetry.waterLevel,
    soilMoisture: payload.soilMoisture !== undefined ? Number(payload.soilMoisture) : targetNode.telemetry.soilMoisture,
    vibration: payload.vibration !== undefined ? Number(payload.vibration) : targetNode.telemetry.vibration,
  };

  // Evaluate Risk on Edge
  const nodeEval = evaluateNodeRisk(updatedTelemetry);

  const updatedNode: VillageNode = {
    ...targetNode,
    status: nodeEval.risk,
    telemetry: updatedTelemetry,
    health: {
      ...targetNode.health,
      batteryPercent: payload.battery !== undefined ? Number(payload.battery) : targetNode.health.batteryPercent,
      signalRssi: payload.signalRssi !== undefined ? Number(payload.signalRssi) : targetNode.health.signalRssi,
      lastUpdated: 'Just now (Physical Calibrator Live)',
      packetsReceived: targetNode.health.packetsReceived + 1,
    },
  };

  nodes[nodeIndex] = updatedNode;

  // Re-evaluate village-wide risk
  const villageEval = evaluateVillageRisk(nodes);

  // Trigger automated siren and SMS if risk level escalated to RISK
  if (nodeEval.risk === 'RISK') {
    sirenState = {
      status: 'ACTIVE',
      triggerMode: 'AUTO (Event-Triggered)',
      activatedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      lastEventTrigger: `Edge AI Trigger: ${nodeEval.factors[0]} at ${targetNode.name}`,
      relayStatus: 'ENERGIZED',
      audioMuted: sirenState.audioMuted,
    };

    smsState = {
      status: 'SENT',
      lastDispatchedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      incidentId: `INC-${Date.now().toString().slice(-6)}`,
      messageText: `[SAJAG ALERT - GRAM PANCHAYAT] RISK WARNING at ${targetNode.name}. ${nodeEval.factors.slice(0, 2).join('. ')}. Action required.`,
      recipients: smsState.recipients.map((r) => ({
        ...r,
        status: 'SENT',
        deliveryTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })),
      gatewayResponse: '200 OK (BSNL/Govt Push Gateway Ack: 5/5 Delivered)',
    };

    // Add alert record if newly escalated or not already logged
    if (oldRisk !== nodeEval.risk) {
      const newAlert: AlertRecord = {
        id: `ALT-${Date.now().toString().slice(-5)}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        nodeId: targetNode.id,
        nodeName: targetNode.name,
        severity: 'RISK',
        hazardType: nodeEval.hazards[0] || 'SYSTEM',
        title: `RISK: Threshold Exceeded at ${targetNode.name}`,
        description: nodeEval.factors.join('; '),
        acknowledged: false,
      };
      alerts.unshift(newAlert);
    }
  } else if (nodeEval.risk === 'SAFE' && oldRisk !== 'SAFE') {
    // If returned to safe, turn off auto siren
    if (sirenState.triggerMode.startsWith('AUTO')) {
      sirenState = {
        status: 'INACTIVE',
        triggerMode: 'STANDBY',
        relayStatus: 'NORMAL',
        audioMuted: sirenState.audioMuted,
      };
    }
  }

  // Push update to all SSE clients immediately
  broadcastUpdate('TELEMETRY_INGESTED', {
    node: updatedNode,
    villageEval,
    sirenState,
    smsState,
    alerts,
  });

  res.json({
    success: true,
    nodeId: targetNode.id,
    risk: nodeEval.risk,
    confidencePercent: nodeEval.confidence,
    factors: nodeEval.factors,
    sirenActive: sirenState.status === 'ACTIVE',
    smsDispatched: smsState.status === 'SENT',
    villageOverallRisk: villageEval.overallRisk,
  });
});

// Siren Controls
app.post('/api/siren/test', (req, res) => {
  sirenState = {
    status: 'ACTIVE',
    triggerMode: 'MANUAL OVERRIDE',
    activatedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
    lastEventTrigger: 'Manual Operator Diagnostic Drill Test',
    relayStatus: 'ENERGIZED',
    audioMuted: false,
  };
  broadcastUpdate('SIREN_UPDATE', { sirenState });
  res.json({ success: true, sirenState });
});

app.post('/api/siren/silence', (req, res) => {
  sirenState = {
    status: 'INACTIVE',
    triggerMode: 'STANDBY',
    relayStatus: 'NORMAL',
    audioMuted: false,
  };
  broadcastUpdate('SIREN_UPDATE', { sirenState });
  res.json({ success: true, sirenState });
});

app.post('/api/siren/toggle-audio', (req, res) => {
  sirenState.audioMuted = !sirenState.audioMuted;
  broadcastUpdate('SIREN_UPDATE', { sirenState });
  res.json({ success: true, sirenState });
});

// SMS Dispatch Controls
app.post('/api/sms/test', (req, res) => {
  smsState = {
    status: 'SENT',
    lastDispatchedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
    incidentId: `DRILL-${Date.now().toString().slice(-4)}`,
    messageText: '[SAJAG DRILL] Test transmission from Gram Panchayat Shivapur Early Warning Cell. System operational.',
    recipients: smsState.recipients.map((r) => ({
      ...r,
      status: 'SENT',
      deliveryTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    })),
    gatewayResponse: '200 OK (BSNL SMS Gateway: 5 delivered)',
  };
  broadcastUpdate('SMS_UPDATE', { smsState });
  res.json({ success: true, smsState });
});

// Acknowledge alert
app.post('/api/alerts/:id/ack', (req, res) => {
  const alert = alerts.find((a) => a.id === req.params.id);
  if (alert) {
    alert.acknowledged = true;
    broadcastUpdate('ALERT_ACKNOWLEDGED', { alertId: req.params.id, alerts });
    res.json({ success: true, alerts });
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

// Internet Status Toggle (Simulate WAN drop / Local Edge operation)
app.post('/api/system/toggle-internet', (req, res) => {
  systemStatus.internetOnline = !systemStatus.internetOnline;
  broadcastUpdate('SYSTEM_UPDATE', { systemStatus });
  res.json({ success: true, systemStatus });
});

// SSE endpoint for push updates
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial state
  const villageEval = evaluateVillageRisk(nodes);
  res.write(`data: ${JSON.stringify({
    type: 'INITIAL_STATE',
    data: {
      nodes,
      villageEval,
      sirenState,
      smsState,
      systemStatus,
      alerts,
    },
  })}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SAJAG] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

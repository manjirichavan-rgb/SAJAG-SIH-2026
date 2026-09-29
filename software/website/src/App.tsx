import React, { useState, useEffect, useRef } from 'react';
import {
  VillageNode,
  AlertRecord,
  SirenState,
  SmsDispatchState,
  SystemStatus,
  EdgeAiEvaluation,
  TelemetryHistoryPoint,
  SensorTelemetry,
} from './types';
import {
  INITIAL_NODES,
  INITIAL_HISTORICAL_ALERTS,
  DEFAULT_SMS_RECIPIENTS,
  generateInitialTrendData,
} from './utils/mockNodes';
import { evaluateNodeRisk, evaluateVillageRisk } from './utils/edgeAi';
import { sirenAudio } from './utils/sirenAudio';
import { simulatePreFedNodes, createTrendPointFromNode } from './utils/mockDataAdapter';

// 10 Major Components
import { Header } from './components/Header';
import { NodeMap } from './components/NodeMap'; // 1. NODE MAP
import { AllSensorReadings } from './components/AllSensorReadings'; // 2. ALL SENSOR READINGS
import { RiskAndAiConfidence } from './components/RiskAndAiConfidence'; // 3. RISK LEVEL & 4. AI CONFIDENCE
import { Trends } from './components/Trends'; // 5. TRENDS
import { NodeHealth } from './components/NodeHealth'; // 6. NODE HEALTH
import { AlertsPanel } from './components/AlertsPanel'; // 7. ALERTS
import { SirenAndSmsStatus } from './components/SirenAndSmsStatus'; // 8. SIREN STATUS & 9. SMS STATUS
import { HardwareIngestionModal } from './components/HardwareIngestionModal';

export default function App() {
  // Application State
  const [nodes, setNodes] = useState<VillageNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('NODE-01'); // Default to Physical Prototype
  const [alerts, setAlerts] = useState<AlertRecord[]>(INITIAL_HISTORICAL_ALERTS);
  const [historyPoints, setHistoryPoints] = useState<TelemetryHistoryPoint[]>(generateInitialTrendData());

  const [sirenState, setSirenState] = useState<SirenState>({
    status: 'INACTIVE',
    triggerMode: 'STANDBY',
    relayStatus: 'NORMAL',
    audioMuted: false,
  });

  const [smsState, setSmsState] = useState<SmsDispatchState>({
    status: 'IDLE',
    recipients: DEFAULT_SMS_RECIPIENTS,
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    edgeAiActive: true,
    edgeModelVersion: 'SAJAG-EdgeTinyML-v2.4',
    internetOnline: true,
    localNetworkActive: true,
    gatewayHost: 'PANCHAYAT-GW-NODE01.local (192.168.1.10)',
    lastHeartbeat: new Date().toISOString(),
  });

  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState<boolean>(false);

  // Derive Village-wide Edge AI Evaluation
  const villageEvaluation: EdgeAiEvaluation = evaluateVillageRisk(nodes);

  // Sync Siren Audio Synthesizer
  useEffect(() => {
    if (sirenState.status === 'ACTIVE' && !sirenState.audioMuted) {
      sirenAudio.play();
    } else {
      sirenAudio.stop();
    }
    return () => {
      sirenAudio.stop();
    };
  }, [sirenState.status, sirenState.audioMuted]);

  // Clean Mock Data Adapter: Periodically simulates ambient micro-fluctuations
  // on pre-fed grid nodes (NODE-02 through NODE-06) while leaving prototype NODE-01
  // dedicated for live triggers/calibrator input.
  useEffect(() => {
    // Micro-fluctuation timer for pre-fed nodes
    const simulationInterval = setInterval(() => {
      setNodes((prevNodes) => simulatePreFedNodes(prevNodes));
      setSystemStatus((prev) => ({
        ...prev,
        lastHeartbeat: new Date().toISOString(),
      }));
    }, 3500);

    // Periodic trends updater
    const trendsInterval = setInterval(() => {
      setNodes((currentNodes) => {
        const activeNode = currentNodes.find((n) => n.id === selectedNodeId) || currentNodes[0];
        if (activeNode) {
          const newPoint = createTrendPointFromNode(activeNode);
          setHistoryPoints((prev) => [...prev.slice(-24), newPoint]);
        }
        return currentNodes;
      });
    }, 15000);

    return () => {
      clearInterval(simulationInterval);
      clearInterval(trendsInterval);
    };
  }, [selectedNodeId]);

  // Handler for Updating Prototype Telemetry (via HTTP POST or local fallback)
  const handleUpdatePrototypeTelemetry = async (updatedFields: Partial<SensorTelemetry>) => {
    // 1. Optimistic / Local Edge update immediately for zero-latency response
    setNodes((prevNodes) => {
      const idx = prevNodes.findIndex((n) => n.isPrototype);
      if (idx === -1) return prevNodes;

      const target = prevNodes[idx];
      const mergedTelemetry: SensorTelemetry = {
        ...target.telemetry,
        ...updatedFields,
      };

      const evalResult = evaluateNodeRisk(mergedTelemetry);

      const updatedPrototype: VillageNode = {
        ...target,
        status: evalResult.risk,
        telemetry: mergedTelemetry,
        health: {
          ...target.health,
          lastUpdated: 'Just now (Live Physical Node Ingestion)',
          packetsReceived: target.health.packetsReceived + 1,
        },
      };

      const newNodes = [...prevNodes];
      newNodes[idx] = updatedPrototype;

      // Check for alert / siren / sms trigger immediately (Stage: RISK or WATCH)
      if (evalResult.risk === 'RISK') {
        setSirenState((prev) => ({
          status: 'ACTIVE',
          triggerMode: 'AUTO (Event-Triggered)',
          activatedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          lastEventTrigger: `Edge AI Trigger: ${evalResult.factors[0]} at ${target.name}`,
          relayStatus: 'ENERGIZED',
          audioMuted: prev.audioMuted,
        }));

        setSmsState((prev) => ({
          status: 'SENT',
          lastDispatchedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          incidentId: `INC-${Date.now().toString().slice(-6)}`,
          messageText: `[SAJAG ALERT] RISK detected at ${target.name}. ${evalResult.factors.slice(0, 2).join('. ')}. Urgent intervention requested.`,
          recipients: prev.recipients.map((r) => ({
            ...r,
            status: 'SENT',
            deliveryTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          })),
          gatewayResponse: '200 OK (BSNL Gateway Ack: 5/5 Delivered)',
        }));

        setAlerts((prevAlerts) => {
          const newAlert: AlertRecord = {
            id: `ALT-${Date.now().toString().slice(-5)}`,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
            nodeId: target.id,
            nodeName: target.name,
            severity: 'RISK',
            hazardType: evalResult.hazards[0] || 'FLOOD',
            title: `RISK: Threshold Exceeded at ${target.name}`,
            description: evalResult.factors.join('; '),
            acknowledged: false,
          };
          return [newAlert, ...prevAlerts];
        });
      } else if (evalResult.risk === 'WATCH') {
        setAlerts((prevAlerts) => {
          const newAlert: AlertRecord = {
            id: `ALT-${Date.now().toString().slice(-5)}`,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
            nodeId: target.id,
            nodeName: target.name,
            severity: 'WATCH',
            hazardType: evalResult.hazards[0] || 'FLOOD',
            title: `WATCH: Advisory Mark at ${target.name}`,
            description: evalResult.factors.join('; '),
            acknowledged: false,
          };
          return [newAlert, ...prevAlerts];
        });
      } else if (evalResult.risk === 'SAFE') {
        setSirenState((prev) => {
          if (prev.triggerMode.startsWith('AUTO')) {
            return {
              ...prev,
              status: 'INACTIVE',
              triggerMode: 'STANDBY',
              relayStatus: 'NORMAL',
            };
          }
          return prev;
        });
      }

      return newNodes;
    });
  };

  // Reset Prototype to Normal Baseline (5 Parameters)
  const handleResetPrototype = () => {
    handleUpdatePrototypeTelemetry({
      temperature: 29.8,
      pressure: 1012.4,
      waterLevel: 28.5,
      soilMoisture: 45.2,
      vibration: 0.35,
    });
  };

  // Siren Controls
  const handleTestSiren = () => {
    setSirenState({
      status: 'ACTIVE',
      triggerMode: 'MANUAL OVERRIDE',
      activatedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      lastEventTrigger: 'Manual Operator Diagnostic Drill Test',
      relayStatus: 'ENERGIZED',
      audioMuted: false,
    });
  };

  const handleSilenceSiren = () => {
    setSirenState({
      status: 'INACTIVE',
      triggerMode: 'STANDBY',
      relayStatus: 'NORMAL',
      audioMuted: false,
    });
  };

  const handleToggleSirenAudio = () => {
    setSirenState((prev) => ({
      ...prev,
      audioMuted: !prev.audioMuted,
    }));
  };

  // SMS Test
  const handleTestSms = () => {
    setSmsState((prev) => ({
      ...prev,
      status: 'SENT',
      lastDispatchedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      incidentId: `DRILL-${Date.now().toString().slice(-4)}`,
      messageText: '[SAJAG DRILL] Test alert from Gram Panchayat Shivapur Early Warning Cell. System operational.',
      recipients: prev.recipients.map((r) => ({
        ...r,
        status: 'SENT',
        deliveryTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      })),
      gatewayResponse: '200 OK (BSNL Gateway Ack: 5/5 Delivered)',
    }));
  };

  // Acknowledge Alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  // Toggle Internet Offline / Online Simulation
  const handleToggleInternet = () => {
    setSystemStatus((prev) => ({
      ...prev,
      internetOnline: !prev.internetOnline,
    }));
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const prototypeNode = nodes.find((n) => n.isPrototype) || nodes[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Official Government Portal Header with 10. LOCAL / OFFLINE STATUS */}
      <Header
        systemStatus={systemStatus}
        sirenState={sirenState}
        onToggleInternet={handleToggleInternet}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
      />

      {/* Main Dashboard Grid Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-5 lg:p-6 space-y-5">
        
        {/* TOP ROW: 1. NODE MAP */}
        <section id="section-node-map" aria-label="Village Node Map">
          <NodeMap
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
          />
        </section>

        {/* ROW 2: 3. RISK LEVEL & 4. AI CONFIDENCE */}
        <section id="section-risk-ai" aria-label="Risk Level and AI Confidence">
          <RiskAndAiConfidence
            evaluation={villageEvaluation}
            nodes={nodes}
          />
        </section>

        {/* ROW 3: 2. ALL SENSOR READINGS */}
        <section id="section-all-sensor-readings" aria-label="All Sensor Readings">
          <AllSensorReadings
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={(id) => setSelectedNodeId(id)}
          />
        </section>

        {/* ROW 4: 5. TRENDS */}
        <section id="section-trends" aria-label="Multi-Parameter Trends">
          <Trends
            historyPoints={historyPoints}
            selectedNodeId={selectedNode.id}
          />
        </section>

        {/* ROW 5: 6. NODE HEALTH */}
        <section id="section-node-health" aria-label="Node Health Diagnostics">
          <NodeHealth
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
          />
        </section>

        {/* ROW 6: 8. SIREN STATUS & 9. SMS STATUS */}
        <section id="section-siren-sms" aria-label="Siren and SMS Dispatch Status">
          <SirenAndSmsStatus
            sirenState={sirenState}
            smsState={smsState}
            onTestSiren={handleTestSiren}
            onSilenceSiren={handleSilenceSiren}
            onToggleAudio={handleToggleSirenAudio}
            onTestSms={handleTestSms}
          />
        </section>

        {/* ROW 7: 7. ALERTS */}
        <section id="section-alerts" aria-label="Hazard Alerts">
          <AlertsPanel
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
          />
        </section>

      </main>

      {/* Official Government Footer */}
      <footer className="w-full bg-[#0a192f] text-slate-400 text-xs border-t border-slate-700 py-4 px-4 sm:px-8 mt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              SAJAG (सजग) • Village Environmental Intelligence & Early Warning System
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Developed for Gram Panchayat Shivapur, Taluka Haveli, District Pune, Maharashtra.
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-center gap-3">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              Edge-AI TinyML v2.4
            </span>
            <span>Local Gateway Standalone Architecture</span>
            <span className="text-emerald-400 font-semibold">● Zero Cloud Dependency Mode Ready</span>
          </div>
        </div>
      </footer>

      {/* Hardware Prototype Ingestion & Physical Trigger Modal */}
      <HardwareIngestionModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        prototypeNode={prototypeNode}
        onUpdatePrototypeTelemetry={handleUpdatePrototypeTelemetry}
        onResetPrototype={handleResetPrototype}
      />

    </div>
  );
}

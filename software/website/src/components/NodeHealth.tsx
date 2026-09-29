import React from 'react';
import { VillageNode } from '../types';
import {
  Battery,
  BatteryCharging,
  Radio,
  Wifi,
  Clock,
  CheckCircle2,
  AlertCircle,
  HardDriveDownload,
  Bluetooth,
  BluetoothConnected,
} from 'lucide-react';

interface NodeHealthProps {
  nodes: VillageNode[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const NodeHealth: React.FC<NodeHealthProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
}) => {
  const getSignalBars = (rssi: number) => {
    if (rssi >= -60) return 4;
    if (rssi >= -75) return 3;
    if (rssi >= -88) return 2;
    return 1;
  };

  const getBatteryColor = (percent: number) => {
    if (percent > 60) return 'text-emerald-600';
    if (percent > 25) return 'text-amber-500';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            6. Node Health — Telemetry Network Diagnostics
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          6/6 Edge Nodes Operational (LoRaWAN &amp; Laptop Bluetooth BLE Protocol)
        </span>
      </div>

      {/* Node Health Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {nodes.map((node) => {
          const { health } = node;
          const isSelected = node.id === selectedNodeId;
          const signalBars = getSignalBars(health.signalRssi);

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-900 bg-blue-50/50 ring-1 ring-blue-900 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300'
              }`}
            >
              {/* Header row with Node ID, Prototype badge, Online status */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-sm text-slate-900">{node.id}</span>
                  {node.isPrototype && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-extrabold text-[9px] rounded uppercase animate-pulse">
                      ● LIVE PROTOTYPE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Node Name & Zone */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {node.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {node.zone}
                </div>
              </div>

              {/* Diagnostic Metrics Matrix */}
              <div className="space-y-2 text-xs">
                
                {/* Battery Metric */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Battery className={`w-3.5 h-3.5 ${getBatteryColor(health.batteryPercent)}`} />
                    <span className="text-[11px]">Power Supply:</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 flex items-center gap-1">
                    <span>{health.batteryPercent}%</span>
                    <span className="text-[10px] text-slate-500 font-normal">({health.batteryVoltage}V LiFePO4)</span>
                  </div>
                </div>

                {/* Signal RSSI & Link Quality */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Radio className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px]">Link Signal:</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="font-semibold text-slate-800">{health.signalRssi} dBm</span>
                    {/* Signal bars */}
                    <div className="flex items-end gap-0.5 h-3">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 rounded-xs ${
                            bar <= signalBars ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                          style={{ height: `${bar * 25}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Protocol & Packets */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Comm Protocol:</span>
                  <span className="font-mono text-slate-700 truncate max-w-[170px] text-right font-medium flex items-center gap-1 justify-end">
                    {node.isPrototype ? (
                      <>
                        <Bluetooth className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-900 font-semibold">Laptop BLE 5.2</span>
                      </>
                    ) : (
                      'LoRaWAN 868 MHz'
                    )}
                  </span>
                </div>

                {/* Prototype Bluetooth Status Callout */}
                {node.isPrototype && (
                  <div className="bg-blue-50/80 border border-blue-200/80 rounded px-2 py-1 flex items-center justify-between text-[10px]">
                    <span className="text-blue-900 font-semibold flex items-center gap-1">
                      <BluetoothConnected className="w-3 h-3 text-blue-600" />
                      Edge AI BLE Link:
                    </span>
                    <span className="font-mono font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-blue-200">
                      CONNECTED (-58 dBm)
                    </span>
                  </div>
                )}

                {/* Packet Delivery / Loss */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Packet Rx / Loss:</span>
                  <span className="font-mono text-slate-700">
                    {health.packetsReceived.toLocaleString()} <span className="text-emerald-700 font-semibold">({health.packetLossPercent}% loss)</span>
                  </span>
                </div>

                {/* Last Update */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Heartbeat:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {health.lastUpdated}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

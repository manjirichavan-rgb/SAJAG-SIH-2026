import React from 'react';
import { VillageNode, RiskLevel } from '../types';
import {
  Thermometer,
  Gauge,
  Waves,
  Droplets,
  Activity,
  Layers,
  Radio,
} from 'lucide-react';

interface AllSensorReadingsProps {
  nodes: VillageNode[];
  selectedNode: VillageNode;
  onSelectNode: (nodeId: string) => void;
}

export const AllSensorReadings: React.FC<AllSensorReadingsProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
}) => {
  const { telemetry } = selectedNode;

  // 3-Stage status evaluations for each of the 5 parameters
  const getTempStatus = (val: number): { label: string; color: string; bar: string; stage: RiskLevel } => {
    if (val >= 45.0 || val <= 4.0) {
      return { label: 'RISK (EXTREME)', color: 'text-red-700 bg-red-50 border-red-200', bar: 'bg-red-600', stage: 'RISK' };
    }
    if (val >= 38.0) {
      return { label: 'WATCH (HIGH HEAT)', color: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'bg-amber-500', stage: 'WATCH' };
    }
    return { label: 'SAFE (NOMINAL)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-600', stage: 'SAFE' };
  };

  const getPressureStatus = (val: number): { label: string; color: string; bar: string; stage: RiskLevel } => {
    if (val < 975.0) {
      return { label: 'RISK (CYCLONIC DROP)', color: 'text-red-700 bg-red-50 border-red-200', bar: 'bg-red-600', stage: 'RISK' };
    }
    if (val < 995.0 || val > 1030.0) {
      return { label: 'WATCH (UNSTABLE)', color: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'bg-amber-500', stage: 'WATCH' };
    }
    return { label: 'SAFE (STABLE)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-600', stage: 'SAFE' };
  };

  const getWaterStatus = (val: number): { label: string; color: string; bar: string; stage: RiskLevel } => {
    if (val >= 80.0) {
      return { label: 'RISK (OVERFLOW BREACH)', color: 'text-red-700 bg-red-50 border-red-200', bar: 'bg-red-600', stage: 'RISK' };
    }
    if (val >= 50.0) {
      return { label: 'WATCH (ELEVATED FLOW)', color: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'bg-amber-500', stage: 'WATCH' };
    }
    return { label: 'SAFE (NORMAL BED)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-600', stage: 'SAFE' };
  };

  const getSoilMoistureStatus = (val: number): { label: string; color: string; bar: string; stage: RiskLevel } => {
    if (val >= 85.0 || val <= 10.0) {
      return { label: 'RISK (SATURATION/ARID)', color: 'text-red-700 bg-red-50 border-red-200', bar: 'bg-red-600', stage: 'RISK' };
    }
    if (val >= 70.0) {
      return { label: 'WATCH (HIGH RUNOFF)', color: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'bg-amber-500', stage: 'WATCH' };
    }
    return { label: 'SAFE (OPTIMAL SOIL)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-600', stage: 'SAFE' };
  };

  const getVibrationStatus = (val: number): { label: string; color: string; bar: string; stage: RiskLevel } => {
    if (val >= 5.0) {
      return { label: 'RISK (SEISMIC/DEBRIS)', color: 'text-red-700 bg-red-50 border-red-200', bar: 'bg-red-600', stage: 'RISK' };
    }
    if (val >= 2.0) {
      return { label: 'WATCH (ELEVATED)', color: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'bg-amber-500', stage: 'WATCH' };
    }
    return { label: 'SAFE (STABLE GROUND)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-600', stage: 'SAFE' };
  };

  const tempStat = getTempStatus(telemetry.temperature);
  const pressureStat = getPressureStatus(telemetry.pressure);
  const waterStat = getWaterStatus(telemetry.waterLevel);
  const soilStat = getSoilMoistureStatus(telemetry.soilMoisture);
  const vibrationStat = getVibrationStatus(telemetry.vibration);

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            2. Sensor Readings — Parametric Telemetry
          </h2>
          <span className="text-xs text-slate-500">
            (Active Inspection: <span className="font-mono font-bold text-slate-800">{selectedNode.id}</span> — {selectedNode.name})
          </span>
        </div>

        {/* Node Mode Indicator */}
        <div>
          {selectedNode.isPrototype ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-400 text-xs font-bold animate-pulse">
              <Radio className="w-3.5 h-3.5 text-amber-700" />
              PHYSICAL HARDWARE NODE (CALIBRATOR TARGET)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium">
              PRE-FED GRID NODE (ACTIVE SENSOR TELEMETRY)
            </span>
          )}
        </div>
      </div>

      {/* Primary Telemetry Grid: EXACTLY the 5 parameters + 1 node channel card */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* PARAMETER 1: Ambient Temperature */}
        <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                Temperature (temp)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {telemetry.temperature.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-600">°C</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tempStat.color}`}>
              {tempStat.label}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
              <span>0°C</span>
              <span>Watch 38°C</span>
              <span>Risk 45°C</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${tempStat.bar}`}
                style={{ width: `${Math.min(100, Math.max(5, (telemetry.temperature / 55) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* PARAMETER 2: Barometric Pressure */}
        <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                Barometric Pressure (pressure)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {telemetry.pressure.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-600">hPa</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pressureStat.color}`}>
              {pressureStat.label}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
              <span>Risk &lt;975</span>
              <span>Watch 995</span>
              <span>Safe 1013</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${pressureStat.bar}`}
                style={{ width: `${Math.min(100, Math.max(5, ((telemetry.pressure - 950) / 100) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* PARAMETER 3: Water Level */}
        <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-blue-600" />
                Water Level (water level)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {telemetry.waterLevel.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-600">cm</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${waterStat.color}`}>
              {waterStat.label}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
              <span>Safe 0-50cm</span>
              <span>Watch 50cm</span>
              <span>Risk 80cm</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${waterStat.bar}`}
                style={{ width: `${Math.min(100, (telemetry.waterLevel / 120) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* PARAMETER 4: Soil Moisture */}
        <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-teal-600" />
                Soil Moisture (soil moisture)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {telemetry.soilMoisture.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-600">%</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${soilStat.color}`}>
              {soilStat.label}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
              <span>Safe 20-70%</span>
              <span>Watch 70%</span>
              <span>Risk 85%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${soilStat.bar}`}
                style={{ width: `${Math.min(100, telemetry.soilMoisture)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* PARAMETER 5: Vibration */}
        <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                Vibration (vibration)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {telemetry.vibration.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-600">mm/s</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${vibrationStat.color}`}>
              {vibrationStat.label}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
              <span>Safe &lt;2.0</span>
              <span>Watch 2.0</span>
              <span>Risk 5.0</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${vibrationStat.bar}`}
                style={{ width: `${Math.min(100, (telemetry.vibration / 8.0) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* NODE INGESTION CHANNEL CARD */}
        <div className="bg-[#0f284e] text-white p-3.5 rounded border border-slate-700 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-mono font-bold flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              Node Ingestion Channel
            </div>
            <div className="mt-1 font-mono text-base font-bold text-white">
              {selectedNode.id}
            </div>
            <div className="text-xs text-slate-300 truncate">
              {selectedNode.health.commProtocol}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-600/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">Stage Status:</span>
            <span
              className={`font-mono px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                selectedNode.status === 'SAFE'
                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/50'
                  : selectedNode.status === 'WATCH'
                  ? 'bg-amber-900/80 text-amber-300 border border-amber-500/50'
                  : 'bg-red-900/80 text-red-300 border border-red-500/50'
              }`}
            >
              {selectedNode.status}
            </span>
          </div>
        </div>

      </div>

      {/* SUB-SECTION: Village-Wide Node Comparison Matrix (5 Parameters Only + 3 Stages) */}
      <div className="border-t border-slate-200">
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Village-Wide Node Parameter Comparison Matrix (5 Physical Parameters)
          </span>
          <span className="text-[11px] text-slate-500">
            Click any row to switch active telemetry view
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <th className="py-2.5 px-3">Node Identifier &amp; Type</th>
                <th className="py-2.5 px-3">Zone / Location</th>
                <th className="py-2.5 px-3 text-right">Temp (°C)</th>
                <th className="py-2.5 px-3 text-right">Pressure (hPa)</th>
                <th className="py-2.5 px-3 text-right">Water Level (cm)</th>
                <th className="py-2.5 px-3 text-right">Soil Moisture (%)</th>
                <th className="py-2.5 px-3 text-right">Vibration (mm/s)</th>
                <th className="py-2.5 px-3 text-center">Stage (3 Stages)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {nodes.map((node) => {
                const isCurrent = node.id === selectedNode.id;
                return (
                  <tr
                    key={node.id}
                    onClick={() => onSelectNode(node.id)}
                    className={`cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-blue-50/80 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{node.id}</span>
                        {node.isPrototype ? (
                          <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-extrabold text-[9px] rounded uppercase animate-pulse">
                            ● PHYSICAL NODE
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">
                            (Grid Node)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      <div className="font-medium text-slate-900">{node.name}</div>
                      <div className="text-[10px] text-slate-500">{node.zone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={node.telemetry.temperature >= 38 ? 'font-bold text-amber-700' : 'text-slate-800'}>
                        {node.telemetry.temperature.toFixed(1)}°C
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={node.telemetry.pressure < 995 ? 'font-bold text-amber-700' : 'text-slate-800'}>
                        {node.telemetry.pressure.toFixed(1)} hPa
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={node.telemetry.waterLevel >= 80 ? 'font-bold text-red-600' : node.telemetry.waterLevel >= 50 ? 'font-bold text-amber-700' : 'text-slate-800'}>
                        {node.telemetry.waterLevel.toFixed(1)} cm
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={node.telemetry.soilMoisture >= 85 ? 'font-bold text-red-600' : node.telemetry.soilMoisture >= 70 ? 'font-bold text-amber-700' : 'text-slate-800'}>
                        {node.telemetry.soilMoisture.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={node.telemetry.vibration >= 5.0 ? 'font-bold text-red-600' : node.telemetry.vibration >= 2.0 ? 'font-bold text-amber-700' : 'text-slate-800'}>
                        {node.telemetry.vibration.toFixed(2)} mm/s
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          node.status === 'SAFE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : node.status === 'WATCH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800 animate-pulse'
                        }`}
                      >
                        {node.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

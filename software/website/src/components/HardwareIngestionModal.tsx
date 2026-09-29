import React from 'react';
import { SensorTelemetry, VillageNode, RiskLevel } from '../types';
import {
  Sliders,
  RotateCcw,
  Waves,
  Thermometer,
  Gauge,
  Droplets,
  Activity,
  X,
} from 'lucide-react';

interface HardwareIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prototypeNode: VillageNode;
  onUpdatePrototypeTelemetry: (telemetry: Partial<SensorTelemetry>) => void;
  onResetPrototype: () => void;
}

export const HardwareIngestionModal: React.FC<HardwareIngestionModalProps> = ({
  isOpen,
  onClose,
  prototypeNode,
  onUpdatePrototypeTelemetry,
  onResetPrototype,
}) => {
  // Current prototype values for calibrator slider adjustments
  const current = prototypeNode.telemetry;

  if (!isOpen) return null;

  // Helper to determine stage for each parameter
  const getTempStage = (temp: number): RiskLevel => {
    if (temp >= 45 || temp <= 4) return 'RISK';
    if (temp >= 38) return 'WATCH';
    return 'SAFE';
  };

  const getPressureStage = (pressure: number): RiskLevel => {
    if (pressure < 975) return 'RISK';
    if (pressure < 995 || pressure > 1030) return 'WATCH';
    return 'SAFE';
  };

  const getWaterStage = (water: number): RiskLevel => {
    if (water >= 80) return 'RISK';
    if (water >= 50) return 'WATCH';
    return 'SAFE';
  };

  const getSoilStage = (soil: number): RiskLevel => {
    if (soil >= 85 || soil <= 10) return 'RISK';
    if (soil >= 70) return 'WATCH';
    return 'SAFE';
  };

  const getVibrationStage = (vib: number): RiskLevel => {
    if (vib >= 5.0) return 'RISK';
    if (vib >= 2.0) return 'WATCH';
    return 'SAFE';
  };

  const getStageBadge = (stage: RiskLevel) => {
    switch (stage) {
      case 'RISK':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'WATCH':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'SAFE':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="bg-[#0f284e] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-500 text-slate-950 shadow-xs">
              <Sliders className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                Physical Trigger Calibrator
              </h3>
              <p className="text-[11px] text-slate-300">
                Direct Telemetry Calibration &amp; Threshold Testing for Physical Node (NODE-01)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Physical Trigger Calibrator */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Real-time Physical Sensor Calibration: </span>
              Calibrate the 5 parameters below. Sliding values into <span className="font-bold text-amber-800 bg-amber-100 px-1 py-0.5 rounded">WATCH</span> or <span className="font-bold text-red-800 bg-red-100 px-1 py-0.5 rounded">RISK</span> immediately evaluates the 3-stage hazard level across the dashboard.
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded border border-blue-300 text-slate-800 shadow-xs">
              <span>Current Stage:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${getStageBadge(prototypeNode.status)}`}>
                {prototypeNode.status}
              </span>
            </div>
          </div>

          {/* Instant 1-Click Hazard Calibrations */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              1-Click Physical Hazard Calibrations:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdatePrototypeTelemetry({
                    waterLevel: 94.0,
                    soilMoisture: 88.0,
                    pressure: 988.0,
                  });
                }}
                className="p-2.5 rounded bg-red-50 hover:bg-red-100 border border-red-300 text-left text-xs transition-all shadow-xs"
              >
                <div className="flex items-center gap-1 font-bold text-red-700">
                  <Waves className="w-3.5 h-3.5" />
                  <span>Flash Flood Stage</span>
                </div>
                <div className="text-[10px] text-red-600 mt-1">Water 94cm + Moisture 88% (RISK)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdatePrototypeTelemetry({
                    vibration: 6.8,
                    soilMoisture: 86.0,
                  });
                }}
                className="p-2.5 rounded bg-orange-50 hover:bg-orange-100 border border-orange-300 text-left text-xs transition-all shadow-xs"
              >
                <div className="flex items-center gap-1 font-bold text-orange-700">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Seismic / Ground Risk</span>
                </div>
                <div className="text-[10px] text-orange-600 mt-1">Vibration 6.8 mm/s (RISK)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdatePrototypeTelemetry({
                    temperature: 46.5,
                    pressure: 972.0,
                  });
                }}
                className="p-2.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 text-left text-xs transition-all shadow-xs"
              >
                <div className="flex items-center gap-1 font-bold text-amber-800">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Heat / Storm Drop</span>
                </div>
                <div className="text-[10px] text-amber-700 mt-1">Temp 46.5°C + 972 hPa (RISK)</div>
              </button>

              <button
                type="button"
                onClick={onResetPrototype}
                className="p-2.5 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-left text-xs transition-all shadow-xs"
              >
                <div className="flex items-center gap-1 font-bold text-emerald-800">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Safe Nominal Baseline</span>
                </div>
                <div className="text-[10px] text-emerald-700 mt-1">Reset all 5 to SAFE</div>
              </button>
            </div>
          </div>

          {/* Physical Calibrator Sliders for the 5 parameters */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
            
            {/* 1. TEMPERATURE */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                  1. Ambient Temperature (temp)
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-mono ${getStageBadge(getTempStage(current.temperature))}`}>
                    {getTempStage(current.temperature)}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {current.temperature.toFixed(1)} °C
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="55"
                step="0.5"
                value={current.temperature}
                onChange={(e) => onUpdatePrototypeTelemetry({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span className="text-emerald-700 font-semibold">SAFE (15°C - 38°C)</span>
                <span className="text-amber-700 font-semibold">WATCH (38°C - 45°C)</span>
                <span className="text-red-700 font-bold">RISK (&ge; 45°C or &le; 4°C)</span>
              </div>
            </div>

            {/* 2. BAROMETRIC PRESSURE */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                  2. Barometric Pressure (pressure)
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-mono ${getStageBadge(getPressureStage(current.pressure))}`}>
                    {getPressureStage(current.pressure)}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {current.pressure.toFixed(1)} hPa
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="950"
                max="1050"
                step="0.5"
                value={current.pressure}
                onChange={(e) => onUpdatePrototypeTelemetry({ pressure: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span className="text-red-700 font-bold">RISK (&lt; 975 hPa Cyclonic Drop)</span>
                <span className="text-amber-700 font-semibold">WATCH (975 - 995 hPa)</span>
                <span className="text-emerald-700 font-semibold">SAFE (995 - 1025 hPa)</span>
              </div>
            </div>

            {/* 3. WATER LEVEL */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-blue-600" />
                  3. Water Level (water level)
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-mono ${getStageBadge(getWaterStage(current.waterLevel))}`}>
                    {getWaterStage(current.waterLevel)}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {current.waterLevel.toFixed(1)} cm
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="0.5"
                value={current.waterLevel}
                onChange={(e) => onUpdatePrototypeTelemetry({ waterLevel: parseFloat(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span className="text-emerald-700 font-semibold">SAFE (0 - 50 cm)</span>
                <span className="text-amber-700 font-semibold">WATCH (50 - 80 cm)</span>
                <span className="text-red-700 font-bold">RISK (&ge; 80 cm Overflow Breach)</span>
              </div>
            </div>

            {/* 4. SOIL MOISTURE */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-600" />
                  4. Soil Moisture (soil moisture)
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-mono ${getStageBadge(getSoilStage(current.soilMoisture))}`}>
                    {getSoilStage(current.soilMoisture)}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {current.soilMoisture.toFixed(1)} %
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={current.soilMoisture}
                onChange={(e) => onUpdatePrototypeTelemetry({ soilMoisture: parseFloat(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span className="text-emerald-700 font-semibold">SAFE (20% - 70%)</span>
                <span className="text-amber-700 font-semibold">WATCH (70% - 85%)</span>
                <span className="text-red-700 font-bold">RISK (&ge; 85% Saturation / &le; 10% Drought)</span>
              </div>
            </div>

            {/* 5. VIBRATION */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  5. Ground / Structural Vibration (vibration)
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-mono ${getStageBadge(getVibrationStage(current.vibration))}`}>
                    {getVibrationStage(current.vibration)}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {current.vibration.toFixed(2)} mm/s
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.05"
                value={current.vibration}
                onChange={(e) => onUpdatePrototypeTelemetry({ vibration: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span className="text-emerald-700 font-semibold">SAFE (0 - 2.0 mm/s)</span>
                <span className="text-amber-700 font-semibold">WATCH (2.0 - 5.0 mm/s)</span>
                <span className="text-red-700 font-bold">RISK (&ge; 5.0 mm/s Seismic / Debris)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Target Node: <span className="font-bold text-slate-800">NODE-01 (Physical Calibrator Target)</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded font-semibold transition-colors"
          >
            Close Calibrator
          </button>
        </div>

      </div>
    </div>
  );
};

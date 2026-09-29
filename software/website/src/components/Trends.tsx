import React, { useState } from 'react';
import { TelemetryHistoryPoint } from '../types';
import { LineChart, TrendingUp } from 'lucide-react';

interface TrendsProps {
  historyPoints: TelemetryHistoryPoint[];
  selectedNodeId: string;
}

type TrendMetric = 'temperature' | 'pressure' | 'waterLevel' | 'soilMoisture' | 'vibration';

export const Trends: React.FC<TrendsProps> = ({ historyPoints, selectedNodeId }) => {
  const [activeMetric, setActiveMetric] = useState<TrendMetric>('waterLevel');
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h'>('24h');

  const metricConfig: Record<
    TrendMetric,
    {
      label: string;
      unit: string;
      color: string;
      strokeColor: string;
      fillGradient: string;
      thresholdWatch?: number;
      thresholdRisk?: number;
      maxScale: number;
      minScale?: number;
    }
  > = {
    temperature: {
      label: 'Ambient Temperature (temp)',
      unit: '°C',
      color: 'text-orange-600',
      strokeColor: '#ea580c',
      fillGradient: '#fb923c',
      thresholdWatch: 38,
      thresholdRisk: 45,
      maxScale: 55,
      minScale: 0,
    },
    pressure: {
      label: 'Barometric Pressure (pressure)',
      unit: 'hPa',
      color: 'text-indigo-600',
      strokeColor: '#4f46e5',
      fillGradient: '#818cf8',
      thresholdWatch: 995,
      thresholdRisk: 975,
      maxScale: 1040,
      minScale: 950,
    },
    waterLevel: {
      label: 'Water Level (water level)',
      unit: 'cm',
      color: 'text-blue-600',
      strokeColor: '#2563eb',
      fillGradient: '#3b82f6',
      thresholdWatch: 50,
      thresholdRisk: 80,
      maxScale: 120,
      minScale: 0,
    },
    soilMoisture: {
      label: 'Soil Moisture (soil moisture)',
      unit: '%',
      color: 'text-teal-600',
      strokeColor: '#0d9488',
      fillGradient: '#2dd4bf',
      thresholdWatch: 70,
      thresholdRisk: 85,
      maxScale: 100,
      minScale: 0,
    },
    vibration: {
      label: 'Ground / Structural Vibration (vibration)',
      unit: 'mm/s',
      color: 'text-purple-600',
      strokeColor: '#9333ea',
      fillGradient: '#c084fc',
      thresholdWatch: 2.0,
      thresholdRisk: 5.0,
      maxScale: 8.0,
      minScale: 0,
    },
  };

  const currentCfg = metricConfig[activeMetric];

  // Filter history points based on timeframe
  const points = (() => {
    if (timeframe === '1h') return historyPoints.slice(-6);
    if (timeframe === '6h') return historyPoints.slice(-14);
    return historyPoints;
  })();

  const values = points.map((p) => p[activeMetric]);
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const currentVal = values.length > 0 ? values[values.length - 1] : 0;
  const avgVal = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  // Chart dimensions
  const width = 800;
  const height = 240;
  const paddingX = 45;
  const paddingY = 25;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const yBase = currentCfg.minScale ?? 0;
  const yMax = Math.max(currentCfg.maxScale, maxVal * 1.1);
  const ySpan = Math.max(1, yMax - yBase);

  const getY = (val: number) => {
    const norm = Math.min(1, Math.max(0, (val - yBase) / ySpan));
    return height - paddingY - norm * chartHeight;
  };

  const getX = (index: number) => {
    if (points.length <= 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (points.length - 1)) * chartWidth;
  };

  // Generate SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p[activeMetric]).toFixed(1)}`)
    .join(' ');

  const areaD = `${pathD} L ${getX(points.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            5. Trends — 5-Parameter Time-Series Telemetry
          </h2>
          <span className="text-xs text-slate-500">
            (Target: <span className="font-mono font-bold text-slate-800">{selectedNodeId}</span>)
          </span>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded text-xs font-semibold">
          {(['1h', '6h', '24h'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeframe === tf
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf === '1h' ? 'Last 1 Hr' : tf === '6h' ? 'Last 6 Hrs' : 'Last 24 Hrs'}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Metric Selector Tabs (ONLY 5 PARAMETERS) */}
      <div className="bg-slate-100/70 border-b border-slate-200 px-4 py-1.5 flex flex-wrap items-center gap-1.5 overflow-x-auto">
        {(Object.keys(metricConfig) as TrendMetric[]).map((metric) => {
          const cfg = metricConfig[metric];
          const isActive = activeMetric === metric;
          return (
            <button
              key={metric}
              type="button"
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#0f284e] text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {cfg.label.split(' ')[0]} ({cfg.unit})
            </button>
          );
        })}
      </div>

      {/* Metrics Stats Banner */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div>
          <span className="text-slate-500">Current Reading:</span>
          <div className="font-mono font-bold text-base text-slate-900">
            {currentVal.toFixed(activeMetric === 'vibration' ? 2 : 1)}{' '}
            <span className="text-xs font-normal text-slate-500">{currentCfg.unit}</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500">Minimum Recorded:</span>
          <div className="font-mono font-bold text-base text-slate-700">
            {minVal.toFixed(activeMetric === 'vibration' ? 2 : 1)}{' '}
            <span className="text-xs font-normal text-slate-500">{currentCfg.unit}</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500">Maximum Recorded:</span>
          <div className="font-mono font-bold text-base text-slate-900">
            {maxVal.toFixed(activeMetric === 'vibration' ? 2 : 1)}{' '}
            <span className="text-xs font-normal text-slate-500">{currentCfg.unit}</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500">Rolling Average:</span>
          <div className="font-mono font-bold text-base text-slate-700">
            {avgVal.toFixed(activeMetric === 'vibration' ? 2 : 1)}{' '}
            <span className="text-xs font-normal text-slate-500">{currentCfg.unit}</span>
          </div>
        </div>
      </div>

      {/* SVG Time-Series Chart with SAFE, WATCH, RISK Stages */}
      <div className="p-4 bg-white">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[260px] font-mono text-[10px]"
          >
            <defs>
              <linearGradient id={`grad-${activeMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={currentCfg.fillGradient} stopOpacity="0.25" />
                <stop offset="100%" stopColor={currentCfg.fillGradient} stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = height - paddingY - ratio * chartHeight;
              const val = (yBase + ratio * ySpan).toFixed(0);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <text x={paddingX - 8} y={y + 3} textAnchor="end" fill="#94a3b8">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Risk Threshold Line (3 Stages: Safe, Watch, Risk) */}
            {currentCfg.thresholdRisk && currentCfg.thresholdRisk <= yMax && currentCfg.thresholdRisk >= yBase && (
              <g>
                <line
                  x1={paddingX}
                  y1={getY(currentCfg.thresholdRisk)}
                  x2={width - paddingX}
                  y2={getY(currentCfg.thresholdRisk)}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x={width - paddingX}
                  y={getY(currentCfg.thresholdRisk) - 4}
                  textAnchor="end"
                  fill="#b91c1c"
                  fontWeight="bold"
                  fontSize="9"
                >
                  RISK STAGE ({currentCfg.thresholdRisk} {currentCfg.unit})
                </text>
              </g>
            )}

            {/* Watch Threshold Line */}
            {currentCfg.thresholdWatch && currentCfg.thresholdWatch <= yMax && currentCfg.thresholdWatch >= yBase && (
              <g>
                <line
                  x1={paddingX}
                  y1={getY(currentCfg.thresholdWatch)}
                  x2={width - paddingX}
                  y2={getY(currentCfg.thresholdWatch)}
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <text
                  x={width - paddingX}
                  y={getY(currentCfg.thresholdWatch) - 4}
                  textAnchor="end"
                  fill="#b45309"
                  fontWeight="bold"
                  fontSize="9"
                >
                  WATCH STAGE ({currentCfg.thresholdWatch} {currentCfg.unit})
                </text>
              </g>
            )}

            {/* Area fill */}
            <path d={areaD} fill={`url(#grad-${activeMetric})`} />

            {/* Main Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke={currentCfg.strokeColor}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Data point circles and timestamps */}
            {points.map((p, i) => {
              const x = getX(i);
              const y = getY(p[activeMetric]);
              const showLabel = i % Math.max(1, Math.floor(points.length / 6)) === 0 || i === points.length - 1;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#ffffff"
                    stroke={currentCfg.strokeColor}
                    strokeWidth="2"
                  />
                  {showLabel && (
                    <text
                      x={x}
                      y={height - paddingY + 16}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                    >
                      {p.timeLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

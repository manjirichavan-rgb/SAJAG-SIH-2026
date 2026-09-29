import React from 'react';
import { EdgeAiEvaluation, RiskLevel, VillageNode } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Cpu } from 'lucide-react';

interface RiskAndAiConfidenceProps {
  evaluation: EdgeAiEvaluation;
  nodes: VillageNode[];
}

export const RiskAndAiConfidence: React.FC<RiskAndAiConfidenceProps> = ({
  evaluation,
  nodes,
}) => {
  const primaryNode = nodes.find((n) => n.id === evaluation.primaryRiskNodeId) || nodes[0];

  const getRiskDetails = (risk: RiskLevel) => {
    switch (risk) {
      case 'RISK':
        return {
          title: 'RISK HAZARD ALERT',
          subtitle: 'Emergency thresholds breached. Warning siren protocol & Gram Panchayat rapid alert triggered.',
          bg: 'bg-red-700',
          border: 'border-red-800',
          badge: 'bg-red-100 text-red-900 border-red-300',
          icon: AlertOctagon,
          textColor: 'text-red-700',
          accent: 'red',
        };
      case 'WATCH':
        return {
          title: 'WATCH ADVISORY',
          subtitle: 'Elevated physical parameters detected. Continuous edge sensor telemetry correlation active.',
          bg: 'bg-amber-500',
          border: 'border-amber-600',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: AlertTriangle,
          textColor: 'text-amber-700',
          accent: 'amber',
        };
      case 'SAFE':
      default:
        return {
          title: 'SAFE ENVIRONMENTAL BASELINE',
          subtitle: 'All monitored micro-sectors operating within standard nominal tolerances across all 5 parameters.',
          bg: 'bg-emerald-700',
          border: 'border-emerald-800',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: ShieldCheck,
          textColor: 'text-emerald-700',
          accent: 'emerald',
        };
    }
  };

  const riskDetails = getRiskDetails(evaluation.overallRisk);
  const RiskIcon = riskDetails.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* 3. RISK LEVEL SECTION (Takes 6 cols) */}
      <div className="lg:col-span-6 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                3. Risk Level — 3-Stage Hazard Evaluation
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Gram Panchayat 5-Sensor Fusion
            </span>
          </div>

          {/* Big Risk Banner */}
          <div className="p-4">
            <div
              className={`p-4 rounded-md text-white flex items-start gap-3.5 shadow-xs transition-colors duration-300 ${riskDetails.bg}`}
            >
              <div className="p-2 rounded bg-white/15 backdrop-blur-xs flex-shrink-0">
                <RiskIcon className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-white/80">
                    Jurisdiction Assessment
                  </span>
                  <span className="text-xs font-mono font-bold bg-black/25 px-2 py-0.5 rounded text-white">
                    STAGE: {evaluation.overallRisk}
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight mt-0.5 font-sans">
                  {riskDetails.title}
                </h3>
                <p className="text-xs text-white/90 mt-1 leading-relaxed">
                  {riskDetails.subtitle}
                </p>
              </div>
            </div>

            {/* Visual Risk Stage Progression Bar (EXACTLY 3 STAGES: SAFE, WATCH, RISK) */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                Hazard Classification Ladder (3 Stages Only)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div
                  className={`py-2 rounded font-bold border transition-all ${
                    evaluation.overallRisk === 'SAFE'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  SAFE
                </div>
                <div
                  className={`py-2 rounded font-bold border transition-all ${
                    evaluation.overallRisk === 'WATCH'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  WATCH
                </div>
                <div
                  className={`py-2 rounded font-bold border transition-all ${
                    evaluation.overallRisk === 'RISK'
                      ? 'bg-red-600 text-white border-red-700 shadow-sm animate-pulse'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  RISK
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Contributing Node Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <span className="font-semibold text-slate-600">Primary Assessment Node:</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-bold text-slate-900">{primaryNode.id}</span>
            <span className="text-slate-500">({primaryNode.name.split('/')[0]})</span>
            {primaryNode.isPrototype && (
              <span className="px-1 bg-amber-400 text-slate-900 font-extrabold text-[9px] rounded">
                PHYSICAL
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. AI CONFIDENCE SECTION (Takes 6 cols) */}
      <div className="lg:col-span-6 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                4. AI Confidence &amp; 5-Parameter Evaluation
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <Cpu className="w-3 h-3 text-emerald-600" />
              <span>Edge Quantized INT8</span>
            </div>
          </div>

          {/* AI Metrics Block */}
          <div className="p-4">
            <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Model Decision Confidence
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono text-slate-900">
                    {evaluation.confidencePercent}%
                  </span>
                  <span className="text-xs text-slate-500">certainty index</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono">
                  Inference Latency: <span className="font-semibold text-slate-800">{evaluation.inferenceTimeMs} ms</span> (Local Gateway)
                </div>
              </div>

              {/* Circular Gauge Representation */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={evaluation.overallRisk === 'SAFE' ? 'text-emerald-600' : evaluation.overallRisk === 'WATCH' ? 'text-amber-500' : 'text-red-600'}
                    strokeDasharray={`${evaluation.confidencePercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-slate-800">
                  {Math.round(evaluation.confidencePercent)}%
                </span>
              </div>
            </div>

            {/* Contributing Physical Factors List */}
            <div className="mt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Physical Parameter Factors:</span>
                <span className="text-[10px] text-slate-500 font-normal">5-parameter cross-check</span>
              </div>

              <div className="space-y-1.5">
                {evaluation.contributingFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs bg-slate-50/80 p-2 rounded border border-slate-200/80 text-slate-800"
                  >
                    <span className="font-mono text-blue-900 font-bold text-[11px]">
                      0{index + 1}.
                    </span>
                    <span className="leading-tight">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary Banner at bottom */}
        <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 text-xs text-slate-700">
          <span className="font-semibold text-slate-900">Diagnosis Summary: </span>
          <span className="italic text-slate-800">{evaluation.summaryCondition}</span>
        </div>
      </div>

    </div>
  );
};

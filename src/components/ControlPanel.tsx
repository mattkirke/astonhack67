import { useMemo } from 'react';
import { Play, Pause, RotateCcw, Eye, EyeOff, Zap, Route, Leaf, Users, Clock, MapPin, TrendingUp } from 'lucide-react';
import type { SimulationState } from '@/types/simulation';
import { BUS_ROUTES, ASTON_CENSUS } from '@/data/astonData';

interface ControlPanelProps {
  state: SimulationState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;

  onToggleFlow: () => void;
  onToggleCorridors: () => void;

  onGenerateRoute: () => void;
  onClearRoutes: () => void;
}


function formatTime(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function StatRow({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-mono text-sm font-medium text-foreground">
        {value}{unit && <span className="text-muted-foreground ml-1 text-xs">{unit}</span>}
      </span>
    </div>
  );
}

export default function ControlPanel({
  state,
  onStart,
  onPause,
  onResume,
  onReset,
  onSetSpeed,
  onToggleFlow,
  onToggleCorridors,
  onGenerateRoute,
  onClearRoutes,
}: ControlPanelProps) {

  const {
    metrics,
    currentMinute,
    isRunning,
    isPaused,
    speed,
    generatedRoutes,
    selectedAgentId,
    agents,
  } = state;

  const { showFlow, showCorridors } = state as any;

  const selectedAgent = useMemo(() => {
    if (!selectedAgentId) return null;
    return agents.find(a => a.id === selectedAgentId) || null;
  }, [selectedAgentId, agents]);

  const { simStartMinute, simDurationMinutes } = state as any;

  const dayProgress = Math.max(
    0,
    Math.min(100, ((currentMinute - simStartMinute) / simDurationMinutes) * 100)
  );

  const analysis = (state as any).analysis as any | undefined;
  const baseline = analysis?.baseline ?? null;
  const proposal = analysis?.proposal ?? null;



  return (
    <div className="w-[380px] h-screen overflow-y-auto bg-sim-panel border-l border-sim-panel-border flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Aston Human Simulation Lab
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Agent-based transport simulation · Aston Ward, Birmingham
        </p>
      </div>

      {/* Time & Controls */}
      <div className="px-5 py-3 border-t border-sim-panel-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-2xl font-bold text-foreground">
              {formatTime(currentMinute)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {!isRunning ? (
              <button
                onClick={onStart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Play className="w-3.5 h-3.5" />
                Simulate
              </button>
            ) : isPaused ? (
              <button
                onClick={onResume}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Play className="w-3.5 h-3.5" />
                Resume
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <Pause className="w-3.5 h-3.5" />
                Pause
              </button>
            )}
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm hover:opacity-80 transition-opacity"
              title="Reset simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Day progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${dayProgress}%` }}
          />
        </div>

        {/* Speed controls */}
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Speed:</span>
          {[1, 2, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                speed === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Details */}
      <div className="px-5 py-3 border-t border-sim-panel-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Simulation Details
          </h2>
          <div className="flex items-center gap-2">
  <button
    onClick={onToggleFlow}
    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    title="Toggle demand (flow) lines"
  >
    {showFlow ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
    Demand
  </button>

  <button
    onClick={onToggleCorridors}
    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    title="Toggle generated corridors"
  >
    {showCorridors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
    Corridors
  </button>
</div>

        </div>

        <StatRow label="Total Agents" value={metrics.totalAgents} />
        <StatRow label="Active" value={metrics.activeAgents} />
        <StatRow label="Walking" value={metrics.walkingAgents} />
        <StatRow label="Waiting at Stop" value={metrics.waitingAgents} />
        <StatRow label="Riding Bus" value={metrics.ridingAgents} />
        <StatRow label="Arrived" value={metrics.arrivedAgents} />
        <StatRow label="Average Age" value={metrics.averageAge} unit="yrs" />

        <div className="mt-3">
          <span className="text-xs text-muted-foreground">Age Color Scale</span>
          <div className="age-gradient mt-1" />
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-muted-foreground font-mono">0</span>
            <span className="text-[10px] text-muted-foreground font-mono">90+</span>
          </div>
        </div>
      </div>

      {/* Travel Metrics */}
      <div className="px-5 py-3 border-t border-sim-panel-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          Travel Metrics
        </h2>
        <StatRow label="Avg Travel Time" value={metrics.averageTravelTime} unit="min" />
        <StatRow label="Avg Wait Time" value={metrics.averageWaitTime} unit="min" />
        <StatRow label="Total Distance" value={metrics.totalDistance} unit="km" />
        <StatRow label="Accessibility Coverage" value={`${metrics.accessibilityCoverage}%`} />
      </div>

      {/* Transit Optimization */}
      <div className="px-5 py-3 border-t border-sim-panel-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Route className="w-4 h-4 text-primary" />
          Transit Optimization
        </h2>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">Generate Routes</span>
          <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium text-foreground">Bus</span>
          <button
            onClick={onGenerateRoute}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Route className="w-3.5 h-3.5" />
            Generate
          </button>
        </div>

        <div className="space-y-1.5">
          {BUS_ROUTES.map(route => (
            <div key={route.id} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: route.color }} />
              <span className="text-muted-foreground">{route.name}</span>
            </div>
          ))}
          {generatedRoutes.map(route => (
            <div key={route.id} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: route.color }} />
              <span className="text-foreground">{route.name}</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-primary/20 text-primary">NEW</span>
            </div>
          ))}
          {generatedRoutes.length > 0 && (
            <button
              onClick={onClearRoutes}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors mt-1"
            >
              × Clear generated routes
            </button>
          )}
        </div>
      </div>

      {/* ✅ Step 9: Before vs After */}
      <div className="px-5 py-3 border-t border-sim-panel-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          Before vs After
        </h2>

        {!baseline ? (
          <div className="text-xs text-muted-foreground">
            Run the simulation to 12:00 to capture the baseline.
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground mb-2">Baseline (Before)</div>
            <StatRow label="Demand edges" value={baseline.edges} />
            <StatRow label="Total traversals" value={baseline.totalTraversals} />
            <StatRow label="Peak demand hour" value={`${baseline.peakHour}:00`} />
            <StatRow label="CO₂ emitted" value={baseline.totalCO2} unit="kg" />
          </>
        )}

        <div className="mt-4" />

        {!proposal ? (
          <div className="text-xs text-muted-foreground">
            Click <span className="text-foreground">Generate</span> to compute corridor coverage.
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground mb-2">Proposed Corridors (After)</div>
            <StatRow label="Routes generated" value={proposal.routesCount} />
            <StatRow label="Total route length" value={proposal.routeKm} unit="km" />
            <StatRow label="Demand captured" value={`${proposal.demandCapturedPct}%`} />
            <StatRow label="Captured traversals" value={proposal.demandCapturedTraversals} />
            <StatRow label="Efficiency" value={proposal.efficiency} unit="trav/km" />
          </>
        )}
      </div>

      {/* Carbon Emissions Analysis */}
      <div className="px-5 py-3 border-t border-sim-panel-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Leaf className="w-4 h-4 text-primary" />
          Carbon Emissions Analysis
        </h2>
        <StatRow label="Total CO₂ Emitted" value={metrics.totalCO2} unit="kg" />
        <StatRow label="CO₂ per Capita" value={metrics.co2PerCapita} unit="kg" />
        <StatRow label="CO₂ Saved vs Cars" value={metrics.co2Saved} unit="kg" />
        <StatRow label="Total Distance" value={metrics.totalDistance} unit="km" />
      </div>

      {/* Selected Agent Info */}
      {selectedAgent && (
        <div className="px-5 py-3 border-t border-primary/30 bg-primary/5">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            Selected Agent
          </h2>
          <StatRow label="ID" value={selectedAgent.id} />
          <StatRow label="Age" value={selectedAgent.age} unit="yrs" />
          <StatRow label="Group" value={selectedAgent.ageGroup} />
          <StatRow label="State" value={selectedAgent.state.replace(/_/g, ' ')} />
          <StatRow label="Walking" value={selectedAgent.walkingTime} unit="min" />
          <StatRow label="Waiting" value={selectedAgent.waitingTime} unit="min" />
          <StatRow label="Riding" value={selectedAgent.ridingTime} unit="min" />
          <StatRow label="CO₂" value={Math.round(selectedAgent.carbonEmitted * 1000) / 1000} unit="kg" />
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto px-5 py-3 border-t border-sim-panel-border">
        <div className="text-[10px] text-muted-foreground space-y-0.5">
          <p>Census 2021 · Population: {ASTON_CENSUS.totalPopulation.toLocaleString()} (modelled at {metrics.totalAgents} agents)</p>
          <p>Bus data: Transport for West Midlands</p>
          <p>Map: OpenStreetMap + CARTO Dark</p>
        </div>
      </div>
    </div>
  );
}

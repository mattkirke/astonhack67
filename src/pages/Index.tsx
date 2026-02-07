// src/pages/Index.tsx

import { useCallback, useEffect } from 'react';
import SimulationMap from '@/components/SimulationMap';
import ControlPanel from '@/components/ControlPanel';
import { useSimulation } from '@/hooks/useSimulation';

export default function Index() {
  const {
    state,
    start,
    pause,
    resume,
    reset,
    setSpeed,
    toggleCorridors,
    toggleFlow,
    selectAgent,
    clearGeneratedRoutes,
    generateFromFlow,
  } = useSimulation();

  // Auto-load TfWM stops on page load (optional)


  const handleGenerateRoute = useCallback(() => {
    generateFromFlow();
  }, [generateFromFlow]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex-1 relative">
        <SimulationMap
  agents={state.agents}
  vehicles={state.vehicles}
  showFlow={(state as any).showFlow}
  showCorridors={(state as any).showCorridors}
  generatedRoutes={state.generatedRoutes}
  selectedAgentId={state.selectedAgentId}
  onSelectAgent={selectAgent}
  baseRoutes={[]}
  stops={state.networkStops as any}
/>

      </div>

      <ControlPanel
        state={state as any}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onSetSpeed={setSpeed}
        onToggleFlow={toggleFlow}
        onToggleCorridors={toggleCorridors}
        onGenerateRoute={handleGenerateRoute}
        onClearRoutes={clearGeneratedRoutes}
      />
    </div>
  );
}

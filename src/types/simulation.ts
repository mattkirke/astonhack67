export type AgentState =
  | 'at_home'
  | 'walking_to_stop'
  | 'waiting'
  | 'riding'
  | 'walking_to_dest'
  | 'at_destination';

export interface ScheduleEntry {
  departureMinute: number;
  destination: [number, number];
  type: 'work' | 'education' | 'shopping' | 'social' | 'home';
  label: string;
}

export interface Agent {
  id: string;
  homeLocation: [number, number];
  currentLocation: [number, number];
  targetLocation: [number, number] | null;
  nearestStopId: string | null;
  destinationStopId: string | null;
  age: number;
  ageGroup: string;
  state: AgentState;
  schedule: ScheduleEntry[];
  currentScheduleIndex: number;
  carbonEmitted: number;
  totalTimeSpent: number;
  walkingTime: number;
  waitingTime: number;
  ridingTime: number;
  distanceTraveled: number;
  currentRouteId: string | null;
}

export interface BusStop {
  id: string;
  name: string;
  location: [number, number];
}

export interface BusRoute {
  id: string;
  name: string;
  stopIds: string[];
  frequency: number;
  vehicleCapacity: number;
  color: string;
  geometry: [number, number][];
}

export interface Vehicle {
  id: string;
  routeId: string;
  currentStopIndex: number;
  nextStopIndex: number;
  passengers: string[];
  capacity: number;
  position: [number, number];
  progress: number;
  direction: 1 | -1;
}

export interface SimulationMetrics {
  totalAgents: number;
  activeAgents: number;
  walkingAgents: number;
  waitingAgents: number;
  ridingAgents: number;
  arrivedAgents: number;
  averageTravelTime: number;
  averageWaitTime: number;
  totalCO2: number;
  co2PerCapita: number;
  co2Saved: number;
  totalDistance: number;
  averageAge: number;
  accessibilityCoverage: number;
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentMinute: number;
  speed: number;
  agents: Agent[];
  vehicles: Vehicle[];
  metrics: SimulationMetrics;
  generatedRoutes: BusRoute[];
  showRoutes: boolean;
  selectedAgentId: string | null;
}

// ✅ Make POI consistent with astonData.ts categories
export type POIType =
  | 'education'
  | 'employment'
  | 'retail'
  | 'healthcare'
  | 'social'
  | 'leisure'
  | 'religious'
  | 'transport';

export interface POI {
  id: string;
  name: string;
  location: [number, number];
  type: POIType;
}

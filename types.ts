export enum FlowRegime {
  Laminar = 'Laminar',
  Transition = 'Transición',
  Turbulent = 'Turbulento',
}

export interface ExperimentState {
  temperature: number; // Celsius
  valveOpenPercent: number; // 0-100
  diameterMm: number; // mm
  isPlaying: boolean;
}

export interface PhysicsResult {
  kinematicViscosity: number; // m^2/s
  velocity: number; // m/s
  flowRate: number; // m^3/s
  reynoldsNumber: number;
  regime: FlowRegime;
}

export interface MeasuredDataPoint {
  id: number;
  volumeMl: number;
  timeS: number;
  description: string;
  expectedRegime: FlowRegime;
}
export type EventType = 'study' | 'work' | 'training' | 'other';

export interface CareerEvent {
  id: string;
  type: EventType;
  title: string;
  institution?: string;
  startYear: number;
  endYear?: number;
  isCurrent?: boolean;
  description?: string;
}

export interface PathStep {
  type: 'job' | 'formation';
  title: string;
  provider?: string;
  duration_months: number;
  salary_min?: number;
  salary_max?: number;
  cost?: number;
  year_estimate?: number;
  description?: string;
}

export interface CareerPath {
  steps: PathStep[];
  market_insights: string;
  confidence_score: number;
}

export interface Objective {
  id: string;
  title: string;
  location: string;
  color: string;
  path?: CareerPath;
  isLoading?: boolean;
  isVisible: boolean;
}

export interface MarketInsight {
  topJobs: { title: string; demand: string; growth: string }[];
  salaryByCity: { city: string; min: number; max: number; avg: number }[];
  trendingFormations: { title: string; provider: string; relevance: string }[];
  summary: string;
}

export const OBJECTIVE_COLORS = [
  '#34d399', // vert neon
  '#a78bfa', // violet neon
  '#fb923c', // orange neon
  '#f472b6', // rose neon
  '#38bdf8', // bleu ciel
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  study: 'Études',
  work: 'Emploi',
  training: 'Formation',
  other: 'Autre',
};

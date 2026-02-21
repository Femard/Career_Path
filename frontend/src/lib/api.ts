import axios from 'axios';
import { CareerEvent, Objective, CareerPath, MarketInsight } from '@/types/career';

// Mettre à true pour tester l'UI sans backend
const USE_MOCK = false;

const api = axios.create({
  // En prod (Docker+Nginx), NEXT_PUBLIC_API_URL="" → URL relative (même origine)
  // En dev, fallback sur localhost:8000
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  timeout: 60000,
});

// --- Mock data ---

const mockPath = (objective: string, location: string): CareerPath => ({
  steps: [
    {
      type: 'job',
      title: 'Poste intermédiaire Junior',
      duration_months: 18,
      salary_min: 34000,
      salary_max: 42000,
      year_estimate: new Date().getFullYear() + 1,
      description: 'Première étape vers votre objectif',
    },
    {
      type: 'formation',
      title: `Formation spécialisée — ${objective}`,
      provider: 'OpenClassrooms / AFPA',
      duration_months: 6,
      cost: 4000,
      year_estimate: new Date().getFullYear() + 2,
      description: 'Formation certifiante reconnue',
    },
    {
      type: 'job',
      title: 'Poste Senior / Confirmé',
      duration_months: 24,
      salary_min: 48000,
      salary_max: 62000,
      year_estimate: new Date().getFullYear() + 3,
      description: 'Montée en responsabilité',
    },
    {
      type: 'job',
      title: objective,
      duration_months: 0,
      salary_min: 60000,
      salary_max: 85000,
      year_estimate: new Date().getFullYear() + 5,
      description: `Objectif atteint à ${location}`,
    },
  ],
  market_insights: `Le marché pour "${objective}" à ${location} est en forte croissance (+12% en 2025). La demande dépasse l'offre, ce qui favorise les candidats avec une expérience mixte terrain + formation.`,
  confidence_score: 0.81,
});

const mockMarket: MarketInsight = {
  topJobs: [
    { title: 'Ingénieur DevOps', demand: 'Très forte demande', growth: '+18%' },
    { title: 'Data Scientist', demand: 'Demande soutenue', growth: '+14%' },
    { title: 'Chef de projet IT', demand: 'Stable et croissant', growth: '+9%' },
    { title: 'Product Manager', demand: 'En forte hausse', growth: '+21%' },
    { title: 'Consultant Cloud', demand: 'Très recherché', growth: '+16%' },
  ],
  salaryByCity: [
    { city: 'Paris', min: 45000, avg: 62000, max: 90000 },
    { city: 'Lyon', min: 38000, avg: 52000, max: 72000 },
    { city: 'Bordeaux', min: 36000, avg: 48000, max: 68000 },
    { city: 'Toulouse', min: 37000, avg: 50000, max: 70000 },
    { city: 'Nantes', min: 35000, avg: 47000, max: 65000 },
  ],
  trendingFormations: [
    { title: 'MBA Management & Innovation', provider: 'HEC Paris Executive', relevance: 'Top pour transition vers management' },
    { title: 'Certification Cloud AWS / Azure', provider: 'Amazon / Microsoft', relevance: 'Indispensable en 2025' },
    { title: 'Executive Coach Professionnel', provider: 'ICF France', relevance: 'Complément leadership' },
  ],
  summary: 'Le marché français de l\'emploi est dynamique en 2025 avec une forte demande dans les métiers tech et hybrides. Les profils avec compétences transversales (tech + gestion) sont particulièrement valorisés, notamment à Paris et Lyon. Les salaires ont augmenté de 6% en moyenne cette année.',
};

// --- API functions ---

export const eventsApi = {
  list: async (): Promise<CareerEvent[]> => {
    if (USE_MOCK) return [];
    const { data } = await api.get('/api/events');
    return data;
  },
  create: async (event: Omit<CareerEvent, 'id'>): Promise<CareerEvent> => {
    if (USE_MOCK) return { ...event, id: crypto.randomUUID() };
    const { data } = await api.post('/api/events', event);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) return;
    await api.delete(`/api/events/${id}`);
  },
};

export const pathsApi = {
  generate: async (params: {
    career_history: CareerEvent[];
    objective_title: string;
    location: string;
  }): Promise<CareerPath> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1500)); // simule le délai IA
      return mockPath(params.objective_title, params.location);
    }
    const { data } = await api.post('/api/paths/generate', params);
    return data;
  },
};

export const marketApi = {
  insights: async (params: {
    career_history: CareerEvent[];
    objectives: Pick<Objective, 'title' | 'location'>[];
  }): Promise<MarketInsight> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 2000)); // simule le délai
      return mockMarket;
    }
    const { data } = await api.post('/api/market/insights', params);
    return data;
  },
};

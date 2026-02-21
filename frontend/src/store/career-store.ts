import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CareerEvent, Objective, MarketInsight, OBJECTIVE_COLORS } from '@/types/career';

interface CareerStore {
  events: CareerEvent[];
  objectives: Objective[];
  marketInsight: MarketInsight | null;
  isMarketLoading: boolean;
  activePanel: 'events' | 'objectives' | 'market';

  addEvent: (event: Omit<CareerEvent, 'id'>) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<CareerEvent>) => void;

  addObjective: (objective: Omit<Objective, 'id' | 'color' | 'isVisible'>) => void;
  removeObjective: (id: string) => void;
  setObjectivePath: (id: string, path: Objective['path']) => void;
  setObjectiveLoading: (id: string, loading: boolean) => void;
  toggleObjectiveVisibility: (id: string) => void;

  setMarketInsight: (insight: MarketInsight | null) => void;
  setMarketLoading: (loading: boolean) => void;
  setActivePanel: (panel: CareerStore['activePanel']) => void;
}

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      events: [],
      objectives: [],
      marketInsight: null,
      isMarketLoading: false,
      activePanel: 'events',

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: crypto.randomUUID() }].sort(
            (a, b) => a.startYear - b.startYear
          ),
        })),

      removeEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

      updateEvent: (id, updated) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updated } : e)),
        })),

      addObjective: (objective) => {
        const { objectives } = get();
        const color = OBJECTIVE_COLORS[objectives.length % OBJECTIVE_COLORS.length];
        set((state) => ({
          objectives: [
            ...state.objectives,
            { ...objective, id: crypto.randomUUID(), color, isVisible: true },
          ],
        }));
      },

      removeObjective: (id) =>
        set((state) => ({ objectives: state.objectives.filter((o) => o.id !== id) })),

      setObjectivePath: (id, path) =>
        set((state) => ({
          objectives: state.objectives.map((o) => (o.id === id ? { ...o, path } : o)),
        })),

      setObjectiveLoading: (id, isLoading) =>
        set((state) => ({
          objectives: state.objectives.map((o) =>
            o.id === id ? { ...o, isLoading } : o
          ),
        })),

      toggleObjectiveVisibility: (id) =>
        set((state) => ({
          objectives: state.objectives.map((o) =>
            o.id === id ? { ...o, isVisible: !o.isVisible } : o
          ),
        })),

      setMarketInsight: (marketInsight) => set({ marketInsight }),
      setMarketLoading: (isMarketLoading) => set({ isMarketLoading }),
      setActivePanel: (activePanel) => set({ activePanel }),
    }),
    { name: 'career-path-store' }
  )
);

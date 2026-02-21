'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCareerStore } from '@/store/career-store';
import { pathsApi } from '@/lib/api';

const FRENCH_CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux',
  'Nantes', 'Lille', 'Strasbourg', 'Rennes', 'Montpellier',
  'Nice', 'Grenoble', 'Remote France',
];

const OBJECTIVE_SUGGESTIONS = [
  'Manager', 'Directeur technique', 'Freelance', 'Boulanger',
  'Data Scientist', 'Entrepreneur', 'Architecte logiciel',
  'Chef de projet', 'Consultant', 'Médecin', 'Avocat',
];

export default function ObjectiveForm() {
  const { events, objectives, addObjective, setObjectivePath, setObjectiveLoading } = useCareerStore();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Paris');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Définissez un objectif'); return; }
    if (objectives.length >= 5) { setError('Maximum 5 objectifs simultanés'); return; }

    setError('');
    setIsLoading(true);
    addObjective({ title: title.trim(), location });
    // Get the objective we just added (last one)
    const updatedObjectives = useCareerStore.getState().objectives;
    const newObj = updatedObjectives[updatedObjectives.length - 1];

    if (newObj) {
      setObjectiveLoading(newObj.id, true);
      try {
        const path = await pathsApi.generate({
          career_history: events,
          objective_title: title.trim(),
          location,
        });
        setObjectivePath(newObj.id, path);
      } catch (err) {
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        setError(detail || 'Erreur de génération du chemin');
      } finally {
        setObjectiveLoading(newObj.id, false);
      }
    }

    setTitle('');
    setIsLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Objective title */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Manager, Boulanger, CTO..."
          list="objective-suggestions"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <datalist id="objective-suggestions">
          {OBJECTIVE_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      {/* Location */}
      <div>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
        >
          {FRENCH_CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <motion.div
              className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Génération du chemin IA...
          </>
        ) : (
          '✦ Définir cet objectif'
        )}
      </button>

      <p className="text-slate-600 text-xs text-center">
        L&apos;IA génère un chemin avec formations, salaires et étapes
      </p>
    </motion.form>
  );
}

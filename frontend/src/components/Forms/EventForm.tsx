'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCareerStore } from '@/store/career-store';
import { EventType, EVENT_TYPE_LABELS } from '@/types/career';

const currentYear = new Date().getFullYear();

const EVENT_TYPE_OPTIONS: { value: EventType; emoji: string }[] = [
  { value: 'study', emoji: '🎓' },
  { value: 'work', emoji: '💼' },
  { value: 'training', emoji: '📚' },
  { value: 'other', emoji: '⭐' },
];

export default function EventForm() {
  const { addEvent } = useCareerStore();
  const [type, setType] = useState<EventType>('study');
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [startYear, setStartYear] = useState(currentYear - 2);
  const [endYear, setEndYear] = useState<number | undefined>(currentYear);
  const [isCurrent, setIsCurrent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Le titre est requis'); return; }
    if (startYear > currentYear) { setError('L\'année de début invalide'); return; }

    addEvent({
      type,
      title: title.trim(),
      institution: institution.trim() || undefined,
      startYear,
      endYear: isCurrent ? undefined : endYear,
      isCurrent,
    });

    setTitle('');
    setInstitution('');
    setError('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Type selector */}
      <div className="grid grid-cols-4 gap-1">
        {EVENT_TYPE_OPTIONS.map(({ value, emoji }) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`flex flex-col items-center p-2 rounded-lg text-xs transition-all ${
              type === value
                ? 'bg-blue-500/20 border border-blue-500/60 text-blue-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <span className="text-base">{emoji}</span>
            <span className="mt-0.5">{EVENT_TYPE_LABELS[value]}</span>
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Baccalauréat S, Ingénieur chez..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Institution */}
      <div>
        <input
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Établissement / Entreprise (optionnel)"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Years */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            min={1950}
            max={currentYear}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <span className="text-slate-500 text-xs">→</span>
        <div className="flex-1">
          {isCurrent ? (
            <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-500 italic">
              Aujourd&apos;hui
            </div>
          ) : (
            <input
              type="number"
              value={endYear ?? currentYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              min={startYear}
              max={currentYear + 1}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          )}
        </div>
      </div>

      {/* Is current toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          onClick={() => setIsCurrent(!isCurrent)}
          className={`w-8 h-4 rounded-full transition-colors relative ${
            isCurrent ? 'bg-blue-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
              isCurrent ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </div>
        <span className="text-xs text-slate-400">Poste actuel</span>
      </label>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        + Ajouter l&apos;événement
      </button>
    </motion.form>
  );
}

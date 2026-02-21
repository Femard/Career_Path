'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCareerStore } from '@/store/career-store';

const TYPE_EMOJI: Record<string, string> = {
  study: '🎓',
  work: '💼',
  training: '📚',
  other: '⭐',
};

export default function EventList() {
  const { events, removeEvent } = useCareerStore();

  if (events.length === 0) {
    return (
      <p className="text-slate-600 text-xs text-center py-4">
        Aucun événement ajouté
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {events.map((event, i) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-2 bg-slate-800/60 rounded-lg px-3 py-2 group border border-slate-700/50"
          >
            <span className="text-sm mt-0.5">{TYPE_EMOJI[event.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{event.title}</p>
              {event.institution && (
                <p className="text-xs text-slate-500 truncate">{event.institution}</p>
              )}
              <p className="text-xs text-slate-600 font-mono">
                {event.startYear}
                {event.isCurrent ? ' → maintenant' : event.endYear ? ` → ${event.endYear}` : ''}
              </p>
            </div>
            <button
              onClick={() => removeEvent(event.id)}
              className="text-slate-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              title="Supprimer"
            >
              ✕
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

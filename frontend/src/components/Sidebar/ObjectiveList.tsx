'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCareerStore } from '@/store/career-store';

export default function ObjectiveList() {
  const { objectives, removeObjective, toggleObjectiveVisibility } = useCareerStore();

  if (objectives.length === 0) {
    return (
      <p className="text-slate-600 text-xs text-center py-4">
        Aucun objectif défini
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {objectives.map((obj) => (
          <motion.li
            key={obj.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-slate-800/60 rounded-lg px-3 py-2 border group"
            style={{ borderColor: obj.color + '40' }}
          >
            <div className="flex items-start gap-2">
              {/* Color dot + visibility toggle */}
              <button
                onClick={() => toggleObjectiveVisibility(obj.id)}
                className="mt-1 flex-shrink-0"
                title={obj.isVisible ? 'Masquer' : 'Afficher'}
              >
                <div
                  className="w-3 h-3 rounded-full transition-opacity"
                  style={{
                    backgroundColor: obj.color,
                    opacity: obj.isVisible ? 1 : 0.3,
                    boxShadow: obj.isVisible ? `0 0 8px ${obj.color}` : 'none',
                  }}
                />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium truncate" style={{ color: obj.color }}>
                    {obj.title}
                  </p>
                  {obj.isLoading && (
                    <motion.div
                      className="w-3 h-3 border border-current border-t-transparent rounded-full flex-shrink-0"
                      style={{ borderColor: obj.color }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
                <p className="text-xs text-slate-500">📍 {obj.location}</p>
                {obj.path && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    {obj.path.steps.length} étapes •{' '}
                    {Math.round(obj.path.confidence_score * 100)}% confiance
                  </p>
                )}
              </div>

              <button
                onClick={() => removeObjective(obj.id)}
                className="text-slate-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                title="Supprimer"
              >
                ✕
              </button>
            </div>

            {/* Steps preview */}
            {obj.path && obj.isVisible && (
              <div className="mt-2 ml-5 space-y-1">
                {obj.path.steps.slice(0, 3).map((step, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs text-slate-500">
                    <span>{step.type === 'formation' ? '🎓' : '💼'}</span>
                    <span className="truncate">{step.title}</span>
                    {step.salary_min && (
                      <span className="text-slate-600 flex-shrink-0">
                        {Math.round(step.salary_min / 1000)}k€
                      </span>
                    )}
                  </div>
                ))}
                {obj.path.steps.length > 3 && (
                  <p className="text-xs text-slate-600">
                    +{obj.path.steps.length - 3} étapes...
                  </p>
                )}
              </div>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

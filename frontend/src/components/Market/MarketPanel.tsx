'use client';

import { motion } from 'framer-motion';
import { useCareerStore } from '@/store/career-store';
import { marketApi } from '@/lib/api';
import SalaryChart from './SalaryChart';

export default function MarketPanel() {
  const { events, objectives, marketInsight, isMarketLoading, setMarketInsight, setMarketLoading } =
    useCareerStore();

  const handleAnalyze = async () => {
    setMarketLoading(true);
    try {
      const insight = await marketApi.insights({
        career_history: events,
        objectives: objectives.map((o) => ({ title: o.title, location: o.location })),
      });
      setMarketInsight(insight);
    } catch (err) {
      console.error('Market analysis error:', err);
    } finally {
      setMarketLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Trigger button */}
      <button
        onClick={handleAnalyze}
        disabled={isMarketLoading}
        className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isMarketLoading ? (
          <>
            <motion.div
              className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Analyse en cours...
          </>
        ) : (
          '🔍 Analyser le marché de l\'emploi'
        )}
      </button>

      {marketInsight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Summary */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
            <p className="text-xs text-violet-300 leading-relaxed">{marketInsight.summary}</p>
          </div>

          {/* Top jobs */}
          {marketInsight.topJobs?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">
                Métiers en demande
              </p>
              <ul className="space-y-1.5">
                {marketInsight.topJobs.map((job, i) => (
                  <li key={i} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                    <span className="text-xs font-mono text-emerald-400 w-4">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{job.title}</p>
                      <p className="text-xs text-slate-600">{job.demand}</p>
                    </div>
                    <span
                      className="text-xs text-emerald-400 font-mono flex-shrink-0"
                    >
                      {job.growth}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Salary chart */}
          {marketInsight.salaryByCity?.length > 0 && (
            <SalaryChart salaryData={marketInsight.salaryByCity} />
          )}

          {/* Trending formations */}
          {marketInsight.trendingFormations?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">
                Formations tendance 2025
              </p>
              <ul className="space-y-1.5">
                {marketInsight.trendingFormations.map((f, i) => (
                  <li
                    key={i}
                    className="bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/30"
                  >
                    <p className="text-xs text-white">{f.title}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{f.provider}</span>
                      <span className="text-xs text-violet-400">{f.relevance}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {!marketInsight && !isMarketLoading && (
        <p className="text-slate-600 text-xs text-center">
          Analysez le marché pour découvrir les tendances et nouvelles opportunités
        </p>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PathCanvas from '@/components/PathCanvas/PathCanvas';
import EventForm from '@/components/Forms/EventForm';
import ObjectiveForm from '@/components/Forms/ObjectiveForm';
import EventList from '@/components/Sidebar/EventList';
import ObjectiveList from '@/components/Sidebar/ObjectiveList';
import MarketPanel from '@/components/Market/MarketPanel';
import { useCareerStore } from '@/store/career-store';

type Tab = 'events' | 'objectives' | 'market';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'events', label: 'Parcours', emoji: '📍' },
  { id: 'objectives', label: 'Objectifs', emoji: '🎯' },
  { id: 'market', label: 'Marché', emoji: '📊' },
];

interface AiInfo {
  provider: 'claude' | 'ollama';
  model: string;
  base_url?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [aiInfo, setAiInfo] = useState<AiInfo | null>(null);
  const { events, objectives } = useCareerStore();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/config`)
      .then((r) => r.json())
      .then((data: AiInfo) => setAiInfo(data))
      .catch(() => {}); // backend offline → pas d'indicateur
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-[#0d1117] border-r border-slate-800/60">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-xs">🗺️</span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight">Career Path</h1>
          </div>
          <p className="text-xs text-slate-500">Visualisez et planifiez votre carrière</p>
        </div>

        {/* Stats bar */}
        <div className="px-5 py-3 flex gap-4 border-b border-slate-800/40">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">{events.length}</p>
            <p className="text-xs text-slate-600">événements</p>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-400">{objectives.length}</p>
            <p className="text-xs text-slate-600">objectifs</p>
          </div>
          {objectives.length > 0 && (
            <>
              <div className="w-px bg-slate-800" />
              <div className="text-center">
                <p className="text-lg font-bold text-violet-400">
                  {objectives.filter((o) => o.path).length}
                </p>
                <p className="text-xs text-slate-600">chemins IA</p>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800/60">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{tab.emoji} {tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <EventForm />
                  <div className="border-t border-slate-800/60 pt-3">
                    <p className="text-xs text-slate-600 uppercase tracking-wider font-mono mb-2">
                      Votre parcours
                    </p>
                    <EventList />
                  </div>
                </div>
              )}

              {activeTab === 'objectives' && (
                <div className="space-y-4">
                  <ObjectiveForm />
                  <div className="border-t border-slate-800/60 pt-3">
                    <p className="text-xs text-slate-600 uppercase tracking-wider font-mono mb-2">
                      Chemins définis
                    </p>
                    <ObjectiveList />
                  </div>
                </div>
              )}

              {activeTab === 'market' && <MarketPanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer — AI provider badge */}
        <div className="px-5 py-3 border-t border-slate-800/40 flex items-center justify-center gap-2">
          {aiInfo ? (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono ${
                aiInfo.provider === 'ollama'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {aiInfo.provider === 'ollama' ? `Ollama · ${aiInfo.model}` : `Claude · ${aiInfo.model}`}
            </span>
          ) : (
            <span className="text-xs text-slate-700">Mode démo</span>
          )}
        </div>
      </div>

      {/* Main canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-3 border-b border-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-slate-300">Frise chronologique</h2>
            {events.length > 0 && (
              <span className="text-xs text-slate-600 font-mono">
                {events[0]?.startYear} → {events[events.length - 1]?.isCurrent ? 'maintenant' : events[events.length - 1]?.endYear ?? events[events.length - 1]?.startYear}
              </span>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-0.5 bg-blue-400 rounded" />
              <span className="text-xs text-slate-500">Parcours</span>
            </div>
            {objectives.slice(0, 3).map((obj) => (
              <div key={obj.id} className="flex items-center gap-1.5">
                <div
                  className="w-8 h-0.5 rounded"
                  style={{
                    background: `repeating-linear-gradient(90deg, ${obj.color} 0, ${obj.color} 6px, transparent 6px, transparent 12px)`,
                  }}
                />
                <span className="text-xs text-slate-500 max-w-16 truncate">{obj.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-h-full flex items-center">
            <div className="w-full">
              <PathCanvas />
            </div>
          </div>
        </div>

        {/* Bottom info bar */}
        {events.length === 0 && (
          <div className="px-6 py-4 border-t border-slate-800/40">
            <div className="flex items-center gap-6 justify-center">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>1.</span>
                <span>Ajoutez vos événements dans l&apos;onglet <strong className="text-slate-500">Parcours</strong></span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>2.</span>
                <span>Définissez vos <strong className="text-slate-500">Objectifs</strong> avec l&apos;IA</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>3.</span>
                <span>Explorez le <strong className="text-slate-500">Marché</strong> de l&apos;emploi</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

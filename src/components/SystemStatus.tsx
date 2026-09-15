/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

export default function SystemStatus({ lang }: { lang: Language }) {
  const [isOpen, setIsOpen] = useState(true);
  const t = translations[lang].status;

  const isRtl = lang === 'ar';

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 w-60">
        
        {/* Toggle bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 bg-slate-950 flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-slate-400 border-b border-slate-900 cursor-pointer ${
            isRtl ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <div className={`flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.title}</span>
          </div>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Content list */}
        {isOpen && (
          <div className={`p-3 space-y-1.5 font-mono text-[9px] leading-tight ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="text-slate-300">{t.frontend}</span>
            </div>
            
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="text-slate-300">{t.lab}</span>
            </div>

            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
              <span className="text-slate-300">{t.github}</span>
            </div>

            <div className="border-t border-slate-900 mt-2 pt-1.5 text-[8px] text-slate-600 flex justify-between">
              <span>PING: 14ms</span>
              <span>USTHB — 2026</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

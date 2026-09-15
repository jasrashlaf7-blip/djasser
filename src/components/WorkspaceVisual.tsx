/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Code2, Smartphone } from 'lucide-react';

export default function WorkspaceVisual() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [terminalLine, setTerminalLine] = useState(0);

  const terminalOutputs = [
    '>>> import djasser_core',
    '>>> djasser_core.get_status()',
    '{"role": "builder", "location": "Algeria"}',
    '>>> djasser_core.run_prototype_engine()',
    '[SUCCESS] Queues, URLs, and Maps loaded.',
    '>>> status: active',
  ];

  // Animate terminal outputs
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalLine((prev) => (prev + 1) % terminalOutputs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg aspect-square bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl p-4 md:p-6 flex flex-col justify-between group">
      
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      
      {/* Glow Backdrops */}
      <div className="absolute top-10 right-10 w-44 h-44 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>
      <div className="absolute bottom-10 left-10 w-44 h-44 bg-violet-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-violet-500/10 transition-colors"></div>

      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-3.5 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">WIDGET_SANDBOX.sh</span>
      </div>

      {/* Middle Interactive Blueprint Canvas */}
      <div className="relative flex-1 flex items-center justify-center py-4 z-10">
        
        {/* Dynamic Connected Node Schematic */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* Animated path lines */}
          <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
          <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_12s_linear_infinite]" />
          <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_14s_linear_infinite]" />
          <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_16s_linear_infinite]" />
        </svg>

        {/* Nodes */}
        <div className="relative w-full h-full flex flex-wrap items-center justify-around p-4 gap-8">
          
          {/* Top Left: Terminal node */}
          <button 
            onMouseEnter={() => setActiveNode('terminal')}
            onMouseLeave={() => setActiveNode(null)}
            className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative z-20 cursor-pointer ${
              activeNode === 'terminal' 
                ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-105' 
                : 'bg-slate-950/80 border-slate-900 text-slate-400'
            }`}
          >
            <Terminal className={`w-5 h-5 ${activeNode === 'terminal' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span className="text-[8px] font-mono font-bold">PYTHON</span>
          </button>

          {/* Top Right: Android / Mobile node */}
          <button 
            onMouseEnter={() => setActiveNode('mobile')}
            onMouseLeave={() => setActiveNode(null)}
            className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative z-20 cursor-pointer ${
              activeNode === 'mobile' 
                ? 'bg-slate-900 border-violet-500 shadow-lg shadow-violet-500/20 scale-105' 
                : 'bg-slate-950/80 border-slate-900 text-slate-400'
            }`}
          >
            <Smartphone className={`w-5 h-5 ${activeNode === 'mobile' ? 'text-violet-400' : 'text-slate-500'}`} />
            <span className="text-[8px] font-mono font-bold">ANDROID</span>
          </button>

          {/* Center Hub */}
          <div className="absolute w-20 h-20 rounded-full border border-slate-800/80 flex items-center justify-center bg-slate-950/90 z-10 shadow-inner">
            <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-900/60 flex items-center justify-center animate-pulse">
              <Code2 className="w-7 h-7 text-cyan-400/80" />
            </div>
          </div>

          {/* Bottom Left: Security / Heuristics node */}
          <button 
            onMouseEnter={() => setActiveNode('security')}
            onMouseLeave={() => setActiveNode(null)}
            className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative z-20 cursor-pointer ${
              activeNode === 'security' 
                ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' 
                : 'bg-slate-950/80 border-slate-900 text-slate-400'
            }`}
          >
            <Shield className={`w-5 h-5 ${activeNode === 'security' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="text-[8px] font-mono font-bold">SECURE</span>
          </button>

          {/* Bottom Right: AI development node */}
          <button 
            onMouseEnter={() => setActiveNode('ai')}
            onMouseLeave={() => setActiveNode(null)}
            className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative z-20 cursor-pointer ${
              activeNode === 'ai' 
                ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/20 scale-105' 
                : 'bg-slate-950/80 border-slate-900 text-slate-400'
            }`}
          >
            <Cpu className={`w-5 h-5 ${activeNode === 'ai' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="text-[8px] font-mono font-bold">AI_COREG</span>
          </button>

        </div>

      </div>

      {/* Footer Animated Console */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 min-h-[90px] font-mono text-[10px] leading-relaxed text-slate-400 relative z-10">
        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 mb-2 text-[9px] text-slate-600">
          <span>DEBUG LOGS</span>
          <span className="animate-pulse">● LIVE</span>
        </div>
        <div className="space-y-0.5">
          {terminalOutputs.slice(0, terminalLine + 1).map((line, idx) => {
            const isCommand = line.startsWith('>>>');
            return (
              <div 
                key={idx} 
                className={`${isCommand ? 'text-cyan-400' : 'text-slate-300'} truncate`}
              >
                {line}
              </div>
            );
          })}
          <span className="inline-block w-1.5 h-3 bg-cyan-400/80 ml-0.5 animate-pulse"></span>
        </div>
      </div>

    </div>
  );
}

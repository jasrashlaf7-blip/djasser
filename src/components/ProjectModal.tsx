/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, ExternalLink, Github, Code, CheckCircle, HelpCircle } from 'lucide-react';
import { Project, Language } from '../types';
import { translations } from '../data/translations';

export default function ProjectModal({
  project,
  lang,
  onClose,
  onLaunchDemo,
}: {
  project: Project;
  lang: Language;
  onClose: () => void;
  onLaunchDemo: (id: string) => void;
}) {
  const isRtl = lang === 'ar';
  const pt = translations[lang].projects;

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'prototype':
        return {
          text: lang === 'ar' ? 'نموذج أولي' : lang === 'fr' ? 'Prototype' : 'Working Prototype',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'experimental':
        return {
          text: lang === 'ar' ? 'تجريبي' : lang === 'fr' ? 'Expérimental' : 'Experimental Concept',
          color: 'bg-violet-500/10 text-violet-400 border-violet-500/20 animate-pulse',
        };
      case 'development':
        return {
          text: lang === 'ar' ? 'قيد التطوير' : lang === 'fr' ? 'En cours de dév.' : 'Under Active Development',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        };
      default:
        return {
          text: lang === 'ar' ? 'فكرة / مفهوم' : lang === 'fr' ? 'Concept' : 'Conceptual Design',
          color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        };
    }
  };

  const badge = getStatusBadge(project.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-fade-in text-slate-200 z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header bar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950 sticky top-0 z-20 ${
          isRtl ? 'flex-row-reverse' : ''
        }`}>
          <div>
            <span className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded border ${badge.color}`}>
              {badge.text}
            </span>
            <h3 className="text-xl font-bold text-white mt-1.5 font-sans tracking-tight">
              {project.title[lang]}
            </h3>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 border border-slate-900 cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm leading-relaxed">
          
          {/* Tagline */}
          <p className={`text-slate-300 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>
            {project.description[lang]}
          </p>

          {/* Core Grid Matrix (Problem & Solution) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Problem card */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/80">
              <div className={`flex items-center gap-2 mb-2 text-red-400 font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
                <HelpCircle className="w-4.5 h-4.5 shrink-0" />
                <span className="text-xs uppercase tracking-wider font-mono">{pt.problemLabel}</span>
              </div>
              <p className={`text-slate-400 text-xs leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {project.problem[lang]}
              </p>
            </div>

            {/* Solution card */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/80">
              <div className={`flex items-center gap-2 mb-2 text-emerald-400 font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                <span className="text-xs uppercase tracking-wider font-mono">{pt.solutionLabel}</span>
              </div>
              <p className={`text-slate-400 text-xs leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {project.solution[lang]}
              </p>
            </div>
          </div>

          {/* Features list */}
          <div>
            <h4 className={`text-xs uppercase tracking-wider font-mono font-bold text-slate-400 mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              {pt.featuresLabel}
            </h4>
            <ul className="space-y-2">
              {project.features[lang].map((feature, idx) => (
                <li 
                  key={idx} 
                  className={`flex items-start gap-2 text-slate-300 text-xs leading-relaxed ${
                    isRtl ? 'flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack badges */}
          <div>
            <h4 className={`text-xs uppercase tracking-wider font-mono font-bold text-slate-400 mb-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
              {pt.techUsed}
            </h4>
            <div className={`flex flex-wrap gap-1.5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-1 text-[10px] font-mono font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Action button footer */}
        <div className={`px-6 py-4 border-t border-slate-900 bg-slate-950 sticky bottom-0 z-20 flex gap-3 ${
          isRtl ? 'flex-row-reverse' : 'flex-row'
        }`}>
          {/* Trigger Prototype click */}
          <button
            onClick={() => {
              onLaunchDemo(project.id);
            }}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-xl text-xs font-semibold font-sans tracking-tight transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/20"
          >
            <Code className="w-4 h-4" />
            {pt.prototype}
          </button>

          {/* GitHub redirect */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              {pt.github}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

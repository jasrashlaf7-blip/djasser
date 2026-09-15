/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Search, Globe, Home, Briefcase, Award, FolderHeart, Hammer, User, Mail, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface CommandItem {
  id: string;
  icon: any;
  label: string;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({
  lang,
  setLang,
  isOpen,
  setIsOpen,
  onNavigate,
  onOpenCv,
}: {
  lang: Language;
  setLang: (l: Language) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNavigate: (section: string) => void;
  onOpenCv: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang].cmdPalette;

  // Toggle state using global keys Ctrl+K and /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    { id: 'home', icon: Home, label: t.goHome, action: () => onNavigate('hero'), shortcut: 'H' },
    { id: 'about', icon: User, label: t.goAbout, action: () => onNavigate('about'), shortcut: 'A' },
    { id: 'skills', icon: Hammer, label: t.goSkills, action: () => onNavigate('skills'), shortcut: 'S' },
    { id: 'projects', icon: FolderHeart, label: t.goProjects, action: () => onNavigate('projects'), shortcut: 'P' },
    { id: 'lab', icon: Briefcase, label: t.goLab, action: () => onNavigate('lab'), shortcut: 'L' },
    { id: 'experience', icon: Briefcase, label: t.goExp, action: () => onNavigate('experience'), shortcut: 'E' },
    { id: 'achievements', icon: Award, label: t.goAch, action: () => onNavigate('achievement'), shortcut: 'G' },
    { id: 'contact', icon: Mail, label: t.goContact, action: () => onNavigate('contact'), shortcut: 'C' },
    { id: 'cv', icon: FileText, label: t.viewCv, action: () => { onOpenCv(); setIsOpen(false); }, shortcut: 'V' },
    { id: 'github', icon: ArrowRight, label: t.viewGithub, action: () => window.open('https://github.com/jasrashlaf7-blip/djasser', '_blank') },
    { id: 'lang-en', icon: Globe, label: t.switchEn, action: () => setLang('en') },
    { id: 'lang-ar', icon: Globe, label: t.switchAr, action: () => setLang('ar') },
    { id: 'lang-fr', icon: Globe, label: t.switchFr, action: () => setLang('fr') },
  ];

  const filtered = query.trim() === ''
    ? commands
    : commands.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          if (filtered[selectedIndex].id !== 'lang-en' && filtered[selectedIndex].id !== 'lang-ar' && filtered[selectedIndex].id !== 'lang-fr') {
            setIsOpen(false);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isOpen, selectedIndex, filtered]);

  if (!isOpen) return null;

  const isRtl = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Body */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in text-slate-200 z-10"
      >
        {/* Search Input bar */}
        <div className={`flex items-center gap-2 border-b border-slate-800 px-3.5 py-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t.placeholder}
            className={`w-full bg-transparent border-0 text-white placeholder-slate-600 focus:outline-none focus:ring-0 text-sm ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          />
          <span className="text-[10px] text-slate-600 font-mono bg-slate-900 border border-slate-800/80 px-1.5 py-0.5 rounded uppercase">
            ESC
          </span>
        </div>

        {/* Command Items list */}
        <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const IconComp = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    if (cmd.id !== 'lang-en' && cmd.id !== 'lang-ar' && cmd.id !== 'lang-fr') {
                      setIsOpen(false);
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    isRtl ? 'flex-row-reverse' : ''
                  } ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-800' 
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <div className={`flex items-center gap-2.5 min-w-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{cmd.label}</span>
                  </div>

                  {/* Actions & enter hints */}
                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <kbd className="hidden sm:inline-block text-[9px] text-slate-600 font-mono px-1 py-0.5 bg-slate-950 border border-slate-900 rounded uppercase">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <span className="text-[9px] text-slate-500 flex items-center gap-0.5 font-mono">
                        <CornerDownLeft className="w-2.5 h-2.5" />
                        Enter
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-6 text-slate-600 text-xs italic">
              {t.noResults}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className={`bg-slate-950 border-t border-slate-900 px-3 py-2 text-[10px] text-slate-600 flex justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span>{t.hint}</span>
          <span className="font-mono">Ctrl+K / /</span>
        </div>
      </div>
    </div>
  );
}

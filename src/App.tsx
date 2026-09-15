/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Menu, X, Globe, Search, Terminal, Award, Briefcase, 
  BookOpen, ChevronRight, MessageSquare, ExternalLink, 
  ArrowUpRight, Heart, Sparkles, Code, CheckCircle, Mail, Phone, MapPin, User, FileText 
} from 'lucide-react';

import { Language, Project } from './types';
import { translations } from './data/translations';
import { projectsData, experienceData, educationData } from './data/portfolioData';

// Import Prototypes
import QueuePilot from './components/prototypes/QueuePilot';
import LinkLens from './components/prototypes/LinkLens';
import LostLoop from './components/prototypes/LostLoop';
import FixNow from './components/prototypes/FixNow';
import StudyForge from './components/prototypes/StudyForge';

// Import Global Components
import CommandPalette from './components/CommandPalette';
import ProjectModal from './components/ProjectModal';
import SystemStatus from './components/SystemStatus';
import CvViewer from './components/CvViewer';
import WorkspaceVisual from './components/WorkspaceVisual';

export default function App() {
  // Localization and direction state
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('djasser_lang');
    return (saved as Language) || 'en';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePrototype, setActivePrototype] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);

  // Active Workflow Step in About section
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formFeedback, setFormFeedback] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Persist language settings
  useEffect(() => {
    localStorage.setItem('djasser_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const handleLangChange = (l: Language) => {
    setLang(l);
    setMobileMenuOpen(false);
  };

  const handleNavigate = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Launch a demo inside the Sandbox Lab
  const handleLaunchDemo = (projectId: string) => {
    // Map project ID to available prototype components
    // If the project itself is market-manager-ai, let's map it to queue-pilot or similar
    let targetLabId = projectId;
    if (projectId === 'market-manager-ai') {
      targetLabId = 'queue-pilot';
    } else if (projectId === 'grasis') {
      targetLabId = 'fix-now'; // coordinates matching
    } else if (projectId === 'mouth-control') {
      targetLabId = 'link-lens'; // heuristic analysis
    }
    
    setActivePrototype(targetLabId);
    setSelectedProject(null);
    setTimeout(() => {
      const labSection = document.getElementById('lab');
      if (labSection) {
        labSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setFormFeedback(t.contact.error);
      setFormSuccess(false);
      return;
    }

    // Save message locally for mock demonstration & persistent logging
    const savedMsgs = localStorage.getItem('djasser_messages') || '[]';
    try {
      const parsed = JSON.parse(savedMsgs);
      parsed.push({
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        date: new Date().toISOString(),
      });
      localStorage.setItem('djasser_messages', JSON.stringify(parsed));
    } catch (err) {}

    setFormSuccess(true);
    setFormFeedback(t.contact.success);
    
    // Clear inputs
    setContactName('');
    setContactEmail('');
    setContactMessage('');

    setTimeout(() => {
      setFormFeedback(null);
      setFormSuccess(false);
    }, 5000);
  };

  const handleDirectEmail = () => {
    const subject = encodeURIComponent(`Collaboration Inquiry from ${contactName || 'Portfolio Visitor'}`);
    const body = encodeURIComponent(contactMessage || 'Hello Djasser,\n\nI was browsing your premium portfolio and wanted to reach out regarding...');
    window.location.href = `mailto:jaserachlaf7@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white antialiased`}>
      
      {/* Background Radial Glow */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,#0f172a_0%,transparent_70%)] pointer-events-none z-0"></div>

      {/* STICKY HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between ${
          isRtl ? 'flex-row-reverse' : 'flex-row'
        }`}>
          {/* Logo Brand */}
          <div className={`flex items-center gap-2.5 cursor-pointer`} onClick={() => handleNavigate('hero')}>
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-950/30">
              D
            </div>
            <span className="font-extrabold text-sm tracking-wider font-mono text-white hidden sm:block">
              DJASSER_ACHLAF
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
            isRtl ? 'flex-row-reverse' : ''
          }`}>
            <button onClick={() => handleNavigate('about')} className="hover:text-white transition-colors cursor-pointer">{t.nav.about}</button>
            <button onClick={() => handleNavigate('skills')} className="hover:text-white transition-colors cursor-pointer">{t.nav.skills}</button>
            <button onClick={() => handleNavigate('projects')} className="hover:text-white transition-colors cursor-pointer">{t.nav.projects}</button>
            <button onClick={() => handleNavigate('lab')} className="hover:text-white transition-colors cursor-pointer">{t.nav.lab}</button>
            <button onClick={() => handleNavigate('experience')} className="hover:text-white transition-colors cursor-pointer">{t.nav.experience}</button>
            <button onClick={() => handleNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">{t.nav.contact}</button>
          </nav>

          {/* Quick Controls Section */}
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            
            {/* Search Pill trigger for Cmd Palette */}
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-md text-[10px] font-mono text-slate-400 cursor-pointer"
              title="Search and commands"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Ctrl+K</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-xs text-slate-300 font-semibold cursor-pointer">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="uppercase font-mono">{lang}</span>
              </button>
              
              {/* Dropdown Items */}
              <div className={`absolute right-0 mt-1.5 w-24 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50 text-xs`}>
                <button onClick={() => handleLangChange('en')} className="w-full px-3 py-1.5 hover:bg-slate-900 text-left font-mono">EN</button>
                <button onClick={() => handleLangChange('ar')} className="w-full px-3 py-1.5 hover:bg-slate-900 text-left font-mono">AR</button>
                <button onClick={() => handleLangChange('fr')} className="w-full px-3 py-1.5 hover:bg-slate-900 text-left font-mono">FR</button>
              </div>
            </div>

            {/* CV Viewer Button */}
            <button 
              onClick={() => setIsCvOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 hover:text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.hero.ctaCv}</span>
            </button>

            {/* Mobile menu toggle button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white md:hidden border border-slate-900 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-slate-900 px-4 py-4 space-y-3 shadow-2xl">
            <button onClick={() => handleNavigate('about')} className="block w-full text-left text-sm py-1.5 text-slate-400 hover:text-white uppercase font-bold tracking-wider">{t.nav.about}</button>
            <button onClick={() => handleNavigate('skills')} className="block w-full text-left text-sm py-1.5 text-slate-400 hover:text-white uppercase font-bold tracking-wider">{t.nav.skills}</button>
            <button onClick={() => handleNavigate('projects')} className="block w-full text-left text-sm py-1.5 text-slate-400 hover:text-white uppercase font-bold tracking-wider">{t.nav.projects}</button>
            <button onClick={() => handleNavigate('lab')} className="block w-full text-left text-sm py-1.5 text-slate-400 hover:text-white uppercase font-bold tracking-wider">{t.nav.lab}</button>
            <button onClick={() => handleNavigate('experience')} className="block w-full text-left text-sm py-1.5 text-slate-400 hover:text-white uppercase font-bold tracking-wider">{t.nav.experience}</button>
            <button onClick={() => handleNavigate('contact')} className="block w-full text-left text-sm py-1.5 text-slate-400 hover:text-white uppercase font-bold tracking-wider">{t.nav.contact}</button>
            
            <div className="border-t border-slate-900 pt-3 flex gap-2">
              <button 
                onClick={() => { setIsCvOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-200"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{t.hero.ctaCv}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
          isRtl ? 'direction-rtl' : ''
        }`}>
          
          {/* Hero text metadata content */}
          <div className={`lg:col-span-7 space-y-6 ${
            isRtl ? 'text-right' : 'text-left'
          }`}>
            {/* Status indicators */}
            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-400 font-medium ${
              isRtl ? 'flex-row-reverse' : ''
            }`}>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{t.hero.status}: USTHB 2026</span>
            </div>

            {/* Sharp sleek displays headings */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans">
              <span className="text-slate-400 font-light block text-lg md:text-xl tracking-widest font-mono lowercase mb-1">
                {t.hero.greeting}
              </span>
              {t.hero.name}
            </h1>

            <p className="text-cyan-400 font-semibold text-sm md:text-base tracking-wider uppercase font-mono max-w-2xl leading-relaxed">
              {t.hero.subheading}
            </p>

            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
              {t.hero.supporting}
            </p>

            {/* Quick CTAs */}
            <div className={`pt-4 flex flex-wrap gap-4 ${isRtl ? 'justify-start md:justify-end flex-row-reverse' : ''}`}>
              <button 
                onClick={() => handleNavigate('lab')}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-950/20"
              >
                {t.hero.ctaTry}
              </button>
              
              <button 
                onClick={() => handleNavigate('projects')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                {t.hero.ctaExplore}
              </button>
            </div>
          </div>

          {/* Workstation Interactive visual canvas widget */}
          <div className="lg:col-span-5 flex justify-center">
            <WorkspaceVisual />
          </div>

        </div>
      </section>

      {/* STATS HIGHLIGHTS GRID */}
      <section className="bg-slate-950/40 border-y border-slate-900/60 py-8 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* WorldSkills card */}
            <div className="text-center p-4 bg-slate-950/30 rounded-xl border border-slate-900/60">
              <div className="text-xl md:text-2xl font-extrabold text-amber-400 flex items-center justify-center gap-1 font-mono">
                🥇 {t.stats.achievement}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold mt-1.5">{t.stats.achievementSub}</div>
            </div>

            <div className="text-center p-4 bg-slate-950/30 rounded-xl border border-slate-900/60">
              <div className="text-xl md:text-2xl font-extrabold text-cyan-400 font-mono">Android</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold mt-1.5">{t.stats.mobileSub}</div>
            </div>

            <div className="text-center p-4 bg-slate-950/30 rounded-xl border border-slate-900/60">
              <div className="text-xl md:text-2xl font-extrabold text-violet-400 font-mono">Full-Stack</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold mt-1.5">{t.stats.webSub}</div>
            </div>

            <div className="text-center p-4 bg-slate-950/30 rounded-xl border border-slate-900/60">
              <div className="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono">AI Builder</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold mt-1.5">{t.stats.aiSub}</div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT SECTION & WORKFLOW STAGES */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Bio text block */}
          <div className={`lg:col-span-5 space-y-5 ${isRtl ? 'lg:order-2 text-right' : 'text-left'}`}>
            <span className="text-xs uppercase tracking-widest font-mono font-extrabold text-cyan-400">{t.about.subtitle}</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">{t.about.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{t.about.bio}</p>

            <div className="pt-4">
              <button 
                onClick={() => setIsCvOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{t.cv.text}</span>
              </button>
            </div>
          </div>

          {/* Interactive Workflow Stage diagram */}
          <div className="lg:col-span-7 bg-slate-950/30 border border-slate-900 rounded-2xl p-5 md:p-6">
            <h3 className={`text-xs uppercase tracking-wider font-mono font-bold text-slate-400 mb-6 ${
              isRtl ? 'text-right' : 'text-left'
            }`}>
              ⚡ {t.about.timeline.title}
            </h3>

            {/* Workflow List layout */}
            <div className="space-y-4">
              {[
                { label: t.about.timeline.step1, desc: t.about.timeline.step1Desc },
                { label: t.about.timeline.step2, desc: t.about.timeline.step2Desc },
                { label: t.about.timeline.step3, desc: t.about.timeline.step3Desc },
                { label: t.about.timeline.step4, desc: t.about.timeline.step4Desc },
                { label: t.about.timeline.step5, desc: t.about.timeline.step5Desc },
              ].map((step, idx) => {
                const isActive = activeWorkflowStep === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveWorkflowStep(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex gap-4 items-start ${
                      isRtl ? 'flex-row-reverse text-right' : 'flex-row'
                    } ${
                      isActive 
                        ? 'bg-slate-950 border-cyan-500/80 shadow-md shadow-cyan-950/10' 
                        : 'bg-slate-950/10 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                      isActive ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-500'
                    }`}>
                      0{idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{step.label}</div>
                      {isActive && (
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed animate-fade-in">{step.desc}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* TECH SKILLS & CORE CAPABILITIES */}
      <section id="skills" className="py-20 border-y border-slate-900/40 bg-slate-950/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-mono font-extrabold text-cyan-400">{t.skills.title}</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">{t.skills.subtitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
            
            {/* Programming card */}
            <div className="p-5 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
              <h3 className="text-xs uppercase font-bold font-mono text-cyan-400">{t.skills.programming}</h3>
              <div className="space-y-3 text-xs text-slate-400">
                <div>
                  <div className="font-semibold text-white">Python</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descPython}</p>
                </div>
                <div>
                  <div className="font-semibold text-white">JavaScript / TypeScript</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descJs}</p>
                </div>
                <div>
                  <div className="font-semibold text-white">HTML5 & CSS3</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descHtml}</p>
                </div>
              </div>
            </div>

            {/* Mobile & Web card */}
            <div className="p-5 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
              <h3 className="text-xs uppercase font-bold font-mono text-cyan-400">{t.skills.mobile}</h3>
              <div className="space-y-3 text-xs text-slate-400">
                <div>
                  <div className="font-semibold text-white">Android Layout Engineering</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descAndroid}</p>
                </div>
                <div>
                  <div className="font-semibold text-white">Web Applications</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descWebApps}</p>
                </div>
                <div>
                  <div className="font-semibold text-white">Firebase & Services</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descFirebase}</p>
                </div>
              </div>
            </div>

            {/* Workflow & AI-assisted card */}
            <div className="p-5 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
              <h3 className="text-xs uppercase font-bold font-mono text-cyan-400">{t.skills.workflow}</h3>
              <div className="space-y-3 text-xs text-slate-400">
                <div>
                  <div className="font-semibold text-white">AI-Assisted Workflow</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descAi}</p>
                </div>
                <div>
                  <div className="font-semibold text-white">Git / GitHub Ecosystem</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descGithub}</p>
                </div>
                <div>
                  <div className="font-semibold text-white">Vibe Coding / Rapid Assembly</div>
                  <p className="mt-0.5 text-[11px]">{t.skills.descVibe}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WORLDSKILLS AWARD PROMINENT SPOT */}
      <section id="achievement" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-6 md:p-10 rounded-2xl bg-[radial-gradient(ellipse_at_bottom_left,#1e1b4b,transparent_60%)] bg-slate-950 border border-slate-900 flex flex-col md:flex-row gap-8 items-center justify-between">
          
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full uppercase tracking-widest font-mono">
              🏆 {t.achievements.medal}
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase leading-tight">
              {t.achievements.award} — {t.achievements.field}
            </h2>
            <div className="text-xs font-semibold text-slate-400 font-mono">
              {t.achievements.location} · {t.achievements.subText}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.achievements.desc}
            </p>
          </div>

          {/* Big graphical Gold Medal badge */}
          <div className="relative shrink-0 w-32 h-32 md:w-40 md:h-40 bg-slate-950 border border-slate-800 rounded-full flex flex-col items-center justify-center shadow-2xl">
            <div className="absolute inset-2 border border-dashed border-amber-500/20 rounded-full animate-[spin_40s_linear_infinite]"></div>
            <span className="text-5xl md:text-6xl filter drop-shadow-md">🥇</span>
            <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider uppercase mt-2">WORLD_SKILLS</span>
          </div>

        </div>
      </section>

      {/* PROJECTS GRID SHOWCASE */}
      <section id="projects" className="py-20 border-t border-slate-900/60 bg-slate-950/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-mono font-extrabold text-cyan-400">{t.projects.title}</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">{t.projects.subtitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
            {projectsData.map((project) => (
              <div 
                key={project.id} 
                className="bg-slate-950 border border-slate-900/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-800 transition-all p-5 space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-wider">
                      {project.category[lang]}
                    </span>
                    <span className="text-[8px] font-mono bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded uppercase">
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-1.5 font-sans tracking-tight">
                    {project.title[lang]}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {project.description[lang]}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{t.projects.viewProject}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleLaunchDemo(project.id)}
                    className="text-[10px] bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/10 hover:border-cyan-500 px-2.5 py-1 rounded-md font-bold uppercase transition-all cursor-pointer"
                  >
                    {t.projects.prototype}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE PROTOTYPE SANDBOX LAB */}
      <section id="lab" className="py-20 border-y border-slate-900 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-mono font-extrabold text-cyan-400">⚙️ PROTOTYPE SANDBOX LAB</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">{t.lab.title}</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">{t.lab.subtitle}</p>

          {/* Sandbox tabs / Selection panel */}
          <div className="flex flex-wrap gap-2 justify-center pt-6 max-w-4xl mx-auto">
            {[
              { id: 'queue-pilot', label: '📊 QueuePilot' },
              { id: 'link-lens', label: '🛡️ LinkLens' },
              { id: 'lost-loop', label: '🔎 LostLoop' },
              { id: 'fix-now', label: '🧰 FixNow' },
              { id: 'study-forge', label: '🧠 StudyForge' },
            ].map((tab) => {
              const isSelected = activePrototype === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePrototype(tab.id)}
                  className={`px-4 py-2 text-xs font-bold tracking-tight rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-950/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sandbox active container */}
          <div className="pt-8">
            {activePrototype === 'queue-pilot' && (
              <div className="animate-fade-in"><QueuePilot lang={lang} /></div>
            )}
            {activePrototype === 'link-lens' && (
              <div className="animate-fade-in"><LinkLens lang={lang} /></div>
            )}
            {activePrototype === 'lost-loop' && (
              <div className="animate-fade-in"><LostLoop lang={lang} /></div>
            )}
            {activePrototype === 'fix-now' && (
              <div className="animate-fade-in"><FixNow lang={lang} /></div>
            )}
            {activePrototype === 'study-forge' && (
              <div className="animate-fade-in"><StudyForge lang={lang} /></div>
            )}

            {!activePrototype && (
              <div className="bg-slate-900/30 p-12 rounded-2xl border border-slate-900 max-w-3xl mx-auto flex flex-col items-center gap-4">
                <Code className="w-12 h-12 text-slate-700 animate-pulse" />
                <div className="text-sm font-semibold text-slate-400">Select any prototype above to mount and play with it live.</div>
                <button
                  onClick={() => setActivePrototype('queue-pilot')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Quick Launch QueuePilot
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* JOURNEY & EDUCATION BLOCK */}
      <section id="experience" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Work experience timeline */}
          <div className="space-y-6">
            <h2 className={`text-base font-extrabold text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-2 mb-6 flex items-center gap-2 ${
              isRtl ? 'flex-row-reverse text-right' : 'text-left'
            }`}>
              <Briefcase className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              <span>{t.experience.title}</span>
            </h2>

            <div className="space-y-8 pl-1 pr-1">
              {experienceData.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className={`flex justify-between items-start flex-wrap gap-2 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <h3 className="text-sm font-bold text-slate-200">{exp.title[lang]}</h3>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded-full">
                      {exp.period[lang]}
                    </span>
                  </div>
                  <div className={`text-xs text-slate-500 font-mono mt-1 ${isRtl ? 'text-right' : 'text-left'}`}>{exp.company[lang]}</div>
                  <ul className="mt-2.5 space-y-1.5">
                    {exp.responsibilities[lang].map((resp, idx) => (
                      <li key={idx} className={`text-xs text-slate-400 leading-relaxed flex items-start gap-2 ${
                        isRtl ? 'flex-row-reverse text-right' : 'text-left'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5"></span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Academic education timeline */}
          <div className="space-y-6">
            <h2 className={`text-base font-extrabold text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-2 mb-6 flex items-center gap-2 ${
              isRtl ? 'flex-row-reverse text-right' : 'text-left'
            }`}>
              <BookOpen className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              <span>{t.education.title}</span>
            </h2>

            <div className="space-y-8 pl-1 pr-1">
              {educationData.map((edu) => (
                <div key={edu.id} className="space-y-2">
                  <div className={`flex justify-between items-start flex-wrap gap-2 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <h3 className="text-sm font-bold text-slate-200">{edu.degree[lang]}</h3>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded-full">
                      {edu.period[lang]}
                    </span>
                  </div>
                  <div className={`text-xs text-slate-500 font-mono ${isRtl ? 'text-right' : 'text-left'}`}>{edu.school[lang]}</div>
                  {edu.details && (
                    <p className={`text-xs text-slate-400 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>{edu.details[lang]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* TRILINGUAL CV EXPORTER SECTION */}
      <section className="py-20 border-t border-slate-900/60 bg-slate-950/20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <FileText className="w-10 h-10 text-cyan-400/80 mx-auto" />
          <h2 className="text-2xl font-bold text-white uppercase">{t.cv.title}</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">{t.cv.text}</p>
          
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <button
              onClick={() => { setLang('en'); setIsCvOpen(true); }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              🇬🇧 {t.cv.enCv}
            </button>
            <button
              onClick={() => { setLang('ar'); setIsCvOpen(true); }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              🇩🇿 {t.cv.arCv}
            </button>
            <button
              onClick={() => { setLang('fr'); setIsCvOpen(true); }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              🇫🇷 {t.cv.frCv}
            </button>
          </div>
        </div>
      </section>

      {/* DYNAMIC CONTACT FORM SECTION */}
      <section id="contact" className="py-20 border-t border-slate-900/60 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Col: Contact metadata */}
            <div className={`lg:col-span-5 space-y-6 ${isRtl ? 'lg:order-2 text-right' : 'text-left'}`}>
              <span className="text-xs uppercase tracking-widest font-mono font-extrabold text-cyan-400">📬 {t.contact.infoTitle}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase leading-tight">{t.contact.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{t.contact.text}</p>
              
              <div className="space-y-4 pt-4 text-xs font-medium text-slate-400">
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>0796783270</span>
                </div>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>jaserachlaf7@gmail.com</span>
                </div>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Boumerdès, Algeria</span>
                </div>
              </div>
            </div>

            {/* Right Col: actual, working form container */}
            <div className="lg:col-span-7 bg-slate-950/40 p-5 md:p-6 rounded-2xl border border-slate-900">
              <h3 className={`text-xs uppercase font-bold font-mono text-slate-400 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                {t.contact.formTitle}
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.contact.name}</label>
                    <input 
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Djasser"
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.contact.email}</label>
                    <input 
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jaserachlaf7@gmail.com"
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">{t.contact.message}</label>
                  <textarea 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    placeholder="Hello Djasser, let's build something beautiful together..."
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                </div>

                <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {t.contact.send}
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectEmail}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    {t.contact.emailBtn}
                  </button>
                </div>
              </form>

              {formFeedback && (
                <div className={`mt-4 p-3 rounded-lg text-xs text-center border ${
                  formSuccess 
                    ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                    : 'bg-red-500/5 text-red-400 border-red-500/10'
                }`}>
                  {formFeedback}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-8 text-center relative z-10 text-slate-500 text-[11px] leading-relaxed font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>{t.footer.text}</p>
          <div className="flex justify-center gap-2 text-slate-600">
            <span>BOUMERDÈS, ALGERIA</span>
            <span>·</span>
            <span className="text-cyan-600">VIBE_CODING_ACTIVE</span>
          </div>
        </div>
      </footer>

      {/* IMMERSIVE COMPONENT MODALS */}
      
      {/* 1. Command Palette Overlay */}
      <CommandPalette 
        lang={lang}
        setLang={handleLangChange}
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        onNavigate={handleNavigate}
        onOpenCv={() => setIsCvOpen(true)}
      />

      {/* 2. Project Details Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject}
          lang={lang}
          onClose={() => setSelectedProject(null)}
          onLaunchDemo={handleLaunchDemo}
        />
      )}

      {/* 3. Interactive CV Viewer */}
      <CvViewer 
        lang={lang}
        setLang={setLang}
        isOpen={isCvOpen}
        onClose={() => setIsCvOpen(false)}
      />

      {/* 4. Floating System Status Dashboard */}
      <SystemStatus lang={lang} />

    </div>
  );
}

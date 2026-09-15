/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Printer, Download, MapPin, Phone, Mail, Award, BookOpen, Briefcase, Github, Globe } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { experienceData, educationData } from '../data/portfolioData';

export default function CvViewer({
  lang,
  setLang,
  isOpen,
  onClose,
}: {
  lang: Language;
  setLang: (l: Language) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const t = translations[lang].cv;
  const ct = translations[lang].contact;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:absolute print:inset-0 bg-black/90 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-fade-in text-slate-200 z-10 my-8 max-h-[90vh] flex flex-col print:border-0 print:bg-white print:text-black print:shadow-none print:max-h-none print:my-0">
        
        {/* Header Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/80 sticky top-0 z-20 print:hidden flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            <div className="flex gap-1.5">
              {(['en', 'ar', 'fr'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded border cursor-pointer ${
                    lang === l 
                      ? 'bg-cyan-600 border-cyan-500 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'en' ? 'EN' : l === 'ar' ? 'AR' : 'FR'}
                </button>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-200">
            {t.interactive}
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {t.downloadPdf}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 border border-slate-900 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable CV Content */}
        <div 
          className={`flex-1 overflow-y-auto p-8 md:p-12 space-y-8 bg-slate-950 print:bg-white print:text-black text-slate-300 font-sans ${
            isRtl ? 'rtl text-right' : 'ltr text-left'
          }`}
          id="cv-document"
        >
          {/* Print Style Injector */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body { background-color: white !important; color: black !important; }
              #cv-document { background-color: white !important; color: black !important; padding: 0 !important; }
              .print\\:text-black { color: black !important; }
              .print\\:border-black { border-color: #e2e8f0 !important; }
              .print\\:hidden { display: none !important; }
            }
          `}} />

          {/* Profile Header */}
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6 border-slate-800 print:border-slate-300 print:text-black ${
            isRtl ? 'md:flex-row-reverse' : ''
          }`}>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white print:text-black tracking-tight uppercase">
                {translations[lang].hero.name}
              </h1>
              <p className="text-cyan-400 font-semibold text-sm mt-1 uppercase tracking-wider font-mono">
                {translations[lang].hero.subheading}
              </p>
              <p className="text-slate-400 text-xs mt-2 print:text-slate-600 max-w-xl">
                {translations[lang].about.bio}
              </p>
            </div>

            {/* Quick Contact Matrix */}
            <div className={`space-y-1.5 text-xs text-slate-400 print:text-slate-700 shrink-0 font-mono font-medium ${
              isRtl ? 'md:text-left md:items-start' : 'md:text-right'
            }`}>
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse justify-end md:justify-start' : 'justify-start md:justify-end'}`}>
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{ct.location}: Boumerdès, Algeria</span>
              </div>
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse justify-end md:justify-start' : 'justify-start md:justify-end'}`}>
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{ct.phone}: 0796783270</span>
              </div>
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse justify-end md:justify-start' : 'justify-start md:justify-end'}`}>
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>jaserachlaf7@gmail.com</span>
              </div>
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse justify-end md:justify-start' : 'justify-start md:justify-end'}`}>
                <Github className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>github.com/jasrashlaf7-blip</span>
              </div>
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse justify-end md:justify-start' : 'justify-start md:justify-end'}`}>
                <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Birth: 23 June 2008</span>
              </div>
            </div>
          </div>

          {/* Core Grid Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col (Experience & Education) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Major Achievement (prominent gold box) */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 print:border-slate-300 print:text-black flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 print:text-amber-600">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold font-mono text-amber-400 uppercase tracking-widest print:text-amber-600">
                    🥇 {translations[lang].achievements.medal}
                  </div>
                  <h3 className="text-base font-extrabold text-white print:text-black mt-1">
                    {translations[lang].achievements.award} — {translations[lang].achievements.field}
                  </h3>
                  <div className="text-xs text-slate-400 print:text-slate-500 mt-0.5">
                    {translations[lang].achievements.location} · {translations[lang].achievements.subText}
                  </div>
                  <p className="text-xs text-slate-400 print:text-slate-600 mt-2 leading-relaxed">
                    {translations[lang].achievements.desc}
                  </p>
                </div>
              </div>

              {/* Experience timeline */}
              <div>
                <h2 className="text-base font-extrabold text-white print:text-black flex items-center gap-2 uppercase tracking-wider font-mono border-b border-slate-800 pb-2 mb-4 print:border-slate-300">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  {translations[lang].experience.title}
                </h2>

                <div className="space-y-5">
                  {experienceData.map((exp) => (
                    <div key={exp.id} className="relative group">
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <h3 className="text-xs font-bold text-slate-100 print:text-black">
                          {exp.title[lang]}
                        </h3>
                        <span className="text-[10px] text-cyan-400 font-mono font-semibold shrink-0">
                          {exp.period[lang]}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 print:text-slate-500 mt-0.5 font-mono">
                        {exp.company[lang]}
                      </div>
                      
                      <ul className="mt-2 space-y-1 pl-1 pr-1">
                        {exp.responsibilities[lang].map((res, i) => (
                          <li 
                            key={i} 
                            className={`text-[10px] text-slate-400 print:text-slate-600 leading-relaxed flex items-start gap-1.5 ${
                              isRtl ? 'flex-row-reverse text-right' : 'text-left'
                            }`}
                          >
                            <span className="w-1 h-1 rounded-full bg-cyan-400/60 shrink-0 mt-1.5"></span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col (Education & Skill Stack) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Education */}
              <div>
                <h2 className="text-base font-extrabold text-white print:text-black flex items-center gap-2 uppercase tracking-wider font-mono border-b border-slate-800 pb-2 mb-4 print:border-slate-300">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  {translations[lang].education.title}
                </h2>

                <div className="space-y-4">
                  {educationData.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start flex-wrap">
                        <h3 className="text-xs font-bold text-slate-100 print:text-black">
                          {edu.degree[lang]}
                        </h3>
                        <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                          {edu.period[lang]}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 print:text-slate-500 mt-0.5 font-mono">
                        {edu.school[lang]}
                      </div>
                      {edu.details && (
                        <p className="text-[10px] text-slate-400 print:text-slate-600 mt-1.5 leading-relaxed">
                          {edu.details[lang]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills categorization */}
              <div>
                <h2 className="text-base font-extrabold text-white print:text-black flex items-center gap-2 uppercase tracking-wider font-mono border-b border-slate-800 pb-2 mb-4 print:border-slate-300">
                  <Award className="w-4 h-4 text-cyan-400" />
                  {translations[lang].skills.title}
                </h2>

                <div className="space-y-3.5 text-[11px]">
                  <div>
                    <div className="font-semibold text-slate-100 print:text-black mb-1">{translations[lang].skills.programming}</div>
                    <div className="flex flex-wrap gap-1">
                      {['Python', 'JavaScript', 'HTML5 / CSS3'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] print:border-slate-300 print:bg-slate-50">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-100 print:text-black mb-1">{translations[lang].skills.mobile}</div>
                    <div className="flex flex-wrap gap-1">
                      {['Android Development'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] print:border-slate-300 print:bg-slate-50">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-100 print:text-black mb-1">{translations[lang].skills.web}</div>
                    <div className="flex flex-wrap gap-1">
                      {['Web Application Development'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] print:border-slate-300 print:bg-slate-50">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-100 print:text-black mb-1">{translations[lang].skills.backend}</div>
                    <div className="flex flex-wrap gap-1">
                      {['Firebase Services'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] print:border-slate-300 print:bg-slate-50">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-100 print:text-black mb-1">{translations[lang].skills.workflow}</div>
                    <div className="flex flex-wrap gap-1">
                      {['Git / GitHub', 'AI-Assisted Development', 'Vibe Coding'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] print:border-slate-300 print:bg-slate-50">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

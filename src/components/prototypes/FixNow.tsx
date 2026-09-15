/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Shield, PlusCircle, AlertOctagon, Filter, Check, Map, Flame, Activity } from 'lucide-react';
import { Language } from '../../types';

interface RepairRequest {
  id: string;
  category: string;
  urgency: number; // 1-5
  distance: number; // km
  description: string;
  priorityScore: number; // calculated
  addedAt: string;
  gridX: number; // 0-100 map coord
  gridY: number; // 0-100 map coord
  status: 'pending' | 'resolved';
}

const CATEGORIES = {
  en: ['Street Light', 'Water Leak', 'Pothole', 'Power Outage', 'Public Park Defect'],
  ar: ['إنارة عمومية معطلة', 'تسرب مياه', 'حفرة في الطريق', 'انقطاع تيار كهربائي', 'خلل في حديقة عامة'],
  fr: ['Éclairage Public', 'Fuite d’Eau', 'Nid-de-poule', 'Panne d’Électricité', 'Mobilier Urbain Dégradé'],
};

export default function FixNow({ lang }: { lang: Language }) {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState(3); // 1-5
  const [distance, setDistance] = useState(4); // 1-10 km
  const [description, setDescription] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Load from local storage or pre-populate with default simulated requests
  useEffect(() => {
    const saved = localStorage.getItem('djasser_fix_now');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRequests(parsed || []);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Pre-populate with beautiful test reports
      const defaults: RepairRequest[] = [
        {
          id: 'req-1',
          category: CATEGORIES.en[1], // Water leak
          urgency: 5,
          distance: 1.5,
          description: 'Burst major water pipe flooding the pedestrian walkway near the campus gate.',
          priorityScore: 5 * 15 + Math.round((10 - 1.5) * 5), // 75 + 42.5 = 118
          addedAt: '10:15 AM',
          gridX: 42,
          gridY: 58,
          status: 'pending',
        },
        {
          id: 'req-2',
          category: CATEGORIES.en[2], // Pothole
          urgency: 3,
          distance: 6.2,
          description: 'Deep pothole on the fast lane causing sudden braking.',
          priorityScore: 3 * 15 + Math.round((10 - 6.2) * 5), // 45 + 19 = 64
          addedAt: 'Yesterday',
          gridX: 75,
          gridY: 30,
          status: 'pending',
        },
      ];
      setRequests(defaults);
      localStorage.setItem('djasser_fix_now', JSON.stringify(defaults));
    }
  }, []);

  const saveRequests = (newReqs: RepairRequest[]) => {
    setRequests(newReqs);
    localStorage.setItem('djasser_fix_now', JSON.stringify(newReqs));
  };

  const handleAddRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFeedback(lang === 'ar' ? 'الرجاء إدخال تفاصيل البلاغ.' : lang === 'fr' ? 'Saisir les détails.' : 'Please enter request details.');
      return;
    }

    const cat = category || CATEGORIES[lang][0];
    
    // Automatic Priority Scoring formula
    // Urgency (1-5) * 15 points
    // Proximity ((10 - distance) * 5) points
    // Max priority is 75 + 50 = 125
    const score = (urgency * 15) + Math.round((10 - distance) * 5);

    const newRequest: RepairRequest = {
      id: Math.random().toString(36).substr(2, 9),
      category: cat,
      urgency,
      distance,
      description: description.trim(),
      priorityScore: score,
      addedAt: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      // Simulated grid coordinate calculation
      gridX: Math.floor(Math.random() * 80) + 10,
      gridY: Math.floor(Math.random() * 80) + 10,
      status: 'pending',
    };

    const updated = [newRequest, ...requests];
    saveRequests(updated);
    setDescription('');
    setFeedback(lang === 'ar' ? 'تم تسجيل البلاغ ووضعه على خارطة الأولويات!' : lang === 'fr' ? 'Signalement ajouté avec succès !' : 'Report added and plotted onto priority map!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleResolve = (id: string) => {
    const updated = requests.map(r => 
      r.id === id ? { ...r, status: 'resolved' as const } : r
    );
    saveRequests(updated);
  };

  const handleClear = () => {
    setRequests([]);
    localStorage.removeItem('djasser_fix_now');
  };

  // Sort by priority score descending
  const sortedRequests = [...requests]
    .filter(r => selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter)
    .sort((a, b) => {
      if (a.status === 'resolved' && b.status === 'pending') return 1;
      if (a.status === 'pending' && b.status === 'resolved') return -1;
      return b.priorityScore - a.priorityScore;
    });

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 p-5 md:p-6 text-slate-100 max-w-4xl mx-auto shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              {lang === 'ar' ? 'نموذج لوجستي ذكي' : lang === 'fr' ? 'Modèle Logistique' : 'Priority Router'}
            </span>
            <span className="text-xs text-slate-500 font-mono">FixNow v1.1</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight">
            🧰 FixNow
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {lang === 'ar'
              ? 'منصة لرفع بلاغات الصيانة البلدية للحي وحساب الأولويات فورياً بناءً على مسافة البلاغ ومدى استعجاله.'
              : lang === 'fr'
                ? 'Plateforme de signalement urbain avec calcul de score de priorité automatique.'
                : 'Community repair request platform with dynamic urgency and proximity scoring algorithms.'}
          </p>
        </div>

        <button 
          onClick={handleClear}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-lg cursor-pointer transition-colors font-medium"
        >
          {lang === 'ar' ? 'إعادة ضبط الخارطة' : lang === 'fr' ? 'Réinitialiser la carte' : 'Reset Map Data'}
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Create Request */}
        <div className="lg:col-span-5 bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            {lang === 'ar' ? 'تسجيل بلاغ صيانة' : lang === 'fr' ? 'Nouveau Signalement' : 'File Maintenance Report'}
          </h4>

          <form onSubmit={handleAddRequest} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'فئة الخلل' : lang === 'fr' ? 'Catégorie du problème' : 'Category of Defect'}</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none"
              >
                {CATEGORIES[lang].map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Urgency Slider (1-5) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">{lang === 'ar' ? 'مستوى الاستعجال والخطورة' : lang === 'fr' ? 'Degré d’urgence' : 'Urgency Level'}</label>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{urgency}/5</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
                <span>{lang === 'ar' ? 'منخفض' : lang === 'fr' ? 'Faible' : 'Low'}</span>
                <span>{lang === 'ar' ? 'كارثي' : lang === 'fr' ? 'Critique' : 'Critical'}</span>
              </div>
            </div>

            {/* Distance Slider (1-10 km) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">{lang === 'ar' ? 'المسافة النسبية للخلل' : lang === 'fr' ? 'Distance estimée' : 'Proximity / Distance'}</label>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{distance} km</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
                <span>{lang === 'ar' ? 'قريب جداً' : lang === 'fr' ? 'Proche' : 'Very Close'}</span>
                <span>{lang === 'ar' ? 'بعيد' : lang === 'fr' ? 'Éloigné' : 'Far Away'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'تفاصيل ومكان الخلل' : lang === 'fr' ? 'Description' : 'Description'}</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder={lang === 'ar' ? 'صف العطل والموقع بدقة ليتحقق النظام من البلاغ.' : lang === 'fr' ? 'Indiquez les détails visibles...' : 'Describe the exact issue visible.'}
                className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <PlusCircle className="w-4 h-4" />
              {lang === 'ar' ? 'تسجيل ونشر البلاغ' : lang === 'fr' ? 'Créer le Signalement' : 'Publish Report'}
            </button>
          </form>

          {feedback && (
            <div className="mt-3 p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 text-xs text-center">
              {feedback}
            </div>
          )}
        </div>

        {/* Right Side: Map & Priority List */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Simulated Coordinate Map Grid */}
          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'ar' ? 'محاكاة الخارطة اللوجستية للبلدية' : lang === 'fr' ? 'Simulation Carte de Dispatch' : 'Simulated Dispatch Map Grid'}
            </h4>
            
            <div className="relative w-full h-[140px] bg-slate-950 rounded-lg border border-slate-900/80 overflow-hidden flex items-center justify-center">
              {/* Grid Background lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              {/* Map Center indicator (Our HQ/Dispatcher) */}
              <div className="absolute w-3.5 h-3.5 bg-cyan-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div className="absolute top-[42%] text-[9px] text-cyan-400/80 font-mono bg-slate-950/80 border border-slate-900 px-1 py-0.5 rounded pointer-events-none">HQ</div>

              {/* Plotted pins */}
              {requests.map((r) => {
                const isUrgent = r.priorityScore >= 80;
                return (
                  <div 
                    key={r.id}
                    style={{ left: `${r.gridX}%`, top: `${r.gridY}%` }}
                    className={`absolute w-3 h-3 rounded-full flex items-center justify-center cursor-pointer group transition-all transform hover:scale-125 ${
                      r.status === 'resolved' 
                        ? 'bg-slate-700' 
                        : isUrgent 
                          ? 'bg-red-500 border-2 border-white animate-pulse shadow-lg shadow-red-500/50' 
                          : 'bg-amber-500 border-2 border-white shadow-lg shadow-amber-500/50'
                    }`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-100 text-[10px] p-2 rounded border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-sans shadow-xl">
                      <div className="font-bold">{r.category}</div>
                      <div className="text-slate-400 mt-0.5">Priority: {r.priorityScore} · {r.distance}km</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sorted Priority Queue */}
          <div className="bg-slate-950/20 border border-slate-800/80 rounded-xl p-4 flex-1">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                {lang === 'ar' ? 'طابور الأولويات المجدول' : lang === 'fr' ? 'Liste de Priorité Ordonnée' : 'Sorted Dispatch Priority Queue'}
              </h4>
              
              <div className="flex items-center gap-1 border border-slate-800 bg-slate-950 rounded px-1.5 py-0.5">
                <Filter className="w-3 h-3 text-slate-500" />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-transparent text-[10px] text-slate-400 focus:outline-none"
                >
                  <option value="All">{lang === 'ar' ? 'كل التصنيفات' : 'All Categories'}</option>
                  {CATEGORIES[lang].map((c: string) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[160px] pr-1 flex flex-col gap-2.5 custom-scrollbar">
              {sortedRequests.length > 0 ? (
                sortedRequests.map((r) => {
                  const isHighPriority = r.priorityScore >= 80;
                  return (
                    <div 
                      key={r.id} 
                      className={`p-3 rounded-lg border text-xs flex justify-between items-start transition-all relative overflow-hidden ${
                        r.status === 'resolved'
                          ? 'bg-slate-950/20 border-slate-900 opacity-60'
                          : isHighPriority
                            ? 'bg-red-950/10 border-red-900/60'
                            : 'bg-slate-950/40 border-slate-900'
                      }`}
                    >
                      {/* Priority left color stripe */}
                      <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                        r.status === 'resolved' 
                          ? 'bg-slate-800' 
                          : isHighPriority 
                            ? 'bg-red-500' 
                            : 'bg-amber-500'
                      }`}></div>
                      
                      <div className="pl-2 flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-100">{r.category}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{r.distance} km away</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed truncate" title={r.description}>
                          {r.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Score Gauge */}
                        <div className="text-right">
                          <div className={`font-mono text-xs font-bold flex items-center justify-end gap-1 ${
                            r.status === 'resolved' 
                              ? 'text-slate-500' 
                              : isHighPriority 
                                ? 'text-red-400' 
                                : 'text-amber-400'
                          }`}>
                            {r.status === 'resolved' ? (
                              <span className="text-[10px] text-slate-500 font-sans font-normal uppercase">Resolved</span>
                            ) : (
                              <>
                                <Flame className="w-3.5 h-3.5 shrink-0" />
                                {r.priorityScore}
                              </>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{r.addedAt}</span>
                        </div>

                        {/* Complete action */}
                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleResolve(r.id)}
                            className="p-1 border border-slate-800 hover:border-emerald-700/60 bg-slate-950 text-slate-500 hover:text-emerald-400 rounded transition-colors cursor-pointer"
                            title={lang === 'ar' ? 'تأكيد الحل صيانة' : 'Mark as Resolved'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs italic">
                  {lang === 'ar' ? 'لا توجد بلاغات تندرج تحت هذا الفلتر.' : lang === 'fr' ? 'Aucun signalement trouvé.' : 'No requests matched.'}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

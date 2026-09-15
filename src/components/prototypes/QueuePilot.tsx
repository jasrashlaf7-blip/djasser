/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { UserPlus, Bell, Users, Clock, Play, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { Language } from '../../types';

interface Ticket {
  id: string;
  number: number;
  customerName: string;
  service: string;
  addedAt: string;
  status: 'waiting' | 'serving' | 'completed';
  counter?: number;
  estimatedWaitMinutes: number;
}

const SERVICES = {
  en: ['Technical Support', 'Developer Consulting', 'Startup Mentoring', 'General Enquiry'],
  ar: ['الدعم الفني والتقني', 'الاستشارة البرمجية', 'توجيه المشاريع الناشئة', 'استفسار عام'],
  fr: ['Support Technique', 'Conseil Développeur', 'Accompagnement Startup', 'Demande Générale'],
};

export default function QueuePilot({ lang }: { lang: Language }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [activeCounters, setActiveCounters] = useState<Record<number, Ticket | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('djasser_queue_pilot');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTickets(parsed.tickets || []);
        setActiveCounters(parsed.counters || { 1: null, 2: null, 3: null });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveState = (newTickets: Ticket[], newCounters: Record<number, Ticket | null>) => {
    localStorage.setItem(
      'djasser_queue_pilot',
      JSON.stringify({ tickets: newTickets, counters: newCounters })
    );
  };

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddTicket = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showFeedback(lang === 'ar' ? 'الرجاء إدخال اسم العميل.' : lang === 'fr' ? 'Saisir le nom.' : 'Please enter customer name.', 'error');
      return;
    }
    const service = selectedService || SERVICES[lang][0];
    
    // Calculate ticket number
    const maxNum = tickets.length > 0 ? Math.max(...tickets.map(t => t.number)) : 100;
    const nextNum = maxNum + 1;

    // Calculate wait time based on waiting queue size
    const waitingCount = tickets.filter(t => t.status === 'waiting').length;
    const waitTime = (waitingCount + 1) * 4; // 4 mins per customer

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      number: nextNum,
      customerName: customerName.trim(),
      service,
      addedAt: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'waiting',
      estimatedWaitMinutes: waitTime,
    };

    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    saveState(updatedTickets, activeCounters);
    setCustomerName('');
    showFeedback(
      lang === 'ar' 
        ? `تم توليد تذكرة بنجاح! رقمك هو T-${nextNum}` 
        : lang === 'fr' 
          ? `Ticket généré! Votre numéro est T-${nextNum}` 
          : `Ticket generated successfully! Your number is T-${nextNum}`,
      'success'
    );
  };

  const handleCallNext = (counterNum: number) => {
    const nextWaiting = tickets.find(t => t.status === 'waiting');
    
    // Complete previous ticket on this counter if any
    const currentOnCounter = activeCounters[counterNum];
    let updatedTickets = [...tickets];
    
    if (currentOnCounter) {
      updatedTickets = updatedTickets.map(t => 
        t.id === currentOnCounter.id ? { ...t, status: 'completed' as const } : t
      );
    }

    const updatedCounters = { ...activeCounters };

    if (!nextWaiting) {
      updatedCounters[counterNum] = null;
      setActiveCounters(updatedCounters);
      setTickets(updatedTickets);
      saveState(updatedTickets, updatedCounters);
      showFeedback(
        lang === 'ar' ? 'لا يوجد عملاء في قائمة الانتظار حالياً.' : lang === 'fr' ? 'Aucun client en attente.' : 'No customers in the waiting queue.',
        'error'
      );
      return;
    }

    // Assign next to counter
    const updatedTicket: Ticket = {
      ...nextWaiting,
      status: 'serving',
      counter: counterNum,
    };

    updatedTickets = updatedTickets.map(t => 
      t.id === nextWaiting.id ? updatedTicket : t
    );

    updatedCounters[counterNum] = updatedTicket;
    
    setActiveCounters(updatedCounters);
    setTickets(updatedTickets);
    saveState(updatedTickets, updatedCounters);

    // Simulated chime sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Audio context blocked/not supported, ignore
    }

    showFeedback(
      lang === 'ar' 
        ? `مناداة التذكرة T-${nextWaiting.number} إلى شباك ${counterNum}` 
        : lang === 'fr' 
          ? `Appel du ticket T-${nextWaiting.number} au Guichet ${counterNum}` 
          : `Calling ticket T-${nextWaiting.number} to Counter ${counterNum}`,
      'success'
    );
  };

  const handleReset = () => {
    setTickets([]);
    const clearedCounters = { 1: null, 2: null, 3: null };
    setActiveCounters(clearedCounters);
    saveState([], clearedCounters);
    showFeedback(
      lang === 'ar' ? 'تم إعادة تعيين لوحة الانتظار.' : lang === 'fr' ? 'File d’attente réinitialisée.' : 'Queue system reset successfully.',
      'success'
    );
  };

  const waitingTickets = tickets.filter(t => t.status === 'waiting');
  const completedCount = tickets.filter(t => t.status === 'completed').length;
  const averageWait = tickets.length > 0 ? Math.round(tickets.reduce((acc, t) => acc + t.estimatedWaitMinutes, 0) / tickets.length) : 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 p-5 md:p-6 text-slate-100 max-w-4xl mx-auto shadow-2xl">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
              {lang === 'ar' ? 'نموذج أولي تفاعلي' : lang === 'fr' ? 'Prototype Interactif' : 'Interactive Prototype'}
            </span>
            <span className="text-xs text-slate-500 font-mono">QueuePilot v1.2</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight">
            🎫 QueuePilot
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {lang === 'ar' 
              ? 'إدارة الحشود وتنظيم قائمة الانتظار مع احتساب لحظي لوقت الانتظار المتوقع.'
              : lang === 'fr'
                ? 'Gestion de file d’attente virtuelle avec calcul des temps d’attente estimatifs.'
                : 'Smart virtual queue with live ticket management and estimated waiting time.'}
          </p>
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-lg transition-colors font-medium cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {lang === 'ar' ? 'إعادة تعيين' : lang === 'fr' ? 'Réinitialiser' : 'Reset System'}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 leading-tight">{lang === 'ar' ? 'قيد الانتظار' : lang === 'fr' ? 'En attente' : 'Waiting'}</div>
            <div className="text-lg font-semibold text-white mt-0.5">{waitingTickets.length}</div>
          </div>
        </div>
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 leading-tight">{lang === 'ar' ? 'يتم خدمتهم' : lang === 'fr' ? 'En service' : 'Being Served'}</div>
            <div className="text-lg font-semibold text-white mt-0.5">
              {Object.values(activeCounters).filter(Boolean).length}
            </div>
          </div>
        </div>
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 leading-tight">{lang === 'ar' ? 'مكتملين' : lang === 'fr' ? 'Terminés' : 'Completed'}</div>
            <div className="text-lg font-semibold text-white mt-0.5">{completedCount}</div>
          </div>
        </div>
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 flex items-center gap-3">
          <div className="p-2 rounded-md bg-violet-500/10 text-violet-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 leading-tight">{lang === 'ar' ? 'معدل الانتظار' : lang === 'fr' ? 'Attente moy.' : 'Avg Wait'}</div>
            <div className="text-lg font-semibold text-white mt-0.5">~{averageWait} {lang === 'ar' ? 'دقائق' : 'mins'}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Create Ticket Form & Waiting Queue */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Create Form */}
          <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              {lang === 'ar' ? 'إضافة عميل جديد' : lang === 'fr' ? 'Nouveau Ticket' : 'Generate Ticket'}
            </h4>
            <form onSubmit={handleAddTicket} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'اسم العميل' : lang === 'fr' ? 'Nom du Client' : 'Customer Name'}</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={lang === 'ar' ? 'محمد علي' : lang === 'fr' ? 'Ex: Jean Dupont' : 'Ex: Alice Smith'}
                  className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'الخدمة المطلوبة' : lang === 'fr' ? 'Service requis' : 'Required Service'}</label>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/60"
                >
                  {SERVICES[lang].map((srv: string) => (
                    <option key={srv} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full mt-1 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950/20"
              >
                <UserPlus className="w-4 h-4" />
                {lang === 'ar' ? 'توليد التذكرة' : lang === 'fr' ? 'Créer le Ticket' : 'Print Ticket'}
              </button>
            </form>
          </div>

          {/* Live Screen Simulation */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>● {lang === 'ar' ? 'شاشة الإعلانات الحية' : lang === 'fr' ? 'Écran en Direct' : 'Live Waiting Board'}</span>
              <span className="text-[10px] text-slate-500">{lang === 'ar' ? 'تحديث تلقائي' : lang === 'fr' ? 'Mise à jour live' : 'Auto-sync'}</span>
            </h4>
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-900 flex flex-col gap-2 font-mono text-center min-h-[140px] justify-center">
              {Object.values(activeCounters).some(Boolean) ? (
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-slate-500 tracking-widest uppercase">{lang === 'ar' ? 'النداء الحالي' : lang === 'fr' ? 'PROCHAIN APPEL' : 'CURRENT CALL'}</div>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    {Object.entries(activeCounters).map(([counter, item]) => {
                      const t = item as Ticket | null;
                      if (!t) return null;
                      return (
                        <div key={counter} className="flex justify-between w-full max-w-xs border-b border-slate-900 pb-1 last:border-0 text-xs text-left">
                          <span className="text-amber-400 font-bold">Ticket T-{t.number}</span>
                          <span className="text-slate-400 truncate max-w-[100px]">{t.customerName}</span>
                          <span className="text-cyan-400 font-bold">⟶ Counter {counter}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 text-xs italic">
                  {lang === 'ar' ? 'شاشة الانتظار فارغة حالياً' : lang === 'fr' ? 'Aucun appel actif' : 'No active counter calls'}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Counters Controllers & Queue List */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Counter Controls */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-amber-400" />
              {lang === 'ar' ? 'أجهزة التحكم بالشبابيك' : lang === 'fr' ? 'Guichets d’Appel' : 'Service Desk Controls'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((num) => {
                const current = activeCounters[num];
                return (
                  <div key={num} className="bg-slate-950/30 border border-slate-800 p-3 rounded-xl flex flex-col justify-between min-h-[120px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400 font-mono">Counter {num}</span>
                      <span className={`w-2 h-2 rounded-full ${current ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`}></span>
                    </div>
                    
                    <div className="my-2 text-center">
                      {current ? (
                        <div className="animate-fade-in">
                          <div className="text-base font-bold text-white">T-{current.number}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate px-1" title={current.customerName}>
                            {current.customerName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 italic">{lang === 'ar' ? 'شاغر' : lang === 'fr' ? 'Disponible' : 'Idle'}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleCallNext(num)}
                      className="w-full text-center text-xs py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      {current ? (lang === 'ar' ? 'استدعاء التالي' : lang === 'fr' ? 'Suivant' : 'Call Next') : (lang === 'ar' ? 'فتح واستدعاء' : lang === 'fr' ? 'Appeler' : 'Call Next')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue List Table */}
          <div className="flex-1 bg-slate-950/20 border border-slate-800/80 rounded-xl p-4 flex flex-col">
            <h4 className="text-sm font-semibold text-white mb-3">
              {lang === 'ar' ? 'قائمة العملاء المنتظرين' : lang === 'fr' ? 'File d’Attente Active' : 'Active Waiting List'} ({waitingTickets.length})
            </h4>
            
            <div className="flex-1 overflow-y-auto max-h-[160px] pr-1 flex flex-col gap-2 custom-scrollbar">
              {waitingTickets.length > 0 ? (
                waitingTickets.map((t) => (
                  <div key={t.id} className="flex justify-between items-center text-xs bg-slate-950/60 border border-slate-900 hover:border-slate-800 p-2.5 rounded-lg transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        T-{t.number}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">{t.customerName}</div>
                        <div className="text-[10px] text-slate-500">{t.service}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        ~{t.estimatedWaitMinutes}m
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{t.addedAt}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs italic flex flex-col items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-slate-700" />
                  {lang === 'ar' ? 'كل قائمة الانتظار فارغة! الموظفون جاهزون.' : lang === 'fr' ? 'La file d’attente est vide.' : 'The waiting list is empty.'}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Notifications Alert */}
      {feedback && (
        <div className={`mt-4 p-3 rounded-lg border flex items-center gap-2 text-xs transition-opacity animate-slide-up ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' 
            : 'bg-red-950/60 border-red-800 text-red-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

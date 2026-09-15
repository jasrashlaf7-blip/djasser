/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { HelpCircle, PlusCircle, Search, Sparkles, MapPin, Tag, RefreshCw, AlertCircle } from 'lucide-react';
import { Language } from '../../types';

interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  name: string;
  category: string;
  location: string;
  details: string;
  addedAt: string;
}

interface MatchResult {
  lostItem: LostFoundItem;
  foundItem: LostFoundItem;
  score: number; // 0 to 100
}

const CATEGORIES = {
  en: ['Electronics', 'Wallets & Cards', 'Keys', 'Bags & Luggage', 'Documents', 'Others'],
  ar: ['إلكترونيات وهواتف', 'محافظ وبطاقات نقدية', 'مفاتيح وممتلكات صغيرة', 'حقائب وأمتعة', 'وثائق ومستندات رسمية', 'أخرى'],
  fr: ['Électronique', 'Portefeuilles & Cartes', 'Clés', 'Sacs & Bagages', 'Documents', 'Autres'],
};

const LOCATIONS = {
  en: ['USTHB University Campus', 'Boumerdès Downtown', 'Tramway Station', 'National Library', 'Cafeteria / Restaurant'],
  ar: ['حرم جامعة باب الزوار (USTHB)', 'وسط مدينة بومرداس', 'محطة الترامواي', 'المكتبة الوطنية', 'المقهى / المطعم'],
  fr: ['Campus Universitaire USTHB', 'Centre-ville de Boumerdès', 'Station de Tramway', 'Bibliothèque Nationale', 'Cafétéria / Restaurant'],
};

export default function LostLoop({ lang }: { lang: Language }) {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Load items from local storage
  useEffect(() => {
    const saved = localStorage.getItem('djasser_lost_loop');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed || []);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Compute matches whenever items list changes
  useEffect(() => {
    calculateMatches();
  }, [items]);

  const saveItems = (newItems: LostFoundItem[]) => {
    setItems(newItems);
    localStorage.setItem('djasser_lost_loop', JSON.stringify(newItems));
  };

  const calculateMatches = () => {
    const losts = items.filter(i => i.type === 'lost');
    const founds = items.filter(i => i.type === 'found');
    const matchedResults: MatchResult[] = [];

    losts.forEach(lost => {
      founds.forEach(found => {
        let score = 0;

        // 1. Category Match (40 points)
        if (lost.category === found.category) {
          score += 40;
        }

        // 2. Location Match (30 points)
        if (lost.location === found.location) {
          score += 30;
        }

        // 3. Name & Details Similarity (up to 30 points)
        const lostWords = `${lost.name} ${lost.details}`.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const foundWords = `${found.name} ${found.details}`.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        
        let matchCount = 0;
        lostWords.forEach(lw => {
          if (foundWords.some(fw => fw.includes(lw) || lw.includes(fw))) {
            matchCount++;
          }
        });

        if (lostWords.length > 0) {
          const overlapRatio = matchCount / Math.max(lostWords.length, 1);
          score += Math.min(Math.round(overlapRatio * 30), 30);
        }

        // Only register significant matches
        if (score >= 40) {
          matchedResults.push({
            lostItem: lost,
            foundItem: found,
            score,
          });
        }
      });
    });

    // Sort matches by highest score first
    matchedResults.sort((a, b) => b.score - a.score);
    setMatches(matchedResults);
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !details.trim()) {
      setFeedback(lang === 'ar' ? 'يرجى تعبئة جميع الحقول المطلوبة.' : lang === 'fr' ? 'Veuillez remplir les champs.' : 'Please fill in all required fields.');
      return;
    }

    const newItem: LostFoundItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: itemName.trim(),
      category: category || CATEGORIES[lang][0],
      location: location || LOCATIONS[lang][0],
      details: details.trim(),
      addedAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        day: 'numeric',
      }),
    };

    const updated = [...items, newItem];
    saveItems(updated);

    setItemName('');
    setDetails('');
    setFeedback(
      lang === 'ar'
        ? `تم تسجيل الـ ${type === 'lost' ? 'مفقود' : 'معثور عليه'} وجاري مطابقة البيانات!`
        : lang === 'fr'
          ? `Enregistré! Recherche de correspondances en cours.`
          : 'Item registered! Checking match scores now.'
    );
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleClear = () => {
    setItems([]);
    setMatches([]);
    localStorage.removeItem('djasser_lost_loop');
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 p-5 md:p-6 text-slate-100 max-w-4xl mx-auto shadow-2xl">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-semibold bg-pink-500/10 text-pink-400 rounded-full border border-pink-500/20">
              {lang === 'ar' ? 'نموذج مطابقة ذكي' : lang === 'fr' ? 'Modèle de Correspondance' : 'Matching Engine'}
            </span>
            <span className="text-xs text-slate-500 font-mono">LostLoop v1.0</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight">
            🔎 LostLoop
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {lang === 'ar'
              ? 'نظام تعقب للمفقودات والمعثورات يقوم بحساب نسبة مطابقة ذكية بين البلاغات فوراً.'
              : lang === 'fr'
                ? 'Système de gestion des objets perdus et trouvés avec algorithme de matching croisé.'
                : 'Smart lost-and-found system that scores possible matches between missing and found items.'}
          </p>
        </div>

        <button 
          onClick={handleClear}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-lg cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {lang === 'ar' ? 'مسح البيانات' : lang === 'fr' ? 'Effacer tout' : 'Clear Database'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-5 bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-pink-400" />
            {lang === 'ar' ? 'تسجيل بلاغ جديد' : lang === 'fr' ? 'Déclarer un Objet' : 'File a New Report'}
          </h4>

          <form onSubmit={handleAddItem} className="flex flex-col gap-3">
            {/* Type selector tabs */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-900">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                  type === 'lost' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'فقدت غرضاً 👤' : lang === 'fr' ? 'Perdu 👤' : 'Lost Item 👤'}
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                  type === 'found' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'وجدت غرضاً 📦' : lang === 'fr' ? 'Trouvé 📦' : 'Found Item 📦'}
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'اسم الغرض' : lang === 'fr' ? 'Nom de l’objet' : 'Item Name'}</label>
              <input 
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: مفاتيح شقة بميدالية زرقاء' : lang === 'fr' ? 'Ex: Clés de voiture' : 'Ex: Keys with blue keychain'}
                className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'الفئة' : lang === 'fr' ? 'Catégorie' : 'Category'}</label>
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

              <div>
                <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'الموقع التقريبي' : lang === 'fr' ? 'Lieu' : 'Location'}</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none"
                >
                  {LOCATIONS[lang].map((l: string) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'تفاصيل إضافية / علامات فارقة' : lang === 'fr' ? 'Description des détails' : 'Details & Key Identifiers'}</label>
              <textarea 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder={lang === 'ar' ? 'مثال: سقطت في الترامواي حوالي الساعة الرابعة زوالاً، تحتوي على ٣ مفاتيح' : lang === 'fr' ? 'Détails, heure approximative...' : 'Ex: Contains 3 house keys and an attached USB drive.'}
                className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-950/20"
            >
              <PlusCircle className="w-4 h-4" />
              {lang === 'ar' ? 'تأكيد التسجيل والبلاغ' : lang === 'fr' ? 'Créer la déclaration' : 'Submit Report'}
            </button>
          </form>

          {feedback && (
            <div className="mt-3 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Right: Matches Showcase & Raw logs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Matches Panel */}
          <div className="bg-slate-950/20 border border-slate-800/80 rounded-xl p-4 flex-1">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              {lang === 'ar' ? 'محرك مطابقة البلاغات الذكي' : lang === 'fr' ? 'Correspondances Trouvées' : 'Smart Matches Detected'}
              <span className="text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono px-2 py-0.5 rounded-full font-bold ml-auto shrink-0">
                {matches.length} {lang === 'ar' ? 'تطابقات' : 'matches'}
              </span>
            </h4>

            <div className="overflow-y-auto max-h-[190px] pr-1 flex flex-col gap-3 custom-scrollbar">
              {matches.length > 0 ? (
                matches.map((match, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-900 p-3 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
                    {/* Glow backdrop on high scores */}
                    {match.score >= 70 && (
                      <div className="absolute right-0 top-0 w-24 h-24 bg-pink-500/5 blur-xl pointer-events-none rounded-full group-hover:bg-pink-500/10 transition-colors"></div>
                    )}
                    
                    {/* Header score badge */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Matched Pair</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        match.score >= 70 
                          ? 'bg-pink-500/10 text-pink-400 border-pink-500/20 animate-pulse' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {match.score}% {lang === 'ar' ? 'تطابق' : 'Match'}
                      </span>
                    </div>

                    {/* Compare info cards */}
                    <div className="grid grid-cols-2 gap-3 items-center text-xs">
                      <div className="border-r border-slate-800/80 pr-2">
                        <div className="text-[10px] text-pink-400 font-semibold">{lang === 'ar' ? 'مفقود' : 'LOST'}</div>
                        <div className="font-bold text-slate-100 truncate">{match.lostItem.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{match.lostItem.details}</div>
                      </div>
                      <div className="pl-1">
                        <div className="text-[10px] text-emerald-400 font-semibold">{lang === 'ar' ? 'معثور عليه' : 'FOUND'}</div>
                        <div className="font-bold text-slate-100 truncate">{match.foundItem.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{match.foundItem.details}</div>
                      </div>
                    </div>

                    {/* Shared categories */}
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-900 pt-2 text-[9px] text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        {match.lostItem.category}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[150px]" title={match.lostItem.location}>
                        <MapPin className="w-2.5 h-2.5 text-slate-500" />
                        {match.lostItem.location}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs italic flex flex-col items-center gap-2">
                  <HelpCircle className="w-8 h-8 text-slate-800" />
                  {lang === 'ar' ? 'لم تكتشف تطابقات عالية حتى الآن. أضف عناصر في كلا الخيارين لتجربة المطابقة.' : lang === 'fr' ? 'Aucune correspondance identifiée.' : 'No active matching pairs detected yet. Add both lost and found items to test the engine.'}
                </div>
              )}
            </div>
          </div>

          {/* Registered Items Log list */}
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">{lang === 'ar' ? 'سجل البلاغات المسجلة' : lang === 'fr' ? 'Déclarations enregistrées' : 'Registered Claims Log'}</h4>
            <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto pr-1">
              {items.length > 0 ? (
                items.map((it) => (
                  <span 
                    key={it.id}
                    className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${
                      it.type === 'lost' 
                        ? 'bg-pink-500/5 text-pink-400 border-pink-500/10' 
                        : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <strong className="truncate max-w-[80px]">{it.name}</strong>
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-600 italic">{lang === 'ar' ? 'قاعدة البيانات فارغة.' : lang === 'fr' ? 'Aucun objet.' : 'No registered items yet.'}</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

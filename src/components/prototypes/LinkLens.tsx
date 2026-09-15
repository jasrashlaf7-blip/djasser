/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, Info, HelpCircle } from 'lucide-react';
import { Language } from '../../types';

interface DetectedSignal {
  id: string;
  severity: 'high' | 'medium' | 'info';
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export default function LinkLens({ lang }: { lang: Language }) {
  const [url, setUrl] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [score, setScore] = useState(0); // 0 (Safe) to 100 (Extremely Dangerous)
  const [signals, setSignals] = useState<DetectedSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeUrl = (inputUrl: string) => {
    if (!inputUrl) return;
    setIsLoading(true);
    setAnalyzed(false);

    // Simulate analysis delay
    setTimeout(() => {
      let currentScore = 0;
      const detected: DetectedSignal[] = [];
      let cleanUrl = inputUrl.trim().toLowerCase();

      // Ensure URL scheme is parsed or prepended
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'http://' + cleanUrl;
      }

      try {
        const parsed = new URL(cleanUrl);
        const host = parsed.hostname;
        const protocol = parsed.protocol;
        const path = parsed.pathname + parsed.search;

        // 1. Protocol check
        if (protocol === 'http:') {
          currentScore += 25;
          detected.push({
            id: 'http',
            severity: 'medium',
            title: {
              en: 'Unencrypted Connection (HTTP)',
              ar: 'اتصال غير مشفر (HTTP)',
              fr: 'Connexion non sécurisée (HTTP)',
            },
            description: {
              en: 'The site transmits data in plaintext, exposing users to interception.',
              ar: 'ينقل الموقع البيانات بشكل غير مشفر، مما يعرض المستخدمين للتنصت والسرقة.',
              fr: 'Le site transmet des données en clair, exposant les informations à l’interception.',
            },
          });
        }

        // 2. IP Address check
        const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (ipRegex.test(host)) {
          currentScore += 35;
          detected.push({
            id: 'ip',
            severity: 'high',
            title: {
              en: 'IP Address Hostname',
              ar: 'اسم المضيف كـ عنوان IP',
              fr: 'Adresse IP en guise d’hôte',
            },
            description: {
              en: 'Legitimate services rarely use raw IP addresses for their hostnames. This is a common evasion tactic.',
              ar: 'نادراً ما تستخدم الخدمات الموثوقة عناوين IP كعنوان مضيف رئيسي. هذا تكتيك شائع للتمويه.',
              fr: 'Les services légitimes utilisent rarement des adresses IP brutes. C’est une tactique d’évasion classique.',
            },
          });
        }

        // 3. Shortener checks
        const shorteners = ['bit.ly', 'goo.gl', 't.co', 'tinyurl.com', 'is.gd', 'ow.ly', 'buff.ly', 'rebrand.ly'];
        if (shorteners.some(s => host.includes(s))) {
          currentScore += 20;
          detected.push({
            id: 'shortener',
            severity: 'medium',
            title: {
              en: 'Shortened URL Detected',
              ar: 'رابط مختصر ومخفي',
              fr: 'URL Raccourcie Détectée',
            },
            description: {
              en: 'URL shorteners hide the final destination address, commonly used to bypass visual security checks.',
              ar: 'تخفي الروابط المختصرة الوجهة الحقيقية للموقع، وتستخدم عادة لتخطي الفحوصات الأمنية البصرية.',
              fr: 'Les réducteurs de liens masquent la destination finale, souvent pour tromper l’analyse visuelle.',
            },
          });
        }

        // 4. Suspicious subdomains count
        const subdomains = host.split('.');
        // e.g. login.paypal.secure.com-verify.xyz (lots of dots)
        if (subdomains.length > 3) {
          currentScore += 20;
          detected.push({
            id: 'subdomains',
            severity: 'medium',
            title: {
              en: 'Excessive Subdomains',
              ar: 'نطاقات فرعية مفرطة',
              fr: 'Sous-domaines excessifs',
            },
            description: {
              en: 'Using more than 3 subdomains is a high indicator of lookalike phishing pages targeting specific brands.',
              ar: 'استخدام أكثر من 3 نطاقات فرعية يعد مؤشراً قوياً على مواقع تصيد تحاكي علامات تجارية كبرى.',
              fr: 'L’usage de plus de 3 sous-domaines est un fort indicateur d’imitation de marques.',
            },
          });
        }

        // 5. Suspicious TLDs
        const suspiciousTlds = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.club', '.info', '.bid', '.download', '.site', '.online'];
        const matchedTld = suspiciousTlds.find(tld => host.endsWith(tld));
        if (matchedTld) {
          currentScore += 15;
          detected.push({
            id: 'tld',
            severity: 'info',
            title: {
              en: `Suspicious Top-Level Domain (${matchedTld})`,
              ar: `نطاق علوي مشبوه (${matchedTld})`,
              fr: `Extension de domaine suspecte (${matchedTld})`,
            },
            description: {
              en: 'Cheap or free domain extensions are statistically more abused by malicious actors to host fleeting phishing campaigns.',
              ar: 'النطاقات الرخيصة أو المجانية يساء استخدامها إحصائياً بكثرة من قبل المخترقين لاستضافة مواقع التصيد السريعة.',
              fr: 'Les extensions bon marché ou gratuites sont statistiquement plus exploitées pour héberger des arnaques éphémères.',
            },
          });
        }

        // 6. Security keywords check in host/path (phishing bait)
        const phishKeywords = ['login', 'signin', 'verify', 'update', 'secure', 'bank', 'wallet', 'paypal', 'netflix', 'facebook', 'google', 'apple', 'account', 'recovery', 'checkout', 'billing', 'support'];
        const matchedKeywords = phishKeywords.filter(kw => host.includes(kw) || path.includes(kw));
        if (matchedKeywords.length > 0) {
          const isLegitBrandMatch = matchedKeywords.some(kw => host === `${kw}.com` || host === `www.${kw}.com` || host.endsWith(`.${kw}.com`));
          
          if (!isLegitBrandMatch) {
            currentScore += 30;
            detected.push({
              id: 'keywords',
              severity: 'high',
              title: {
                en: `Misplaced Security Keywords`,
                ar: 'كلمات أمنية مشبوهة في غير مكانها',
                fr: 'Mots-clés de confiance suspects',
              },
              description: {
                en: `Contains brand or security indicators (${matchedKeywords.slice(0, 3).join(', ')}) in an unrecognized host domain, raising lookalike suspicion.`,
                ar: `يحتوي الرابط على كلمات حماية أو أسماء شركات مثل (${matchedKeywords.slice(0, 3).join(', ')}) في نطاق غير رسمي، مما يزيد شبهة الاحتيال البصري.`,
                fr: `Contient des termes d’autorité ou de marques (${matchedKeywords.slice(0, 3).join(', ')}) sur un hôte non officiel, créant une forte suspicion d’imitation.`,
              },
            });
          }
        }

        // Limit score to max 100
        currentScore = Math.min(currentScore, 100);

        // If score is 0 and URL looks okay, let's keep it healthy
        if (detected.length === 0) {
          currentScore = 5; // tiny trace score
        }

        setScore(currentScore);
        setSignals(detected);
      } catch (err) {
        // Invalid URL format
        setScore(85);
        setSignals([
          {
            id: 'invalid-url',
            severity: 'high',
            title: {
              en: 'Malformed URL Syntax',
              ar: 'صيغة رابط غير صالحة',
              fr: 'Structure d’URL invalide',
            },
            description: {
              en: 'The provided text does not match standard URL syntax patterns, commonly used to disrupt security parsing systems.',
              ar: 'النص المدخل لا يتوافق مع بنية الروابط القياسية، وهي حيلة تستخدم لتعطيل أنظمة الفحص التلقائية.',
              fr: 'La chaîne saisie ne respecte pas les standards syntaxiques d’une URL, une méthode employée pour perturber les analyseurs.',
            },
          },
        ]);
      }

      setIsLoading(false);
      setAnalyzed(true);
    }, 1200);
  };

  const getRiskLabel = (val: number) => {
    if (val < 20) return {
      text: lang === 'ar' ? 'آمن (تقييم أولي)' : lang === 'fr' ? 'Sûr (Heuristique)' : 'Low Risk',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: ShieldCheck,
    };
    if (val < 50) return {
      text: lang === 'ar' ? 'شبهة متوسطة' : lang === 'fr' ? 'Suspicion Modérée' : 'Moderate Suspicion',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: AlertTriangle,
    };
    return {
      text: lang === 'ar' ? 'خطورة عالية جداً' : lang === 'fr' ? 'Risque Élevé' : 'High Suspicion',
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      icon: ShieldAlert,
    };
  };

  const risk = getRiskLabel(score);
  const RiskIcon = risk.icon;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 p-5 md:p-6 text-slate-100 max-w-4xl mx-auto shadow-2xl">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            {lang === 'ar' ? 'محلل فوري' : lang === 'fr' ? 'Analyseur Heuristique' : 'Explainable Analyzer'}
          </span>
          <span className="text-xs text-slate-500 font-mono">LinkLens v2.0</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight flex items-center gap-2">
          🛡️ LinkLens
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          {lang === 'ar'
            ? 'فحص الروابط المشبوهة وكشف الحيل البصرية وحيل الاصطياد عبر لوحة تفسيرية مدعومة بالقواعد.'
            : lang === 'fr'
              ? 'Analysez les liens suspects et comprenez les signaux d’alerte grâce à des règles heuristiques claires.'
              : 'Explainable URL risk analyzer using transparent heuristics to expose phishing and spoofing tricks.'}
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 mb-6">
        <label className="block text-xs text-slate-400 mb-2 font-medium">
          {lang === 'ar' ? 'أدخل الرابط المراد تحليله' : lang === 'fr' ? 'Saisir l’URL à inspecter' : 'Enter URL to analyze'}
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ex: login.secure-banking-verify.xyz/signin"
              className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
          <button
            onClick={() => analyzeUrl(url)}
            disabled={isLoading || !url.trim()}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors cursor-pointer shrink-0"
          >
            {isLoading ? (lang === 'ar' ? 'جاري الفحص...' : lang === 'fr' ? 'Analyse...' : 'Analyzing...') : (lang === 'ar' ? 'حلل الرابط الآن' : lang === 'fr' ? 'Analyser le lien' : 'Analyze Link')}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Dial / Meter Card */}
          <div className="lg:col-span-4 bg-slate-950/30 border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-4">{lang === 'ar' ? 'مؤشر التهديد' : lang === 'fr' ? 'NIVEAU DE MENACE' : 'THREAT METER'}</div>
            
            {/* Circle Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="72" 
                  cy="72" 
                  r="60" 
                  stroke="#1e293b" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="60" 
                  stroke={score < 20 ? '#10b981' : score < 50 ? '#f59e0b' : '#ef4444'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={376.8}
                  strokeDashoffset={376.8 - (376.8 * score) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white font-mono">{score}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">{lang === 'ar' ? 'معدل الخطر' : lang === 'fr' ? 'Indice' : 'Risk Score'}</span>
              </div>
            </div>

            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${risk.color} flex items-center gap-1.5`}>
              <RiskIcon className="w-3.5 h-3.5" />
              <span>{risk.text}</span>
            </div>
          </div>

          {/* Explainable Signals list */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              {lang === 'ar' ? 'الإشارات الأمنية المكتشفة' : lang === 'fr' ? 'Détail des signaux d’analyse' : 'Explainable Security Signals'}
            </h4>

            <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 flex flex-col gap-3 custom-scrollbar">
              {signals.length > 0 ? (
                signals.map((sig) => (
                  <div key={sig.id} className="bg-slate-950/50 border border-slate-900 rounded-lg p-3 flex gap-3">
                    <div className="mt-0.5">
                      {sig.severity === 'high' ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      ) : sig.severity === 'medium' ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white leading-tight">{sig.title[lang]}</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{sig.description[lang]}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-4 text-center flex flex-col items-center gap-1.5">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  <div className="text-xs font-semibold text-emerald-400">{lang === 'ar' ? 'لم تكتشف أنماط احتيال ظاهرة' : lang === 'fr' ? 'Aucun signal suspect' : 'No Suspicious Patterns Detected'}</div>
                  <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'الرابط يتبع الهياكل القياسية للمواقع الرسمية الآمنة.' : lang === 'fr' ? 'La structure respecte les standards usuels de confiance.' : 'The URL follows standard formatting parameters associated with legitimate websites.'}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Disclaimer Box */}
      <div className="mt-6 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex gap-3 items-start">
        <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-indigo-300 font-medium mr-1 uppercase font-mono text-[10px] tracking-wider block md:inline mb-1 md:mb-0">
            {lang === 'ar' ? 'تنويه أمني مهم:' : lang === 'fr' ? 'Clause de non-responsabilité:' : 'Important Disclaimer:'}
          </strong>
          {lang === 'ar'
            ? 'هذا نظام نموذجي مبدئي قائم على القواعد الهيكلية البصرية وليس أداة كشف تصيد نهائية. لا يعبر الفحص عن سلامة المواقع من الفيروسات الخلفية أو حوادث القرصنة المتقدمة.'
            : lang === 'fr'
              ? 'Il s’agit d’un prototype pédagogique exploitant des filtres heuristiques visuels et non d’un outil de sécurité complet. Il ne garantit pas la sécurité contre des piratages avancés.'
              : 'This is a prototype focusing on structural heuristics and is not a definitive phishing detector. It does not certify the presence of backend malware or active server-side breach vectors.'}
        </div>
      </div>
    </div>
  );
}

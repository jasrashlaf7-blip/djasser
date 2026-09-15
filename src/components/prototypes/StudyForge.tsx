/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Calendar, Plus, Play, Pause, RotateCcw, CheckCircle2, Circle, Clock, Flame, Brain, AlertCircle } from 'lucide-react';
import { Language } from '../../types';

interface StudyTask {
  id: string;
  name: string;
  difficulty: number; // 1-5
  urgency: number; // 1-5
  timeEstimate: number; // minutes
  score: number; // adaptive calculated priority
  completed: boolean;
}

export default function StudyForge({ lang }: { lang: Language }) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [taskName, setTaskName] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [timeEstimate, setTimeEstimate] = useState(45); // mins
  const [feedback, setFeedback] = useState<string | null>(null);

  // Focus Timer States
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTimerType, setActiveTimerType] = useState<'focus' | 'break'>('focus');
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load state
  useEffect(() => {
    const saved = localStorage.getItem('djasser_study_forge');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed || []);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Prepopulate with clever study tasks
      const defaults: StudyTask[] = [
        {
          id: 'task-1',
          name: 'Master Python Object-Oriented Programming (OOP) syntax structures',
          difficulty: 4,
          urgency: 4,
          timeEstimate: 90,
          score: Math.round(((4 * 0.4) + (4 * 0.6)) * 20), // 80
          completed: false,
        },
        {
          id: 'task-2',
          name: 'Review mobile layouts and grid ratios for USTHB dev team submission',
          difficulty: 3,
          urgency: 5,
          timeEstimate: 30,
          score: Math.round(((3 * 0.4) + (5 * 0.6)) * 20), // 84
          completed: false,
        },
      ];
      setTasks(defaults);
      localStorage.setItem('djasser_study_forge', JSON.stringify(defaults));
    }
  }, []);

  // Timer Countdown Tick
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(s => s - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            // Timer expired!
            triggerAlarm();
            handleTimerComplete();
          } else {
            setTimerMinutes(m => m - 1);
            setTimerSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, timerMinutes, timerSeconds]);

  const saveTasks = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('djasser_study_forge', JSON.stringify(newTasks));
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setFeedback(lang === 'ar' ? 'الرجاء إدخال اسم المهمة.' : lang === 'fr' ? 'Saisir la tâche.' : 'Please enter task name.');
      return;
    }

    // Adaptive priority algorithm
    // Difficulty gets 40% weight, Urgency gets 60% weight
    // Scale is multiplied by 20 to map it cleanly out of 100 points
    const calculatedScore = Math.round(((difficulty * 0.4) + (urgency * 0.6)) * 20);

    const newTask: StudyTask = {
      id: Math.random().toString(36).substr(2, 9),
      name: taskName.trim(),
      difficulty,
      urgency,
      timeEstimate,
      score: calculatedScore,
      completed: false,
    };

    const updated = [...tasks, newTask];
    saveTasks(updated);
    setTaskName('');
    setFeedback(lang === 'ar' ? 'تمت إضافة المهمة وجدولة وزنها الذكي!' : lang === 'fr' ? 'Tâche ajoutée avec priorité adaptative !' : 'Task added with adaptive priority scoring!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleComplete = (id: string) => {
    const updated = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);

    // Play crisp success tone on completion
    const isNowCompleted = updated.find(t => t.id === id)?.completed;
    if (isNowCompleted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.24); // G5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {}
    }
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  const triggerAlarm = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.15); // C6
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  };

  const handleTimerComplete = () => {
    setTimerRunning(false);
    if (activeTimerType === 'focus') {
      setActiveTimerType('break');
      setTimerMinutes(5); // 5 min break
      setTimerSeconds(0);
      setFeedback(lang === 'ar' ? 'انتهت جلسة التركيز! خذ قسطاً من الراحة.' : lang === 'fr' ? 'Session terminée ! Prenez une pause.' : 'Focus session completed! Take a short break.');
    } else {
      setActiveTimerType('focus');
      setTimerMinutes(25); // 25 min focus
      setTimerSeconds(0);
      setFeedback(lang === 'ar' ? 'انتهت الاستراحة! لنعد للعمل والتركيز.' : lang === 'fr' ? 'Pause terminée ! Retour au travail.' : 'Break finished! Back to focus.');
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerMinutes(activeTimerType === 'focus' ? 25 : 5);
    setTimerSeconds(0);
  };

  const formatTime = (m: number, s: number) => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sort tasks by completed (bottom) and highest score (top)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return b.score - a.score;
  });

  const activeFocusTask = sortedTasks.find(t => !t.completed);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 p-5 md:p-6 text-slate-100 max-w-4xl mx-auto shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-semibold bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
              {lang === 'ar' ? 'مجدول إنتاجية' : lang === 'fr' ? 'Planificateur Adaptatif' : 'Productivity Tool'}
            </span>
            <span className="text-xs text-slate-500 font-mono">StudyForge v1.3</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight">
            🧠 StudyForge
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {lang === 'ar'
              ? 'مخطط دراسة متكيف يزن صعوبة المهام ومدى استعجالها لترتيب طابور تركيزك مع مؤقت الطماطم البصري.'
              : lang === 'fr'
                ? 'Planificateur adaptatif classant les tâches et intégrant un minuteur Pomodoro.'
                : 'Adaptive study planner that ranks tasks mathematically and establishes a focused Pomodoro workflow.'}
          </p>
        </div>

        <button 
          onClick={() => {
            setTasks([]);
            localStorage.removeItem('djasser_study_forge');
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-lg cursor-pointer transition-colors"
        >
          {lang === 'ar' ? 'تصفير المهام' : 'Clear All Tasks'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Study Form Organizer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Add Form */}
          <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-400" />
              {lang === 'ar' ? 'إضافة مهمة دراسية جديدة' : lang === 'fr' ? 'Ajouter une Tâche' : 'Add Study Task'}
            </h4>

            <form onSubmit={handleAddTask} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'عنوان الموضوع أو الواجب' : lang === 'fr' ? 'Nom de la tâche' : 'Task Name / Objective'}</label>
                <input 
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: مراجعة خوارزميات الترتيب' : lang === 'fr' ? 'Ex: Réviser algos...' : 'Ex: Review sorting algorithms'}
                  className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'درجة الصعوبة' : lang === 'fr' ? 'Difficulté' : 'Difficulty'}</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} ({n === 5 ? 'Hardest' : n === 1 ? 'Easiest' : 'Medium'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'درجة الاستعجال' : lang === 'fr' ? 'Urgence' : 'Urgency'}</label>
                  <select 
                    value={urgency}
                    onChange={(e) => setUrgency(Number(e.target.value))}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} ({n === 5 ? 'Now' : n === 1 ? 'Later' : 'Soon'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{lang === 'ar' ? 'الوقت المتوقع (بالدقائق)' : lang === 'fr' ? 'Estimation (min)' : 'Time Estimate (minutes)'}</label>
                <input 
                  type="number"
                  min="5"
                  max="480"
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(Number(e.target.value))}
                  className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-violet-950/20"
              >
                <Plus className="w-4 h-4" />
                {lang === 'ar' ? 'تأكيد وحساب الوزن الأنسب' : lang === 'fr' ? 'Créer la tâche' : 'Forge Task'}
              </button>
            </form>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg text-xs text-violet-400 flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

        </div>

        {/* Right: Pomodoro Timer & Tasks List */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Integrated Pomodoro Focus Container */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="text-center md:text-left">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 justify-center md:justify-start mb-1">
                <Brain className="w-3.5 h-3.5" />
                {activeTimerType === 'focus' ? (lang === 'ar' ? 'جلسة تركيز قصوى' : 'FOCUS TIMER ACTIVE') : (lang === 'ar' ? 'استراحة مستحقة' : 'BREAK ACTIVE')}
              </div>
              <h4 className="text-xs text-slate-400 truncate max-w-[200px]" title={activeFocusTask?.name}>
                {lang === 'ar' ? 'المهمة الحالية: ' : 'Focusing on: '}
                <strong className="text-slate-200">{activeFocusTask ? activeFocusTask.name : (lang === 'ar' ? 'لا يوجد مهمة نشطة' : 'No tasks left')}</strong>
              </h4>
            </div>

            {/* Timer Core UI */}
            <div className="flex items-center gap-4">
              <div className="font-mono text-3xl font-extrabold text-white tracking-widest bg-slate-950/80 border border-slate-900 px-3.5 py-1.5 rounded-lg">
                {formatTime(timerMinutes, timerSeconds)}
              </div>
              
              <div className="flex gap-1.5">
                <button
                  onClick={toggleTimer}
                  className="p-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white transition-colors cursor-pointer"
                  title="Play / Pause"
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sorted Adaptive Task List */}
          <div className="bg-slate-950/20 border border-slate-800/80 rounded-xl p-4 flex-1">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-400" />
              {lang === 'ar' ? 'ترتيب المهام حسب الأولوية الذكية' : lang === 'fr' ? 'Stack de tâches intelligentes' : 'Adaptive Priority Focus Stack'}
            </h4>

            <div className="overflow-y-auto max-h-[160px] pr-1 flex flex-col gap-2 custom-scrollbar">
              {sortedTasks.length > 0 ? (
                sortedTasks.map((t) => (
                  <div 
                    key={t.id}
                    className={`p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all ${
                      t.completed 
                        ? 'bg-slate-950/30 border-slate-900/60 opacity-50' 
                        : 'bg-slate-950/50 border-slate-900 hover:border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button 
                        onClick={() => handleToggleComplete(t.id)}
                        className="text-slate-500 hover:text-violet-400 shrink-0 cursor-pointer"
                      >
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 shrink-0" />
                        )}
                      </button>
                      
                      <div className="min-w-0 flex-1">
                        <span className={`font-medium block truncate text-slate-100 ${t.completed ? 'line-through text-slate-500' : ''}`}>
                          {t.name}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-600" />
                            {t.timeEstimate}m
                          </span>
                          <span>·</span>
                          <span>Diff: {t.difficulty}/5</span>
                          <span>·</span>
                          <span>Urg: {t.urgency}/5</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                        t.completed 
                          ? 'bg-slate-900 text-slate-600 border-slate-950' 
                          : t.score >= 70 
                            ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' 
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        <Flame className="w-3 h-3 text-slate-500 shrink-0" />
                        {t.score}
                      </span>

                      <button
                        onClick={() => handleDeleteTask(t.id)}
                        className="text-slate-600 hover:text-red-400 text-[10px] px-1 py-0.5 transition-colors cursor-pointer"
                      >
                        {lang === 'ar' ? 'حذف' : 'Del'}
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs italic">
                  {lang === 'ar' ? 'طابور المهام فارغ تماماً!' : 'All study goals forged! Excellent work.'}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

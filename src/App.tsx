import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Brain, 
  ChevronRight, 
  Globe, 
  Info, 
  X, 
  Send, 
  RefreshCw, 
  Skull, 
  Package, 
  Activity,
  ArrowRight,
  Sun,
  Moon,
  MessageSquare,
  ArrowLeft,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import Background from './components/Background';
import { startSimulation, sendMessage, generateReport, SimulationResponse, SimulationReport } from './services/gemini';

// --- TYPES ---
type AppState = 'LANDING' | 'SETUP' | 'SIMULATION' | 'GAMEOVER';
type Language = 'ITA' | 'ENG';

interface GameState {
  trust: number;
  tension: number;
  stamina: number;
  vibe: string;
  language: Language;
}

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  ITA: {
    tagline: "L'evoluzione della simulazione sociale",
    slogan_main: "DOMINA OGNI",
    slogan_sub: "INTERAZIONE",
    start_btn: "Inizia ora la tua simulazione",
    how_it_works: "Come funziona?",
    suggested_title: "Scenari Consigliati",
    suggestions: [
      { title: "Negoziazione Ostaggi", desc: "Tratta con un sequestratore in una banca." },
      { title: "Debito Insoluto", desc: "Recupera un credito da un vecchio amico ostile." },
      { title: "Crisi Diplomatica", desc: "Evita un conflitto tra due fazioni rivali." },
      { title: "Interrogatorio", desc: "Ottieni la verità da un sospettato reticente." }
    ],
    setup_title: "Configurazione Synapse",
    context_label: "Scenario",
    context_placeholder: "Esempio: Colloquio di lavoro, Primo appuntamento, Negoziazione ostaggio...",
    difficulty_label: "Complessità",
    interlocutor_section: "L'Interlocutore",
    interlocutor_desc: "Definisci chi avrai di fronte nella simulazione",
    personality_label: "Personalità dell'Interlocutore",
    personality_placeholder: "Esempio: Freddo, Empatico, Aggressivo...",
    knows_user_label: "Ti conosce già?",
    knows_user_yes: "Sì (Familiare)",
    knows_user_no: "No (Estraneo)",
    gender_label: "Sesso",
    age_label: "Età",
    user_section: "Il Tuo Profilo",
    user_desc: "Definisci come appari e chi sei nel sistema",
    name_label: "Nome",
    surname_label: "Cognome",
    user_age_label: "Età",
    desc_label: "La Tua Descrizione Fisica",
    desc_placeholder: "Esempio: Alto, vestito elegante, sguardo stanco...",
    launch_btn: "Avvia Simulazione",
    back_btn: "Indietro",
    tutorial_title: "Protocollo Synapse OS",
    tutorial_steps: [
      "Synapse OS simula scenari sociali realistici basati sui tuoi input.",
      "TRUST: Rappresenta la fiducia dell'interlocutore. Aumentala con l'empatia.",
      "TENSION: Se raggiunge il 100%, la simulazione fallisce (Game Over).",
      "STAMINA: Ogni interazione consuma energia mentale. Se finisce, svieni.",
      "Usa i 'Trigger d'Impulso' per azioni rapide o scrivi liberamente."
    ],
    game_over: "SIMULAZIONE TERMINATA",
    stop_simulation: "INTERROMPI",
    restart: "Riavvia Sistema",
    input_placeholder: "Digita la tua risposta...",
    stats: {
      trust: "FIDUCIA",
      tension: "TENSIONE",
      stamina: "ENERGIA"
    },
    report: {
      title: "REPORT ANALITICO",
      score: "SOCIAL IQ",
      persuasion: "PERSUASIONE",
      ei: "INTEL. EMOTIVA",
      pressure: "GESTIONE PRESSIONE",
      key_moment: "MOMENTO CHIAVE",
      pro_tip: "CONSIGLIO PRO"
    }
  },
  ENG: {
    tagline: "The evolution of social simulation",
    slogan_main: "MASTER EVERY",
    slogan_sub: "INTERACTION",
    start_btn: "Start your simulation now",
    how_it_works: "How it works?",
    suggested_title: "Suggested Scenarios",
    suggestions: [
      { title: "Hostage Negotiation", desc: "Negotiate with a kidnapper in a bank." },
      { title: "Unpaid Debt", desc: "Recover a debt from a hostile old friend." },
      { title: "Diplomatic Crisis", desc: "Avoid a conflict between two rival factions." },
      { title: "Interrogation", desc: "Get the truth from a reticent suspect." }
    ],
    setup_title: "Synapse Configuration",
    context_label: "Scenario",
    context_placeholder: "Example: Job interview, First date, Hostage negotiation...",
    difficulty_label: "Complexity",
    interlocutor_section: "The Interlocutor",
    interlocutor_desc: "Define who you will face in the simulation",
    personality_label: "Interlocutor's Personality",
    personality_placeholder: "Example: Cold, Empathic, Aggressive...",
    knows_user_label: "Does he/she know you?",
    knows_user_yes: "Yes (Familiar)",
    knows_user_no: "No (Stranger)",
    gender_label: "Gender",
    age_label: "Age",
    user_section: "Your Profile",
    user_desc: "Define how you appear and who you are in the system",
    name_label: "First Name",
    surname_label: "Last Name",
    user_age_label: "Age",
    desc_label: "Your Physical Description",
    desc_placeholder: "Example: Tall, elegantly dressed, tired look...",
    launch_btn: "Launch Simulation",
    back_btn: "Back",
    tutorial_title: "Synapse OS Protocol",
    tutorial_steps: [
      "Synapse OS simulates realistic social scenarios based on your inputs.",
      "TRUST: Represents the interlocutor's trust. Increase it with empathy.",
      "TENSION: If it reaches 100%, the simulation fails (Game Over).",
      "STAMINA: Every interaction consumes mental energy. If it runs out, you collapse.",
      "Use 'Impulse Triggers' for quick actions or type freely."
    ],
    game_over: "SIMULATION TERMINATED",
    stop_simulation: "INTERRUPT",
    restart: "Restart System",
    input_placeholder: "Type your response...",
    stats: {
      trust: "TRUST",
      tension: "TENSION",
      stamina: "STAMINA"
    },
    report: {
      title: "ANALYTICAL REPORT",
      score: "SOCIAL IQ",
      persuasion: "PERSUASION",
      ei: "EMOTIONAL INTEL.",
      pressure: "PRESSURE MGMT",
      key_moment: "KEY MOMENT",
      pro_tip: "PRO TIP"
    }
  }
};

// --- COMPONENTS ---
const ProgressBar = ({ value, color, label }: { value: number, color: string, label: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center px-1">
      <span className="text-[10px] font-black tracking-widest opacity-50 uppercase">{label}</span>
      <span className="text-xs font-black" style={{ color }}>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}44` }}
      />
    </div>
  </div>
);

const GraphComponent = ({ data, type, label, theme }: { data: any[], type: string, label: string, theme: string }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff66' : '#00000066';
  const gridColor = isDark ? '#ffffff11' : '#00000011';
  const accentColor = '#8b5cf6';

  return (
    <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={14} className="text-violet-500" />
        <span className="text-[10px] font-black tracking-widest opacity-50 uppercase">{label}</span>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'radar' ? (
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="label" tick={{ fill: textColor, fontSize: 10, fontWeight: 'bold' }} />
              <Radar
                name={label}
                dataKey="value"
                stroke={accentColor}
                fill={accentColor}
                fillOpacity={0.5}
              />
            </RadarChart>
          ) : type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: textColor, fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: isDark ? '#111' : '#fff', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: accentColor }}
              />
              <Line type="monotone" dataKey="value" stroke={accentColor} strokeWidth={3} dot={{ r: 4, fill: accentColor }} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: textColor, fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: isDark ? '#111' : '#fff', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: accentColor }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={accentColor} fillOpacity={0.6 + (index / data.length) * 0.4} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [language, setLanguage] = useState<Language>('ITA');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Setup State
  const [setupStep, setSetupStep] = useState(1);
  const [context, setContext] = useState('');
  const [difficulty, setDifficulty] = useState('Realistico');
  const [interlocutorProfile, setInterlocutorProfile] = useState({
    personality: '',
    gender: '',
    age: '',
    knowsUser: false
  });
  const [userProfile, setUserProfile] = useState({
    name: '',
    surname: '',
    age: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string; character?: string }[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    trust: 50,
    tension: 20,
    stamina: 100,
    vibe: '#6200EE',
    language: 'ITA'
  });
  const [userInput, setUserInput] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [currentGraph, setCurrentGraph] = useState<any>(null);
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStart = async () => {
    if (!context.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const newChat = await startSimulation(
        context, 
        difficulty, 
        language,
        interlocutorProfile,
        userProfile
      );
      setChat(newChat);
      
      const response = await sendMessage(newChat, language === 'ITA' ? "Inizia la simulazione." : "Start the simulation.");
      processResponse(response);
      setAppState('SIMULATION');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Errore di connessione al sistema Synapse.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setAppState('GAMEOVER');
    const finalMessages = [...messages, { role: 'model' as const, content: language === 'ITA' ? "SIMULAZIONE INTERROTTA DALL'UTENTE." : "SIMULATION INTERRUPTED BY USER." }];
    setMessages(finalMessages);
    
    setIsGeneratingReport(true);
    try {
      const rep = await generateReport(finalMessages, language);
      setReport(rep);
    } catch (err) {
      console.error("Failed to generate report", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const processResponse = async (response: SimulationResponse) => {
    const { ui_render_stream, character_name, message, impulse_triggers, graph_data } = response;
    
    setGameState(prev => ({
      ...prev,
      trust: ui_render_stream.status.trust,
      tension: ui_render_stream.status.tension,
      stamina: ui_render_stream.status.stamina,
      vibe: ui_render_stream.vibe_animation,
      language: ui_render_stream.language as Language
    }));

    const newMessages = [...messages, { role: 'model' as const, content: message, character: character_name }];
    setMessages(newMessages);
    setTriggers(impulse_triggers);
    
    if (graph_data) {
      setCurrentGraph(graph_data);
    } else {
      setCurrentGraph(null);
    }

    if (ui_render_stream.status.tension >= 100 || ui_render_stream.status.stamina <= 0) {
      setAppState('GAMEOVER');
      setIsGeneratingReport(true);
      try {
        const rep = await generateReport(newMessages, language);
        setReport(rep);
      } catch (err) {
        console.error("Failed to generate report", err);
      } finally {
        setIsGeneratingReport(false);
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const input = text;
    setUserInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(chat, input);
      processResponse(response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Errore durante la comunicazione.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ITA' ? 'ENG' : 'ITA');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-violet-500/30 overflow-hidden flex flex-col transition-colors duration-500 ${
      theme === 'dark' ? 'text-white' : 'text-slate-900'
    }`}>
      
      {/* BACKGROUND EFFECTS */}
      <Background tension={gameState.tension} theme={theme} />

      {/* HEADER */}
      <header className={`relative z-10 flex justify-between items-center px-6 py-4 border-b backdrop-blur-md transition-colors ${
        theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white/40 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-tighter text-xl">SYNAPSE <span className="text-violet-500">OS</span></span>
        </div>
        
        <div className="flex items-center gap-3">
          {appState === 'SIMULATION' && (
            <button 
              onClick={handleStop}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-[10px] font-bold text-red-400 uppercase tracking-widest"
            >
              <Skull size={14} />
              {t.stop_simulation}
            </button>
          )}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all ${
              theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-200 border-slate-300 hover:bg-slate-300'
            }`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button 
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
              theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-200 border-slate-300 hover:bg-slate-300'
            }`}
          >
            <Globe size={14} />
            {language}
          </button>
          <button 
            onClick={() => setShowTutorial(true)}
            className={`p-2 rounded-full border transition-all ${
              theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-200 border-slate-300 hover:bg-slate-300'
            }`}
          >
            <Info size={16} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        
        <AnimatePresence mode="wait">
          
          {/* LANDING STATE */}
          {appState === 'LANDING' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full text-center space-y-12"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold tracking-[0.2em] uppercase"
                >
                  {t.tagline}
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                  {t.slogan_main} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">{t.slogan_sub}</span>
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setAppState('SETUP')}
                  className="group relative px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-violet-500/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t.start_btn}
                    <ArrowRight size={20} />
                  </span>
                </button>
                <button 
                  onClick={() => setShowTutorial(true)}
                  className={`px-8 py-4 rounded-2xl border transition-all font-semibold ${
                    theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.how_it_works}
                </button>
              </div>

              {/* SUGGESTED SCENARIOS */}
              <div className="space-y-6 pt-8">
                <h3 className="text-xs font-black tracking-[0.3em] opacity-50 uppercase">{t.suggested_title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {t.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setContext(s.title + ": " + s.desc);
                        setAppState('SETUP');
                      }}
                      className={`p-6 rounded-3xl border text-left transition-all hover:scale-[1.02] active:scale-95 group ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-violet-500/50' : 'bg-white border-slate-200 hover:border-violet-400 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                          <MessageSquare size={18} />
                        </div>
                        <h4 className="font-bold text-sm">{s.title}</h4>
                      </div>
                      <p className="text-xs opacity-60 leading-relaxed">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SETUP STATE */}
          {appState === 'SETUP' && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className={`max-w-lg w-full backdrop-blur-xl border rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[85vh] scrollbar-hide transition-colors ${
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="text-violet-500" />
                  {t.setup_title}
                </h2>
                <div className="flex gap-1">
                  {[1, 2, 3].map(step => (
                    <div 
                      key={step} 
                      className={`h-1 w-6 rounded-full transition-all ${setupStep >= step ? 'bg-violet-500' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                
                {/* STEP 1: SCENARIO */}
                {setupStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-2">
                      <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.context_label}</label>
                      <textarea 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder={t.context_placeholder}
                        className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none h-32 ${
                          theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.difficulty_label}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Semplice', 'Realistico', 'Brutale'].map((d) => (
                          <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                              difficulty === d 
                                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' 
                                : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAppState('LANDING')}
                        className={`flex-1 py-4 border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <ArrowLeft size={18} />
                        {t.back_btn}
                      </button>
                      <button 
                        onClick={() => setSetupStep(2)}
                        disabled={!context.trim()}
                        className={`flex-[2] py-4 border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                          theme === 'dark' ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {language === 'ITA' ? 'Avanti' : 'Next'}
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: INTERLOCUTOR */}
                {setupStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-violet-400 uppercase tracking-tight">{t.interlocutor_section}</h3>
                      <p className={`text-[10px] font-medium ${theme === 'dark' ? 'opacity-50' : 'text-slate-500'}`}>{t.interlocutor_desc}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.personality_label}</label>
                        <input 
                          value={interlocutorProfile.personality}
                          onChange={(e) => setInterlocutorProfile({...interlocutorProfile, personality: e.target.value})}
                          placeholder={t.personality_placeholder}
                          className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                            theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.knows_user_label}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setInterlocutorProfile({...interlocutorProfile, knowsUser: true})}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                              interlocutorProfile.knowsUser 
                                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' 
                                : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {t.knows_user_yes}
                          </button>
                          <button
                            onClick={() => setInterlocutorProfile({...interlocutorProfile, knowsUser: false})}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                              !interlocutorProfile.knowsUser 
                                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' 
                                : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {t.knows_user_no}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.gender_label}</label>
                          <input 
                            value={interlocutorProfile.gender}
                            onChange={(e) => setInterlocutorProfile({...interlocutorProfile, gender: e.target.value})}
                            placeholder="M / F / Non-binary"
                            className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                              theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.age_label}</label>
                          <input 
                            type="number"
                            value={interlocutorProfile.age}
                            onChange={(e) => setInterlocutorProfile({...interlocutorProfile, age: e.target.value})}
                            placeholder="25"
                            className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                              theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSetupStep(1)}
                        className={`flex-1 py-4 border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <ArrowLeft size={18} />
                        {t.back_btn}
                      </button>
                      <button 
                        onClick={() => setSetupStep(3)}
                        className={`flex-[2] py-4 border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                          theme === 'dark' ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {language === 'ITA' ? 'Avanti' : 'Next'}
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: USER PROFILE */}
                {setupStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-pink-400 uppercase tracking-tight">{t.user_section}</h3>
                      <p className={`text-[10px] font-medium ${theme === 'dark' ? 'opacity-50' : 'text-slate-500'}`}>{t.user_desc}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.name_label}</label>
                          <input 
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                              theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.surname_label}</label>
                          <input 
                            value={userProfile.surname}
                            onChange={(e) => setUserProfile({...userProfile, surname: e.target.value})}
                            className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                              theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.user_age_label}</label>
                        <input 
                          type="number"
                          value={userProfile.age}
                          onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                          className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                            theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-slate-400'}`}>{t.desc_label}</label>
                        <textarea 
                          value={userProfile.description}
                          onChange={(e) => setUserProfile({...userProfile, description: e.target.value})}
                          placeholder={t.desc_placeholder}
                          className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none h-24 ${
                            theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
                      >
                        {error}
                      </motion.div>
                    )}

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSetupStep(2)}
                        className={`flex-1 py-4 border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <ArrowLeft size={18} />
                        {t.back_btn}
                      </button>
                      <button 
                        onClick={handleStart}
                        disabled={isLoading}
                        className="flex-[2] py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl font-bold text-lg shadow-xl shadow-violet-500/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                      >
                        {isLoading ? <RefreshCw className="animate-spin" /> : <Zap size={18} />}
                        {t.launch_btn}
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}

          {/* SIMULATION STATE */}
          {appState === 'SIMULATION' && (
            <motion.div 
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-5xl h-[80vh] grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6"
            >
              {/* SIDEBAR STATS */}
              <div className="hidden lg:flex flex-col gap-4">
                <div className={`backdrop-blur-md border rounded-3xl p-6 space-y-8 transition-colors ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div 
                      className="w-3 h-3 rounded-full animate-pulse" 
                      style={{ backgroundColor: gameState.vibe }}
                    />
                    <span className="text-[10px] font-black tracking-[0.2em] opacity-50 uppercase">Live Metrics</span>
                  </div>

                  <div className="space-y-6">
                    <ProgressBar value={gameState.trust} color="#10B981" label={t.stats.trust} />
                    <ProgressBar value={gameState.tension} color="#EF4444" label={t.stats.tension} />
                    <ProgressBar value={gameState.stamina} color="#3B82F6" label={t.stats.stamina} />
                  </div>

                  {currentGraph && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-4"
                    >
                      <GraphComponent 
                        data={currentGraph.data} 
                        type={currentGraph.type} 
                        label={currentGraph.label} 
                        theme={theme} 
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* CHAT AREA */}
              <div className={`flex flex-col backdrop-blur-md border rounded-[32px] overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'
              }`}>
                
                {/* MOBILE STATS (Visible only on small screens) */}
                <div className={`lg:hidden flex flex-col p-4 border-b gap-3 transition-colors ${
                  theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50'
                }`}>
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] opacity-50 font-bold">{t.stats.trust}</span>
                      <span className="text-xs font-bold text-emerald-400">{gameState.trust}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] opacity-50 font-bold">{t.stats.tension}</span>
                      <span className="text-xs font-bold text-red-400">{gameState.tension}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] opacity-50 font-bold">{t.stats.stamina}</span>
                      <span className="text-xs font-bold text-blue-400">{gameState.stamina}%</span>
                    </div>
                  </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {msg.character && (
                        <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase mb-1 ml-1">
                          {msg.character}
                        </span>
                      )}
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-violet-600 text-white rounded-tr-none' 
                          : theme === 'dark' ? 'bg-white/10 border border-white/5 rounded-tl-none' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className={`flex gap-1 p-4 rounded-2xl w-16 justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-slate-400'}`} />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-slate-400'}`} />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-slate-400'}`} />
                    </div>
                  )}
                </div>

                {/* INPUT AREA */}
                <div className={`p-6 border-t space-y-4 transition-colors ${
                  theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 tracking-widest uppercase">
                      <Zap size={12} className="text-violet-500" />
                      Impulse Triggers
                    </div>
                    <div className="flex flex-col gap-2">
                      {triggers.map((trigger, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(trigger)}
                          disabled={isLoading}
                          className={`px-4 py-3 rounded-xl border text-left text-[11px] font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-3 group ${
                            theme === 'dark' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/20' : 'bg-violet-50 border-violet-100 text-violet-600 hover:bg-violet-100'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme === 'dark' ? 'bg-violet-400' : 'bg-violet-600'} group-hover:scale-150 transition-transform`} />
                          {trigger}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input 
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(userInput)}
                      placeholder={t.input_placeholder}
                      className={`flex-1 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                      }`}
                    />
                    <button 
                      onClick={() => handleSend(userInput)}
                      disabled={isLoading || !userInput.trim()}
                      className="p-3 bg-violet-600 rounded-2xl hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-50 text-white"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* GAMEOVER STATE */}
          {appState === 'GAMEOVER' && (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl w-full text-center space-y-8 overflow-y-auto max-h-[85vh] px-4 py-8 scrollbar-hide"
            >
              <div className="relative inline-block">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"
                />
                <Skull size={60} className="text-red-500 relative z-10 mx-auto" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-red-500 uppercase">{t.game_over}</h2>
                <p className="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase">Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>

              {isGeneratingReport ? (
                <div className={`flex flex-col items-center gap-6 py-20 rounded-[32px] border transition-colors ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="relative">
                    <RefreshCw className="animate-spin text-violet-500" size={48} />
                    <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black tracking-[0.2em] opacity-70 uppercase">Analisi Neurale in Corso...</p>
                    <p className="text-[10px] opacity-40 italic">Synapse OS sta elaborando i dati della tua performance sociale.</p>
                  </div>
                </div>
              ) : report && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
                >
                  {/* SCORE CARD */}
                  <div className={`md:col-span-2 border rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group transition-colors ${
                    theme === 'dark' ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' : 'bg-white border-slate-200 shadow-md'
                  }`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] -mr-32 -mt-32 group-hover:bg-violet-600/20 transition-all duration-700" />
                    
                    <div className="relative z-10 space-y-2 text-center md:text-left">
                      <h3 className="text-xs font-black tracking-[0.3em] text-violet-400 uppercase">{t.report.score}</h3>
                      <div className="flex items-baseline gap-2 justify-center md:justify-start">
                        <span className={`text-7xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent ${
                          theme === 'dark' ? 'bg-gradient-to-b from-white to-white/40' : 'bg-gradient-to-b from-slate-900 to-slate-500'
                        }`}>{report.score}</span>
                        <span className="text-xl font-bold opacity-30">/100</span>
                      </div>
                    </div>

                    {report.final_stats_graph && (
                      <div className="relative z-10 w-full md:w-[300px] h-[200px]">
                        <GraphComponent 
                          data={report.final_stats_graph.data} 
                          type={report.final_stats_graph.type} 
                          label={report.final_stats_graph.label} 
                          theme={theme} 
                        />
                      </div>
                    )}

                    <div className="relative z-10 flex-1 max-w-md">
                      <div className={`p-4 rounded-2xl border backdrop-blur-sm transition-colors ${
                        theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <p className={`text-xs italic leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                          "{messages[messages.length - 1]?.content}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* METRICS GRID */}
                  <div className={`border rounded-[24px] p-6 space-y-4 hover:border-white/20 transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest opacity-50 uppercase">
                      <Zap size={14} className="text-yellow-500" />
                      {t.report.persuasion}
                    </div>
                    <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-white/70' : 'text-slate-700'}`}>{report.persuasion}</p>
                  </div>

                  <div className={`border rounded-[24px] p-6 space-y-4 hover:border-white/20 transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest opacity-50 uppercase">
                      <Brain size={14} className="text-pink-500" />
                      {t.report.ei}
                    </div>
                    <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-white/70' : 'text-slate-700'}`}>{report.emotionalIntelligence}</p>
                  </div>

                  <div className={`border rounded-[24px] p-6 space-y-4 hover:border-white/20 transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest opacity-50 uppercase">
                      <Activity size={14} className="text-blue-500" />
                      {t.report.pressure}
                    </div>
                    <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-white/70' : 'text-slate-700'}`}>{report.pressureManagement}</p>
                  </div>

                  <div className={`border rounded-[24px] p-6 space-y-4 hover:border-white/20 transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest opacity-50 uppercase">
                      <ChevronRight size={14} className="text-violet-500" />
                      {t.report.key_moment}
                    </div>
                    <p className={`text-sm italic font-medium leading-relaxed ${theme === 'dark' ? 'text-violet-300' : 'text-violet-600'}`}>"{report.keyMoment}"</p>
                  </div>

                  {/* PRO TIP */}
                  <div className={`md:col-span-2 border rounded-[24px] p-6 flex items-start gap-5 group transition-all ${
                    theme === 'dark' ? 'bg-gradient-to-r from-violet-600/20 to-pink-600/20 border-violet-500/30 hover:from-violet-600/30 hover:to-pink-600/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}>
                    <div className="p-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform">
                      <Shield size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-violet-500 uppercase">{t.report.pro_tip}</h4>
                      <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}`}>{report.proTip}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="pt-8">
                <button 
                  onClick={() => window.location.reload()}
                  className={`group px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 mx-auto transition-all shadow-2xl active:scale-95 ${
                    theme === 'dark' ? 'bg-white text-black hover:bg-red-600 hover:text-white shadow-white/5' : 'bg-slate-900 text-white hover:bg-red-600 shadow-slate-900/10'
                  }`}
                >
                  <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                  {t.restart}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* TUTORIAL MODAL */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`max-w-md w-full border rounded-[32px] p-8 relative shadow-2xl transition-colors ${
                theme === 'dark' ? 'bg-[#0A0E17] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <button 
                onClick={() => setShowTutorial(false)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-all ${
                  theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-400">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold">{t.tutorial_title}</h3>
              </div>

              <div className="space-y-6">
                {t.tutorial_steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {i + 1}
                    </div>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>{step}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowTutorial(false)}
                className={`w-full mt-10 py-4 rounded-2xl font-bold transition-all ${
                  theme === 'dark' ? 'bg-white text-black hover:bg-violet-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-violet-600'
                }`}
              >
                {language === 'ITA' ? 'Capito' : 'Got it'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-10 px-6 py-4 text-center">
        <span className="text-[10px] font-bold tracking-[0.3em] opacity-20 uppercase">
          Synapse OS Engine v3.6 // Secure Simulation Environment
        </span>
      </footer>

    </div>
  );
}

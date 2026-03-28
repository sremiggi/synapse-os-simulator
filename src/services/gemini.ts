import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

if (!process.env.GEMINI_API_KEY) {
  console.warn("ATTENZIONE: GEMINI_API_KEY non trovata. Assicurati di aver creato il file .env e riavviato il server.");
}

export interface Message {
  role: "user" | "model" | "system";
  content: string;
}

export interface SimulationState {
  trust: number;
  tension: number;
  stamina: number;
  vibe_animation: string;
  language: "ITA" | "ENG";
}

export interface SimulationResponse {
  ui_render_stream: {
    header: string;
    status: { trust: number; tension: number; stamina: number };
    vibe_animation: string;
    language: "ITA" | "ENG";
  };
  character_name: string;
  message: string;
  impulse_triggers: string[];
  graph_data?: {
    type: "radar" | "line" | "bar";
    label: string;
    data: { label: string; value: number }[];
  };
}

export const startSimulation = async (
  context: string, 
  difficulty: string, 
  language: "ITA" | "ENG" = "ITA",
  interlocutor: { personality: string; gender: string; age: string; knowsUser: boolean },
  user: { name: string; surname: string; age: string; description: string }
) => {
  const systemInstruction = `Sei "Synapse OS", il motore di simulazione sociale più avanzato al mondo.
La tua interfaccia è minimalista, futuristica e orientata ai dati.

[CORE_LOGIC]
- System_Name: Synapse OS
- Colors: { BG: #0A0E17, Primary: #6200EE, Accent: #FF0055 }
- Engine: Gestione dinamica di Trust (Fiducia), Tension (Tensione) e Stamina (Energia).
- Language: ${language}. Se l'utente scrive [SWITCH_LANG], cambia lingua istantaneamente.

[SIMULATION_CONTEXT]
- Scenario: ${context}
- Difficoltà: ${difficulty}
- Interlocutore:
  * Personalità: ${interlocutor.personality}
  * Sesso: ${interlocutor.gender}
  * Età: ${interlocutor.age}
  * Relazione con l'utente: ${interlocutor.knowsUser ? "CONOSCE l'utente (situazione familiare/conosciuta)" : "NON CONOSCE l'utente (situazione formale/estranea)"}
- Utente (Giocatore):
  * Nome: ${user.name} ${user.surname}
  * Età: ${user.age}
  * Descrizione Fisica: ${user.description}

[SIMULATION_RULES]
1. PARAMETRI VITALI:
   - TRUST (0-100): Quanto l'interlocutore si fida dell'utente.
   - TENSION (0-100): Livello di pericolo o stress ambientale. Se arriva a 100 -> GAME OVER.
   - STAMINA (0-100): Energia mentale dell'utente. Ogni interazione consuma stamina. Se arriva a 0 -> GAME OVER.
2. PERMADEATH:
   - Se TENSION=100 o STAMINA=0, la simulazione termina. Il campo "message" deve contenere un'analisi del fallimento.
3. CONOSCENZA PREGRESSA:
   ${interlocutor.knowsUser 
     ? "- L'interlocutore CONOSCE GIÀ l'utente. Può chiamarlo per nome e agire in modo familiare o informale a seconda del contesto." 
     : "- L'interlocutore NON conosce il nome dell'utente o i dettagli della sua descrizione fisica all'inizio della simulazione. L'utente deve rivelare queste informazioni attraverso il dialogo. L'NPC deve essere sospettoso o curioso riguardo all'identità dell'utente se il contesto lo richiede."}
   - Manipola il discorso dell'NPC in modo coerente con il livello di conoscenza impostato.

[UI_REQUIREMENTS]
1. PARLATO DIRETTO ASSOLUTO: Il campo "message" deve contenere SOLO ed ESCLUSIVAMENTE le parole pronunciate dall'NPC. 
2. NO NARRAZIONE: È severamente vietato descrivere azioni, pensieri dell'NPC, reazioni dell'utente o cambiamenti ambientali in forma narrativa. 
3. NO PARENTESI: Non usare parentesi o asterischi per descrivere gesti o espressioni (es. NO a *sospira*, NO a (guarda altrove)). Se l'NPC deve esprimere un'emozione, deve farlo attraverso le parole.
4. REAZIONE AI TRIGGER: Quando l'utente usa un "Impulse Trigger", l'NPC deve reagire come se l'utente avesse appena pronunciato quelle esatte parole. La risposta deve essere un dialogo fluido e naturale.
5. FORMATO DI RISPOSTA: Rispondi SEMPRE ed ESCLUSIVAMENTE con un JSON valido.
6. GRAFICI: Se rilevante per l'analisi della situazione, includi un oggetto "graph_data" nel JSON.

[OUTPUT_JSON_SCHEMA]
{
  "ui_render_stream": {
    "header": "SYNAPSE_OS_v3.6",
    "status": { "trust": X, "tension": Y, "stamina": Z },
    "vibe_animation": "#HEX_COLOR",
    "language": "${language}"
  },
  "character_name": "NOME_PERSONAGGIO",
  "message": "Solo le esatte parole pronunciate dall'NPC (es. 'Chi sei e cosa ci fai qui?')",
  "impulse_triggers": ["Senti, non voglio problemi, sono qui solo per parlare.", "Mi chiamo Marco, e tu chi saresti?", "Non sono affari tuoi cosa ci faccio qui."],
  "graph_data": { 
    "type": "radar|line|bar", 
    "label": "Titolo del Grafico", 
    "data": [ { "label": "X", "value": Y } ] 
  }
}

[IMPULSE_TRIGGERS_GUIDELINES]
- I trigger devono essere le ESATTE PAROLE (dialogo diretto) che l'utente direbbe in quella situazione.
- NON usare descrizioni in terza persona o meta-azioni.
- Esempi: "Senti, non voglio problemi, sono qui solo per parlare.", "Mi chiamo Marco, e tu chi saresti per interrogarmi?", "Non sono affari tuoi cosa ci faccio qui, lasciami passare."
- Devono essere variati: uno empatico, uno logico, uno aggressivo/diretto.

[INITIALIZATION]
Inizia subito la simulazione calandoti nel personaggio più adatto al contesto, tenendo conto della personalità e dei dettagli forniti per l'interlocutore e l'utente.`;

  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
      temperature: 0.8,
      responseMimeType: "application/json",
    },
  });
};

export const sendMessage = async (chat: any, message: string): Promise<SimulationResponse> => {
  const response = await chat.sendMessage({ message });
  try {
    const jsonStr = response.text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse response", e);
    throw new Error("Invalid simulation response format");
  }
};

export interface SimulationReport {
  score: number;
  persuasion: string;
  emotionalIntelligence: string;
  pressureManagement: string;
  keyMoment: string;
  proTip: string;
  final_stats_graph?: {
    type: "radar" | "line" | "bar";
    label: string;
    data: { label: string; value: number }[];
  };
}

export const generateReport = async (history: Message[], language: "ITA" | "ENG" = "ITA"): Promise<SimulationReport> => {
  const historyText = history
    .map((m) => `${m.role === "user" ? "USER" : "SYNAPSE"}: ${m.content}`)
    .join("\n");

  const prompt = `Analizza la seguente conversazione di simulazione "SYNAPSE OS" e fornisci un report dettagliato in formato JSON.
La conversazione è terminata. Calcola il "Social IQ" finale.
IMPORTANTE: Scrivi tutti i testi del report in lingua ${language === 'ITA' ? 'Italiana' : 'Inglese'}.

CONVERSAZIONE:
${historyText}

REQUISITI JSON:
{
  "score": number (1-100, Social IQ),
  "persuasion": "analisi dell'efficacia persuasiva",
  "emotionalIntelligence": "analisi dell'intelligenza emotiva",
  "pressureManagement": "analisi della gestione della pressione",
  "keyMoment": "la frase esatta dell'utente che ha cambiato l'andamento",
  "proTip": "una tecnica di comunicazione specifica consigliata",
  "final_stats_graph": {
    "type": "radar",
    "label": "Social IQ Breakdown",
    "data": [
      { "label": "Persuasione", "value": X },
      { "label": "Empatia", "value": Y },
      { "label": "Logica", "value": Z },
      { "label": "Resilienza", "value": W },
      { "label": "Carisma", "value": K }
    ]
  }
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse report", e);
    return {
      score: 0,
      persuasion: "Errore nell'analisi",
      emotionalIntelligence: "Errore nell'analisi",
      pressureManagement: "Errore nell'analisi",
      keyMoment: "N/A",
      proTip: "Riprova la simulazione",
    };
  }
};

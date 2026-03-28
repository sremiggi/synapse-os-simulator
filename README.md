# 🧠 SYNAPSE OS v3.6.1
### *L'evoluzione della simulazione sociale ad alta fedeltà.*

![Status](https://img.shields.io/badge/STATUS-ACTIVE_SIMULATION-6200EE?style=for-the-badge)
![Version](https://img.shields.io/badge/VERSION-3.6.1-FF0055?style=for-the-badge)
![Tech](https://img.shields.io/badge/POWERED_BY-GEMINI_AI-white?style=for-the-badge&logo=google)

---

## 🌐 Cos'è Synapse OS?
**Synapse OS** non è un semplice chatbot. È un motore di simulazione sociale avanzato progettato per testare, allenare e perfezionare le tue abilità comunicative in scenari ad alta pressione. Che si tratti di una negoziazione ostaggi, un primo appuntamento o un debito insoluto, Synapse OS crea un ambiente reattivo dove ogni parola conta.

---

## 🛠️ Caratteristiche Principali

- **🎭 Simulazione Pura**: Niente narrazione descrittiva. Solo dialogo diretto. L'NPC reagisce in tempo reale alle tue parole, non alle tue intenzioni.
- **📊 Motore di Stato Dinamico**:
    - **TRUST (Fiducia)**: Costruisci un legame o guarda l'interlocutore chiudersi a riccio.
    - **TENSION (Tensione)**: Gestisci lo stress ambientale. Se la tensione esplode (100%), la simulazione fallisce.
    - **STAMINA (Energia)**: Ogni interazione consuma energia mentale. Non farti prosciugare.
- **👥 Selettore di Relazione (Novità!)**: Scegli se l'interlocutore è un **Estraneo** (situazione formale/diffidente) o un **Familiare** (situazione informale/conosciuta).
- **🔘 Trigger d'Impulso**: Azioni rapide e risposte istantanee per mantenere il ritmo della conversazione.
- **📈 Report Analitico Post-Simulazione**: Ricevi un'analisi dettagliata del tuo **Social IQ**, Persuasione, Intelligenza Emotiva e un "Pro Tip" per migliorare.

---

## 🖥️ Interfaccia Utente
L'applicazione segue il protocollo **SYNAPSE_INTERFACE**, un design minimalista basato su dati e feedback visivi immediati:

```text
┌─── 🖥️ SYNAPSE_INTERFACE ────────────────────────────┐
│ [STATUS]: { TRUST: ▓▓▓░░ | TENSION: ▓░░░░ | STAMINA: ▓▓▓▓░ }
│ [VIBE]: #6200EE | [MODE]: PURE_DIALOGUE | [VER]: 3.6.1
└───────────────────────────────────────────────────────┘
```

---

## 🚀 Tecnologie Utilizzate
- **Frontend**: React 18 + Vite
- **AI Engine**: Google Gemini AI (@google/genai)
- **Styling**: Tailwind CSS
- **Animazioni**: Motion (Framer Motion)
- **Data Viz**: Recharts (per i grafici radar e lineari nel report)
- **Icons**: Lucide React

---

## 📦 Installazione Locale

Se vuoi eseguire Synapse OS sul tuo computer:

1. **Clona il repository**:
   ```bash
   git clone https://github.com/TUO_USERNAME/synapse-os.git
   cd synapse-os
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Configura l'API Key**:
   Crea un file `.env` nella root del progetto e aggiungi la tua chiave Gemini:
   ```env
   GEMINI_API_KEY=la_tua_chiave_qui
   ```

4. **Avvia il sistema**:
   ```bash
   npm run dev
   ```

---

## 🛡️ Sicurezza e Privacy
Synapse OS è configurato per proteggere i tuoi dati. Il file `.env` è inserito nel `.gitignore` per evitare il caricamento accidentale delle chiavi API su repository pubblici. 

---

## ⚖️ Disclaimer
*Synapse OS è uno strumento di simulazione a scopo di intrattenimento e formazione. I risultati dei report analitici sono generati dall'intelligenza artificiale e devono essere interpretati come suggerimenti creativi, non come consulenza psicologica professionale.*

---

**[SYSTEM_MANDATE]**: *Domina ogni interazione. Non uscire mai dal personaggio.* 🔘

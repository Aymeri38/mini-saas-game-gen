// components/GameGenerator.tsx
"use client";

import { useState } from "react";
import { Send, ArrowLeft, MonitorPlay, Code, RefreshCw } from "lucide-react";

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function GameGenerator({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Bonjour ! Quel type de mini-jeu souhaitez-vous créer aujourd\'hui ? (ex: "Un Snake en rouge et noir", "Un quiz de maths")' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulation de l'envoi (en attendant de rebrancher l'API Gemini)
  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Ajouter le message utilisateur
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setIsGenerating(true);

    // 2. Simulation de délai (API Call)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `J'ai bien reçu votre demande pour : "${userMsg}". Je génère le code... (L'API sera connectée à la prochaine étape)` 
      }]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* --- HEADER DU STUDIO --- */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold flex items-center gap-2">
            <Code size={18} className="text-purple-400" /> Studio de Création
          </span>
        </div>
        <div className="text-xs text-slate-500">v0.1.0 (Alpha)</div>
      </header>

      {/* --- ZONE PRINCIPALE (SPLIT SCREEN) --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* GAUCHE : CHAT & PROMPT */}
        <div className="w-1/3 min-w-[350px] border-r border-slate-800 flex flex-col bg-slate-900/50">
          
          {/* Historique des messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none text-sm animate-pulse flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin" /> Génération en cours...
                </div>
              </div>
            )}
          </div>

          {/* Zone de saisie */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Décrivez votre jeu..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none h-24"
              />
              <button 
                onClick={handleSend}
                disabled={isGenerating || !input.trim()}
                className="absolute bottom-3 right-3 p-2 bg-purple-600 hover:bg-purple-500 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* DROITE : PREVIEW EN TEMPS RÉEL */}
        <div className="flex-1 flex flex-col bg-black">
          {/* Barre d'outils Preview */}
          <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <MonitorPlay size={14} /> Aperçu Live
            </span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
          </div>

          {/* Zone de rendu (Canvas / Iframe placeholder) */}
          <div className="flex-1 flex items-center justify-center text-slate-500 relative overflow-hidden">
            {/* GRILLE DE FOND */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* CONTENU (Pour l'instant statique, bientôt le jeu généré) */}
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-xl mx-auto mb-4 flex items-center justify-center border border-slate-700">
                <MonitorPlay size={32} className="text-slate-600" />
              </div>
              <p>L'aperçu du jeu s'affichera ici.</p>
              <p className="text-xs text-slate-600 mt-2">En attente de code...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

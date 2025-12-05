"use client";

import { useState } from "react";
import { Send, ArrowLeft, MonitorPlay, Code, RefreshCw } from "lucide-react";
import { generateGameCode } from "@/app/actions"; // On importe la Server Action

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function GameGenerator({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Le serveur est sécurisé et prêt. Quel jeu voulez-vous créer ?' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setIsGenerating(true);

    try {
      // APPEL AU SERVEUR (Sécurisé)
      const result = await generateGameCode(userMsg);

      if (result.success && result.code) {
        setGeneratedCode(result.code);
        setIframeKey(prev => prev + 1); // Force refresh iframe
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: `Jeu généré via le serveur ! Testez-le à droite.` 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: "Erreur lors de la génération côté serveur." 
        }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Erreur de communication avec le serveur." 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- FONCTION RESET PARTIELLE --- 
  const handleReset = () => {
    setGeneratedCode(null);     // Reset aperçu actuel
    setIframeKey(prev => prev + 1);  // Refresh iframe
    setInput("");               // Reset input actuel
    // ✅ messages préservés (historique discussion)
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* HEADER AVEC RESET */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold flex items-center gap-2">
            <Code size={18} className="text-blue-400" /> Studio Sécurisé
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium rounded transition shadow-md"
            title="Relancer un nouveau jeu"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </header>

      {/* RESTE DE L'INTERFACE (Chat + Preview) */}
      <div className="flex-1 flex overflow-hidden">
        {/* GAUCHE : CHAT */}
        <div className="w-1/3 min-w-[350px] border-r border-slate-800 flex flex-col bg-slate-900/50">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 text-slate-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg text-sm flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-blue-400" /> Génération Server-Side...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Ex: Un jeu de mémoire avec des cartes..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none h-24"
              />
              <button 
                onClick={handleSend}
                disabled={isGenerating || !input.trim()}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-500 rounded text-white disabled:opacity-50 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* DROITE : PREVIEW AVEC RESET ÉTAT */}
        <div className="flex-1 flex flex-col bg-black relative">
          <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <MonitorPlay size={14} /> Aperçu Live
            </span>
            {generatedCode && (
              <button 
                onClick={handleReset}
                className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-black text-xs rounded font-medium transition flex items-center gap-1"
                title="Relancer le jeu"
              >
                <RefreshCw size={12} /> Reset
              </button>
            )}
          </div>

          <div className="flex-1 w-full h-full relative">
            {generatedCode ? (
              <iframe 
                key={iframeKey}
                srcDoc={generatedCode}
                className="w-full h-full border-none bg-white"
                title="Game Preview"
                sandbox="allow-scripts allow-modals"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <MonitorPlay size={48} className="mb-4 opacity-50" />
                <p>Prêt à générer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
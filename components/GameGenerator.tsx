"use client";

import { useState } from "react";
import { Send, ArrowLeft, MonitorPlay, Code, RefreshCw, AlertCircle } from "lucide-react";
import OpenAI from "openai"; // Import officiel OpenAI

// Récupération de la clé API
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function GameGenerator({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Prêt à coder ! Décrivez le jeu que vous souhaitez (ex: "Un Pong version Matrix", "Un Snake multicolore").' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Vérification basique
    if (!API_KEY) {
      alert("Erreur : Clé NEXT_PUBLIC_OPENAI_API_KEY manquante dans .env.local");
      return;
    }

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setIsGenerating(true);

    try {
      // 1. Initialisation du client OpenAI
      const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true // Nécessaire pour utiliser OpenAI directement dans le navigateur
      });

      // 2. Le System Prompt (Les instructions strictes pour l'IA)
      const systemPrompt = `
        Tu es un expert en développement de jeux web HTML5/JS.
        Ta mission : Créer un jeu complet, jouable, contenu dans un SEUL fichier HTML.
        Règles strictes :
        1. Tout le CSS doit être dans <style>.
        2. Tout le JS doit être dans <script>.
        3. Le code doit être robuste (gestion des erreurs).
        4. Pas de Markdown (pas de \`\`\`). Donne juste le code brut.
        5. Utilise des couleurs modernes et un design sombre (#111).
      `;

      // 3. Appel à l'API (Chat Completion)
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // ou "gpt-3.5-turbo" si vous voulez économiser des crédits
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Crée ce jeu : ${userMsg}` }
        ],
      });

      let text = completion.choices[0].message.content || "";

      // Nettoyage au cas où GPT ajoute quand même du markdown
      text = text.replace(/```html/g, '').replace(/```/g, '');

      // 4. Mise à jour de l'interface
      setGeneratedCode(text);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Jeu généré avec succès via OpenAI ! Regardez à droite ->` 
      }]);

    } catch (error) {
      console.error("Erreur OpenAI:", error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Erreur lors de la génération. Vérifiez votre clé API ou vos crédits." 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold flex items-center gap-2">
            <Code size={18} className="text-green-400" /> Studio OpenAI {/* Indicateur visuel vert pour OpenAI */}
          </span>
        </div>
        {!API_KEY && (
          <div className="flex items-center gap-2 text-red-400 text-xs border border-red-900 bg-red-900/20 px-3 py-1 rounded">
            <AlertCircle size={12} /> Clé API manquante
          </div>
        )}
      </header>

      {/* RESTE DE L'INTERFACE (Identique à avant) */}
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
                  <RefreshCw size={14} className="animate-spin text-green-400" /> Génération GPT en cours...
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
                placeholder="Ex: Un Flappy Bird où l'oiseau est un carré bleu..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-green-500 resize-none h-24"
              />
              <button 
                onClick={handleSend}
                disabled={isGenerating || !input.trim()}
                className="absolute bottom-3 right-3 p-2 bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-50 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* DROITE : PREVIEW */}
        <div className="flex-1 flex flex-col bg-black relative">
          <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <MonitorPlay size={14} /> Aperçu Live
            </span>
          </div>

          <div className="flex-1 w-full h-full relative">
            {generatedCode ? (
              <iframe 
                srcDoc={generatedCode}
                className="w-full h-full border-none bg-white"
                title="Game Preview"
                sandbox="allow-scripts allow-modals"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <MonitorPlay size={48} className="mb-4 opacity-50" />
                <p>En attente de GPT...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

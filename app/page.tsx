"use client";
import { useState, useEffect, useCallback } from "react";
import ChatInterface from "@/components/ChatInterface";
import GamePreview from "@/components/GamePreview";
import GameHistory from "@/components/GameHistory";

const INITIAL_CODE = { html: "", css: "", js: "" };

type GameEntry = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
};

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentCode, setCurrentCode] = useState(INITIAL_CODE);
  const [gameHistory, setGameHistory] = useState<GameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gameHistory');
      if (saved) setGameHistory(JSON.parse(saved).slice(-10));
    } catch (e) { console.warn('History load failed'); }
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, currentCode }),
      });

      const data = await response.json();
      if (data.html) {
        // Auto-save to history
        const gameEntry: GameEntry = {
          id: Date.now().toString(),
          name: data.name || 'Nouveau jeu',
          html: data.html,
          css: data.css,
          js: data.js,
          createdAt: Date.now()
        };
        const newHistory = [gameEntry, ...gameHistory].slice(0, 10);
        setGameHistory(newHistory);
        localStorage.setItem('gameHistory', JSON.stringify(newHistory));
        
        setCurrentCode({ html: data.html, css: data.css, js: data.js });
        setMessages(prev => [...prev, { role: "assistant", content: data.message || "Jeu généré ! 🎮" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Erreur génération." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartGame = useCallback(() => {
    setCurrentCode(INITIAL_CODE);
    setMessages([]);
    const chatInput = document.querySelector('input[placeholder*="Message"]') as HTMLInputElement;
    chatInput?.focus();
  }, []);

  const handleSaveGame = useCallback(() => {
    if (!currentCode.html && !currentCode.css && !currentCode.js) return;
    const gameEntry: GameEntry = {
      id: Date.now().toString(),
      name: 'Jeu sauvegardé',
      html: currentCode.html,
      css: currentCode.css,
      js: currentCode.js,
      createdAt: Date.now()
    };
    const newHistory = [gameEntry, ...gameHistory].slice(0, 10);
    setGameHistory(newHistory);
    localStorage.setItem('gameHistory', JSON.stringify(newHistory));
  }, [currentCode, gameHistory]);

  const handleLoadGame = useCallback((game: GameEntry) => {
    setCurrentCode({ html: game.html, css: game.css, js: game.js });
  }, []);

  const handleClearHistory = useCallback(() => {
    setGameHistory([]);
    localStorage.removeItem('gameHistory');
  }, []);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* History (25%) */}
      <div className="w-80 shrink-0 h-full border-r border-gray-200">
        <GameHistory 
          onLoadGame={handleLoadGame}
          onClearHistory={handleClearHistory}
        />
      </div>

      {/* Chat (50%) */}
      <div className="w-[500px] shrink-0 h-full border-r border-gray-200">
        <ChatInterface 
          onSendMessage={handleSendMessage}
          messages={messages}
          isLoading={isLoading}
        />
      </div>

      {/* Preview (25%) + Boutons */}
      <div className="flex-1 h-full relative">
        <GamePreview 
          code={currentCode}
          onRestart={handleRestartGame}
        />
        {/* 💾 Bouton Sauvegarde fixe */}
        <button
          onClick={handleSaveGame}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          title="💾 Sauvegarder ce jeu"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Sauvegarder
        </button>
      </div>
    </main>
  );
}
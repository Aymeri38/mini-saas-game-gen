"use client";
import { useState, useEffect, useCallback } from "react";
import { Play, Hammer, Send, RefreshCw } from "lucide-react";

const DEFAULT_GAMES = [
  { name: "Pong Classic", emoji: "🎾", description: "↑↓ flèches vs IA" },
  { name: "Snake Pro", emoji: "🐍", description: "↑↓←→ mange les pommes" }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"play" | "create">("play");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, {
          text: `Voici ton jeu ${data.game.emoji} ${data.game.name} !`,
          game: data.game,
          isUser: false
        }]);
        setCurrentGame(data.game);
      } else {
        setMessages(prev => [...prev, {
          text: "❌ Erreur: " + (data.error || 'Jeu non créé'),
          isUser: false
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "❌ Erreur réseau",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* 🔝 ONGLETS */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex gap-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("play")}
            className={`flex-1 flex items-center gap-2 p-3 rounded-xl font-semibold transition-all ${
              activeTab === "play"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <Play className="w-5 h-5" />
            Jouer
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center gap-2 p-3 rounded-xl font-semibold transition-all ${
              activeTab === "create"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <Hammer className="w-5 h-5" />
            Créateur
          </button>
        </div>
      </div>

      {/* 🎮 ESPACE JOUER */}
      {activeTab === "play" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              🎮 Jeux Prêts
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Clique pour jouer instantanément
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            {DEFAULT_GAMES.map((game, i) => (
              <div key={i} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-indigo-300 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{game.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-gray-900 group-hover:text-indigo-600 mb-2">
                      {game.name}
                    </h3>
                    <p className="text-gray-600">{game.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🛠️ ESPACE CRÉATEUR */}
      {activeTab === "create" && (
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* History colonne gauche */}
            <div className="w-80 bg-white/50 backdrop-blur-sm border-r p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                💾 Mes Jeux
              </h3>
              <div className="space-y-2">
                {DEFAULT_GAMES.map((game, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{game.emoji}</div>
                      <span className="font-medium">{game.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat colonne milieu */}
            <div className="flex-1 border-r p-6">
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 bg-gray-50 rounded-xl mb-4 overflow-y-auto space-y-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Send className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Demande-moi de créer un jeu !</p>
                      <p className="text-sm mt-1">"Crée un pong" 🎮</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`p-3 rounded-xl max-w-xs ${
                        msg.isUser
                          ? 'bg-indigo-500 text-white ml-auto'
                          : 'bg-white shadow-sm'
                      }`}>
                        {msg.game ? (
                          <div>
                            <div>{msg.text}</div>
                            <div className="mt-2 p-2 bg-green-100 rounded text-xs">
                              <strong>{msg.game.emoji} {msg.game.name}</strong><br/>
                              {msg.game.instructions}
                            </div>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="p-3 bg-white shadow-sm rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Je crée ton jeu... 🎮</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
                    placeholder="Tape ton idée de jeu..."
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!message.trim() || isLoading}
                    className="p-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Preview colonne droite */}
            <div className="w-96 relative bg-gradient-to-b from-gray-50 to-white">
              {currentGame ? (
                <div className="p-4 h-full flex flex-col">
                  <div className="text-3xl mb-4 text-center">{currentGame.emoji}</div>
                  <h3 className="font-bold text-xl mb-4 text-center">{currentGame.name}</h3>
                  <div className="flex-1 bg-gray-900 rounded-xl p-2 overflow-auto text-xs font-mono text-green-400 mb-4">
                    {/* Aperçu du code */}
                    <pre>{currentGame.code.substring(0, 500)}...</pre>
                  </div>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all">
                    📋 Copier le code
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                  <h3 className="font-bold text-xl mb-2">Preview Live</h3>
                  <p className="text-gray-500 text-sm">Aucun jeu chargé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
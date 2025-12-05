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
                <div className="flex-1 p-4 bg-gray-50 rounded-xl mb-4 overflow-y-auto">
                  <div className="text-center text-gray-500 py-8">
                    <Send className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Demande-moi de créer un jeu !</p>
                    <p className="text-sm mt-1">"Crée un pong" 🎮</p>
                  </div>
                  {messages.map((msg, i) => (
                    <div key={i} className={`mb-4 p-3 rounded-xl ${
                      msg.isUser
                        ? 'bg-indigo-500 text-white ml-auto max-w-xs'
                        : 'bg-white shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Tape ton idée de jeu..."
                  />
                  <button 
                    onClick={() => {
                      if (message.trim()) {
                        setMessages([...messages, { text: message, isUser: true }]);
                        setMessage("");
                        // TODO: Appel API vers /api/create-game
                        console.log("Envoi:", message);
                      }
                    }}
                    disabled={!message.trim()}
                    className="p-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Preview colonne droite */}
            <div className="w-96 relative bg-gradient-to-b from-gray-50 to-white">
              <div className="p-6 text-center">
                <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="font-bold text-xl mb-2">Preview Live</h3>
                <p className="text-gray-500 text-sm">Aucun jeu chargé</p>
              </div>
              <button className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all">
                🔄 Redémarrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// components/GameHistory.tsx
import { useState, useEffect } from 'react';
import { Trash2, Play, Save, Clock } from 'lucide-react';

type GameEntry = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
};

export default function GameHistory({ 
  onLoadGame, 
  onClearHistory 
}: { 
  onLoadGame: (game: GameEntry) => void;
  onClearHistory: () => void;
}) {
  const [history, setHistory] = useState<GameEntry[]>([]);
  const MAX_HISTORY = 10;

  // 🔄 Load/Save depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gameHistory');
      if (saved) {
        const parsed: GameEntry[] = JSON.parse(saved);
        setHistory(parsed.slice(-MAX_HISTORY));
      }
    } catch (e) {
      console.warn('History load failed:', e);
    }
  }, []);

  const saveGame = (game: GameEntry) => {
    try {
      const newHistory = [game, ...history].slice(0, MAX_HISTORY);
      setHistory(newHistory);
      localStorage.setItem('gameHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  };

  return (
    <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            <span className="font-bold text-lg">Historique ( {history.length} )</span>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-xs font-medium rounded-lg transition-all backdrop-blur-sm"
            >
              <Trash2 className="w-3 h-3" />
              Vider
            </button>
          )}
        </div>
      </div>

      {/* Liste des jeux */}
      <div className="h-[calc(100%-80px)] overflow-y-auto">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
            <Save className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-1">Aucun jeu sauvegardé</p>
            <p className="text-sm">Les jeux apparaîtront ici automatiquement</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.slice().reverse().map((game) => (
              <button
                key={game.id}
                onClick={() => onLoadGame(game)}
                className="w-full p-4 hover:bg-gray-50 transition-all group flex items-center gap-3 text-left border-l-4 border-indigo-500 hover:border-indigo-600"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-all flex-shrink-0">
                  <Play className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate group-hover:text-indigo-700">{game.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(game.createdAt).toLocaleString('fr-FR', { 
                      hour: '2-digit', minute: '2-digit' 
                    })}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
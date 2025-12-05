"use client";

import GameGenerator from "@/components/GameGenerator";
import { useState } from "react";
import { Play, Hammer, Code2, ArrowLeft, Star, Clock, User } from "lucide-react";
import PongGame from "@/components/PongGame";

// --- 1. SIMULATION DE LA BASE DE DONNÉES (Système de sauvegarde) ---
// Dans une version finale, ces données viendraient de votre base de données (PostgreSQL/Supabase).
type GameData = {
  id: string;
  title: string;
  author: string;
  description: string;
  stars: number;
  lastUpdate: string;
  isPlayable: boolean;
};

const GAMES_LIBRARY: GameData[] = [
  {
    id: 'pong-classic',
    title: 'Pong Arena IA',
    author: 'Aymeri38',
    description: 'Le classique revisité avec une IA réactive et un moteur physique fluide en React.',
    stars: 124,
    lastUpdate: "Aujourd'hui",
    isPlayable: true, // C'est le seul qui marche pour l'instant !
  },
  {
    id: 'space-shooter',
    title: 'Galactic Defender',
    author: 'CommunityUser',
    description: 'Défendez la terre contre les vagues alien. (Démo en construction)',
    stars: 89,
    lastUpdate: 'Il y a 2j',
    isPlayable: false,
  },
  {
    id: 'rpg-quest',
    title: 'Mini RPG Quest',
    author: 'DevTeam',
    description: 'Un petit RPG textuel généré par IA.',
    stars: 256,
    lastUpdate: 'Il y a 1sem',
    isPlayable: false,
  }
];

export default function Home() {
  // Navigation : 'menu' (accueil), 'library' (liste des jeux), 'playing' (jeu lancé), 'dev' (création), 'profile'
  const [view, setView] = useState<'menu' | 'library' | 'playing' | 'dev' | 'profile'>('menu');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Simulation utilisateur connecté (à remplacer par vraie auth)
  const user = {
    name: 'Aymeri',
    avatar: 'https://avatars.githubusercontent.com/u/204607066?v=4',
    savedGames: ['pong-classic', 'rpg-quest']
  };

  // Fonction pour lancer un jeu
  const launchGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setView('playing');
  };

  // Fonction pour revenir en arrière intelligemment
  const handleBack = () => {
    if (view === 'playing') {
      setView('library');
      setSelectedGameId(null);
    } else {
      setView('menu');
    }
  };

  const goToProfile = () => setView('profile');

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-950 text-white font-sans">
      
      {/* HEADER AMÉLIORÉ AVEC PROFIL */}
      {view !== 'playing' && (
        <header className="w-full max-w-5xl flex justify-between items-center mb-12">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('menu')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">G</div>
            <span className="font-bold text-xl tracking-tight">GameGen SaaS</span>
          </div>
          <div className="flex items-center gap-4">
            {view !== 'menu' && (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                <ArrowLeft size={20} /> Retour
              </button>
            )}
            <button 
              onClick={goToProfile}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              title="Votre profil"
            >
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
              <span className="hidden sm:inline">Profil</span>
            </button>
          </div>
        </header>
      )}

      {/* --- VUE 1 : MENU PRINCIPAL --- */}
      {view === 'menu' && (
        <div className="text-center space-y-12 mt-10">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Créez. Jouez. Partagez.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            La première plateforme de jeux générés par IA. Jouez aux créations de la communauté ou codez la vôtre en quelques secondes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {/* Carte MODE JOUEUR */}
            <button 
              onClick={() => setView('library')}
              className="group relative overflow-hidden flex flex-col items-center p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all duration-300 w-full hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            >
              <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:scale-110 transition duration-300">
                <Play size={40} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Explorer la Bibliothèque</h2>
              <p className="text-sm text-slate-400">Jouer aux jeux créés par la communauté</p>
            </button>

            {/* Carte MODE CRÉATEUR */}
            <button 
              onClick={() => setView('dev')}
              className="group flex flex-col items-center p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-purple-500 transition-all duration-300 w-full hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              <div className="p-4 bg-purple-500/10 rounded-full mb-4 group-hover:scale-110 transition duration-300">
                <Hammer size={40} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Studio de Création</h2>
              <p className="text-sm text-slate-400">Générer un nouveau jeu avec l'IA</p>
            </button>
          </div>
        </div>
      )}

      {/* --- VUE 2 : BIBLIOTHÈQUE DE JEUX (LISTE) --- */}
      {view === 'library' && (
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <User className="text-blue-400" /> Jeux de la Communauté
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES_LIBRARY.map((game) => (
              <div key={game.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition flex flex-col">
                {/* Image Placeholder (Gradiant pour l'instant) */}
                <div className={`h-32 w-full bg-gradient-to-br ${game.isPlayable ? 'from-blue-900 to-slate-900' : 'from-gray-800 to-slate-950'} flex items-center justify-center`}>
                  <Play size={32} className={`text-white opacity-20 ${game.isPlayable ? 'group-hover:opacity-100' : ''}`} />
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{game.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                      <Star size={14} fill="currentColor" /> {game.stars}
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4 flex-1">{game.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>Par @{game.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {game.lastUpdate}</span>
                  </div>

                  <button 
                    disabled={!game.isPlayable}
                    onClick={() => launchGame(game.id)}
                    className={`w-full py-2 rounded font-medium transition ${
                      game.isPlayable 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {game.isPlayable ? 'Jouer maintenant' : 'Bientôt disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VUE 3 : JEU EN COURS --- */}
      {view === 'playing' && selectedGameId === 'pong-classic' && (
        // On charge le composant PongGame et on lui passe la fonction pour revenir en arrière
        <PongGame onBack={handleBack} />
      )}

      {/* --- VUE 4 : MODE DEV (STUDIO) --- */}
      {view === 'dev' && (
        <GameGenerator onBack={() => setView('menu')} />
      )}

      {/* --- VUE 5 : PROFIL UTILISATEUR --- */}
      {view === 'profile' && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setView('menu')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft size={20} /> Retour
            </button>
            <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-slate-400">Membre depuis 2025</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Section jeux sauvegardés */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="text-yellow-400" size={20} />
                Jeux Sauvegardés ({user.savedGames.length})
              </h3>
              {user.savedGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {user.savedGames.map((gameId) => {
                    const game = GAMES_LIBRARY.find(g => g.id === gameId);
                    if (!game) return null;
                    return (
                      <div key={gameId} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded flex items-center justify-center">
                          <Play size={16} className="text-white opacity-50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{game.title}</p>
                          <p className="text-xs text-slate-400">Par {game.author}</p>
                        </div>
                        <button 
                          onClick={() => launchGame(gameId)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs rounded font-medium"
                        >
                          Jouer
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">Aucun jeu sauvegardé pour le moment.</p>
              )}
            </div>

            {/* Section stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-bold text-blue-400">3</div>
                <div className="text-sm text-slate-400">Jeux créés</div>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-bold text-green-400">12</div>
                <div className="text-sm text-slate-400">Heures jouées</div>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-bold text-purple-400">2</div>
                <div className="text-sm text-slate-400">Jeux sauvegardés</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
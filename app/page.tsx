// app/page.tsx
"use client";

import { useState } from "react";
import { Play, Hammer, User, Code2 } from "lucide-react"; 
import PongGame from "@/components/PongGame"; // Import du jeu qu'on vient de créer

export default function Home() {
  // Gestion de l'état : 'menu', 'game', ou 'dev'
  const [mode, setMode] = useState<'menu' | 'game' | 'dev'>('menu');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-white">
      
      {/* --- AFFICHAGE DU MENU PRINCIPAL --- */}
      {mode === 'menu' && (
        <div className="text-center space-y-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mini SaaS Game Gen
          </h1>
          <p className="text-slate-400 text-lg">Choisissez votre mode pour commencer</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            
            {/* Carte Mode JOUEUR */}
            <button 
              onClick={() => setMode('game')}
              className="group flex flex-col items-center p-10 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 hover:bg-slate-800 transition-all duration-300 w-64"
            >
              <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:scale-110 transition">
                <Play size={48} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Mode Joueur</h2>
              <p className="text-sm text-slate-400">Tester le jeu généré (Pong)</p>
            </button>

            {/* Carte Mode CREATEUR/DEV */}
            <button 
              onClick={() => setMode('dev')}
              className="group flex flex-col items-center p-10 bg-slate-900 border border-slate-800 rounded-2xl hover:border-purple-500 hover:bg-slate-800 transition-all duration-300 w-64"
            >
              <div className="p-4 bg-purple-500/10 rounded-full mb-4 group-hover:scale-110 transition">
                <Hammer size={48} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Mode Créateur</h2>
              <p className="text-sm text-slate-400">Modifier le code ou l'IA</p>
            </button>
          
          </div>
        </div>
      )}

      {/* --- AFFICHAGE DU JEU (Pong) --- */}
      {mode === 'game' && (
        <PongGame onBack={() => setMode('menu')} />
      )}

      {/* --- AFFICHAGE DU MODE DEV (Placeholder) --- */}
      {mode === 'dev' && (
        <div className="flex flex-col items-center space-y-6">
          <Code2 size={64} className="text-slate-600" />
          <h2 className="text-3xl font-bold">Espace Développeur</h2>
          <p className="text-slate-400 max-w-md text-center">
            Ici, vous pourrez bientôt configurer les paramètres de génération de l'IA ou modifier les assets du jeu.
          </p>
          <button 
            onClick={() => setMode('menu')}
            className="px-6 py-2 border border-slate-600 rounded hover:bg-slate-800 transition"
          >
            Retour au menu
          </button>
        </div>
      )}

    </main>
  );
}

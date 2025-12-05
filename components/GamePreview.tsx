import { RefreshCw } from "lucide-react";

import { useState } from 'react';

interface GameCode {
  html: string;
  css: string;
  js: string;
}

interface GamePreviewProps {
  code: GameCode | null;
  onRestart: () => void;
}

export default function GamePreview({ code, onRestart }: GamePreviewProps) {
  if (!code || (!code.html && !code.css && !code.js)) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p className="text-lg font-medium mb-2">Prêt pour ton premier jeu !</p>
          <p className="text-sm">Demande-moi de générer un jeu dans le chat 👈</p>
        </div>
      </div>
    );
  }

  // Construction du document complet à injecter
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          /* CSS Généré */
          ${code.css}
        </style>
      </head>
      <body>
        ${code.html}
        <script>
          try {
            ${code.js}
          } catch (err) {
            console.error('Game Error:', err);
            document.body.innerHTML += '<div style="position:fixed;top:10px;right:10px;color:red;padding:10px;background:rgba(255,255,255,0.95);border-radius:8px;font-family:sans-serif;z-index:9999;">🚨 Erreur: ' + err.message + '</div>';
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header avec bouton REDÉMARRER */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">🎮 Aperçu en direct</span>
        </div>
        <button
          onClick={onRestart}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          title="Redémarrer le jeu (Ctrl+R)"
        >
          <RefreshCw className="w-4 h-4" />
          Redémarrer
        </button>
      </div>
      
      {/* Zone de jeu */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          title="Game Preview"
          srcDoc={srcDoc}
          className="w-full h-full border-none bg-white rounded-t-lg shadow-2xl"
          sandbox="allow-scripts allow-modals allow-forms allow-pointer-lock allow-popups"
        />
      </div>
    </div>
  );
}
// components/GamePreview.tsx
import { RefreshCw } from "lucide-react";

interface GameCode {
  html: string;
  css: string;
  js: string;
}

interface GamePreviewProps {
  code: GameCode | null;
}

export default function GamePreview({ code }: GamePreviewProps) {
  if (!code) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
        <p>Le jeu apparaîtra ici...</p>
      </div>
    );
  }

  // Construction du document complet à injecter
  // On ajoute un style reset de base et une gestion d'erreur script
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; overflow: hidden; font-family: sans-serif; }
          /* CSS Généré */
          ${code.css}
        </style>
      </head>
      <body>
        ${code.html}
        <script>
          // Script Généré
          try {
            ${code.js}
          } catch (err) {
            console.error('Game Error:', err);
            document.body.innerHTML += '<div style="color:red; padding:10px; background:white;">Erreur JS: ' + err.message + '</div>';
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-600">Aperçu en direct</span>
        <div className="flex gap-2">
           {/* Indicateurs ou boutons de contrôle futurs */}
        </div>
      </div>
      <div className="flex-1 relative">
        <iframe
          title="Game Preview"
          srcDoc={srcDoc}
          className="w-full h-full border-none bg-white"
          sandbox="allow-scripts allow-modals allow-forms allow-pointer-lock"
        />
      </div>
    </div>
  );
}
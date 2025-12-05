// app/page.tsx
"use client";
import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import GamePreview from "@/components/GamePreview";

// État initial vide
const INITIAL_CODE = {
  html: "",
  css: "",
  js: ""
};

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentCode, setCurrentCode] = useState(INITIAL_CODE);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userMessage: string) => {
    // 1. Ajouter le message utilisateur à l'historique local
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 2. Appel API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          currentCode: currentCode // On renvoie le code actuel pour que l'IA puisse l'éditer
        }),
      });

      const data = await response.json();

      if (data.html) {
        // 3. Mettre à jour le code
        setCurrentCode(data);
        
        // 4. Ajouter la réponse de l'IA
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Code mis à jour ! Regarde l'aperçu à droite. 🎮" }
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oups, j'ai eu un problème pour générer le code." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Colonne Gauche: Chat (35-40% largeur) */}
      <div className="w-[400px] shrink-0 h-full">
        <ChatInterface 
          onSendMessage={handleSendMessage} 
          messages={messages} 
          isLoading={isLoading} 
        />
      </div>

      {/* Colonne Droite: Preview (Reste) */}
      <div className="flex-1 h-full">
        <GamePreview code={currentCode} />
      </div>
    </main>
  );
}
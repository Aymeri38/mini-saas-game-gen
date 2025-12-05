// app/actions.ts
"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateGameCode(userPrompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Clé API manquante sur le serveur");
  }

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

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // ou "gpt-3.5-turbo"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Crée ce jeu : ${userPrompt}` }
      ],
    });

    let code = completion.choices[0].message.content || "";
    
    // Nettoyage au cas où
    code = code.replace(/```html/g, '').replace(/```/g, '');

    return { success: true, code };
    
  } catch (error) {
    console.error("Erreur serveur OpenAI:", error);
    return { success: false, error: "Échec de la génération" };
  }
}

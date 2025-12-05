"use client";

import { useEffect, useRef } from "react";

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration du jeu
    const ball = { x: 400, y: 200, dx: 4, dy: 4, radius: 10 };
    const paddleHeight = 100;
    const paddleWidth = 10;
    const player = { x: 0, y: 150, score: 0 };
    const computer = { x: 790, y: 150, score: 0 };

    // Logique de dessin
    const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };

    const drawCircle = (x: number, y: number, r: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    };

    const drawText = (text: string, x: number, y: number) => {
      ctx.fillStyle = "#FFF";
      ctx.font = "30px Arial";
      ctx.fillText(text, x, y);
    };

    // Logique de mise à jour (boucle de jeu)
    const update = () => {
      // Déplacement de la balle
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Rebond haut et bas
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // IA basique pour l'ordinateur
      const computerLevel = 0.1;
      computer.y += (ball.y - (computer.y + paddleHeight / 2)) * computerLevel;

      // Détection de collision raquettes
      let playerPaddle = ball.x < canvas.width / 2 ? player : computer;
      
      if (
        ball.x - ball.radius < playerPaddle.x + paddleWidth &&
        ball.x + ball.radius > playerPaddle.x &&
        ball.y + ball.radius > playerPaddle.y &&
        ball.y - ball.radius < playerPaddle.y + paddleHeight
      ) {
        // Inverse la direction et accélère un peu
        let collidePoint = ball.y - (playerPaddle.y + paddleHeight / 2);
        collidePoint = collidePoint / (paddleHeight / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = ball.x < canvas.width / 2 ? 1 : -1;
        
        ball.dx = direction * 4 * 1.5; // Vitesse après impact
        ball.dy = 4 * Math.sin(angleRad) * 1.5;
      }

      // Gestion des points
      if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
      } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
      }
    };

    const resetBall = () => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = -ball.dx;
    };

    const render = () => {
      // Nettoyer le canvas
      drawRect(0, 0, canvas.width, canvas.height, "#000");
      
      // Dessiner les éléments
      drawText(player.score.toString(), canvas.width / 4, canvas.height / 5);
      drawText(computer.score.toString(), (3 * canvas.width) / 4, canvas.height / 5);
      
      drawRect(player.x, player.y, paddleWidth, paddleHeight, "#FFF");
      drawRect(computer.x, computer.y, paddleWidth, paddleHeight, "#FFF");
      drawCircle(ball.x, ball.y, ball.radius, "#FFF");
    };

    const gameLoop = () => {
      update();
      render();
      requestAnimationFrame(gameLoop);
    };

    // Contrôle Souris
    const handleMouseMove = (evt: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      player.y = evt.clientY - rect.top - paddleHeight / 2;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    
    // Lancer le jeu
    gameLoop();

    // Nettoyage quand on quitte la page
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8">
      <h1 className="mb-4 text-3xl font-bold text-white">Pong IA - Version React</h1>
      <div className="border-4 border-gray-700 shadow-xl">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="bg-black cursor-none block"
        />
      </div>
      <p className="mt-4 text-gray-400">Utilisez votre souris pour contrôler la raquette de gauche.</p>
    </div>
  );
}

// components/PongGame.tsx
"use client";

import { useEffect, useRef } from "react";

export default function PongGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- CONFIG DU JEU ---
    let animationFrameId: number;
    const ball = { x: 400, y: 200, dx: 4, dy: 4, radius: 10 };
    const paddleHeight = 100;
    const paddleWidth = 10;
    const player = { x: 0, y: 150, score: 0 };
    const computer = { x: 790, y: 150, score: 0 };

    // --- FONCTIONS DE DESSIN ---
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

    // --- BOUCLE DE JEU ---
    const update = () => {
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Rebond haut/bas
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // IA Ordi
      const computerLevel = 0.1;
      computer.y += (ball.y - (computer.y + paddleHeight / 2)) * computerLevel;

      // Collisions Raquettes
      let playerPaddle = ball.x < canvas.width / 2 ? player : computer;
      if (
        ball.x - ball.radius < playerPaddle.x + paddleWidth &&
        ball.x + ball.radius > playerPaddle.x &&
        ball.y + ball.radius > playerPaddle.y &&
        ball.y - ball.radius < playerPaddle.y + paddleHeight
      ) {
        let collidePoint = ball.y - (playerPaddle.y + paddleHeight / 2);
        collidePoint = collidePoint / (paddleHeight / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = ball.x < canvas.width / 2 ? 1 : -1;
        ball.dx = direction * 5; 
        ball.dy = 5 * Math.sin(angleRad);
      }

      // Score
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
      drawRect(0, 0, canvas.width, canvas.height, "#111"); // Fond
      drawText(player.score.toString(), canvas.width / 4, canvas.height / 5);
      drawText(computer.score.toString(), (3 * canvas.width) / 4, canvas.height / 5);
      drawRect(player.x, player.y, paddleWidth, paddleHeight, "#FFF");
      drawRect(computer.x, computer.y, paddleWidth, paddleHeight, "#FFF");
      drawCircle(ball.x, ball.y, ball.radius, "#FFF");
    };

    const loop = () => {
      update();
      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    // --- CONTROLE SOURIS ---
    const handleMouseMove = (evt: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      player.y = evt.clientY - rect.top - paddleHeight / 2;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    loop();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="flex justify-between w-full mb-4 px-4">
        <h2 className="text-xl font-bold text-white">Pong Arena</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          Quitter
        </button>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="border-2 border-gray-600 rounded shadow-2xl cursor-none max-w-full"
      />
    </div>
  );
}

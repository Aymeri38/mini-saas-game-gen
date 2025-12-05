"use client";
import { useState, useEffect, useCallback } from "react";
import ChatInterface from "@/components/ChatInterface";
import GamePreview from "@/components/GamePreview";
import GameHistory from "@/components/GameHistory";

const INITIAL_CODE = { html: "", css: "", js: "" };

type GameEntry = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
};

const DEFAULT_GAMES: GameEntry[] = [
  {
    id: 'demo-pong',
    name: '🎾 Pong Classic',
    html: `<div id=\"gameContainer\" style=\"width:100%;height:100%;position:relative;\"><canvas id=\"pongCanvas\" width=\"800\" height=\"400\"></canvas><div id=\"score\" style=\"position:absolute;top:20px;left:50%;transform:translateX(-50%);color:white;font-family:Arial;font-size:24px;font-weight:bold;\"><span id=\"playerScore\">0</span> - <span id=\"computerScore\">0</span></div></div>`,
    css: `body { margin: 0; padding: 0; background: #000; overflow: hidden; } #gameContainer { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; } #pongCanvas { background: #111; border: 2px solid #333; border-radius: 8px; box-shadow: 0 0 20px rgba(255,255,255,0.1); } #score { text-shadow: 0 0 10px #00ff00; }`,
    js: `const canvas=document.getElementById('pongCanvas');const ctx=canvas.getContext('2d');const playerScoreEl=document.getElementById('playerScore');const computerScoreEl=document.getElementById('computerScore');let ball={x:400,y:200,vx:5,vy:3,radius:8};let paddle1={x:20,y:180,width:12,height:60,vy:0};let paddle2={x:768,y:180,width:12,height:60,vy:0};let playerScore=0,computerScore=0;let keys={};document.addEventListener('keydown',(e)=>keys[e.key]=true);document.addEventListener('keyup',(e)=>keys[e.key]=false);function update(){if(keys['ArrowUp']&&paddle1.y>0)paddle1.y-=6;if(keys['ArrowDown']&&paddle1.y<340)paddle1.y+=6;paddle2.vy=(ball.y-(paddle2.y+paddle2.height/2))*0.2;paddle2.y+=paddle2.vy;if(paddle2.y<0)paddle2.y=0;if(paddle2.y>340)paddle2.y=340;ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x-ball.radius<paddle1.x+paddle1.width&&ball.y>paddle1.y&&ball.y<paddle1.y+paddle1.height){ball.vx=Math.abs(ball.vx);ball.vy+=(ball.y-(paddle1.y+paddle1.height/2))*0.2}if(ball.x+ball.radius>paddle2.x&&ball.y>paddle2.y&&ball.y<paddle2.y+paddle2.height){ball.vx=-Math.abs(ball.vx);ball.vy+=(ball.y-(paddle2.y+paddle2.height/2))*0.2}if(ball.y-ball.radius<0||ball.y+ball.radius>400)ball.vy=-ball.vy;if(ball.x<0){computerScore++;ball.x=400;ball.y=200;ball.vx=5;ball.vy=3}if(ball.x>800){playerScore++;ball.x=400;ball.y=200;ball.vx=-5;ball.vy=3}playerScoreEl.textContent=playerScore;computerScoreEl.textContent=computerScore}function draw(){ctx.fillStyle='#111';ctx.fillRect(0,0,800,400);ctx.fillStyle='#00ff00';ctx.fillRect(paddle1.x,paddle1.y,paddle1.width,paddle1.height);ctx.fillRect(paddle2.x,paddle2.y,paddle2.width,paddle2.height);ctx.beginPath();ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);ctx.fill();ctx.setLineDash([10,10]);ctx.lineWidth=4;ctx.strokeStyle='#333';ctx.beginPath();ctx.moveTo(400,0);ctx.lineTo(400,400);ctx.stroke()}function gameLoop(){update();draw();requestAnimationFrame(gameLoop)}gameLoop();`,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'demo-snake-pro',
    name: '🐍 Snake Pro',
    html: `<div id=\"snakeGame\" style=\"width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;\"><canvas id=\"snakeCanvas\" width=\"500\" height=\"500\"></canvas><div id=\"ui\" style=\"position:absolute;top:20px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-family:'Segoe UI',Arial,sans-serif;font-weight:600;\"><div>Score: <span id=\"score\">0</span></div><div>Meilleur: <span id=\"highScore\">0</span></div></div><div id=\"gameOver\" style=\"position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:#fff;padding:2rem;border-radius:16px;text-align:center;display:none;font-family:'Segoe UI',Arial,sans-serif;\"><h2 style=\"margin:0 0 1rem 0;font-size:2rem;color:#ff6b6b;\">Game Over!</h2><p style=\"margin:0 0 1rem 0;font-size:1.2rem;\">Score final: <span id=\"finalScore\">0</span></p><button id=\"restart\" style=\"background:#4ecdc4;color:#fff;border:none;padding:12px 24px;border-radius:12px;font-size:1.1rem;font-weight:600;cursor:pointer;transition:all 0.3s;\">🔄 Rejouer</button></div></div>`,
    css: `* { box-sizing: border-box; } body { margin: 0; padding: 0; background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%); overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; } #snakeGame { width: 100vw; height: 100vh; } #snakeCanvas { background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f23 70%); border: 4px solid #4ecdc4; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 50px rgba(78,205,196,0.1); display: block; margin: 0 auto; } #ui { text-shadow: 0 0 20px rgba(255,255,255,0.5); } #ui span { background: linear-gradient(45deg, #4ecdc4, #44a08d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 1.3rem; } #gameOver button:hover { background: #44a08d; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(78,205,196,0.4); }`,
    js: `const canvas=document.getElementById('snakeCanvas');const ctx=canvas.getContext('2d');const scoreEl=document.getElementById('score');const highScoreEl=document.getElementById('highScore');const gameOverEl=document.getElementById('gameOver');const finalScoreEl=document.getElementById('finalScore');const restartBtn=document.getElementById('restart');const grid=25;const cols=canvas.width/grid;const rows=canvas.height/grid;let snake=[{x:10,y:10}],dx=1,dy=0,food={x:15,y:15},score=0,highScore=localStorage.getHighScore||0,tail=[],gameRunning=true,speed=150;highScoreEl.textContent=highScore;function randomFood(){do{food.x=Math.floor(Math.random()*cols);food.y=Math.floor(Math.random()*rows)}while(snake.some(s=>s.x===food.x&&s.y===food.y))}function draw(){ctx.fillStyle='#0f0f23';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.save();ctx.shadowColor='#4ecdc4';ctx.shadowBlur=20;ctx.fillStyle='#ff6b6b';ctx.fillRect(food.x*grid,food.y*grid,grid-3,grid-3);ctx.shadowBlur=15;ctx.fillStyle='#4ecdc4';snake.forEach((part,i)=>{const gradient=ctx.createRadialGradient(part.x*grid+grid/2,part.y*grid+grid/2,0,part.x*grid+grid/2,part.y*grid+grid/2,grid/2);gradient.addColorStop(0,'#4ecdc4');gradient.addColorStop(1,i===0?'#44a08d':'#2d8b7a');ctx.fillStyle=gradient;ctx.fillRect(part.x*grid+1,part.y*grid+1,grid-2,grid-2);ctx.shadowColor='#4ecdc4';ctx.shadowBlur=i===0?25:10});ctx.restore();ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(0,0,canvas.width,canvas.height);scoreEl.textContent=score}function update(){if(!gameRunning)return;const head={x:snake[0].x+dx,y:snake[0].y+dy};if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.slice(1).some(s=>s.x===head.x&&s.y===head.y)){gameOver();return}if(head.x===food.x&&head.y===food.y){score++;if(score>highScore){highScore=score;localStorage.highScore=highScore;highScoreEl.textContent=highScore}randomFood()}else snake.pop();snake.unshift(head);setTimeout(update,speed-(score>10?Math.min(score/10,30):0))}function gameOver(){gameRunning=false;finalScoreEl.textContent=score;gameOverEl.style.display='block'}restartBtn.onclick=()=>{snake=[{x:10,y:10}];dx=1;dy=0;score=0;scoreEl.textContent=0;gameOverEl.style.display='none';gameRunning=true;update()};document.addEventListener('keydown',e=>{if(!gameRunning)return;switch(e.key){case'ArrowUp':if(dy!==1){dx=0;dy=-1}break;case'ArrowDown':if(dy!==-1){dx=0;dy=1}break;case'ArrowLeft':if(dx!==1){dx=-1;dy=0}break;case'ArrowRight':if(dx!==-1){dx=1;dy=0}break}});randomFood();update();draw();setInterval(draw,100);`,
    createdAt: Date.now() - 7200000
  }
];

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentCode, setCurrentCode] = useState(INITIAL_CODE);
  const [gameHistory, setGameHistory] = useState<GameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history OR init with demos
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gameHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        setGameHistory(parsed.slice(-10));
      } else {
        // 🔥 Init avec jeux d'exemple pour TOUS les users
        localStorage.setItem('gameHistory', JSON.stringify(DEFAULT_GAMES));
        setGameHistory(DEFAULT_GAMES);
      }
    } catch (e) {
      console.warn('History init failed, using defaults');
      setGameHistory(DEFAULT_GAMES);
    }
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, currentCode }),
      });

      const data = await response.json();
      if (data.html) {
        const gameEntry: GameEntry = {
          id: Date.now().toString(),
          name: data.name || 'Nouveau jeu',
          html: data.html,
          css: data.css,
          js: data.js,
          createdAt: Date.now()
        };
        const newHistory = [gameEntry, ...gameHistory].slice(0, 10);
        setGameHistory(newHistory);
        localStorage.setItem('gameHistory', JSON.stringify(newHistory));
        
        setCurrentCode({ html: data.html, css: data.css, js: data.js });
        setMessages(prev => [...prev, { role: "assistant", content: data.message || "Jeu généré ! 🎮" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Erreur génération." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartGame = useCallback(() => {
    setCurrentCode(INITIAL_CODE);
    setMessages([]);
    const chatInput = document.querySelector('input[placeholder*="Message"]') as HTMLInputElement;
    chatInput?.focus();
  }, []);

  const handleSaveGame = useCallback(() => {
    if (!currentCode.html && !currentCode.css && !currentCode.js) return;
    const gameEntry: GameEntry = {
      id: Date.now().toString(),
      name: 'Jeu sauvegardé',
      html: currentCode.html,
      css: currentCode.css,
      js: currentCode.js,
      createdAt: Date.now()
    };
    const newHistory = [gameEntry, ...gameHistory].slice(0, 10);
    setGameHistory(newHistory);
    localStorage.setItem('gameHistory', JSON.stringify(newHistory));
  }, [currentCode, gameHistory]);

  const handleLoadGame = useCallback((game: GameEntry) => {
    setCurrentCode({ html: game.html, css: game.css, js: game.js });
  }, []);

  const handleClearHistory = useCallback(() => {
    setGameHistory([]);
    localStorage.removeItem('gameHistory');
  }, []);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* History (25%) avec EXEMPLES ! */}
      <div className="w-80 shrink-0 h-full border-r border-gray-200">
        <GameHistory 
          onLoadGame={handleLoadGame}
          onClearHistory={handleClearHistory}
        />
      </div>

      {/* Chat (50%) */}
      <div className="w-[500px] shrink-0 h-full border-r border-gray-200">
        <ChatInterface 
          onSendMessage={handleSendMessage}
          messages={messages}
          isLoading={isLoading}
        />
      </div>

      {/* Preview (25%) + Boutons */}
      <div className="flex-1 h-full relative">
        <GamePreview 
          code={currentCode}
          onRestart={handleRestartGame}
        />
        {/* 💾 Bouton Sauvegarde fixe */}
        <button
          onClick={handleSaveGame}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          title="💾 Sauvegarder ce jeu"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Sauvegarder
        </button>
      </div>
    </main>
  );
}
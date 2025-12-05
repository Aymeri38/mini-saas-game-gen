import { NextRequest, NextResponse } from 'next/server';

const GAME_TEMPLATES = {
  'pong': {
    name: 'Pong IA',
    emoji: '🎾',
    code: `// Pong IA - Copie ce code dans un fichier .html
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;title&gt;Pong IA&lt;/title&gt;&lt;style&gt;
canvas { border: 2px solid #333; background: #000; display: block; margin: 0 auto; }
body { margin: 0; background: #111; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: Arial; }
&lt;/style&gt;&lt;/head&gt;
&lt;body&gt;
&lt;canvas id="canvas" width="800" height="400"&gt;&lt;/canvas&gt;
&lt;script&gt;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Paddle joueur
let playerY = 150;
const paddleHeight = 80, paddleWidth = 15;

// Paddle IA
const aiY = 150;

// Balle
let ballX = 400, ballY = 200;
let ballSpeedX = 7, ballSpeedY = 3;

// Contrôles
let upPressed = false, downPressed = false;
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') upPressed = true;
  if (e.key === 'ArrowDown') downPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') upPressed = false;
  if (e.key === 'ArrowDown') downPressed = false;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Joueur
  ctx.fillStyle = '#0f0';
  ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
  
  // IA
  ctx.fillStyle = '#f00';
  ctx.fillRect(canvas.width - 35, aiY, paddleWidth, paddleHeight);
  
  // Balle
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Milieu
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
}

function update() {
  // Joueur
  if (upPressed && playerY > 0) playerY -= 8;
  if (downPressed && playerY < canvas.height - paddleHeight) playerY += 8;
  
  // IA simple
  if (aiY + paddleHeight/2 > ballY) aiY -= 4;
  if (aiY + paddleHeight/2 < ballY) aiY += 4;
  
  // Balle
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  
  // Rebond joueur
  if (ballX &lt; 50 && ballY &gt; playerY && ballY &lt; playerY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY += (ballY - (playerY + paddleHeight/2)) * 0.1;
  }
  
  // Rebond IA
  if (ballX &gt; canvas.width - 50 && ballY &gt; aiY && ballY &lt; aiY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }
  
  // Haut/bas
  if (ballY &lt; 0 || ballY &gt; canvas.height) ballSpeedY = -ballSpeedY;
  
  // Score
  if (ballX &lt; 0) { ballX = 400; ballY = 200; ballSpeedX = 7; }
  if (ballX &gt; canvas.width) { ballX = 400; ballY = 200; ballSpeedX = -7; }
}

setInterval(() => { update(); draw(); }, 1000/60);
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;`
  },
  'snake': {
    name: 'Snake Classique',
    emoji: '🐍',
    code: `// Snake - Copie dans un fichier .html
&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Snake&lt;/title&gt;&lt;style&gt;
body { margin: 0; background: #222; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: Arial; }
canvas { border: 3px solid #fff; background: #000; }
&lt;/style&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h2 style="color:#fff; margin-bottom:10px;">Score: &lt;span id="score"&gt;0&lt;/span&gt;&lt;/h2&gt;
&lt;canvas id="game" width="400" height="400"&gt;&lt;/canvas&gt;
&lt;p style="color:#aaa; margin-top:20px;"&gt;↑↓←→ ou WASD&lt;/p&gt;
&lt;script&gt;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
const size = canvas.width / grid;

let snake = [{x: 10, y: 10}];
let dx = 0, dy = 0;
let foodX, foodY;
let score = 0;

function randomFood() {
  foodX = Math.floor(Math.random() * grid);
  foodY = Math.floor(Math.random() * grid);
}
randomFood();

function drawGame() {
  // Fond
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Nourriture
  ctx.fillStyle = '#f44';
  ctx.fillRect(foodX * grid, foodY * grid, grid-2, grid-2);
  
  // Serpent
  for (let i = 0; i &lt; snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#0f0' : '#4a0';
    ctx.fillRect(snake[i].x * grid, snake[i].y * grid, grid-2, grid-2);
  }
  
  // Score
  document.getElementById('score').textContent = score;
}

function update() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  
  // Collision mur
  if (head.x &lt; 0 || head.x &gt;= grid || head.y &lt; 0 || head.y &gt;= grid) {
    location.reload();
    return;
  }
  
  // Collision soi-même
  for (let seg of snake) {
    if (head.x === seg.x && head.y === seg.y) {
      location.reload();
      return;
    }
  }
  
  snake.unshift(head);
  
  // Nourriture
  if (head.x === foodX && head.y === foodY) {
    score++;
    randomFood();
  } else {
    snake.pop();
  }
}

// Contrôles
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { dx=0; dy=-1; }
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { dx=0; dy=1; }
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { dx=-1; dy=0; }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { dx=1; dy=0; }
});

setInterval(() => { update(); drawGame(); }, 150);
&lt;/script&gt;
&lt;/body&gt;&lt;/html&gt;`
  }
};

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }
    
    // Détection simple du jeu demandé
    const lowerMessage = message.toLowerCase();
    let gameType = 'pong';
    
    if (lowerMessage.includes('snake') || lowerMessage.includes('serpent')) {
      gameType = 'snake';
    }
    
    const game = GAME_TEMPLATES[gameType];
    
    // Simulation délai IA (2s)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return NextResponse.json({
      success: true,
      game: {
        id: Date.now(),
        name: game.name,
        emoji: game.emoji,
        code: game.code,
        instructions: 'Copie ce code dans un fichier .html et ouvre dans ton navigateur !'
      }
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
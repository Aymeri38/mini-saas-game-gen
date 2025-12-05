// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GAME_TEMPLATES = {
  pong: {
    html: `<div id="gameContainer" style="width:100%;height:100%;position:relative;"><canvas id="pongCanvas" width="800" height="400"></canvas><div id="score" style="position:absolute;top:20px;left:50%;transform:translateX(-50%);color:white;font-family:Arial;font-size:24px;font-weight:bold;"><span id="playerScore">0</span> - <span id="computerScore">0</span></div></div>`,
    css: `body { margin: 0; padding: 0; background: #000; overflow: hidden; } #gameContainer { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; } #pongCanvas { background: #111; border: 2px solid #333; border-radius: 8px; box-shadow: 0 0 20px rgba(255,255,255,0.1); } #score { text-shadow: 0 0 10px #00ff00; }`,
    js: `const canvas=document.getElementById('pongCanvas');const ctx=canvas.getContext('2d');const playerScoreEl=document.getElementById('playerScore');const computerScoreEl=document.getElementById('computerScore');let ball={x:400,y:200,vx:5,vy:3,radius:8};let paddle1={x:20,y:180,width:12,height:60,vy:0};let paddle2={x:768,y:180,width:12,height:60,vy:0};let playerScore=0,computerScore=0;let keys={};document.addEventListener('keydown',(e)=>keys[e.key]=true);document.addEventListener('keyup',(e)=>keys[e.key]=false);function update(){if(keys['ArrowUp']&&paddle1.y>0)paddle1.y-=6;if(keys['ArrowDown']&&paddle1.y<340)paddle1.y+=6;paddle2.vy=(ball.y-(paddle2.y+paddle2.height/2))*0.2;paddle2.y+=paddle2.vy;if(paddle2.y<0)paddle2.y=0;if(paddle2.y>340)paddle2.y=340;ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x-ball.radius<paddle1.x+paddle1.width&&ball.y>paddle1.y&&ball.y<paddle1.y+paddle1.height){ball.vx=Math.abs(ball.vx);ball.vy+=(ball.y-(paddle1.y+paddle1.height/2))*0.2}if(ball.x+ball.radius>paddle2.x&&ball.y>paddle2.y&&ball.y<paddle2.y+paddle2.height){ball.vx=-Math.abs(ball.vx);ball.vy+=(ball.y-(paddle2.y+paddle2.height/2))*0.2}if(ball.y-ball.radius<0||ball.y+ball.radius>400)ball.vy=-ball.vy;if(ball.x<0){computerScore++;ball.x=400;ball.y=200;ball.vx=5;ball.vy=3}if(ball.x>800){playerScore++;ball.x=400;ball.y=200;ball.vx=-5;ball.vy=3}playerScoreEl.textContent=playerScore;computerScoreEl.textContent=computerScore}function draw(){ctx.fillStyle='#111';ctx.fillRect(0,0,800,400);ctx.fillStyle='#00ff00';ctx.fillRect(paddle1.x,paddle1.y,paddle1.width,paddle1.height);ctx.fillRect(paddle2.x,paddle2.y,paddle2.width,paddle2.height);ctx.beginPath();ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);ctx.fill();ctx.setLineDash([10,10]);ctx.lineWidth=4;ctx.strokeStyle='#333';ctx.beginPath();ctx.moveTo(400,0);ctx.lineTo(400,400);ctx.stroke()}function gameLoop(){update();draw();requestAnimationFrame(gameLoop)}gameLoop();`
  }
};

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const lowerMessage = message.toLowerCase();
    const templateKey = lowerMessage.includes('pong') ? 'pong' : 'pong';
    const template = GAME_TEMPLATES[templateKey];
    return NextResponse.json({
      ...template,
      name: 'Pong Classic',
      message: 'Pong généré ! ↑↓ flèches pour jouer 🎮'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur génération' }, { status: 500 });
  }
}
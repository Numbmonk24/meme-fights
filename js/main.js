const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

let gameState = 'title'; // title | select | fight | gameover
let selectedCharacter = 0;
let player = null;
let enemy = null;
let round = 1;
let message = '';
let messageTimer = 0;

 // Character roster (expand this to 15 later)
const characters = [
  {
    id: 'sparrow',
    name: 'SPARROW',
    color: '#f4a261',
    spriteSrc: 'assets/sprites/sparrow/spritesheet.png',
    frameWidth: 80,
    frameHeight: 100
  },
  {
    id: 'greedy_wife',
    name: 'GREEDY WIFE',
    color: '#9b2226',
    spriteSrc: 'assets/sprites/greedy_wife/spritesheet.png',
    frameWidth: 80,
    frameHeight: 100
  },
  {
    id: 'old_man',
    name: 'OLD MAN',
    color: '#90be6d',
    spriteSrc: 'assets/sprites/old_man/spritesheet.png',
    frameWidth: 80,
    frameHeight: 100
  }
];

// ===== Initialize =====
function init() {
  Sound.init();
  Input.init();
  requestAnimationFrame(loop);
}

// ===== Screens =====
function drawTitle() {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#ffde59';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('MEME FIGHTS', W/2, 160);

  ctx.font = '24px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Suzume Edition', W/2, 210);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Press ENTER or TAP to Start', W/2, 340);
}

function drawCharacterSelect() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#ffde59';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SELECT YOUR FIGHTER', W/2, 60);

  characters.forEach((char, i) => {
    const x = 150 + i * 180;
    const y = 180;

    // Box
    ctx.strokeStyle = i === selectedCharacter ? '#ffde59' : '#555';
    ctx.lineWidth = i === selectedCharacter ? 4 : 2;
    ctx.strokeRect(x - 60, y - 80, 120, 160);

    // Placeholder color
    ctx.fillStyle = char.color;
    ctx.fillRect(x - 50, y - 70, 100, 140);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(char.name, x, y + 100);
  });

  ctx.font = '18px Arial';
  ctx.fillStyle = '#aaa';
  ctx.fillText('← → to choose   |   ENTER to confirm', W/2, 400);
}

function startFight() {
  const pConfig = characters[selectedCharacter];
  player = new Fighter({
    ...pConfig,
    x: 150,
    facing: 1,
    isPlayer: true
  });

  // Enemy is currently always Greedy Wife (we can make this selectable later)
  enemy = new Fighter({
    ...characters[1],
    x: 550,
    facing: -1,
    isPlayer: false
  });

  round = 1;
  player.wins = 0;
  enemy.wins = 0;
  gameState = 'fight';
  Sound.play('start');
}

// ===== Main Loop =====
function loop() {
  ctx.clearRect(0, 0, W, H);

  if (gameState === 'title') {
    drawTitle();
  } 
  else if (gameState === 'select') {
    drawCharacterSelect();
  } 
  else if (gameState === 'fight') {
    // Simple background for now
    ctx.fillStyle = '#7ec8e3';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#56ab2f';
    ctx.fillRect(0, 360, W, 90);

    // Update & draw fighters
    if (player) {
      // Player controls
      player.vx = 0;
      if (Input.isDown('arrowleft'))  { player.vx = -player.speed; player.facing = -1; }
      if (Input.isDown('arrowright')) { player.vx =  player.speed; player.facing =  1; }
      if (Input.isDown('arrowup') && player.y >= 340) {
        player.vy = player.jumpForce;
        Sound.play('jump');
      }
      if (Input.isDown('z')) player.punch();
      if (Input.isDown('x')) player.kick();
      if (Input.isDown('c')) player.special();

      player.update(enemy);
      player.draw(ctx);
    }

    if (enemy) {
      // Very basic AI
      const dist = player.x - enemy.x;
      enemy.facing = dist > 0 ? 1 : -1;
      if (Math.abs(dist) > 120) {
        enemy.vx = enemy.facing * 2.8;
      } else {
        enemy.vx = 0;
        if (Math.random() < 0.02) enemy.punch();
      }
      enemy.update(player);
      enemy.draw(ctx);
    }

    // Health bars
    drawHealthBars();
  }

  requestAnimationFrame(loop);
}

function drawHealthBars() {
  // Player
  ctx.fillStyle = '#333';
  ctx.fillRect(30, 20, 300, 22);
  ctx.fillStyle = '#00e676';
  ctx.fillRect(30, 20, 300 * (player.health / 100), 22);
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(30, 20, 300, 22);

  // Enemy
  ctx.fillStyle = '#333';
  ctx.fillRect(W - 330, 20, 300, 22);
  ctx.fillStyle = '#ff1744';
  ctx.fillRect(W - 330, 20, 300 * (enemy.health / 100), 22);
  ctx.strokeRect(W - 330, 20, 300, 22);
}

// ===== Controls for menus =====
window.addEventListener('keydown', e => {
  if (gameState === 'title' && (e.key === 'Enter' || e.key === ' ')) {
    gameState = 'select';
    Sound.play('select');
  }
  if (gameState === 'select') {
    if (e.key === 'ArrowLeft')  selectedCharacter = Math.max(0, selectedCharacter - 1);
    if (e.key === 'ArrowRight') selectedCharacter = Math.min(characters.length - 1, selectedCharacter + 1);
    if (e.key === 'Enter') startFight();
  }
});

// Touch support for title/select
canvas.addEventListener('click', () => {
  if (gameState === 'title') {
    gameState = 'select';
  } else if (gameState === 'select') {
    startFight();
  }
});

init();

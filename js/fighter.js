class Fighter {
  constructor(config) {
    this.name = config.name;
    this.sprite = new Sprite(
      config.spriteSrc,
      config.frameWidth || 80,
      config.frameHeight || 100,
      config.animations || {
        idle:   { frames: [0, 1, 2, 1], speed: 12 },
        walk:   { frames: [3, 4, 5, 4], speed: 8 },
        jump:   { frames: [6], speed: 10 },
        punch:  { frames: [7, 8, 9], speed: 5 },
        kick:   { frames: [10, 11, 12], speed: 5 },
        special:{ frames: [13, 14, 15], speed: 4 },
        hit:    { frames: [16], speed: 8 },
        win:    { frames: [17, 18], speed: 10 }
      }
    );

    this.x = config.x || 150;
    this.y = config.y || 300;
    this.w = config.frameWidth || 80;
    this.h = config.frameHeight || 100;
    this.vx = 0;
    this.vy = 0;
    this.speed = config.speed || 5;
    this.jumpForce = -15;
    this.health = 100;
    this.maxHealth = 100;
    this.facing = config.facing || 1;
    this.state = 'idle';
    this.attackTimer = 0;
    this.cooldown = 0;
    this.isPlayer = config.isPlayer || false;
    this.wins = 0;
  }

  update(opponent) {
    if (this.attackTimer > 0) this.attackTimer--;
    if (this.cooldown > 0) this.cooldown--;

    // Simple gravity
    this.vy += 0.7;
    this.x += this.vx;
    this.y += this.vy;

    const ground = 340;
    if (this.y > ground) {
      this.y = ground;
      this.vy = 0;
    }

    // Keep on screen
    this.x = Math.max(20, Math.min(700, this.x));

    // Animation state
    if (this.attackTimer > 0) {
      // keep current attack anim
    } else if (this.vy < -2) {
      this.state = 'jump';
      this.sprite.play('jump');
    } else if (Math.abs(this.vx) > 0.5) {
      this.state = 'walk';
      this.sprite.play('walk');
    } else {
      this.state = 'idle';
      this.sprite.play('idle');
    }

    this.sprite.update();
  }

  draw(ctx) {
    this.sprite.draw(ctx, this.x, this.y - this.h + 20, this.facing, 1.1);
  }

  punch() {
    if (this.cooldown > 0) return;
    this.state = 'punch';
    this.sprite.play('punch');
    this.attackTimer = 20;
    this.cooldown = 25;
    Sound.play('punch');
  }

  kick() {
    if (this.cooldown > 0) return;
    this.state = 'kick';
    this.sprite.play('kick');
    this.attackTimer = 22;
    this.cooldown = 30;
    Sound.play('kick');
  }

  special() {
    if (this.cooldown > 0) return;
    this.state = 'special';
    this.sprite.play('special');
    this.attackTimer = 28;
    this.cooldown = 50;
    this.vy = -8;
    Sound.play('special');
  }
}

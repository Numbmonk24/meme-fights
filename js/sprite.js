class Sprite {
  constructor(src, frameWidth, frameHeight, animations) {
    this.image = new Image();
    this.image.src = src;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.animations = animations; // { idle: {frames: [0,1,2], speed: 8}, walk: {...}, ... }
    this.currentAnim = 'idle';
    this.frameIndex = 0;
    this.tick = 0;
    this.loaded = false;

    this.image.onload = () => this.loaded = true;
  }

  play(animName) {
    if (this.currentAnim !== animName) {
      this.currentAnim = animName;
      this.frameIndex = 0;
      this.tick = 0;
    }
  }

  update() {
    if (!this.loaded) return;
    const anim = this.animations[this.currentAnim];
    if (!anim) return;

    this.tick++;
    if (this.tick >= anim.speed) {
      this.tick = 0;
      this.frameIndex = (this.frameIndex + 1) % anim.frames.length;
    }
  }

  draw(ctx, x, y, facing = 1, scale = 1) {
    if (!this.loaded) {
      // Placeholder rectangle while loading
      ctx.fillStyle = '#f4a261';
      ctx.fillRect(x, y, this.frameWidth * scale, this.frameHeight * scale);
      return;
    }

    const anim = this.animations[this.currentAnim];
    const frame = anim.frames[this.frameIndex];
    const sx = (frame % (this.image.width / this.frameWidth)) * this.frameWidth;
    const sy = Math.floor(frame / (this.image.width / this.frameWidth)) * this.frameHeight;

    ctx.save();
    ctx.translate(x + (this.frameWidth * scale) / 2, y);
    ctx.scale(facing, 1);
    ctx.drawImage(
      this.image,
      sx, sy, this.frameWidth, this.frameHeight,
      - (this.frameWidth * scale) / 2, 0,
      this.frameWidth * scale, this.frameHeight * scale
    );
    ctx.restore();
  }
}

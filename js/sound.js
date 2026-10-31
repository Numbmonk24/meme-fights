// Simple sound manager (ready for real files)
const Sound = {
  sounds: {},
  
  load(name, src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.sounds[name] = audio;
  },

  play(name) {
    const s = this.sounds[name];
    if (s) {
      s.currentTime = 0;
      s.play().catch(() => {}); // ignore autoplay errors
    } else {
      console.log(`🔊 ${name}`);
    }
  },

  // Call this once at start (paths ready for your files)
  init() {
    this.load('punch',   'assets/sfx/punch.mp3');
    this.load('kick',    'assets/sfx/kick.mp3');
    this.load('special', 'assets/sfx/special.mp3');
    this.load('hit',     'assets/sfx/hit.mp3');
    this.load('jump',    'assets/sfx/jump.mp3');
    this.load('win',     'assets/sfx/win.mp3');
    this.load('lose',    'assets/sfx/lose.mp3');
    this.load('select',  'assets/sfx/select.mp3');
    this.load('start',   'assets/sfx/start.mp3');
  }
};

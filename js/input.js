const Input = {
  keys: {},
  touch: {
    left: false, right: false, jump: false,
    punch: false, kick: false, special: false
  },

  init() {
    window.addEventListener('keydown', e => {
      this.keys[e.key.toLowerCase()] = true;
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', e => {
      this.keys[e.key.toLowerCase()] = false;
    });
  },

  isDown(key) {
    return !!this.keys[key];
  }
};

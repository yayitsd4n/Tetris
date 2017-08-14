var game = {
  timeStep: 1000 / 60,
  lastFrameMs: 0,
  delta: 0,
  processInput() {

  },
  update(delta) {
    console.log('update', delta);
  },
  render(interp) {
    console.log(interp);
  },
  main: function(timestamp) { 
    var elapsed = timestamp - this.lastFrameMs;
    this.lastFrameMs = timestamp;
    this.delta += elapsed;

    this.processInput();
    while (this.delta >= this.timeStep) {
      this.update(this.delta);
      this.delta -= this.timeStep;
    }
    this.render(this.delta / this.timeStep);

    requestAnimationFrame(game.main.bind(this));
  }
}

requestAnimationFrame(game.main.bind(game));
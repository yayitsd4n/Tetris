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
};

var randomGenerator = {
  bag: [],
  getTetromino() {
    if (this.bag.length == 0) {
      console.log('generate new bag');
      this.bag = this.generateNewBag();
    }
    return this.bag.shift();
  },
  generateNewBag() {
    var tetrominoes = ['I','J','L','O','S','T','Z'];
    var bag = [];

    for (var i = 7; i > 0; i--) {
      var tetrominoIndex = Math.floor( Math.random() * i);

      bag.push(tetrominoes[tetrominoIndex]);
      tetrominoes.splice(tetrominoIndex, 1);
    }

    return bag;
  }
};

setInterval(function() {
  console.log(randomGenerator.getTetromino());
}, 1000);

//requestAnimationFrame(game.main.bind(game));
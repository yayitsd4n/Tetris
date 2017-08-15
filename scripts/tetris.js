// Basically the main loop. Keeps track of time, schedules user input,
// game logic updates, and rendering
var Game = {
  timeStep: 1000 / 60,
  lastFrameMs: 0,
  delta: 0,
  processInput() {

  },
  update(delta) {
    Gameboard.tick(delta);
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

    requestAnimationFrame(this.main.bind(this));
  }
};

// The game board state
var Gameboard = {
  board: [
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[]]
  ],
  tetromino: null,
  tick() {
    setTetromino();
  }

};

var GameboardUtils = {
  setTetromino() {
    this.tetromino = RandomGenerator.getTetromino() 
  },
}
Object.setPrototypeOf(Gameboard, GameboardUtils);

// Handles randomly generating and returning a tetromino
var RandomGenerator = {
  bag: [],
  getTetromino() {
    if (this.bag.length === 0) {
      console.log('generate new bag');
      this.bag = this.generateNewBag();
    }
    return this.bag.shift();
  },
  generateNewBag() {
    //var tetrominoes = ['I','J','L','O','S','T','Z'];
    var bag = [];

    for (var i = 7; i > 0; i--) {
      var tetrominoIndex = Math.floor( Math.random() * i);

      bag.push(tetrominoes[tetrominoIndex]);
      tetrominoes.splice(tetrominoIndex, 1);
    }

    return bag;
  }
};

var I = {
  piece: [['I'],['I'],['I'],['I']]
};
var O = {
  piece: [
    [['O'],['O']],
    [['O'],['O']]
  ]
};
var T = {
  piece: [
    [['T'],['T'],['T']],
    [[null],['T'],[null]]
  ]
};

// setInterval(function() {
//   Gameboard.setTetromino()
//   console.log(Gameboard);
// }, 1000);

//requestAnimationFrame(game.main.bind(Game));
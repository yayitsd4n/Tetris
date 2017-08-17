// Basically the main loop. Keeps track of time, schedules user input,
// game logic updates, and rendering
var Game = {
  timeStep: 1000 / 60,
  lastFrameMs: 0,
  delta: 0,
  processInput() {

  },
  update(timeStep) {
    Gameboard.tick(timeStep);
  },
  render(interp) {
    //console.log(interp);
  },
  main: function(timestamp) {
    var elapsed = timestamp - this.lastFrameMs;
    this.lastFrameMs = timestamp;
    this.delta += elapsed;

    this.processInput();
    while (this.delta >= this.timeStep) {
      this.update(this.timeStep);
      this.delta -= this.timeStep;
    }
    this.render(this.delta / this.timeStep);

    requestAnimationFrame(this.main.bind(this));
  }
};

// The game board state
var Gameboard = {
  properties: {
    speed: 1
  },
  board: [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ],
  tetromino: null,
  tick(timeStep) {
    if (!this.tetromino) {
      this.setTetromino();
      this.tetromino.spawn(this);
    }
    this.tetromino.update(this);
  }

};

var GameboardUtils = {
  setTetromino() {
    var tetromino = RandomGenerator.getTetromino();

    switch (tetromino) {
      case 'I':
        this.tetromino = Object.create(I);
        break;
      case 'J':
        this.tetromino = Object.create(J);
        break;
      case 'L':
        this.tetromino = Object.create(L);
        break;
      case 'O':
        this.tetromino = Object.create(O);
        break;
      case 'S':
        this.tetromino = Object.create(S);
        break;
      case 'T':
        this.tetromino = Object.create(T);
        break;
      case 'Z':
        this.tetromino = Object.create(Z);
        break;
    }
  }
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
    var tetrominoes = ['I','I','I','I','I','I','I'];
    var bag = [];

    for (var i = 7; i > 0; i--) {
      var tetrominoIndex = Math.floor(Math.random() * i);

      bag.push(tetrominoes[tetrominoIndex]);
      tetrominoes.splice(tetrominoIndex, 1);
    }

    return bag;
  }
};

var Tetromino = {
  update(Gameboard) {
    this.frames++;

    // 60 should be the game speed instead.
    if (this.frames != 60) return;

    // Remove parts from the board
    this.entity.forEach(function(part, index) {
      var y = part.y + this.y,
          x = part.x + this.x;

      Gameboard.board[y][x] = 0;
    }, this);

    this.frames = 0;
    this.y++;

    // Add parts to the board
    this.entity.forEach(function(part, index) {
      var y = part.y + this.y,
          x = part.x + this.x;
      
      Gameboard.board[y][x] = part.part;
    }, this);
  },
  spawn(Gameboard) {
    this.frames = 0;
    this.y = this.spawnPoints.y;
    this.x = this.spawnPoints.x;

    this.entity.forEach(function(part, index) {
      var y = part.y + this.y,
          x = part.x + this.x;
    
      Gameboard.board[y][x] = part.part;
    }, this);
  }
};

var I = {
  entity: [
    {
      y: 0,
      x: 0,
      part: 'I'
    },
    {
      y: 1,
      x: 0,
      part: 'I'
    },
    {
      y: 2,
      x: 0,
      part: 'I'
    },
    {
      y: 3,
      x: 0,
      part: 'I'
    },
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(I, Tetromino);

requestAnimationFrame(Game.main.bind(Game));
// Basically the main loop. Keeps track of time, schedules user input,
// game logic updates, and rendering
var Game = {
  timeStep: 1000 / 60,
  lastFrameMs: 0,
  delta: 0,
  init() {
    UserInputs.init();
    requestAnimationFrame(Game.main.bind(this));
  },
  processInput() {
    //console.log(UserInputs.inputqueue);
    //UserInputs.inputqueue.pop();
  },
  update(timeStep) {
    Gameboard.tick(timeStep);
  },
  render(interp) {
    var canvas = document.getElementById('game');
        ctx = canvas.getContext('2d');
    
    Asciirender.render();
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

var UserInputs = {
  init() {
    document.addEventListener('keyup', function(event) {
      this.inputqueue.push(event.key);
    }.bind(this));
  },
  inputqueue: []
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
      console.log('set');
      this.setTetromino();
      this.tetromino.spawn(this);
      console.log(this.tetromino);
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

var Asciirender = {
  render() {
    var asciiCanavs = document.getElementById('asciiGame');
    
    var frame = document.createElement('table');
    frame.innerHTML = '<tbody id="frameBody"></tbody>';
    var frameBody = frame.querySelector('#frameBody');  

    asciiCanavs.innerHTML = '';

    this.board.forEach(function(row) {
      var asciiRow = document.createElement('tr');
      row.forEach(function(column) {
        var square = document.createElement('td');

        if (column != 0) square.classList = column;

        asciiRow.appendChild(square);
      });
      frameBody.appendChild(asciiRow);
    }, this);

    asciiCanavs.appendChild(frame);
  }
};
Object.setPrototypeOf(Asciirender, Gameboard);

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
    var tetrominoes = ['I','J','L','O','S','T','Z'];
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
  move: {
    x: 0,
    y: 0
  },
  update(Gameboard) {
    this.frames++;
    this.handleInput();

    // If frames equals the game speed, increment it's y position
    if (this.frames == 10) {
      this.frames = 0;
      if (!this.checkCollision(1,0)) {
        this.move.y = 1;
      } else {
        console.log('remove');
        Gameboard.tetromino = null;
      }
    }

    this.clearSelf();
    this.moveSelf();
  },
  spawn(Gameboard) {
    this.frames = 0;

    this.entity.forEach(function(part, index) {
      part.y += this.spawnPoints.y;
      part.x += this.spawnPoints.x;
    
      Gameboard.board[part.y][part.x] = part.part;
    }, this);
  },
  handleInput() {
    var input = UserInputs.inputqueue.pop();

    if (input == 'ArrowLeft') {
      if (!this.checkCollision(0, 1)) {
        this.move.x = -1;
      }
    }

    if (input == 'ArrowRight') {
      if (!this.checkCollision(1, 0)) {
        this.move.x = 1;
      }
    }
  },
  checkCollision(y, x) {
    var positions = [];
    var collision = false;
    this.entity.forEach(function(part) {
      positions.push(part.y + ':' + part.x);
    }, this);

    this.entity.forEach(function(part, index) {
      var partY = part.y + y,
          partX = part.x + x;

      // Is the part about to hit the floor?
      if (Gameboard.board.length == partY) {
        console.log('collision');
        collision = true;
        return
      } 
      
      // Is the part going to an occupied space?
      if (Gameboard.board[partY][partX] != 0) {
      // Is the occupied space part of the current tetromino?
        if (positions.indexOf(partY + ':' + partX) == -1) {
          console.log('collision');
          collision = true;
        }
      }
    }, this);
    return collision;
  },
  clearSelf() {
    this.entity.forEach(function(part) {
      Gameboard.board[part.y][part.x] = 0;
    }, this);
  },
  moveSelf() {
    this.entity.forEach(function(part) {
      part.y += this.move.y;
      part.x += this.move.x;
      Gameboard.board[part.y][part.x] = part.part;
    }, this);

    this.move.y = 0;
    this.move.x = 0;
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
      y: 0,
      x: 1,
      part: 'I'
    },
    {
      y: 0,
      x: 2,
      part: 'I'
    },
    {
      y: 0,
      x: 3,
      part: 'I'
    },
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(I, Tetromino);

var J = {
  entity: [
    {
      y: 0,
      x: 0,
      part: 'J'
    },
    {
      y: 0,
      x: 1,
      part: 'J'
    },
    {
      y: 0,
      x: 2,
      part: 'J'
    },
    {
      y: 1,
      x: 2,
      part: 'J'
    }
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(J, Tetromino);

var L = {
  entity: [
    {
      y: 0,
      x: 0,
      part: 'L'
    },
    {
      y: 0,
      x: 1,
      part: 'L'
    },
    {
      y: 0,
      x: 2,
      part: 'L'
    },
    {
      y: 1,
      x: 0,
      part: 'L'
    }
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(L, Tetromino);

var O = {
  entity: [
    {
      y: 0,
      x: 0,
      part: 'O'
    },
    {
      y: 0,
      x: 1,
      part: 'O'
    },
    {
      y: 1,
      x: 0,
      part: 'O'
    },
    {
      y: 2,
      x: 0,
      part: 'O'
    }
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(O, Tetromino);

var S = {
  entity: [
    {
      y: 0,
      x: 1,
      part: 'S'
    },
    {
      y: 0,
      x: 2,
      part: 'S'
    },
    {
      y: 1,
      x: 1,
      part: 'S'
    },
    {
      y: 1,
      x: 2,
      part: 'S'
    }
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(S, Tetromino);

var T = {
  entity: [
    {
      y: 0,
      x: 0,
      part: 'T'
    },
    {
      y: 0,
      x: 1,
      part: 'T'
    },
    {
      y: 0,
      x: 2,
      part: 'T'
    },
    {
      y: 1,
      x: 1,
      part: 'T'
    }
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(T, Tetromino);

var Z = {
  entity: [
    {
      y: 0,
      x: 0,
      part: 'Z'
    },
    {
      y: 0,
      x: 1,
      part: 'Z'
    },
    {
      y: 1,
      x: 1,
      part: 'Z'
    },
    {
      y: 1,
      x: 2,
      part: 'Z'
    }
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(Z, Tetromino);

Game.init();
//requestAnimationFrame(Game.main.bind(Game));
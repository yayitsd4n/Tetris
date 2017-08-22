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
      this.setTetromino();
      this.tetromino.spawn();
    }
    this.tetromino.update();
  }
};

var GameboardUtils = {
  setTetromino() {
    var tetromino = RandomGenerator.getTetromino();
    var properties = {
      frames: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 0
      },
      blocks: {
        writable: true,
        enumerable: true,
        configurable: true
      },
      position: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 0
      }
    };

    function setBlocks(tetromino) {
      var blocks = [];
      tetromino.blocks.forEach(function(block) {
        blocks.push({
          y: block.y,
          x: block.x
        });
      });

      properties.blocks.value = blocks;
    };

    switch (tetromino) {
      case 'I':
        setBlocks(I);
        this.tetromino = Object.create(I, properties);
        break;
      case 'J':
        setBlocks(J);
        this.tetromino = Object.create(J, properties);
        break;
      case 'L':
        setBlocks(L);
        this.tetromino = Object.create(L, properties);
        break;
      case 'O':
        setBlocks(O);
        this.tetromino = Object.create(O, properties);
        break;
      case 'S':
        setBlocks(S);
        this.tetromino = Object.create(S, properties);
        break;
      case 'T':
        setBlocks(T);
        this.tetromino = Object.create(T, properties);
        break;
      case 'Z':
        setBlocks(Z);
        this.tetromino = Object.create(Z, properties);
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
      this.bag = this.generateNewBag();
    }
    return this.bag.shift();
  },
  generateNewBag() {
    var tetrominoes = ['I','J','L','O','S','T','Z'];
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
  update() {
    this.frames++;

    this.handleInput();

    // if (this.frames == 15) {
    //   this.frames = 0;

    //   var transformed = this.transform(1, 0);
    //   if (this.destroy) {
    //     if (!this.checkCollision(transformed)) {
    //       Gameboard.tetromino = null;
    //       return;
    //     } else {
    //       this.destroy = false;
    //     }
    //   }

    //   if (this.checkCollision(transformed)) {
    //     this.moveSelf(transformed);
    //   } else {
    //     console.log('set to destroy');
    //     this.destroy = true;
    //   }
    // }
  },
  spawn() {
    this.blocks.forEach(function(block) {
      Gameboard.board[block.y][block.x] = this.block;
    }, this);
  },
  transform(moveY, moveX) {
    var positions = [];

    this.blocks.forEach(function(block) {
      positions.push({
        y: block.y + moveY,
        x: block.x + moveX
      });
    }, this);

    return positions;
  },
  handleInput() {
    var input = UserInputs.inputqueue.pop();
    if (input == 'ArrowLeft') {
      var transformed = this.transform(0, -1);
      if (this.checkCollision(transformed)) {
        this.moveSelf(transformed);
      }
    }

    if (input == 'ArrowRight') {
      var transformed = this.transform(0, 1);
      if (this.checkCollision(transformed)) {
        this.moveSelf(transformed);
      }
    }

    if (input == 'a') {
      this.SRS(1, -1);
    }

    if (input == 's') {
      this.SRS(-1, 1);
    }
  },
  checkCollision(transformed) {
    return transformed.every(function(position) {

      if (position.y == Gameboard.board.length) {
        console.log('hit floor');
        return false;
      }
      
      return this.blocks.some(function(position2) {
        if (Gameboard.board[position.y][position.x] != 0) {
          return position.y == position2.y && position.x == position2.x;
        } else {
          return true;
        }
      }, this);

    }, this);
  },
  clearSelf() {
    this.blocks.forEach(function(block) {
      Gameboard.board[block.y][block.x] = 0;;
    }, this);
  },
  moveSelf(transformed) {
    this.clearSelf();
    this.blocks = transformed;

    this.blocks.forEach(function(position) {
      Gameboard.board[position.y][position.x] = this.block;
    }, this);
  },
  SRS(directionY, directionX) {
    var tests;
    switch(this.position) {
      case(0):
        tests = {
          1: [
            [-1, 0],[-1, 1],[0, 2],[-1, -2]
          ],
          3: [
            [1, 0], [1, 1], [0, -2], [1, 2]
          ]
        }
      break;
      case(1):
      case(-1):
        tests =  {
          0: [
            [1, 0], [1, -1], [0, 2], [1, 2]
          ],
          2: [
            [1, 0], [1, -1], [0, 2], [1, 2]
          ]
        }
      break;
      case(2):
      case(-2):
        tests = {
          1: [
            [-1, 0], [-1, 1], [0, -2], [-1, -2]
          ],
          3: [
            [1, 0], [1, 1], [0, -2], [1, -2]
          ]
        }
      break;
      case(3):
      case(-3):
        tests = {
          2: [
            [-1, 0], [-1, -1], [0, 2], [-1, -2]
          ], 
          0: [
            [-1, 0], [-1, -1], [0, 2], [-1, 2]
          ]
        }
      break;
    }

    var positions = [1, 2, 3, 0, 1, 2, 3];
    var pointer = positions.indexOf(this.position),
        newPointer,
        futurePosition;

    if (pointer + directionY == 7 || pointer + directionY == -1) {
      newPointer = 3;
    } else {
      newPointer = pointer + directionY;
    }

    futurePosition = positions[newPointer];

    console.log(tests[futurePosition]);
  },
  rotate(directionY, directionX) {
    var positions = [];
    var pivit = this.pivit();

    this.blocks.forEach(function(block) {
      var y = block.y,
          x = block.x;

      var vY = y - pivit.y;
      var vX = x - pivit.x;

      var newY = (0 * vY) + (directionY * vX) + pivit.y;
      var newX = (directionX * vY) + (0 * vX) + pivit.x;

      positions.push({
        y: newY,
        x: newX
      });
    }, this);

    if (this.checkCollision(positions)) {
      this.moveSelf(positions);
      
      // Save the orientation
      var positions = [1, 2, 3, 0, 1, 2, 3];
      var pointer = positions.indexOf(this.position),
          newPointer;

      if (pointer + directionY == 7 || pointer + directionY == -1) {
        newPointer = 3;
      } else {
        newPointer = pointer + directionY;
      }

      this.position = positions[newPointer];
    } else {
      this.kick();
    }
  },
  kick() {
    
  }
};

var I = {
  block: 'I',
  blocks: [
    {
      y: 3,
      x: 5
    },
    {
      y: 3,
      x: 6
    },
    {
      y: 3,
      x: 7
    },
    {
      y: 3,
      x: 8
    }
  ],
  pivit() {
    var y = this.blocks[1].y,
        x = this.blocks[1].x;

    switch(this.position) {
      case(0):
        y += .5;
        x += .5;
      break;
      case(1):
        y += .5;
        x -= .5;
      break;
      case(2):
        y -= .5;
        x -= .5;
      break;
      case(3):
        y -= .5;
        x += .5;
      break;
    }

    return {
      y: y,
      x: x
    };

  }
};
Object.setPrototypeOf(I, Tetromino);

var J = {
  block: 'J',
  blocks: [
    {
      y: 0,
      x: 5
    },
    {
      y: 1,
      x: 5
    },
    {
      y: 1,
      x: 6,
    },
    {
      y: 1,
      x: 7
    }
  ],
  pivit() {
    return {
      y: this.blocks[2].y,
      x: this.blocks[2].x
    }
  }
};
Object.setPrototypeOf(J, Tetromino);

var L = {
  block: 'L',
  blocks: [
    {
      y: 0,
      x: 7
    },
    {
      y: 1,
      x: 5
    },
    {
      y: 1,
      x: 6
    },
    {
      y: 1,
      x: 7
    }
  ],
  pivit() {
    return {
      y: this.blocks[2].y,
      x: this.blocks[2].x
    }
  }
};
Object.setPrototypeOf(L, Tetromino);

var O = {
  block: 'O',
  blocks: [
    {
      y: 0,
      x: 5
    },
    {
      y: 0,
      x: 6
    },
    {
      y: 1,
      x: 5
    },
    {
      y: 1,
      x: 6
    }
  ],
  rotate() {
    // Shadow base rotate method
    // O block does not rotate
    return;
  }
};
Object.setPrototypeOf(O, Tetromino);

var S = {
  block: 'S',
  blocks: [
    {
      y: 0,
      x: 6
    },
    {
      y: 0,
      x: 7
    },
    {
      y: 1,
      x: 5
    },
    {
      y: 1,
      x: 6
    }
  ],
  pivit() {
    return {
      y: this.blocks[3].y,
      x: this.blocks[3].x
    }
  }
};
Object.setPrototypeOf(S, Tetromino);

var T = {
  block: 'T',
  blocks: [
    {
      y: 0,
      x: 6
    },
    {
      y: 1,
      x: 5
    },
    {
      y: 1,
      x: 6
    },
    {
      y: 1,
      x: 7
    }
  ],
  pivit() {
    return {
      y: this.blocks[2].y,
      x: this.blocks[2].x
    }
  }
};
Object.setPrototypeOf(T, Tetromino);

var Z = {
  block: 'Z',
  blocks: [
    {
      y: 0,
      x: 5
    },
    {
      y: 0,
      x: 6
    },
    {
      y: 1,
      x: 6
    },
    {
      y: 1,
      x: 7
    }
  ],
  pivit() {
    return {
      y: this.blocks[2].y,
      x: this.blocks[2].x
    }
  }
};
Object.setPrototypeOf(Z, Tetromino);

Game.init();
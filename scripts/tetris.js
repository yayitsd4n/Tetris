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
      this.tetromino.spawn(this);
    }
    this.tetromino.update(this);
  }

};

var GameboardUtils = {
  setTetromino() {
    var tetromino = RandomGenerator.getTetromino();
    var properties = {
      y: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 0
      },
      x: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 0
      },
      frames: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 0
      },
      entity: {
        writable: true,
        enumerable: true,
        configurable: true
      }
    };

    switch (tetromino) {
      case 'I':
        properties.x.value = I.spawnPoints.x;
        properties.y.value = I.spawnPoints.y;
        properties.entity.value = I.entity.slice();
        this.tetromino = Object.create(I, properties);
        break;
      case 'J':
        properties.x.value = J.spawnPoints.x;
        properties.y.value = J.spawnPoints.y;
        properties.entity.value = J.entity.slice();
        this.tetromino = Object.create(J, properties);
        break;
      case 'L':
        properties.x.value = L.spawnPoints.x;
        properties.y.value = L.spawnPoints.y;
        properties.entity.value = L.entity.slice();
        this.tetromino = Object.create(L, properties);
        break;
      case 'O':
        properties.x.value = O.spawnPoints.x;
        properties.y.value = O.spawnPoints.y;
        properties.entity.value = O.entity.slice();
        this.tetromino = Object.create(O, properties);
        break;
      case 'S':
        properties.x.value = S.spawnPoints.x;
        properties.y.value = S.spawnPoints.y;
        properties.entity.value = S.entity.slice();
        this.tetromino = Object.create(S, properties);
        break;
      case 'T':
        properties.x.value = T.spawnPoints.x;
        properties.y.value = T.spawnPoints.y;
        properties.entity.value = T.entity.slice();
        this.tetromino = Object.create(T, properties);
        break;
      case 'Z':
        properties.x.value = Z.spawnPoints.x;
        properties.y.value = Z.spawnPoints.y;
        properties.entity.value = Z.entity.slice();
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
  update(Gameboard) {
    this.frames++;

    this.handleInput();

    // if (this.frames == 15) {
    //   this.frames = 0;

    //   if (this.destroy) {
    //     if (this.checkCollision(1, 0)) {
    //       Gameboard.tetromino = null;
    //       return;
    //     } else {
    //       this.destroy = false;
    //     }
    //   }

    //   if (!this.checkCollision(1, 0)) {
    //     this.moveSelf(1, 0);
    //   } else {
    //     console.log('set to destroy');
    //     this.destroy = true;
    //   }
    // }
  },
  spawn(Gameboard) {
    this.entity.forEach(function(row, rowIndex) {
      row.forEach(function(part, partIndex) {
        if (part != 0) {
          var y = this.y + rowIndex,
              x = this.x + partIndex;
          
          Gameboard.board[y][x] = part;
        }
      }, this);
    }, this);
  },
  handleInput() {
    var input = UserInputs.inputqueue.pop();

    if (input == 'ArrowLeft') {
      if (!this.checkCollision(0, -1)) {
        this.moveSelf(0, -1);
      }
    }

    if (input == 'ArrowRight') {
      if (!this.checkCollision(0, 1)) {
        this.moveSelf(0, 1);
      }
    }

    if (input == 'ArrowUp') {
      this.rotate();
    }
  },
  checkCollision(y, x) {
    var positions = [];
    var collision = false;

    this.entity.forEach(function(row, rowIndex) {
      row.forEach(function(part, partIndex) {
        if (part != 0) {
          positions.push((this.y + rowIndex) + ':' + (this.x + partIndex));
        }
      }, this);
    }, this);

    this.entity.forEach(function(row, rowIndex) {
      row.forEach(function(part, partIndex) {
        var partY = this.y + rowIndex + y,
            partX = this.x + partIndex + x;
        
        if (part == 0) return;

        // Is the part about to hit the floor?
        if (Gameboard.board.length == partY) {
          console.log('collision');
          collision = 'bottom';
          return;
        }

        // Is the part going to an occupied space?
        if (Gameboard.board[partY][partX] != 0) {
        // Is the occupied space part of the current tetromino?
          if (positions.indexOf(partY + ':' + partX) == -1) {
            collision = 'occupied';
          }
        }
        
      }, this);
    }, this);
    
    return collision;
  },
  clearSelf() {
    this.entity.forEach(function(row, rowIndex) {
      row.forEach(function(part, partIndex) {
        Gameboard.board[rowIndex + this.y][partIndex + this.x] = 0;
      }, this);
    }, this);
  },
  moveSelf(moveY, moveX) {
    this.clearSelf();
    this.y += moveY;
    this.x += moveX;

    this.entity.forEach(function(row, rowIndex) {
      row.forEach(function(part, partIndex) {
        if (part != 0) {
          var y = this.y + rowIndex,
              x = this.x + partIndex;
          
          Gameboard.board[y][x] = part;
        }
      }, this);
    }, this);
  },
  rotate() {
    console.log(Object.getPrototypeOf(this));
    this.clearSelf();

    var newEntity = this.entity.map(function(row) {
      return row.map(function(cell) {
        return 0;
      }, this);
    }, this);

    var yOrigin = 1,
        xOrigin = 1;
    
    this.entity.forEach(function(row, rowIndex) {
      row.forEach(function(cell, cellIndex) {

        var y = rowIndex,
            x = cellIndex;

        var vY = y - yOrigin;
        var vX = x - xOrigin;
        
        var newY = (0 * vY) + (1 * vX) + yOrigin;
        var newX = (-1 * vY) + (0 * vX) + xOrigin;

        newEntity[newY][newX] = cell;
      }, this)
    }, this);

    this.entity = newEntity;
    this.moveSelf(0,0);
  }
};

var I = {
  entity: [
    [0,0,0,0],
    ['I', 'I', 'I', 'I']
    [0,0,0,0],
    [0,0,0,0]
  ],
  spawnPoints: {
    y: 5,
    x: 5
  }
};
Object.setPrototypeOf(I, Tetromino);

var J = {
  entity: [
    ['J', 0, 0],
    ['J', 'J', 'J'],
    [0,0,0]    
  ],
  spawnPoints: {
    y: 3,
    x: 5
  }
};
Object.setPrototypeOf(J, Tetromino);

var L = {
  entity: [
    [0, 0, 'L'],
    ['L', 'L', 'L'],
    [0,0,0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(L, Tetromino);

var O = {
  entity: [
    ['O', 'O'],
    ['O', 'O']
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(O, Tetromino);

var S = {
  entity: [
    [0, 'S', 'S'],
    ['S', 'S', 0],
    [0,0,0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(S, Tetromino);

var T = {
  entity: [
    [0, 'T', 0],
    ['T', 'T', 'T'],
    [0,0,0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(T, Tetromino);

var Z = {
  entity: [
    ['Z', 'Z', 0],
    [0, 'Z', 'Z'],
    [0,0,0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  }
};
Object.setPrototypeOf(Z, Tetromino);

Game.init();
//requestAnimationFrame(Game.main.bind(Game));
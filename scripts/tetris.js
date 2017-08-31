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
  update(timeStep) {
    Gameboard.tick(timeStep);
    Observer.processEvents();
  },
  render(interp) {
    Render.render();
  },
  main: function(timestamp) {
    var elapsed = timestamp - this.lastFrameMs;
    this.lastFrameMs = timestamp;
    this.delta += elapsed;

    UserInputs.processInput();
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
    document.addEventListener('keydown', this.keyDown.bind(this));
    document.addEventListener('keyup', this.keyUp.bind(this));
  },
  processInput() {
    
    // Prevent auto-repeat for rotate and up key
    if (this.isDown.key == 65 || this.isDown.key == 68 || this.keyDown.key == 38) {
      return;
    }

    if (this.isDown) {
      this.isDown.frames++;
     
     if (!this.isDown.held) {
      if (this.isDown.frames == 15) {
        this.isDown.frames = 0;
        this.isDown.held = true;
      }
     } else {
       if (this.isDown.frames == 5) {
        this.inputqueue.push(this.isDown.key);
        this.isDown.frames = 0;
       }
     }
     
    }
    
  },
  keyDown(event) {
    if (this.isDown == false) {
      var key = {
        key: event.keyCode,
        held: false,
        frames: 0
      }
      this.isDown = key;
      this.inputqueue.push(this.isDown.key);
    }
  },
  keyUp(event) {
    this.isDown = false;
  },
  isDown: false,
  inputqueue: []
};

var Observer = {
  events: [],
  processEvents() {
    this.events.forEach(function(event) {
      switch(event.name) {
        case('addPoints'):
          Points.add(event.data);
        break;
      }
    }, this);

    this.events = [];
  }
};

var Points = {
  add(data) {

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
  entities: {
    tetromino: null,
    effects: []
  },
  tick(timeStep) {
    if (!this.entities.tetromino) {
      this.setTetromino();
    }

    this.entities.tetromino.update();
    this.entities.effects.forEach(function(effect) {
      effect.update();
    }, this);
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
      },
      lockDelay: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 0
      },
      spawnDelay: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 25
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
        this.entities.tetromino = Object.create(I, properties);
        break;
      case 'J':
        setBlocks(J);
        this.entities.tetromino = Object.create(J, properties);
        break;
      case 'L':
        setBlocks(L);
        this.entities.tetromino = Object.create(L, properties);
        break;
      case 'O':
        setBlocks(O);
        this.entities.tetromino = Object.create(O, properties);
        break;
      case 'S':
        setBlocks(S);
        this.entities.tetromino = Object.create(S, properties);
        break;
      case 'T':
        setBlocks(T);
        this.entities.tetromino = Object.create(T, properties);
        break;
      case 'Z':
        setBlocks(Z);
        this.entities.tetromino = Object.create(Z, properties);
        break;
    }
  },
  checkGameOver() {
    this.board[0].concat(this.board[1]).forEach(function(cell) {
      if (cell != 0) {
        console.log('gameover');
      }
    });
  },
  checkClearRows(blocks) {
    var rows = [];

    // For each block placed, check each row to see if it can be removed
    blocks.forEach(function(block) {
      var y = block.y;

      if (this.board[y].every(function(cell) {
        return cell != 0 && cell != 'G';
      }) ) {
        if(rows.indexOf(y) === -1) rows.push(y);
      }

    }, this);

    // Add score

    // Sort the array and remove rows from bottom to top
    rows.sort(function(a, b) {
      return a - b;
    }).forEach(function(row) {
      this.board.splice(row, 1);
      this.board.unshift([0,0,0,0,0,0,0,0,0,0]);
    }, this);
  }
}
Object.setPrototypeOf(Gameboard, GameboardUtils);

var Render = {
  render() {
    var asciiCanavs = document.getElementById('game');
    
    var frame = document.createElement('table');
    frame.innerHTML = '<tbody id="frameBody"></tbody>';
    var frameBody = frame.querySelector('#frameBody');  

    asciiCanavs.innerHTML = '';

    this.board.forEach(function(row, rowIndex) {
      var domRow = document.createElement('tr');
      if (rowIndex < 2) {
        domRow.classList = 'hidden';
      }
      row.forEach(function(column) {
        var square = document.createElement('td');

        if (column != 0) square.classList = column;

        domRow.appendChild(square);
      });
      frameBody.appendChild(domRow);
    }, this);

    asciiCanavs.appendChild(frame);
  }
};
Object.setPrototypeOf(Render, Gameboard);

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
    //var tetrominoes = ['L','L','L','L','L','L','L',];
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
    if (this.spawnDelay == 25) {
      this.spawn();
    }

    this.handleInput();

    if (this.spawnDelay) {
      this.spawnDelay--;
      return;
    }

    if (this.lockDelay) {
      this.lockDelay--;

      if (this.lockDelay == 0) {

        var transformed = this.transform(1, 0, this.blocks);
        if (!this.checkCollision(transformed)) {
          Gameboard.entities.tetromino = null;
          Gameboard.checkClearRows(this.blocks);
          Gameboard.checkGameOver();
        }
      }
      return;
    }

    this.frames++;
    this.advance();
  },
  advance() {
    if (this.frames != 15) return;
    this.frames = 0;

    var transformed = this.transform(1, 0, this.blocks);
    if (this.checkCollision(transformed)) {
      this.moveSelf(transformed);
    } else {
      this.lockDelay = 30;
    }
  },
  spawn() {
    this.blocks.forEach(function(block) {
      Gameboard.board[block.y][block.x] = this.block;
    }, this);

    this.ghostPositions = this.getBottom(1);
    this.ghostPositions.forEach(function(position) {
      Gameboard.board[position.y][position.x] = this.block + ' G';
    }, this);
  },
  transform(moveY, moveX, blocks) {
    var positions = [];

    blocks.forEach(function(block) {
      positions.push({
        y: block.y + moveY,
        x: block.x + moveX
      });
    }, this);

    return positions;
  },
  getBottom(y) {
    var transform = this.transform(y, 0, this.blocks);
    if (this.checkCollision(transform)) {
      return this.getBottom(y + 1);
    } else {
      return this.transform(y - 1, 0, this.blocks);
    }
  },
  handleInput() {
    var input = UserInputs.inputqueue.pop();
 
    if (input == 37) {
      var transformed = this.transform(0, -1, this.blocks);
      if (this.checkCollision(transformed)) {
        this.moveSelf(transformed);
      }
    }

    if (input == 39) {
      var transformed = this.transform(0, 1, this.blocks);
      if (this.checkCollision(transformed)) {
        this.moveSelf(transformed);
      }
    }

    if (input == 49) {
      if (this.lockDelay) {
        this.lockDelay = 1;
      } else {
        this.move
      }
    }

    if (input == 38) {
      if (this.spawnDelay) {
        this.spawnDelay = 0;
      }

      if (this.lockDelay) {
        this.lockDelay = 1;
      } else {
        var blocks = this.getBottom(1);
        this.moveSelf(blocks);
      }
    }

    if (input == 65) {
      this.SRS(1, -1);
    }

    if (input == 68) {
      this.SRS(-1, 1);
    }
  },
  checkCollision(transformed) {
    return transformed.every(function(position) {

      if (position.y == Gameboard.board.length || position.y < 0 || position.x < 0 || position.x == Gameboard.board[0].length) {
        return false;
      }
      
      return this.blocks.some(function(position2) {
        if (Gameboard.board[position.y][position.x] != 0 && Gameboard.board[position.y][position.x].length == 1) {
          return position.y == position2.y && position.x == position2.x;
        } else {
          return true;
        }
      }, this);

    }, this);
  },
  clearSelf() {
    this.blocks.forEach(function(block) {
      Gameboard.board[block.y][block.x] = 0;
    }, this);

    this.ghostPositions.forEach(function(block) {
      Gameboard.board[block.y][block.x] = 0;
    }, this);
  },
  moveSelf(transformed) {
    this.clearSelf();
    this.blocks = transformed;

    this.ghostPositions = this.getBottom(1)
    this.ghostPositions.forEach(function(position) {
      Gameboard.board[position.y][position.x] = this.block + ' G';
    }, this);

    this.blocks.forEach(function(position) {
      Gameboard.board[position.y][position.x] = this.block;
    }, this);
  },
  SRS(directionY, directionX) {
    var rotate = this.rotate(directionY, directionX, this.blocks);
    
    // Adjusts rotate position for I, L, J pieces if they're rotated on the floor
    if (!rotate.every(function(piece) {
      return piece.y < Gameboard.board.length;
    })) {
      rotate = rotate.map(function(piece){
        return {
          y: piece.y - 2,
          x: piece.x
        }
      });
    }

    if (this.checkCollision(rotate)) {
      this.moveSelf(rotate);
      this.position = futurePosition.call(this);
    } else {
      var tests = this.getTests(futurePosition.call(this));

      for (var i=0; i<tests.length; i++) {
        var translated = this.transform(tests[i].y, tests[i].x, rotate);

        if (this.checkCollision(translated)) {
           this.moveSelf(translated);
           this.position = futurePosition.call(this);
           break;
        }
      }
    }

    function futurePosition() {
      var positions = [1, 2, 3, 0, 1, 2, 3];
      var pointer = positions.indexOf(this.position),
          newPointer;

      if (pointer + directionY == 7 || pointer + directionY == -1) {
        newPointer = 3;
      } else {
        newPointer = pointer + directionY;
      }
      return positions[newPointer];
    }
  },
  rotate(directionY, directionX, blocks) {
    var positions = [];
    var pivit = this.pivit();

    blocks.forEach(function(block) {
      var y = block.y,
          x = block.x;

      var vY = y - pivit.y;
      var vX = x - pivit.x;

      // var newY = (0 * vY) + (directionY * vX) + pivit.y;
      // var newX = (directionX * vY) + (0 * vX) + pivit.x;

      var newY = (directionY * vX) + pivit.y;
      var newX = (directionX * vY) + pivit.x;

      positions.push({
        y: newY,
        x: newX
      });
    }, this);

    return positions;
  },
  getTests(futurePosition) {
    switch(this.position) {
      case(0):
        switch(futurePosition) {
          case(1):
            return [{y: 0, x: -1}, {y: 1, x: -1}, {y: -2, x: 0}, {y:-2, x: -1}];
          case(3):
            return [{y: 0, x: 1}, {y: 1, x: 1}, {y: -2, x: 0}, {y:-2, x: 1}]
        }
      break;
      case(1):
        switch(futurePosition) {
          case(0):
            return [{y: 0, x: 1}, {y: -1, x: 1}, {y: 2, x: 0}, {y:2, x: 1}];
          case(2):
            return [{y: 0, x: 1}, {y: -1, x: 1}, {y: 2, x: 0}, {y:2, x: 1}];
        }
      break;
      case(2):
        switch(futurePosition) {
          case(1):
            return [{y: 0, x: -1}, {y: 1, x: -1}, {y: -2, x: 0}, {y:-2, x: -1}];
          case(3):
            return [{y: 0, x: 1}, {y: 1, x: 1}, {y: -2, x: 0}, {y:-2, x: 1}];
        }
      break;
      case(3):
        switch(futurePosition) {
          case(2):
            return [{y: 0, x: -1}, {y: -1, x: -1}, {y: 2, x: 0}, {y:2, x: -1}];
          case(0):
            return [{y: 0, x: -1}, {y: -1, x: -1}, {y: 2, x: 0}, {y:2, x: -1}];
        }
    }
  }
};

var I = {
  block: 'I',
  blocks: [
    {
      y: 2,
      x: 5
    },
    {
      y: 2,
      x: 6
    },
    {
      y: 2,
      x: 7
    },
    {
      y: 2,
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

  },
  getTests(futurePosition) {
    switch(this.position) {
      case(0):
        switch(futurePosition){
          case(1):
            return [{y: 0, x: -2}, {y: 0, x: 1}, {y: -1, x: -2}, {y: 2, x: 1}];
          case(3):
            return  [{y: 0, x: -1}, {y: 0, x: 2}, {y: 2, x: -1}, {y: -1, x: 2}]
        }
      break;
      case(1):
        switch(futurePosition) {
          case(0):
            return [{y: 0, x: 2}, {y: 0, x: -1}, {y: 1, x: 2}, {y: -2, x: -1}];
          case(2):
            return [{y: 0, x: -1}, {y: 0, x: 2}, {y: 2, x: -1}, {y: -1, x: 2}];
        }
      break;
      case(2):
        switch(futurePosition) {
          case(1):
            return [{y: 0, x: 1}, {y: 0, x: -2}, {y: -2, x: 1}, {y: 1, x: -2}];
          case(3):
            return [{y: 0, x: 2}, {y: 0, x: -1}, {y: 1, x: 2}, {y: -2, x: -1}];
        }
      break;
      case(3):
        switch(futurePosition) {
          case(2):
            return [{y: 0, x: -2}, {y: 0, x: 1}, {y: -1, x: -2}, {y: 2, x: 1}];
          case(0):
            return [{y: 0, x: 1}, {y: 0, x: -2}, {y: -2, x: 1}, {y: 1, x: -2}];
        }
    }
  }
};
Object.setPrototypeOf(I, Tetromino);

var J = {
  block: 'J',
  blocks: [
    {
      y: 1,
      x: 5
    },
    {
      y: 2,
      x: 5
    },
    {
      y: 2,
      x: 6,
    },
    {
      y: 2,
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
      y: 1,
      x: 7
    },
    {
      y: 2,
      x: 5
    },
    {
      y: 2,
      x: 6
    },
    {
      y: 2,
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
      y: 1,
      x: 5
    },
    {
      y: 1,
      x: 6
    },
    {
      y: 2,
      x: 5
    },
    {
      y: 2,
      x: 6
    }
  ],
  SRS() {
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
      y: 1,
      x: 6
    },
    {
      y: 1,
      x: 7
    },
    {
      y: 2,
      x: 5
    },
    {
      y: 2,
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
      y: 1,
      x: 6
    },
    {
      y: 2,
      x: 5
    },
    {
      y: 2,
      x: 6
    },
    {
      y: 2,
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
      y: 1,
      x: 5
    },
    {
      y: 1,
      x: 6
    },
    {
      y: 2,
      x: 6
    },
    {
      y: 2,
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
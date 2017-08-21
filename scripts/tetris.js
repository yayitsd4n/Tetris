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
        //properties.blocks.value = I.blocks.slice();
        setBlocks(I);
        this.tetromino = Object.create(I, properties);
        break;
      case 'J':
        setBlocks(J);
        this.tetromino = Object.create(J, properties);
        break;
      // case 'L':
      //   properties.x.value = L.spawnPoints.x;
      //   properties.y.value = L.spawnPoints.y;
      //   properties.entity.value = L.entity.slice();
      //   this.tetromino = Object.create(L, properties);
      //   break;
      // case 'O':
      //   properties.x.value = O.spawnPoints.x;
      //   properties.y.value = O.spawnPoints.y;
      //   properties.entity.value = O.entity.slice();
      //   this.tetromino = Object.create(O, properties);
      //   break;
      // case 'S':
      //   properties.x.value = S.spawnPoints.x;
      //   properties.y.value = S.spawnPoints.y;
      //   properties.entity.value = S.entity.slice();
      //   this.tetromino = Object.create(S, properties);
      //   break;
      // case 'T':
      //   properties.x.value = T.spawnPoints.x;
      //   properties.y.value = T.spawnPoints.y;
      //   properties.entity.value = T.entity.slice();
      //   this.tetromino = Object.create(T, properties);
      //   break;
      // case 'Z':
      //   properties.x.value = Z.spawnPoints.x;
      //   properties.y.value = Z.spawnPoints.y;
      //   properties.entity.value = Z.entity.slice();
      //   this.tetromino = Object.create(Z, properties);
      //   break;
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
    //     this.moveSelf(1, 0);
    //   } else {
    //     console.log('set to destroy');
    //     this.destroy = true;
    //   }
    // }
  },
  spawn(Gameboard) {
    this.blocks.forEach(function(block) {
      Gameboard.board[block.y][block.x] = this.block;
    }, this);
    // this.entity.forEach(function(row, rowIndex) {
    //   row.forEach(function(part, partIndex) {
    //     if (part != 0) {
    //       var y = this.y + rowIndex,
    //           x = this.x + partIndex;
          
    //       Gameboard.board[y][x] = part;
    //     }
    //   }, this);
    // }, this);
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

    if (input == 'ArrowUp') {
      this.rotate();
    }
  },
  checkCollision(transformed) {
    return transformed.every(function(position) {

      if (position.y == Gameboard.board.length) {
        console.log('hit floor');
        return false;
      }
      
      return this.blocks.some(function(position2) {
        console.log(position.y, position.x);
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
    // this.entity.forEach(function(row, rowIndex) {
    //   row.forEach(function(part, partIndex) {
    //     if (part != 0) {
    //       Gameboard.board[rowIndex + this.y][partIndex + this.x] = 0;
    //     }
    //   }, this);
    // }, this);
  },
  moveSelf(transformed) {
    this.clearSelf();
    this.blocks = transformed;

    this.blocks.forEach(function(position) {
      Gameboard.board[position.y][position.x] = this.block;
    }, this);

    console.log('this.blocks', this.blocks);
  },
  rotate() {
    var positions = [];

    this.blocks.forEach(function(block) {
      var y = block.y,
          x = block.x;
      
      console.log(this.pivit());
      console.log(block.y);

      var vY = y - this.pivit().y;
      var vX = x - this.pivit().x;

      var newY = (0 * vY) + (1 * vX) + this.pivit().y;
      var newX = (-1 * vY) + (0 * vX) + this.pivit().x;

      positions.push({
        y: newY,
        x: newX
      });
    }, this);

    console.log(positions);

    // this.entity.forEach(function(row, rowIndex) {
    //   row.forEach(function(cell, cellIndex) {
        
    //     var y = rowIndex + this.y,
    //         x = cellIndex + this.x;

    //     var vY = y - (this.y + this.middle);
    //     var vX = x - (this.x + this.middle);
        
    //     var newY = (0 * vY) + (1 * vX) + (this.y + this.middle);
    //     var newX = (-1 * vY) + (0 * vX) + (this.x + this.middle);

    //     positions.push({
    //         y: newY,
    //         x: newX
    //       });
    //     //newEntity[newY][newX] = cell;
    //   }, this)
    // }, this);

    if (this.checkCollision(positions)) {
      this.moveSelf(positions);
      console.log('move');
    } else {
      console.log('cant move');
    }

    // this.clearSelf();
    // this.entity = newEntity;
    // this.moveSelf(0, 0);
  }
};

var I = {
  block: 'I',
  blocks: [
    {
      y: 4,
      x: 2
    },
    {
      y: 4,
      x: 3
    },
    {
      y: 4,
      x: 4
    },
    {
      y: 4,
      x: 5
    }
  ],
  pivit() {
    var canvas = [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ];
    
    this.blocks.forEach(function() {
      
    }, this);

  },
  kick() {

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
  entity: [
    [0, 0, 'L'],
    ['L', 'L', 'L'],
    [0, 0, 0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  },
  middle: 1
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
  },
  rotate() {
    // Shadow base rotate method
    // O block does not rotate
    return;
  }
};
Object.setPrototypeOf(O, Tetromino);

var S = {
  entity: [
    [0, 'S', 'S'],
    ['S', 'S', 0],
    [0, 0, 0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  },
  middle: 1
};
Object.setPrototypeOf(S, Tetromino);

var T = {
  entity: [
    [0, 'T', 0],
    ['T', 'T', 'T'],
    [0, 0, 0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  },
  middle: 1
};
Object.setPrototypeOf(T, Tetromino);

var Z = {
  entity: [
    ['Z', 'Z', 0],
    [0, 'Z', 'Z'],
    [0, 0, 0]
  ],
  spawnPoints: {
    y: 0,
    x: 5
  },
  middle: 1
};
Object.setPrototypeOf(Z, Tetromino);

Game.init();
//requestAnimationFrame(Game.main.bind(Game));
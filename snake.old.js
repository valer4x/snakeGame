class Board {
    #element;
    #size;
    #cells = [];
  
    constructor(size = 10) {
      this.#size = size;
      this.#element = document.querySelector('.game_board');
      this.#generateGrid();
    }
  
    #generateGrid() {
      this.#element.innerHTML = '';
      this.#element.style.gridTemplateColumns = `repeat(${this.#size}, 1fr)`;
      this.#element.style.gridTemplateRows = `repeat(${this.#size}, 1fr)`;
      this.#cells = [];
  
      for (let y = 0; y < this.#size; y++) {
        for (let x = 0; x < this.#size; x++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.dataset.x = x;
          cell.dataset.y = y;
          this.#element.appendChild(cell);
          this.#cells.push(cell);
        }
      }
    }
  
    getCell(x, y) {
      return this.#cells.find(cell => cell.dataset.x == x && cell.dataset.y == y);
    }
  
    getRandomFreeCell(snakeCoords) {
      const freeCells = this.#cells.filter(cell => {
        return !snakeCoords.some(coord => coord.x == cell.dataset.x && coord.y == cell.dataset.y);
      });
      return freeCells[Math.floor(Math.random() * freeCells.length)];
    }
  
    get size() {
      return this.#size;
    }
  
    get element() {
      return this.#element;
    }
  }
  
  class Apple {
    #board;
    #element = null;
    #x = 0;
    #y = 0;
  
    constructor(board) {
      this.#board = board;
    }
  
    spawn(snakeCoords) {
      if (this.#element) {
        this.#element.classList.remove('apple');
      }
      const cell = this.#board.getRandomFreeCell(snakeCoords);
      if (!cell) return;
      cell.classList.add('apple');
      this.#element = cell;
      this.#x = +cell.dataset.x;
      this.#y = +cell.dataset.y;
    }
  
    get x() {
      return this.#x;
    }
  
    get y() {
      return this.#y;
    }
  
    get position() {
      return { x: this.#x, y: this.#y };
    }
  }
  
  class SnakeGame {
    #board;
    #snake = [];
    #direction = 'right';
    #nextDirection = 'right';
    #interval = null;
    #apple;
    #score = 0;
    #scoreElement;
    #restartButton;
    #bestScoreElement;
  
    constructor() {
      this.#board = new Board();
      this.#apple = new Apple(this.#board);
      this.#setupUI();
      this.#bindEvents();
      this.#drawInitialSnake();
    }
  
    #setupUI() {
      this.#scoreElement = document.querySelector('.current_score_value');
      this.#restartButton = document.querySelector('.restart_button');
      this.#bestScoreElement = document.querySelector('.best_score_value');
  
      const bestScore = localStorage.getItem('snake_best_score');
      if (bestScore !== null) {
        this.#bestScoreElement.textContent = bestScore;
      } else {
        this.#bestScoreElement.textContent = '—';
      }
    }
  
    #bindEvents() {
      this.#board.element.addEventListener('click', () => {
        if (!this.#interval) {
          this.#startGame();
        }
      });
  
      window.addEventListener('keydown', (e) => {
        const dirs = {
          ArrowUp: 'up',
          ArrowDown: 'down',
          ArrowLeft: 'left',
          ArrowRight: 'right',
        };
        const newDir = dirs[e.key];
        if (newDir && this.#canChangeDirection(newDir)) {
          this.#nextDirection = newDir;
        }
      });
  
      this.#restartButton.addEventListener('click', () => {
        location.reload();
      });
    }
  
    #drawInitialSnake() {
      const mid = Math.floor(this.#board.size / 2);
      this.#snake = [
        { x: mid - 1, y: mid },
        { x: mid, y: mid },
      ];
      this.#snake.forEach(segment => {
        this.#board.getCell(segment.x, segment.y).classList.add('snake');
      });
    }
  
    #startGame() {
      this.#apple.spawn(this.#snake);
      this.#interval = setInterval(() => this.#move(), 500);
    }
  
    #move() {
      this.#direction = this.#nextDirection;
      const head = this.#snake[this.#snake.length - 1];
      let newHead = { x: head.x, y: head.y };
  
      switch (this.#direction) {
        case 'up': newHead.y--; break;
        case 'down': newHead.y++; break;
        case 'left': newHead.x--; break;
        case 'right': newHead.x++; break;
      }
  
      // телепорт при выходе за границы
      newHead.x = (newHead.x + this.#board.size) % this.#board.size;
      newHead.y = (newHead.y + this.#board.size) % this.#board.size;
  
      // проверка на столкновение с собой
      if (this.#snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        this.#endGame();
        return;
      }
  
      this.#snake.push(newHead);
      const newHeadCell = this.#board.getCell(newHead.x, newHead.y);
      newHeadCell.classList.add('snake');
  
      // если съели яблоко
      if (newHead.x === this.#apple.x && newHead.y === this.#apple.y) {
        this.#score++;
        this.#scoreElement.textContent = this.#score;
        this.#apple.spawn(this.#snake);
      } else {
        const tail = this.#snake.shift();
        const tailCell = this.#board.getCell(tail.x, tail.y);
        tailCell.classList.remove('snake');
      }
    }
  
    #canChangeDirection(newDir) {
      const opposites = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left',
      };
      return opposites[this.#direction] !== newDir;
    }
  
    #endGame() {
      clearInterval(this.#interval);
      this.#interval = null;
      this.#restartButton.classList.remove('hidden');
  
      const best = localStorage.getItem('snake_best_score');
      if (!best || this.#score > +best) {
        localStorage.setItem('snake_best_score', this.#score);
        this.#bestScoreElement.textContent = this.#score;
      }
    }
  }
  
  // запускаем игру
  new SnakeGame();
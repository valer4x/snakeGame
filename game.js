import Board from './board.js';
import Apple from './apple.js';
import Snake from './snake.js';

class SnakeGame {
  #board;
  #apple;
  #snake;
  #score = 0;
  #interval = null;
  #scoreElement;
  #bestScoreElement;
  #restartButton;

  constructor() {
    this.#board = new Board();
    this.#apple = new Apple(this.#board);
    this.#snake = new Snake(this.#board);

    this.#setupUI();
    this.#bindEvents();
  }

  #setupUI() {
    this.#scoreElement = document.querySelector('.current_score_value');
    this.#bestScoreElement = document.querySelector('.best_score_value');
    this.#restartButton = document.querySelector('.restart_button');

    const best = localStorage.getItem('snake_best_score');
    this.#bestScoreElement.textContent = best ? best : '—';
  }

  #bindEvents() {
    this.#board.element.addEventListener('click', () => {
      if (!this.#interval) this.#startGame();
    });

    window.addEventListener('keydown', (e) => {
      const directions = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };
      const dir = directions[e.key];
      if (dir) this.#snake.setDirection(dir);
    });

    this.#restartButton.addEventListener('click', () => location.reload());
  }

  #startGame() {
    this.#apple.spawn(this.#snake.body);
    this.#interval = setInterval(() => this.#gameLoop(), 500);
  }

  #gameLoop() {
    const result = this.#snake.move(this.#apple.position);

    if (result === null) {
      this.#endGame();
      return;
    }

    if (result === true) {
      this.#score++;
      this.#scoreElement.textContent = this.#score;
      this.#apple.spawn(this.#snake.body);
    }
    // result === false — просто движение
  }

  #endGame() {
    clearInterval(this.#interval);
    this.#interval = null;
    this.#restartButton.classList.remove('hidden');

    const best = +localStorage.getItem('snake_best_score') || 0;
    if (this.#score > best) {
      localStorage.setItem('snake_best_score', this.#score);
      this.#bestScoreElement.textContent = this.#score;
    }
  }
}

new SnakeGame();
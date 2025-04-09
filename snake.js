export default class Snake {
    #board;
    #body = [];
    #direction = 'right';
    #nextDirection = 'right';
  
    constructor(board) {
      this.#board = board;
      this.#initSnake();
    }
  
    #initSnake() {
      const mid = Math.floor(this.#board.size / 2);
      this.#body = [
        { x: mid - 1, y: mid },
        { x: mid, y: mid },
      ];
      this.#body.forEach(segment => {
        this.#board.getCell(segment.x, segment.y).classList.add('snake');
      });
    }
  
    get body() {
      return this.#body;
    }
  
    setDirection(newDirection) {
      const opposites = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left',
      };
  
      if (opposites[this.#direction] !== newDirection) {
        this.#nextDirection = newDirection;
      }
    }
  
    move(applePosition) {
      this.#direction = this.#nextDirection;
  
      const head = this.#body[this.#body.length - 1];
      let newHead = { x: head.x, y: head.y };
  
      switch (this.#direction) {
        case 'up': newHead.y--; break;
        case 'down': newHead.y++; break;
        case 'left': newHead.x--; break;
        case 'right': newHead.x++; break;
      }
  
      newHead.x = (newHead.x + this.#board.size) % this.#board.size;
      newHead.y = (newHead.y + this.#board.size) % this.#board.size;
  
      if (this.#body.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return null; // змейка столкнулась с собой
      }
  
      this.#body.push(newHead);
      this.#board.getCell(newHead.x, newHead.y).classList.add('snake');
  
      const ateApple = newHead.x === applePosition.x && newHead.y === applePosition.y;
  
      if (!ateApple) {
        const tail = this.#body.shift();
        this.#board.getCell(tail.x, tail.y).classList.remove('snake');
      }
  
      return ateApple; // true — съела яблоко, false — не съела, null — смерть
    }
  }
  
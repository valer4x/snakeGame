export default class Apple {
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
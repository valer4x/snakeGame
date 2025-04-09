export default class Board {
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
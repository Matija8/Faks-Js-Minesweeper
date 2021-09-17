'use strict';

class Cell {
  constructor(row, col, item, game) {
    this.row = row;
    this.col = col;
    this.item = item; // DOM object reference.
    this.game = game;
    this.style = game.style;
    this.hasMine = false;
    this.clickStates = Object.freeze([
      'not-clicked',
      'left-clicked',
      'right-clicked',
    ]);
    this._clickState = 'not-clicked';
    this.adjacent = [];
    this.setListeners();

    this.css = this.item.style;
    this.setCssProperties();
  }

  setCssProperties() {
    this.css.width = this.css.minWidth = this.css.height = this.css.minHeight = this.style.cellSize;
    this.css.fontSize = this.style.fontSize;
    this.css.backgroundImage = this.style.image_NotClicked;
    this.css.backgroundSize = 'contain';
  }

  set clickState(newState) {
    if (!this.clickStates.includes(newState)) {
      throw Error('Cell set clickState error: Not a valid state: ' + newState);
    }
    this._clickState = newState;
  }

  get clickState() {
    return this._clickState;
  }

  setListeners() {
    this.listenerFunctions = [
      ['mousedown', this.mouseDown],
      ['mouseup', this.mouseUp],
      ['mouseenter', this.mouseIn],
      ['mouseout', this.mouseOut],
    ].map(([event, func]) => [event, func.bind(this)]);

    this.listenerFunctions.forEach((pair) => {
      this.item.addEventListener(...pair);
    });

    // TODO
    this.item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }

  removeListeners() {
    this.listenerFunctions.forEach((pair) => {
      this.item.removeEventListener(...pair);
    });
  }

  mouseDown(event) {
    switch (event.button) {
      case 0:
        if (!this.game.midDownFlag) this.leftDown();
        break;
      case 1:
        if (!this.game.leftDownFlag) this.midDown();
        break;
      case 2:
        this.rightDown();
        break;
    }
  }

  mouseUp(event) {
    switch (event.button) {
      case 0:
        if (this.game.leftDownFlag) this.leftUp();
        break;
      case 1:
        if (this.game.midDownFlag) this.midUp();
        break;
    }
  }

  mouseIn() {
    if (this.game.midDownFlag) {
      this.highlight();
    }
    if (this.game.leftDownFlag) {
      this.leftDown();
    }
  }

  mouseOut() {
    if (this.game.midDownFlag) {
      this.unHighlight();
    }
    if (this.game.leftDownFlag) {
      if (this.clickState === 'not-clicked') {
        this.css.backgroundImage = this.style.image_NotClicked;
      }
    }
  }

  leftDown() {
    this.game.leftDownFlag = true;
    if (this.clickState === 'not-clicked') {
      this.css.backgroundImage = this.style.image_LeftClick;
    }
  }

  leftUp() {
    if (this.clickState !== 'not-clicked') {
      return;
    }
    if (this.hasMine) {
      this.game.gameLoss(this);
      return;
    }
    this.game.cellClick(this); // TODO: Don't hold ref to game.

    this.clickState = 'left-clicked'; // Register the left-click.
    this.game.numOfLeftClicked++;
    this.css.backgroundImage = this.style.image_LeftClick;
    let mineCount = this.countMines();
    if (mineCount === 0) {
      this.adjacent.forEach((cell) => cell.leftUp()); // Recursive left-click on a 'free' cell.
    } else {
      this.item.innerHTML = mineCount;
    }
    if (this.game.winCondition()) {
      this.game.gameWin();
    }
  }

  countMines() {
    let count = 0;
    this.adjacent.forEach(function (cell) {
      if (cell.hasMine) count++;
    });
    return count;
  }

  rightDown() {
    if (this.game.midDownFlag || this.game.leftDownFlag) {
      return;
    }
    if (this.clickState === 'not-clicked') {
      this.clickState = 'right-clicked';
      this.css.backgroundImage = this.style.image_Flag;
      this.game.numOfRightClicked++;
      this.game.refreshFlagNumberDisplay();
    } else if (this.clickState === 'right-clicked') {
      this.clickState = 'not-clicked';
      this.css.backgroundImage = this.style.image_NotClicked;
      this.game.numOfRightClicked--;
      this.game.refreshFlagNumberDisplay();
    }
  }

  midDown() {
    this.game.midDownFlag = true;
    this.highlight();
  }

  midUp() {
    this.unHighlight();
    this.game.midDownFlag = false;
    if (this.clickState === 'left-clicked') {
      let mineCount = this.countMines();
      this.adjacent.forEach((adj) => {
        if (adj.clickState === 'right-clicked') {
          mineCount--;
        }
      });
      if (mineCount === 0) {
        this.adjacent.forEach((cell) => cell.leftUp());
      }
    }
  }

  highlight() {
    if (this.clickState === 'not-clicked') {
      this.css.backgroundImage = this.style.image_Highlight;
    }
    this.adjacent.forEach((adj) => {
      if (adj.clickState === 'not-clicked') {
        adj.css.backgroundImage = this.style.image_Highlight;
      }
    });
  }

  unHighlight() {
    if (this.clickState === 'not-clicked') {
      this.css.backgroundImage = this.style.image_NotClicked;
    }
    this.adjacent.forEach((adj) => {
      if (adj.clickState === 'not-clicked') {
        adj.css.backgroundImage = this.style.image_NotClicked;
      }
    });
  }
}

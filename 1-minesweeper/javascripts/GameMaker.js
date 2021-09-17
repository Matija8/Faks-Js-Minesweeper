'use strict';

class GameMaker {
  constructor(newGameButton, gameParentNode) {
    this._gameParentNode = gameParentNode;
    this._game = null;
    // this._testing = true;
    this._checkedRadio = this.getDefaultRadioBtnValue();
    this._prevCheckedRadio = this._checkedRadio;

    this.addEventListeners(newGameButton);

    this.makeGame();
  }

  getDefaultRadioBtnValue() {
    const defaultRadioBtn = this.tryGetDefaultRadioBtn();
    if (!defaultRadioBtn || defaultRadioBtn.type !== 'radio') {
      throw Error(`Can't get default radio button!?`);
    }
    defaultRadioBtn.checked = true;
    return this._testing ? 'test' : defaultRadioBtn.value;
  }

  tryGetDefaultRadioBtn() {
    return document.getElementById('default-radio');
  }

  addEventListeners(newGameButton) {
    newGameButton.addEventListener('click', () => {
      this.newGame();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'r') this.newGame();
    });

    this.addDifficultyChangeClickListeners();
  }

  addDifficultyChangeClickListeners() {
    const radioBtns = document.querySelectorAll('.drop-radio');

    radioBtns.forEach((radioBtn) => {
      radioBtn.addEventListener('click', () => {
        this._checkedRadio = radioBtn.value;
      });
    });
  }

  newGame() {
    const dimensionsHaveChanged = this._checkedRadio !== this._prevCheckedRadio;
    if (dimensionsHaveChanged) {
      this._prevCheckedRadio = this._checkedRadio;
      this.makeGame();
    } else {
      this._game.reInit();
    }
  }

  makeGame() {
    if (this._game) {
      this._game.destroySelf();
    }
    this._game = new Game(
      this.getDimensions(this._checkedRadio),
      this._gameParentNode,
      new Style('45px', '22px')
    );
  }

  getDimensions(mode) {
    const presets = Object.freeze({
      test: {
        numOfRows: 5,
        numOfCols: 5,
        numOfMines: 1,
        gameType: 'Test',
      },
      beginner: {
        numOfRows: 8,
        numOfCols: 8,
        numOfMines: 10,
        gameType: 'Beginner',
      },
      intermediate: {
        numOfRows: 16,
        numOfCols: 16,
        numOfMines: 40,
        gameType: 'Intermediate',
      },
      expert: {
        numOfRows: 16,
        numOfCols: 30,
        numOfMines: 99,
        gameType: 'Expert',
      },
    });
    const selected = presets[mode];
    if (!this.dimensionsAreValid(selected)) {
      throw Error('Bad mode!');
    }
    return selected;
  }

  dimensionsAreValid(dimensions) {
    return typeof dimensions === 'object' && dimensions !== null;
  }
}

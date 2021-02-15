'use strict';

class GameMaker {
  constructor(newGameButton, gameParentNode) {
    this.gameSettings = {
      numOfRows: undefined,
      numOfCols: undefined,
      numOfMines: undefined,
      gameType: undefined,
    };
    this.CellSize = '45px';
    this.FontSize = '22px';
    this.game = null;
    this.gameParentNode = gameParentNode;
    this.radios = document.querySelectorAll('.drop-radio');

    const defaultRadioBtn = this.tryGetDefaultRadioBtn();
    if (!defaultRadioBtn) {
      throw `Can't get default radio button!?`;
    }
    defaultRadioBtn.checked = true;
    this.checkedRadio = this.prevCheckedRadio = defaultRadioBtn.value;

    this.newGameButton = newGameButton;
    this.newGameButton.addEventListener('click', () => {
      this.newGame();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'r') this.newGame();
    });

    this.addDifficultyChangeClickListeners();
    this.gameMake(); // Make a game with default(Intermediate) settings.
  }

  tryGetDefaultRadioBtn() {
    return document.getElementById('default');
  }

  addDifficultyChangeClickListeners() {
    this.radios.forEach((radio) => {
      radio.addEventListener('click', () => (this.checkedRadio = radio.value));
    });
  }

  newGame() {
    const dimensionsHaveChanged = this.checkedRadio !== this.prevCheckedRadio;
    if (dimensionsHaveChanged) {
      this.prevCheckedRadio = this.checkedRadio;
      this.game.removePlayArea(); // Remove old game DOM elements.
      this.game.stopTimer(); // Stop the timer.
      this.gameMake();
    } else {
      this.game.reInit();
    }
  }

  gameMake() {
    this.setDimensions(this.checkedRadio);
    this.game = new Game(
      this.gameSettings,
      this.gameParentNode,
      new Style(this.CellSize, this.FontSize)
    );
  }

  setDimensions(mode) {
    switch (mode) {
      case 'test':
        this.gameSettings = {
          numOfRows: 5,
          numOfCols: 5,
          numOfMines: 1,
          gameType: 'Test',
        };
        return;
      case 'beginner':
        this.gameSettings = {
          numOfRows: 8,
          numOfCols: 8,
          numOfMines: 10,
          gameType: 'Beginner',
        };
        return;
      case 'intermediate':
        this.gameSettings = {
          numOfRows: 16,
          numOfCols: 16,
          numOfMines: 40,
          gameType: 'Intermediate',
        };
        return;
      case 'expert':
        this.gameSettings = {
          numOfRows: 16,
          numOfCols: 30,
          numOfMines: 99,
          gameType: 'Expert',
        };
        return;
    }
  }
}

'use strict';
/* jshint browser: true */
/*jshint esversion: 6 */


class GameMaker {
    constructor(newGameButton, gameParentNode){
        this.NumOfRows  = undefined;
        this.NumOfCols  = undefined;
        this.NumOfMines = undefined;
        this.gameType   = undefined;
        this.CellSize   = '45px';
        this.FontSize   = '22px';
        this.game       = null;
        this.gameParentNode = gameParentNode;
        this.radios = document.querySelectorAll('.drop-radio');
        const defaultRadio = document.getElementById('default');        // Check off the default radio button.
            defaultRadio.checked = true;
        this.checkedRadio = this.prevCheckedRadio = 'test';           // Uncomment this for testing only.
        //this.checkedRadio = this.prevCheckedRadio = defaultRadio.value; // Comment out this line if testing.
        this.newGameButton = newGameButton;
        this.newGameButton.addEventListener('click', () => { this.newGame(); });             // New game button.
        document.addEventListener('keydown', e => { if (e.which == 113) this.newGame(); } ); // F2 starts a new game.
        this.radios.forEach(radio => {
            radio.addEventListener('click', () => { this.checkedRadio = radio.value; }); });
        this.gameMake(); // Make a game with default(Intermediate) settings.
    }

    newGame(){
        // Make a new game if the dimensions have changed.
        if(this.checkedRadio !== this.prevCheckedRadio){
            this.prevCheckedRadio = this.checkedRadio;
            this.game.playArea.remove(); // Remove old game DOM elements.
            this.game.stopTimer();       // Stop the timer.
            this.gameMake();
        }
        // Otherwise just reload the game.
        else{
            this.game.reInit();
        }
    }

    gameMake(){
        this.setDimensions(this.checkedRadio);
        this.game = new Game(this.NumOfRows, this.NumOfCols, this.NumOfMines, this.gameParentNode, this.gameType,
            new Style(this.CellSize, this.FontSize));
    }

    setDimensions(mode){
        switch(mode){
            case 'test':
                this.NumOfRows  = 5;
                this.NumOfCols  = 5;
                this.NumOfMines = 1;
                this.gameType   = 'Test';
                break;
            case 'begginer':
                this.NumOfRows  = 8;
                this.NumOfCols  = 8;
                this.NumOfMines = 10;
                this.gameType   = 'Beginner';
                break;
            case 'intermediate':
                this.NumOfRows  = 16;
                this.NumOfCols  = 16;
                this.NumOfMines = 40;
                this.gameType   = 'Intermediate';
                break;
            case 'expert':
                this.NumOfRows  = 16;
                this.NumOfCols  = 30;
                this.NumOfMines = 99;
                this.gameType   = 'Expert';
                break;
        }
    }
}

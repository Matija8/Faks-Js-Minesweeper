'use strict';
/* jshint browser: true */
/* jshint node: true */
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
        const defaultRadio = document.getElementById('default'); // Check off the default radio button.
            defaultRadio.checked = true;
        this.checkedRadio = this.prevCheckedRadio = '0'; // Use this value for testing only.
        //this.checkedRadio = this.prevCheckedRadio = defaultRadio.value;
        this.newGameButton = newGameButton;
        this.newGameButton.addEventListener('click', () => { this.newGame(); });             // New game button.
        document.addEventListener('keydown', e => { if (e.which == 113) this.newGame(); } ); // F2 starts new game.
        // TODO: better solution for finding the checked radio button:
        this.radios.forEach(radio => {
            radio.addEventListener('click', () => {
                this.checkedRadio = document.querySelector('.drop-radio:checked').value;
            });
        });
        this.gameMake(); // Make a game with default(Intermediate) settings.
    }

    newGame(){
        if(this.checkedRadio !== this.prevCheckedRadio){ // Make a new game if the dimensions have changed.
            this.prevCheckedRadio = this.checkedRadio;
            this.game.playArea.remove(); // Remove old game DOM elements.
            this.game.stopTimer();       // Stop the timer.
            this.gameMake();
        }
        else{                                            // Otherwise just reload the game.
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
            case '0':
                this.NumOfRows  = 3;
                this.NumOfCols  = 3;
                this.NumOfMines = 1;
                this.gameType   = 'Test';
                break;
            case '1':
                this.NumOfRows  = 8;
                this.NumOfCols  = 8;
                this.NumOfMines = 10;
                this.gameType   = 'Beginner';
                break;
            case '2':
                this.NumOfRows  = 16;
                this.NumOfCols  = 16;
                this.NumOfMines = 40;
                this.gameType   = 'Intermediate';
                break;
            case '3':
                this.NumOfRows  = 16;
                this.NumOfCols  = 30;
                this.NumOfMines = 99;
                this.gameType   = 'Expert';
                break;
        }
    }
}
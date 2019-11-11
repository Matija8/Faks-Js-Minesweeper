'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */

/*TODO The three official board sizes are: 
    Beginner (8x8 with 10 mines), 
    Intermediate (16x16 with 40 mines), and
    Expert (16x30 with 99 mines).
*/

class GameMaker {
    constructor(newGameButton, gameParentNode){
        //Defaults:
        this.NumOfRows  = 16;
        this.NumOfCols  = 16;
        this.NumOfMines = 40;
        this.CellSize   = '45px';
        this.FontSize   = '22px';
        this.game       = null;
        this.radios = document.querySelectorAll('.drop-radio');
        const   defaultRadio = document.getElementById('default');
                this.checked = defaultRadio.value;
                this.prevChecked = this.checked;
                defaultRadio.checked = true;

        this.newGameButton = newGameButton;
        this.newGameButton.addEventListener('click', () => { this.newGame(); });
        document.addEventListener('keydown', e => { if (e.which == 113) this.newGame(); } );
        this.radios.forEach(radio => {
            radio.addEventListener('click', () => {this.checked = document.querySelector('.drop-radio:checked').value; //TODO: better solution.
                console.log(this.checked);
            });
        });
        this.gameMake();
    }

    newGame(){
        if(this.checked !== this.prevChecked){
            this.prevChecked = this.checked;
            this.game.playArea.remove();
            this.gameMake(); //make a new game if the dimensions have changed.
        }
        else{
            this.game.reInit();
        }
    }

    gameMake(){
        this.setDimensions(this.checked);
        this.game = new Game(this.NumOfRows, this.NumOfCols, this.NumOfMines, new Style(this.CellSize, this.FontSize), gameParentNode); //TODO: delete the game?
    }

    setDimensions(mode){
        switch(mode){
            case 1:
                this.NumOfRows  = 8;
                this.NumOfCols  = 8;
                this.NumOfMines = 10;
                break;
            case 2:
                this.NumOfRows  = 16;
                this.NumOfCols  = 16;
                this.NumOfMines = 40;
                break;
            case 3:
                this.NumOfRows  = 30;
                this.NumOfCols  = 16;
                this.NumOfMines = 99;
                break;
        }
    }
}
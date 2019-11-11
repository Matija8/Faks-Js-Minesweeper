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
        this.NumOfRows  = 8;
        this.NumOfCols  = 8;
        this.NumOfMines = 10;
        this.CellSize   = '45px';
        this.FontSize   = '22px';
        //TODO get setup from radio buttons.
        document.getElementById('default').checked = true;
        //this.checked = document.querySelector('input[name="mode"]:checked').value;

        this.game = new Game(this.NumOfRows, this.NumOfCols, this.NumOfMines, new Style(this.CellSize, this.FontSize), gameParentNode);
        this.newGameButton = newGameButton;

        this.newGameButton.addEventListener('click', () => { this.newGame(); });
        document.addEventListener('keydown', e => { if (e.which == 113) this.newGame(); } );
    }

    newGame(){
        this.game.reInit();
    }
}
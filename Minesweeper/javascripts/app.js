'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */

const gNumOfRows = 2,
    gNumOfCols  = 2,
    gNumOfMines = 1,
    gCellSize = '35px',
    gFontSize = '22px';


var game = null;
document.getElementById('new-game').addEventListener('click', () => { newGame([game]); });

function newGame (gameWrapper) {
    game = gameWrapper[0];//TODO: implement better design pattern.
    if(!game){
        game = new Game(gNumOfRows, gNumOfCols, gNumOfMines, new Style());
    }

    //TODO newGame for non-first iteration
    
    /*
    game.firstClick = false;
    this.numOfLeftClicked   = 0;
    this.numOfRightClicked  = 0;
    this.startTime          = null;*/
}

function refreshTimerWrapper(game) { game.refreshTimer(); }
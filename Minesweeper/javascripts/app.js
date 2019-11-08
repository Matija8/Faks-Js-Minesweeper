'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */

//TODO timer;

const gNumOfRows = 7,
    gNumOfCols  = 7,
    gNumOfMines = 12,
    gCellSize = '45px',
    gFontSize = '22px';


var game = {notInstantiated : true};
document.getElementById('new-game').addEventListener('click', () => { newGame(game); });

function newGame (game) {
    if(game.notInstantiated){   //TODO BUG!!!
        game = new Game(gNumOfRows, gNumOfCols, gNumOfMines, new Style(gCellSize, gFontSize));
    }
}
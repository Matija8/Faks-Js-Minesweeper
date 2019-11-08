'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */

/*TODO The three official board sizes are: 
    Beginner (8x8 with 10 mines), 
    Intermediate (16x16 with 40 mines), and
    Expert (16x30 with 99 mines).
*/

const gNumOfRows = 8,
    gNumOfCols  = 8,
    gNumOfMines = 10,
    gCellSize = '45px',
    gFontSize = '22px';

var game = null,
    notInstantiated = true;

document.getElementById('new-game').addEventListener('click', () => { newGame(game); });

function newGame () {
    if(notInstantiated){
        notInstantiated = false;
        game = new Game(gNumOfRows, gNumOfCols, gNumOfMines, new Style(gCellSize, gFontSize)); //TODO: import Game & Style? (jshint warning)
    }
    else {
        game.reInit();
    }
}
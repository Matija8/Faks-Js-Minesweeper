'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */

//TODO timer;

const gNumOfRows = 7,
    gNumOfCols  = 7,
    gNumOfMines = 11,
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
        //TODO
        /* 1) hide the game area
           2) reset cell, timer, flag, semaphore states
           3) show the game area
        */
    }
}
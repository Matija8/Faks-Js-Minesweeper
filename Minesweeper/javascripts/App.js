'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


const   gameMode = document.getElementById('mode'),
        modeRadio = document.querySelectorAll('input');

        //TODO...


const   newGameButton = document.getElementById('new-game'),
        gameParentNode = document.getElementById('play-area-container'),
        gameController = new GameMaker(newGameButton, gameParentNode);
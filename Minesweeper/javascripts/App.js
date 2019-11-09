'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


const   button = document.getElementById('new-game'),
        gameParentNode = document.getElementById('play-area-container'),
        gameController = new GameMaker(button, gameParentNode);
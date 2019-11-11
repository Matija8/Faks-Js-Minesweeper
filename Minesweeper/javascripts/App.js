'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


const   dropdownButton = document.getElementById('mode'),
        dropdown = document.getElementById('dropdown');
        //modeRadio = document.querySelectorAll('input');

        dropdownButton.addEventListener('mouseenter', () => showMenu(true));
        dropdownButton.addEventListener('mouseleave', () => showMenu(false));


const   newGameButton = document.getElementById('new-game'),
        gameParentNode = document.getElementById('play-area-container'),
        gameController = new GameMaker(newGameButton, gameParentNode);


function showMenu(show) {
    if(show){
        dropdown.style.display = 'block';
    }
    else {
        dropdown.style.display = 'none';
    }
}
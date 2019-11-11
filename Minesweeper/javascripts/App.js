'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


const   dropdownButton = document.getElementById('showDropdown'),
        dropdown = document.getElementById('dropdown');
        //modeRadio = document.querySelectorAll('input');

        dropdownButton.addEventListener('mouseenter', () => showMenu(dropdown, true));
        dropdownButton.addEventListener('mouseleave', () => showMenu(dropdown, false));


const   newGameButton = document.getElementById('new-game'),
        gameParentNode = document.getElementById('play-area-container'),
        gameController = new GameMaker(newGameButton, gameParentNode);


function showMenu(dropdown, show) {
    if(show){
        dropdown.style.display = 'block';
    }
    else {
        dropdown.style.display = 'none';
    }
}
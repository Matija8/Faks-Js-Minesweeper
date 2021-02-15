'use strict';

const dropdownButton = document.getElementById('showDropdown'),
  dropdown = document.getElementById('dropdown'),
  newGameButton = document.getElementById('new-game'),
  gameParentNode = document.getElementById('play-area-container'),
  gameController = new GameMaker(newGameButton, gameParentNode);
dropdownButton.addEventListener('mouseenter', () => showMenu(dropdown, true));
dropdownButton.addEventListener('mouseleave', () => showMenu(dropdown, false));

function showMenu(dropdown, show) {
  if (show) {
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
}

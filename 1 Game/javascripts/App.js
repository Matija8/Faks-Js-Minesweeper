'use strict';

const dropdownButton = document.getElementById('showDropdown'),
  dropdownMenu = document.getElementById('dropdown'),
  newGameButton = document.getElementById('new-game'),
  gameParentNode = document.getElementById('play-area-container'),
  gameController = new GameMaker(newGameButton, gameParentNode);

const setMenuVisible = function showOrHideDropdownMenu(dropdown, show) {
  dropdown.style.display = show ? 'block' : 'none';
};

dropdownButton.addEventListener('mouseenter', () =>
  setMenuVisible(dropdownMenu, true)
);

dropdownButton.addEventListener('mouseleave', () =>
  setMenuVisible(dropdownMenu, false)
);

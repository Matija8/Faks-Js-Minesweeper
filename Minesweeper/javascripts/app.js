'use strict';
/* jshint browser: true */

//Initial play area dimensions. Set as desired.
var numOfRows = 7,
    numOfCols = 9,
    numOfMines = 5,
    //clickSound = new Audio('../audio/click.mp3'), //feature creep?

//Global variables. Don't change.
    numOfLeftClicked = 0,
    numOfRightClicked = 0,
    seconds = 0,
    firstClick = true,
    flagSymbol = '🚩',
    mineSymbol = '☢',
    cellMatrix = initializePlayArea(numOfCols, numOfRows);

/*
cellMatrix is a matrix of pairs (mine_state, click_state),
    where mine_state can be one of 2 states: {'no-mine', 'MINE!'},
    and click_state can be one of 3 states: {'not-clicked', 'left-clicked', 'right-clicked'}.

seconds is the time past from the start of the game in seconds.

firstClick is used so that the first click can't be on a mine.
*/

    
//Adding event listeners.
document.querySelectorAll('.table-cell').forEach(function(item){
    item.addEventListener('click', function(event){ leftClickCell(item, event); });
    item.addEventListener('contextmenu', function(event){ rightClickCell(item, event); });
    item.addEventListener('mousedown', function(event){ middleClickWrapper(item, event, true); });
    item.addEventListener('mouseup', function(event){ middleClickWrapper(item, event, false); });
});
document.getElementById('new-game').addEventListener('click', function(event){ newGame(); });

//Display number of mines checked off.
refreshFlagNumberDisplay();
//Timer.
refreshTimer();
//window.alert('Game started.');
//setInterval(refreshTimer, 1000);


//----------------------------------------------------------------------------------
//Function definitions:


//Generate table cells for playing. Returns a matrix of cells.
function initializePlayArea(numOfCols, numOfRows){
    var table = document.getElementById('play-area'),
        rows = [];
    for(var i = 0; i<numOfRows; i++){
        var tableRow = document.createElement('tr'),
        cells = [];
        for(var j = 0; j<numOfCols; j++){
            var tableCell = document.createElement('td');
            tableCell.classList.add('table-cell', 'noselect');
            tableCell.setAttribute('id' , i + ',' + j);
            tableRow.appendChild(tableCell);
            cells.push(['no-mine', 'not-clicked']); // cell = [mine state, click state]
        }
        table.appendChild(tableRow);
        rows.push(cells);
    }
    return rows;
}


//Left click function. Lose if mine is clicked. Counts mines in adjacent cells otherwise.
function leftClickCell(item, e){
    var cell = getCellByItem(item);
    if(cell[1] === 'not-clicked'){
        cell[1] = 'left-clicked';

        if(firstClick){
            firstLeftClick(item);
        }
        if(cell[0] === 'MINE!'){
            gameLoss();
        }
        else {
            numOfLeftClicked++;
            item.style.backgroundColor = 'grey';
            var mineCount = countMines(item);
            if(mineCount === 0){
                zeroCellLeftClick(item); //autoclick adjacent mines.
            }
            else {
                item.innerHTML = mineCount;
            }
            if(winCondition()){
                gameWin();
            }
        }
    }
    else return; //leftClicked on alredy clicked cell.
}



//Place or remove a flag from a cell;
function rightClickCell(item, event){
    event.preventDefault();
    var cell = getCellByItem(item);
    if(cell[1] === 'not-clicked'){
        cell[1] = 'right-clicked';
        placeFlag(item);
    }
    else if (cell[1] === 'right-clicked'){
        cell[1] = 'not-clicked';
        removeFlag(item);
    }
    else {
        return;
    }
}


function middleClickWrapper(item, event, down){
    //middleClick() wrapper for multi browser support.

    if (event.which) { // if event.which, use 2 for middle button
        if (event.which === 2) {
            middleClick(item, down);
        }
    } else if (event.button) { // and if event.button, use 4
        if (event.button === 4) {
            middleClick(item, down);
        }
    }
}


function middleClick(item, down){
    //down is a bool value,
    //down == true => mousedown
    //down == false => mouseup
    var cell = getCellByItem(item);
    if (cell[1] == 'left-clicked'){
        var localCells = getAdjacentCells(item),
            clearLocalCells = [],
            numOfMines = countMines(item);
        localCells.forEach(function(itm){
            var currentCell = getCellByItem(itm);
            if(currentCell[1] === 'right-clicked'){
                numOfMines--;
            }
            else if(currentCell[1] === 'not-clicked'){
                clearLocalCells.push(itm);
            }
        });
        clearLocalCells.forEach(function(itm){
            if(numOfMines === 0){
                leftClickCell(itm);
            }
            else {
                highlightCell(itm, down);
            }
        });
    }    
}


//On middle-click highlight non-open cells.
function highlightCell(item, on){
    if(on){
        item.style.boxShadow = '10px 10px #888888';
    }
    else {
        item.style.boxShadow = '';
    }
}


//Helper function used for: middleClick(), zeroCellLeftClick() & countMines()
function getAdjacentCells(item){
    var row = getRowById(item.id),
        col = getColById(item.id),
        list = [];
    var leftCheck = (col == 0) ? col : col-1,
        rightCheck = (col == numOfCols-1) ? col : col+1,
        topCheck = (row == 0) ? row : row-1,
        bottomCheck = (row == numOfRows-1) ? row : row+1;
        
    for(var i = topCheck; i<=bottomCheck; i++){
        for(var j = leftCheck; j<=rightCheck; j++){
            if(i === row && j === col){
                continue;
            }
            list.push(getElementByRowCol(i, j));
        }
    }
    return list;
}


function firstLeftClick(item){
    firstClick = false;
    document.getElementById('start-prompt').innerHTML = '';
    setRandomMines(numOfMines, item);
    setInterval(refreshTimer, 1000);
}


function zeroCellLeftClick(item){
    getAdjacentCells(item).forEach(function(itm){
        leftClickCell(itm);
    });
}


function winCondition(){
    var numOfLeftClickable = numOfCols * numOfRows - numOfMines;
    return numOfLeftClicked == numOfLeftClickable;
}


function gameWin(){
    window.alert('YOU WON! Congrats :D\nYour time is: ' + secondsToString(seconds-1));
    newGame();
}


function gameLoss(){
    for(var i = 0; i<numOfRows; i++){
        for(var j = 0; j<numOfCols; j++){
            if(cellMatrix[i][j][0] === 'MINE!'){
                var cell = getElementByRowCol(i, j);
                cell.style.backgroundColor = 'red';
                cell.innerHTML = mineSymbol;
            }
        }
    }
    window.alert('Sorry, you just lost :(');
    newGame();
}


//Count mines in adjacent cells.
function countMines(item){
    var count = 0;
    getAdjacentCells(item).forEach(function(itm){
        if(getCellByItem(itm)[0] === 'MINE!'){
            count++;
        }
    });
    return count;
}


//Set mines randomly.
function setRandomMines(numOfMines, firstMine){

    //Set possible choices.
    var mineChoices = [];
    for(var i = 0; i<numOfRows; i++){
        for(var j = 0; j<numOfCols; j++){
            mineChoices.push([i, j]);
        }
    }

    //Exclude first left-clicked cell from possible mine choices.
    var row = getRowById(firstMine.id),
        col = getColById(firstMine.id);
        mineChoices.splice(row*numOfCols + col, 1);

    //Check correct initial numOfMines.
    if(numOfMines > mineChoices.length){
        window.alert('ERROR: more mines than cells! Change app.js specs.');
        newGame();
    }

    //Picks n mines from leftover cell choices.
    for(i = 0; i<numOfMines; i++){
        var randInt = Math.floor(Math.random() * mineChoices.length); //random number in [0, n).
            row = mineChoices[randInt][0];
            col = mineChoices[randInt][1];
        setMine(row, col);
        mineChoices.splice(randInt, 1); //remove selected cell from mine choices.
    }
}


//Set a single mine.
function setMine(row, col){
    cellMatrix[row][col][0] = 'MINE!';
}


//flagging functions.
function placeFlag(item){
    item.innerHTML = flagSymbol;
    refreshFlagNumberDisplay(numOfRightClicked++);
}
function removeFlag(item){
    item.innerHTML = '';
    refreshFlagNumberDisplay(numOfRightClicked--);
}


//UI refresh functions.
function refreshFlagNumberDisplay(){
    var mineNumberDisplay = document.getElementById('mine-number-display');
    mineNumberDisplay.innerHTML = 'Flags: ' + numOfRightClicked + '/'+ numOfMines;
}
function refreshTimer(){
    document.getElementById('timer').innerHTML = 'Time: ' + secondsToString(seconds);
    seconds++;
}
function secondsToString(seconds){ return new Date(seconds * 1000).toISOString().substr(11, 8); }


//Getter functions.
function getElementByRowCol(row, col){ return document.getElementById(row + ',' + col); }
function getCellByItem(item){ return cellMatrix[getRowById(item.id)][getColById(item.id)]; }
function getRowById(id){ return parseInt(id.substring(0, id.indexOf(','))); }
function getColById(id){ return parseInt(id.substring(id.indexOf(',')+1, id.length)); }

function newGame(){ location.reload(); }
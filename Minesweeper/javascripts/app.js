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
    //item.addEventListener('auxclick', function(event){ rightClickCell(item, event); });
});
document.getElementById('new-game').addEventListener('click', function(event){ newGame(); });

//Display number of mines checked off.
refreshFlagNumberDisplay();
//Timer.
refreshTimer();
//window.alert('Game started.');
//setInterval(refreshTimer, 1000);


//Function definitions.
//------------------------------------------------------------


//Generate table cells for playing. Returns a matrix of cells.
function initializePlayArea(numOfCols, numOfRows){
    var table = document.getElementById('play_area'),
        rows = [];
    for(var i = 0; i<numOfRows; i++){
        var tableRow = document.createElement('tr'),
        cells = [];
        for(var j = 0; j<numOfCols; j++){
            var tableCell = document.createElement('td');
            tableCell.classList.add('table-cell');
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
            //TODO prompt: Click any cell to start the game.
            firstClick = false;
            setRandomMines(numOfMines, item);
            setInterval(refreshTimer, 1000);
        }
        
        if(cell[0] === 'MINE!'){
            gameLoss();
        }
        else {
            numOfLeftClicked++;
            item.style.backgroundColor = 'grey';
            var mineCount = countMines(item);
            if(mineCount == 0){
                //autoclick adjacent mines
                zeroCellLeftClick(item);
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
    //if(firstClick) return; //TODO: Da li dozvoliti right-click za prvi click?
    var cell = getCellByItem(item);
    if(cell[1] === 'not-clicked'){
        cell[1] = 'right-clicked';
        placeFlag(item, '*');
    }
    else if (cell[1] === 'right-clicked'){
        cell[1] = 'not-clicked';
        removeFlag(item);
    }
    else {
        return;
    }
}


function zeroCellLeftClick(item){
    var row = getRowById(item.id),
        col = getColById(item.id);
    var leftCheck = (col == 0) ? col : col-1,
        rightCheck = (col == numOfCols-1) ? col : col+1,
        topCheck = (row == 0) ? row : row-1,
        bottomCheck = (row == numOfRows-1) ? row : row+1;
        
    for(var i = topCheck; i<=bottomCheck; i++){
        for(var j = leftCheck; j<=rightCheck; j++){
            if(i === row && j === col){
                continue;
            }
            leftClickCell(getElementByRowCol(i, j), null);
        }
    }
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
                cell.innerHTML = 'X';
            }
        }
    }
    window.alert('Sorry, you just lost :(');
    newGame();
}


//Count mines in adjacent cells.
function countMines(item){
    var row = getRowById(item.id),
        col = getColById(item.id);
    
    var leftCheck = (col == 0) ? col : col-1,
        rightCheck = (col == numOfCols-1) ? col : col+1,
        topCheck = (row == 0) ? row : row-1,
        bottomCheck = (row == numOfRows-1) ? row : row+1;

    var localMines = 0;
    for(var i = topCheck; i<=bottomCheck; i++){
        for(var j = leftCheck; j<=rightCheck; j++){
            if(i === row && j === col){ //remove this check?
                continue;
            }
            if(cellMatrix[i][j][0] === 'MINE!'){
                localMines++;
            }
        }
    }

    return localMines;
}


//Set mines randomly.
function setRandomMines(numOfMines, firstMine){

    var all_possible = [];
    for(var i = 0; i<numOfRows; i++){
        for(var j = 0; j<numOfCols; j++){
            all_possible.push([i, j]);
        }
    }

    var row = getRowById(firstMine.id), col = getColById(firstMine.id);
        all_possible.splice(row*numOfCols + col, 1); //Remove first picked mine.

    if(numOfMines > all_possible.length){
        window.alert('ERROR: more mines than cells! Change app.js specs.');
        newGame();
    }

    //Picks n mines from leftover cells.
    for(i = 0; i<numOfMines; i++){
        var randInt = Math.floor(Math.random() * all_possible.length);
        setMine(all_possible[randInt][0], all_possible[randInt][1]);
        all_possible.splice(randInt, 1); //remove selected mine
    }

}


//Set a single mine.
function setMine(row, col){
    cellMatrix[row][col][0] = 'MINE!';
}


//flagging functions.
function placeFlag(item, flagSymbol){
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
    mineNumberDisplay.innerHTML = numOfRightClicked + '/'+ numOfMines;
}
function refreshTimer(){
    document.getElementById('timer').innerHTML = secondsToString(seconds);
    seconds++;
}


//Getter functions.
function getRowById(id){ return parseInt(id.substring(0, id.indexOf(','))); }
function getColById(id){ return parseInt(id.substring(id.indexOf(',')+1, id.length)); }
function getElementByRowCol(row, col){ return document.getElementById(row + ',' + col); }
function getCellByItem(item){
    var row = getRowById(item.id),
        col = getColById(item.id);
    return cellMatrix[row][col];
}

function newGame(){ location.reload(); }
function secondsToString(seconds){ return new Date(seconds * 1000).toISOString().substr(11, 8); }
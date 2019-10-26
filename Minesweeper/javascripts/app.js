'use strict';


//Initial play area dimensions. Set as desired.
var numOfRows = 5;
var numOfCols = 7;


//Get the game area (table).
var table = document.getElementById('play_area'),
cellMatrix = initializePlayArea(table, numOfCols, numOfRows),
rightClickedCells = [];


//Adding event listeners.
document.querySelectorAll('.table-cell').forEach(function(item){
    item.addEventListener('click', function(event){ leftClickCell(item, event); });
    item.addEventListener('contextmenu', function(event){ rightClickCell(item, event); });
});

//TODO add new game button event listener.


setRandomMines(3, [0,3]); //TODO set initial mine clicked by first left click!




//Function definitions.


//Generate table cells for playing.
function initializePlayArea(table, numOfCols, numOfRows){
    //Adding rows.
    var rows = [];
    for(var i = 0; i<numOfRows; i++){
        var tableRow = document.createElement('tr'),
        cells = [];
        //Adding columns(cells).
        for(var j = 0; j<numOfCols; j++){
            var tableCell = document.createElement('td');
            tableCell.classList.add('table-cell');
            tableCell.setAttribute('id' , i + ',' + j);
            tableRow.appendChild(tableCell);
            cells.push([i, j, 'no-mine']);
        }
        table.appendChild(tableRow);
        rows.push(cells);
    }
    return rows;
}


//Left click function. Lose if mine is clicked. Counts mines in adjacent cells otherwise.
function leftClickCell(item, event){
    var id = item.id,
    row = getRowById(id),
    col = getColById(id);
    if(cellMatrix[row][col][2] === 'MINE!'){
        item.innerHTML = 'X';
        alert('Cell: ' + id + ' has a mine! Sorry, you lost :(');
    } else {
        item.innerHTML = countMines(row, col);
    }
}


//TODO add game end checking for all mines flagged or clicking on a mine.
function rightClickCell(item, event){
    event.preventDefault();
    var id = item.id,
    row = getRowById(id),
    col = getColById(id);
    //console.log('cell ' + id + ' has been right clicked!');
    //rightClickedCells.push(id);
    console.log(item.innerHTML);
    var mineFlag = 'F';
    if(item.innerHTML != mineFlag && item.innerHTML != ''){
        return;
    }
    else if (item.innerHTML == mineFlag){
        item.innerHTML = '';
    }
    else {
        item.innerHTML = mineFlag;
    }
}


//Count mines in adjacent cells.
function countMines(row, col){
    //console.log('row:' + (row) + ', col: ' + (col));
    
    var leftCheck = (col == 0) ? col : col-1;
    var rightCheck = (col == numOfCols-1) ? col : col+1;
    var topCheck = (row == 0) ? row : row-1;
    var bottomCheck = (row == numOfRows-1) ? row : row+1;

    var localMines = 0;
    for(var i = topCheck; i<=bottomCheck; i++){
        for(var j = leftCheck; j<=rightCheck; j++){
            if(i === row && j === col){ //remove this check?
                continue;
            }
            if(cellMatrix[i][j][2] === 'MINE!'){
                localMines++;
            }
        }
    }

    return localMines;
}


//Set mines randomly.
function setRandomMines(numOfMines, firstMine){
    var mineNumberDisplay = document.getElementById('mine-number-display');
    mineNumberDisplay.innerHTML = '0/'+ numOfMines;


    var all_possible = []
    for(var i = 0; i<numOfRows; i++){
        for(var j = 0; j<numOfCols; j++){
            all_possible.push([i, j]);
        }
    }

    var row = firstMine[0], col = firstMine[1];
    all_possible.splice(row*numOfCols + col, 1); //Remove first picked mine.

    if(numOfMines >= all_possible.length){
        console.log('ERROR: more mines than cells!');
    }

    //Picks n mines from leftover cells.
    for(var i = 0; i<numOfMines; i++){
        var randInt = Math.floor(Math.random() * all_possible.length);
        setMine(all_possible[randInt][0], all_possible[randInt][1]);
        all_possible.splice(randInt, 1); //remove selected mine
    }

}


//Set a single mine.
function setMine(row, col){
    var cell = document.getElementById(row + "," + col);
    cellMatrix[row][col][2] = 'MINE!';
}


function getRowById(id){ return parseInt(id.substring(0, id.indexOf(','))); }
function getColById(id){ return parseInt(id.substring(id.indexOf(',')+1, id.length)); }
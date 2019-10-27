'use strict';


//Initial play area dimensions. Set as desired.
var numOfRows = 7,
    numOfCols = 9,
    numOfMines = 5,

//Global variables. Don't change.
    numOfLeftClicked = 0,
    numOfRightClicked = 0,
    firstClick = true,
    cellMatrix = initializePlayArea(numOfCols, numOfRows);


//Adding event listeners.
document.querySelectorAll('.table-cell').forEach(function(item){
    item.addEventListener('click', function(event){ leftClickCell(item, event); });
    item.addEventListener('contextmenu', function(event){ rightClickCell(item, event); });
});

refreshFlagNumberDisplay();
//leftClickCell(document.getElementById('0,0'), null);


//Function definitions.


//Generate table cells for playing.
function initializePlayArea(numOfCols, numOfRows){
    //Adding rows.
    var table = document.getElementById('play_area'),
    rows = [];
    for(var i = 0; i<numOfRows; i++){
        var tableRow = document.createElement('tr'),
        cells = [];
        //Adding columns(cells).
        for(var j = 0; j<numOfCols; j++){
            var tableCell = document.createElement('td');
            tableCell.classList.add('table-cell');
            tableCell.setAttribute('id' , i + ',' + j);
            tableRow.appendChild(tableCell);
            cells.push([i, j, 'no-mine', 'not-clicked']);
        }
        table.appendChild(tableRow);
        rows.push(cells);
    }
    return rows;
}


//Left click function. Lose if mine is clicked. Counts mines in adjacent cells otherwise.
function leftClickCell(item, event){
    console.log(item);
    var row = getRowById(item.id),
        col = getColById(item.id);
    if(cellMatrix[row][col][3] === 'not-clicked'){
        if(firstClick){
            firstClick = false;
            setRandomMines(numOfMines, [row, col]);
        }
        cellMatrix[row][col][3] = 'left-clicked';
        if(cellMatrix[row][col][2] === 'MINE!'){
            item.innerHTML = 'X';
            alert('Cell: ' + item.id + ' has a mine! Sorry, you lost :(');
            location.reload();
        } else {
            numOfLeftClicked++;
            var mineCount = countMines(row, col);
            if(mineCount == 0){
                //autoclick adjacent mines
                zeroCellLeftClick(row, col);
            }
            item.innerHTML = mineCount;
            checkWinCondition(numOfLeftClicked, numOfCols, numOfRows, numOfMines);
        }
    } else {
        return; //leftClicked on alredy leftClicked cell.
    }
}


function zeroCellLeftClick(row, col){    
    var leftCheck = (col == 0) ? col : col-1,
        rightCheck = (col == numOfCols-1) ? col : col+1,
        topCheck = (row == 0) ? row : row-1,
        bottomCheck = (row == numOfRows-1) ? row : row+1;
        
    for(var i = topCheck; i<=bottomCheck; i++){
        for(var j = leftCheck; j<=rightCheck; j++){
            if(i === row && j === col){
                continue;
            }
            leftClickCell(document.getElementById(i+','+j), null);
        }
    }
}



//TODO add game end checking for all mines flagged or clicking on a mine.
function rightClickCell(item, event){
    event.preventDefault();
    var row = getRowById(item.id),
        col = getColById(item.id),
    mineFlag = '*';
    if(cellMatrix[row][col][3] === 'not-clicked'){
        cellMatrix[row][col][3] = 'right-clicked';
        refreshFlagNumberDisplay(numOfRightClicked++);
        item.innerHTML = mineFlag;
    }
    else if (cellMatrix[row][col][3] === 'right-clicked'){
        cellMatrix[row][col][3] = 'not-clicked';
        refreshFlagNumberDisplay(numOfRightClicked--);
        item.innerHTML = '';
    }
    else {
        return;
    }
}


//Count mines in adjacent cells.
function countMines(row, col){
    //console.log('row:' + (row) + ', col: ' + (col));
    
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
            if(cellMatrix[i][j][2] === 'MINE!'){
                localMines++;
            }
        }
    }

    return localMines;
}


function refreshFlagNumberDisplay(){
    var mineNumberDisplay = document.getElementById('mine-number-display');
    mineNumberDisplay.innerHTML = numOfRightClicked + '/'+ numOfMines;
}


//Set mines randomly.
function setRandomMines(numOfMines, firstMine){

    var all_possible = []
    for(var i = 0; i<numOfRows; i++){
        for(var j = 0; j<numOfCols; j++){
            all_possible.push([i, j]);
        }
    }

    var row = firstMine[0], col = firstMine[1];
        all_possible.splice(row*numOfCols + col, 1); //Remove first picked mine.

    if(numOfMines > all_possible.length){
        alert('ERROR: more mines than cells! Change app.js specs.');
        location.reload();
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

function checkWinCondition(numOfLeftClicked, numOfCols, numOfRows, numOfMines){
    var numOfLeftClickable = numOfCols * numOfRows - numOfMines;
    if(numOfLeftClicked < numOfLeftClickable){
        return;
    }
    else {
        alert('YOU WON! Congrats :D');
        location.reload();
    }
}


function getRowById(id){ return parseInt(id.substring(0, id.indexOf(','))); }
function getColById(id){ return parseInt(id.substring(id.indexOf(',')+1, id.length)); }
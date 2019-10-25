'use strict';


//Initial play area dimensions. Set as desired.
var numOfRows = 15;
var numOfCols = 12;


//Get the game area (table).
var table = document.getElementById('play_area');
var cellMatrix = initializePlayArea(table, numOfCols, numOfRows);
//console.log(cellMatrix);


//Add event listeners.
document.querySelectorAll('.table-cell').forEach(function(item){
    item.addEventListener('click', function(event){
        leftClickCell(item, event)
    });
});


setMine(0, 1, cellMatrix);
setMine(0, 2, cellMatrix);
//TODO Set random mines (var numOfMines=...).
//TODO Set timer till completion.




//Function definitions.

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
            //tableCell.setAttribute('has-a-mine', 'no-mine');
            tableRow.appendChild(tableCell);
            cells.push([i, j, 'no-mine']);
        }
        table.appendChild(tableRow);
        //console.log(rows);//TODO Comment this line when done.
        rows.push(cells);
    }
    return rows;
}


function setMine(row, col, cellMatrix){
    var cell = document.getElementById(row + "," + col);
    //cell.setAttribute('has-a-mine', 'MINE!');
    cellMatrix[row][col][2] = 'MINE!';
    //console.log(cellMatrix[row][col]);
}


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
            //console.log(cellMatrix[i][j]);
            if(cellMatrix[i][j][2] === 'MINE!'){
                localMines++;
            }
        }
    }

    return localMines;
}

function leftClickCell(item, event){
    var id = item.id,
    row = parseInt(id.substring(
        0, id.indexOf(',')
    )),
    col = parseInt(id.substring(
        id.indexOf(',')+1, id.length
    ));
    //console.log(cellMatrix[row][col]);
    if(cellMatrix[row][col][2] === 'MINE!'){
        item.innerHTML = 'X';
        alert('Cell: ' + id + ' has a mine! Sorry, you lost :(');
    } else {
        //console.log('id: ' + id);
        //console.log('' + row + col);
        item.innerHTML = countMines(row, col);
    }
}

function setRandomMines(){
    //
}
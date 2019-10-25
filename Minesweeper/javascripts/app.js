'use strict';


//Initial play area dimensions. Set as desired.
var numOfRows = 5;
var numOfCols = 7;


//Get the game area (table).
var table = document.getElementById('play_area');
var cellMatrix = initializePlayArea(table, numOfCols, numOfRows);
//console.log(cellMatrix);


//Add event listeners.
document.querySelectorAll('.table-cell').forEach(function(item){
    item.addEventListener('click', function(event){
        //console.log('ID is: ' + item.id);
        //console.log(item.getAttribute('has-a-mine'));
        if(item.getAttribute('has-a-mine') === 'MINE!'){
            alert('Cell: ' + item.id + ' has a mine! Sorry, you lost :(');
            item.innerHTML = 'X';
        } else {
            //TODO Doesn't work for cols/rows > 9! Implement parse untill ','.
            item.innerHTML = countMines(parseInt(item.id[0]), parseInt(item.id[2]));
        }
    });
});


setMine(0, 1, cellMatrix);
//TODO Set random mines (var numOfMines=...).
//TODO Set timer till completion.




//Function definitions.

function initializePlayArea(table, numOfCols, numOfRows){
    //Adding rows.
    var rows = [];
    for(var i = 0; i<numOfRows; i++){
        var tableRow = document.createElement('tr');
        var cells = [];
        //Adding columns(cells).
        for(var j = 0; j<numOfCols; j++){
            var tableCell = document.createElement('td');
            tableCell.classList.add('table-cell');
            tableCell.setAttribute('id' , i + ',' + j);
            tableCell.setAttribute('has-a-mine', 'no-mine');
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
    cell.setAttribute('has-a-mine', 'MINE!');
    cellMatrix[row][col][2] = 'MINE!';
    //console.log(cellMatrix[row][col]);
}


function countMines(row, col){
    //console.log('entered countMines');
    //console.log(numOfRows)
    console.log('row:' + (row+1) + ', col: ' + (col+1));
    
    var leftCheck = (col == 0) ? col : col-1;
    var rightCheck = (col == numOfCols) ? col : col+1;
    var topCheck = (row == 0) ? row : row-1;
    var bottomCheck = (row == numOfRows) ? row : row+1;
    //console.log(leftCheck.toString() + rightCheck + topCheck + bottomCheck);

    var localMines = 0;
    for(var i = topCheck; i<=bottomCheck; i++){
        for(var j = leftCheck; j<=rightCheck; j++){
            if(i === row && j === col){ //remove this check?
                continue;
            }
            console.log(cellMatrix[i][j]);
            if(cellMatrix[i][j][2] === 'MINE!'){
                localMines++;
            }
        }
    }

    return localMines;
}
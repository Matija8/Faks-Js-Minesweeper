'use strict';
/* jshint browser: true */

//Initial play area dimensions. Set as desired.
var numOfRows = 7,
    numOfCols = 9,
    numOfMines = 5;

new Game(numOfRows, numOfCols, numOfMines);

document.getElementById('new-game').addEventListener('click', function(event){ location.reload(); });


//Object constructors:

function Game(numOfRows, numOfCols, numOfMines){
    this.numOfLeftClicked = 0;
    this.numOfRightClicked = 0;
    this.seconds = 0;
    this.firstClick = true;
    this.cellMatrix = [];

    initPlayArea(this);
    setAdjacentCells(this.cellMatrix);

    //Making the play-area.
    function initPlayArea(game){
        var tableDOM = document.createElement('div');
            tableDOM.setAttribute('id', 'play-area');
        for(var i = 0; i<numOfRows; i++){
            var rowDOM = document.createElement('div'),
                row = [];
                rowDOM.classList.add('row');
            for(var j = 0; j<numOfCols; j++){
                var cellDOM = document.createElement('div');
                    cellDOM.classList.add('cell');
                    cellDOM.innerText = i + ',' + j;
                rowDOM.appendChild(cellDOM);
                row.push(new Cell(cellDOM));
            }
            game.cellMatrix.push(row);
            tableDOM.appendChild(rowDOM);
        }
        document.getElementById('play-area-container').appendChild(tableDOM);
    }


    //Setting adjacent cells.
    function setAdjacentCells(matrix){
        for(var i = 0; i<numOfRows; i++){
            for(var j = 0; j<numOfCols; j++){
                matrix[i][j].adjacent.push('test');
            }
        }
    }

}


function Cell(item){
    this.item = item;                   //DOM object reference
    this.mineState = 'no-mine';         // {'no-mine', 'MINE!'} 
    this.clickState = 'not-clicked';    // {'not-clicked', 'left-clicked', 'right-clicked'}
    this.adjacent = [];

    this.item.addEventListener('mousedown', function(event){ mouseDown(item, event); });
    this.item.addEventListener('mouseup', function(event){ mouseUp(item, event); });


    function mouseDown(item, event){
        console.log(item, event);
    }

    function mouseUp(item, event){
        console.log(item, event);
    }
}

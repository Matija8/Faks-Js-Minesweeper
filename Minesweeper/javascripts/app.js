'use strict';
/* jshint browser: true */
/*jshint esversion: 6 */

//Initial play area dimensions. Set as desired.
var numOfRows = 7,
    numOfCols = 9,
    numOfMines = 5;


//Object constructors:
class Game {
    constructor(numOfRows, numOfCols, numOfMines) {
        this.numOfLeftClicked = 0;
        this.numOfRightClicked = 0;
        this.seconds = 0;
        this.firstClick = true;
        this.cellMatrix = [];
        this.initPlayArea();
        this.setAdjacentCells(this.cellMatrix);
    }//constructor

    initPlayArea() {
        var tableDOM = document.createElement('div');
        tableDOM.setAttribute('id', 'play-area');
        for (var i = 0; i < numOfRows; i++) {
            var rowDOM = document.createElement('div'), row = [];
            rowDOM.classList.add('row');
            for (var j = 0; j < numOfCols; j++) {
                var cellDOM = document.createElement('div');
                cellDOM.classList.add('cell');
                cellDOM.innerText = i + ',' + j;
                rowDOM.appendChild(cellDOM);
                row.push(new Cell(cellDOM));
            }
            this.cellMatrix.push(row);
            tableDOM.appendChild(rowDOM);
        }
        document.getElementById('play-area-container').appendChild(tableDOM);
    }//initPlayArea

    setAdjacentCells(matrix) {
        for (var i = 0; i < numOfRows; i++) {
            for (var j = 0; j < numOfCols; j++) {
                matrix[i][j].adjacent.push('test');
            }
        }
    }//setAdjacentCells

}//class Game


class Cell {
    constructor(item) {
        this.item = item; //DOM object reference
        this.mineState = 'no-mine'; // {'no-mine', 'MINE!'} 
        this.clickState = 'not-clicked'; // {'not-clicked', 'left-clicked', 'right-clicked'}
        this.adjacent = [];
        this.item.addEventListener('mousedown', function (event) { mouseDown(item, event); });
        this.item.addEventListener('mouseup', function (event) { mouseUp(item, event); });
        function mouseDown(item, event) {
            switch(event.button) {
                case 0: //leftClick
                    console.log('left');
                    break;
                case 1: //leftClick
                    console.log('mid');
                    break;
                case 2: //leftClick
                    console.log('right');
                    break;
            }
        }
        function mouseUp(item, event) {
            switch(event.button) {
                case 0: //leftClick
                    console.log('left');
                    break;
                case 1: //leftClick
                    console.log('mid');
                    break;
                case 2: //leftClick
                    console.log('right');
                    break;
            }
        }
    }
}


new Game(numOfRows, numOfCols, numOfMines);

document.getElementById('new-game').addEventListener('click', function(event){ location.reload(); });
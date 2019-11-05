'use strict';
/* jshint browser: true */
/*jshint esversion: 6 */

//Initial play area dimensions. Set as desired.
const numOfRows = 7,
    numOfCols = 9,
    numOfMines = 5;


//Object constructors:
class Game {
    constructor(numOfRows, numOfCols, numOfMines){
        //attributes
        this.numOfRows          = numOfRows;
        this.numOfCols          = numOfCols;
        this.numOfMines         = numOfMines;
        this.numOfLeftClicked   = 0;
        this.numOfRightClicked  = 0;
        this.seconds            = 0;
        this.firstClick         = true;
        this.mineNumberDisplay  = document.getElementById('mine-number-display');
        this.timerDisplay       = document.getElementById('timer');
        this.cellMatrix         = [];

        this.initPlayArea();
        this.refreshFlagNumberDisplay();
        this.refreshTimer();
    }//constructor

    initPlayArea(){
        const tableDOM = document.createElement('div');
        tableDOM.setAttribute('id', 'play-area');
        for (let i = 0; i < numOfRows; i++) {
            const rowDOM = document.createElement('div');
            rowDOM.classList.add('row');
            let row = [];
            for (let j = 0; j < numOfCols; j++) {
                const cellDOM = document.createElement('div');
                cellDOM.classList.add('cell');
                cellDOM.innerText = i + ',' + j;
                rowDOM.appendChild(cellDOM);
                row.push(new Cell(i, j, cellDOM, this));
            }
            this.cellMatrix.push(row);
            tableDOM.appendChild(rowDOM);
        }
        document.getElementById('play-area-container').appendChild(tableDOM);

        //for each cell setAdjacentCells();
        this.cellMatrixToList().forEach(cell => { /*logf(cell.toString());*/ cell.setAdjacentCells(); } );
    }//initPlayArea

    cellMatrixToList(){
        let cells = [];
        this.cellMatrix.forEach(row => {
            row.forEach(cell => {
                cells.push(cell);
            });
        });
        return cells;
    }


    refreshFlagNumberDisplay(){
        this.mineNumberDisplay.innerHTML = `Flags: ${this.numOfRightClicked} / ${this.numOfMines}`;
    }

    refreshTimer(){
        this.timerDisplay.innerHTML = 'Time: ' + secondsToString(this.seconds);
        this.seconds++;
        function secondsToString(seconds){ return new Date(seconds * 1000).toISOString().substr(11, 8); }        
    }

    setRandomMines(firstMine){
        logf('setMines called!' + firstMine.toString());
        //game.log();//TODO: Comment out after.
    }    

    log() {
        this.cellMatrix.forEach((row) => {
            row.forEach((cell) => {
                logf(cell.toString());
            });
        });
    }//log

}//class Game



class Cell {
    constructor(row, col, item, game){
        this.row        = row;
        this.col        = col;
        this.item       = item; //DOM object reference.
        this.game       = game; //Game object.
        this.mineState  = 'no-mine'; // {'no-mine', 'MINE!'} 
        this.clickState = 'not-clicked'; // {'not-clicked', 'left-clicked', 'right-clicked'}
        this.adjacent   = [];
        
        //Adding event listeners.
        this.item.addEventListener('mousedown', (event) => { this.mouseDown(event); });
        this.item.addEventListener('mouseup', (event) => { this.mouseUp(event); });
        this.item.addEventListener('contextmenu', (event) => { event.preventDefault(); });
    }

    setAdjacentCells(){
        let [row, col] = [this.row, this.col],
            leftCheck = (col == 0) ? col : col-1,
            rightCheck = (col == numOfCols-1) ? col : col+1,
            topCheck = (row == 0) ? row : row-1,
            bottomCheck = (row == numOfRows-1) ? row : row+1;
            
        for(let i = topCheck; i<=bottomCheck; i++){
            for(let j = leftCheck; j<=rightCheck; j++){
                if(i === row && j === col){
                    continue;
                }
                this.adjacent.push(this.game.cellMatrix[i][j]);
            }
        }
    }

    mouseDown(event){
        logf(this.adjacent);
        switch(event.button) {
            case 0:
                this.leftDown(); break;
            case 1:
                this.midDown(); break;
            case 2:
                this.rightDown(event);break;
        }
    }

    mouseUp(event){
        switch(event.button) {
            case 0:
                this.leftUp(); break;
            case 1:
                this.midUp(); break;
            case 2:
                this.rightUp();break;
        }
    }

    leftDown(){
        logf('LeftDown');//TODO: Comment out after.

        if(this.clickState === 'not-clicked'){
            this.clickState = 'left-clicked';
            if(game.firstClick){
                game.firstClick = false;
                game.setRandomMines(this);
                //startTimer(this.game); //TODO
            }
        }
    }

    leftUp(){
        logf('LeftUp');
    }

    midDown(){
        logf('MidDown');
    }

    midUp(){
        logf('MidUp');
    }

    rightDown(){
        logf('RightDown');
    }

    rightUp(){
        logf('RightUp');
    }

    toString(){
        return `[${this.row}, ${this.col}],  {${this.mineState}}, {${this.clickState}}`; 
    }
}


const game = new Game(numOfRows, numOfCols, numOfMines);


document.getElementById('new-game').addEventListener('click', (event) => { location.reload(); });

function logf(msg) {console.log(msg)}
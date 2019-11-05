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
        let mineChoices = game.cellMatrixToList();

        //remove firstMine from choices.
        mineChoices.splice(firstMine.row*numOfCols + firstMine.col, 1);

        //Check correct initial numOfMines.
        if(numOfMines > mineChoices.length){
            window.alert('ERROR: more mines than cells! Change app.js specs.');
            return;
        }
    
        //Picks n mines from leftover cell choices.
        for(let i = 0; i<numOfMines; i++){
            let randInt = Math.floor(Math.random() * mineChoices.length); //random number in [0, n).
            mineChoices[randInt].mineState = 'MINE!';
            mineChoices.splice(randInt, 1); //remove selected cell from mine choices.
        }
    }

    winCondition(){
        return this.numOfLeftClicked === this.numOfCols * this.numOfRows - this.numOfMines;
    }

    gameWin(){
        window.alert('You WON! :D');
        location.reload();
    }

    gameLoss(){
        this.cellMatrixToList().forEach(cell => {
            if(cell.mineState === 'MINE!'){
                cell.item.style.backgroundColor = 'red';
                cell.item.innerHTML = '☢';
            }
        });
        setTimeout(() => {
            window.alert('Sorry, you just lost :(');
            location.reload();
        } ,100);
    }

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
        this.adjacentClear = [];
        
        //Adding event listeners.
        this.item.addEventListener('mousedown', (event) => { this.mouseDown(event); });
        this.item.addEventListener('mouseup', (event) => { if(event.button === 1) this.midUp(); });
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
        switch(event.button){
            case 0:
                this.leftDown(); break;
            case 1:
                this.midDown(); break;
            case 2:
                this.rightDown(); break;
        }
    }

    leftDown(){
        let game = this.game;

        if(this.clickState === 'not-clicked'){
            this.clickState = 'left-clicked';
            if(game.firstClick){
                game.firstClick = false;
                game.setRandomMines(this);
                //startTimer(this.game); //TODO
            }
            if(this.mineState === 'MINE!'){
                game.gameLoss();
            }
            else {
                game.numOfLeftClicked++;
                this.item.style.background = 'grey';
                let mineCount = this.countMines();
                if(mineCount === 0){
                    this.adjacent.forEach(cell => cell.leftDown() );
                }
                else {
                    this.item.innerHTML = mineCount;
                }
                if(game.winCondition()){
                    game.gameWin();
                }
            }
        }
    }

    countMines(){
        let count = 0;
        this.adjacent.forEach(function(cell){
            if(cell.mineState === 'MINE!')
                count++;
        });
        return count;
    }

    rightDown(){
        if(this.clickState === 'not-clicked'){
            this.clickState = 'right-clicked';
            this.item.innerHTML = '🚩';
            game.numOfRightClicked++;
            game.refreshFlagNumberDisplay();
        }
        else if(this.clickState === 'right-clicked'){
            this.clickState = 'not-clicked';
            this.item.innerHTML = '';
            game.numOfRightClicked--;
            game.refreshFlagNumberDisplay();
        }
    }

    midDown(){
        if(this.clickState === 'left-clicked'){
            let numOfLocalMines = this.countMines();
            this.adjacent.forEach(cell => {
                if(cell.clickState === 'right-clicked'){
                    numOfLocalMines--;
                }
                else if(cell.clickState === 'not-clicked'){
                    this.adjacentClear.push(cell);
                }
            });
            let highlight = (numOfLocalMines !== 0);
            this.adjacentClear.forEach(cell => {
                if(highlight){
                    cell.item.style.backgroundColor = "#FDFF47";
                }
                else {
                    cell.leftDown();
                }
            });
            if(!highlight){
                this.adjacentClear = [];
            }
        }
    }

    midUp(){
        this.adjacentClear.forEach(cell => {
            cell.item.style.backgroundColor = "gainsboro";
        });
    }

    toString(){
        return `[${this.row}, ${this.col}],  {${this.mineState}}, {${this.clickState}}`; 
    }
}


const game = new Game(numOfRows, numOfCols, numOfMines);


document.getElementById('new-game').addEventListener('click', (event) => { location.reload(); });

function logf(msg) {console.log(msg)}
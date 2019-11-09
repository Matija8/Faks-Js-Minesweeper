'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


class Game {
    constructor(numOfRows, numOfCols, numOfMines, style, parentNode){
        this.numOfRows          = numOfRows;
        this.numOfCols          = numOfCols;
        let maxMines = this.numOfRows * this.numOfCols - 1;
        this.numOfMines = numOfMines > maxMines ? maxMines : numOfMines;
        this.style              = style; // Style class.
        this.parentNode         = parentNode;
        this.playArea           = null;
        this.mineNumberDisplay  = document.getElementById('mine-number-display');
        this.timerDisplay       = document.getElementById('timer');
        this.numOfLeftClicked   = 0;
        this.numOfRightClicked  = 0;
        this.winSemaphore       = true; // Hack to prevent multiple wins on empty cell recursive left-click.
        this.lossSemaphore      = true; // TODO?
        this.listenersRemoved   = false;
        this.firstClick         = true; // Mines are set only on the first left-click.
        this.midDownFlag        = false;
        this.startTime          = null;
        this.runningTimer       = null;
        this.endTime            = null;
        this.cellMatrix         = [];

        [this.mineNumberDisplay, this.timerDisplay].forEach(domElement => {
            domElement.style.display = "block";
            domElement.style.padding = '3px 10px';});
        this.timerDisplay.innerHTML = 'Time: ' + this.timeToString(0);
        this.refreshFlagNumberDisplay();
        this.initPlayArea();
    }


    initPlayArea(){
        this.playArea = document.createElement('div');
        this.playArea.setAttribute('id', 'play-area');
        for (let i = 0; i < this.numOfRows; i++) {
            const rowDOM = document.createElement('div');
            rowDOM.classList.add('row');
            let row = [];
            for (let j = 0; j < this.numOfCols; j++) {
                const cellDOM = document.createElement('div');
                cellDOM.classList.add('cell');
                rowDOM.appendChild(cellDOM);
                row.push(new Cell(i, j, cellDOM, this)); //TODO: import Cell?
            }
            this.cellMatrix.push(row);
            this.playArea.appendChild(rowDOM);
        }
        this.parentNode.appendChild(this.playArea);
        this.cellMatrixToList().forEach(cell => { this.setAdjacentCells(cell); } );
        this.playArea.style.display = 'table';

    }


    setAdjacentCells(cell){
        let [row, col]  = [cell.row, cell.col],
            leftCheck   = (col === 0)                ?   col : col-1,
            rightCheck  = (col === this.numOfCols-1) ?   col : col+1,
            topCheck    = (row === 0)                ?   row : row-1,
            bottomCheck = (row === this.numOfRows-1) ?   row : row+1;            
        for(let i = topCheck; i<=bottomCheck; i++){
            for(let j = leftCheck; j<=rightCheck; j++){
                if(i === row && j === col){
                    continue;
                }
                cell.adjacent.push(this.cellMatrix[i][j]);
            }
        }
    }


    cellMatrixToList(){
        let cells = [];
        this.cellMatrix.forEach(row => {
            row.forEach(cell => {
                cells.push(cell);
            });
        });
        return cells;
    }


    refreshFlagNumberDisplay(){ this.mineNumberDisplay.innerHTML = `Flags: ${this.numOfRightClicked} / ${this.numOfMines}`; }


    //Timer functions.
    startTimer(){
        this.startTime = Date.now();
        this.runningTimer = setInterval(this.refreshTimer.bind(this), 1000);
    }


    stopTimer(){
        if(this.runningTimer){
            clearInterval(this.runningTimer);
            this.endTime = Date.now() - this.startTime;
            this.timerDisplay.innerHTML = 'Time: ' + this.timeToString(this.endTime);
        }
    }


    refreshTimer(){ this.timerDisplay.innerHTML = 'Time: ' + this.timeToString(Date.now() - this.startTime); }

    timeToString(time){ return (new Date(time)).toISOString().substr(11, 8); } //Garbage collector deletes the Date objects, no memory leaks here (hopefully).


    setRandomMines(firstMine){
        let mineChoices = this.cellMatrixToList();
        mineChoices.splice(firstMine.row*this.numOfCols + firstMine.col, 1); //remove firstMine from choices.
        for(let i = 0; i<this.numOfMines; i++){ //Picks n mines from leftover cell choices.
            let randInt = Math.floor(Math.random() * mineChoices.length); //random number in [0, n).
            mineChoices[randInt].mineState = 'MINE!';
            mineChoices.splice(randInt, 1); //remove selected cell from mine choices.
        }
    }


    winCondition(){ return this.numOfLeftClicked === this.numOfCols * this.numOfRows - this.numOfMines; }    


    gameWin(){
        if(!this.winSemaphore){
            return;
        }
        this.winSemaphore = false;    
        this.gameEnd();
        setTimeout(() => {
            window.alert('You WON! :D\n Your time is: ' + accurateTime(this.endTime)); //TODO Chromium bug: promises?
        } ,100);
        //Send win time to the server (Node.js) via ajax...

        function accurateTime(time){return (new Date(time)).toISOString().substr(11, 12);}
    }


    gameLoss(clickedMine){
        if(!this.lossSemaphore){
            return;
        }
        this.lossSemaphore = false;
        this.cellMatrixToList().forEach(cell => {
            if(cell.mineState === 'MINE!' && cell.clickState !== 'right-clicked'){
                cell.css.backgroundImage = this.style.image_Mine;}
            else if(cell.clickState === 'right-clicked' && cell.mineState !== 'MINE!'){
                cell.css.backgroundImage = this.style.image_FlaggedWrong;}
        });
        clickedMine.css.backgroundImage = this.style.image_ClickedMine;
        this.gameEnd();
        setTimeout(() => {
            window.alert('Sorry, you just lost :('); //TODO Chromium bug: promises?
        } ,100);
    }


    gameEnd(){
        this.stopTimer();
        this.cellMatrixToList().forEach(cell => {
            cell.removeListeners();
        });
        this.listenersRemoved = true;
    }


    reInit(){
        //this.playArea.style.display = 'hidden'; //TODO!
        this.stopTimer();
        this.timerDisplay.innerHTML = 'Time: ' + this.timeToString(0);

        this.numOfLeftClicked   = 0;
        this.numOfRightClicked  = 0;
        this.firstClick         = true;
        this.winSemaphore       = true;
        this.lossSemaphore      = true;
        this.midDownFlag        = false;
        this.refreshFlagNumberDisplay();

        this.cellMatrixToList().forEach(cell => {
            cell.mineState  = 'no-mine';
            cell.clickState = 'not-clicked';
            cell.css.backgroundImage = cell.style.image_NotClicked;
            cell.css.backgroundSize = 'contain';
            cell.item.innerHTML = '';
            if(this.listenersRemoved === true){
                cell.setListeners();
            }
        });
        this.listenersRemoved = false;
        //this.playArea.style.display = 'table'; //TODO!
    }
}

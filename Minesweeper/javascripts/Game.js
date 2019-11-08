'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


class Game {
    constructor(numOfRows, numOfCols, numOfMines, style){
        this.numOfRows          = numOfRows;
        this.numOfCols          = numOfCols;
        this.numOfMines         = numOfMines;
        this.style              = style; // Style class.
        this.notInstantiated    = false; //TODO!
        this.numOfLeftClicked   = 0;
        this.numOfRightClicked  = 0;
        this.firstClick         = true; // Mines are set only on the first left-click.
        this.winSemaphore       = true; // Hack to prevent multiple wins on empty cell recursive left-click.
        this.lossSemaphore      = true; // TODO?
        this.mineNumberDisplay  = document.getElementById('mine-number-display');
        this.timerDisplay       = document.getElementById('timer');
        this.startTime          = null;
        this.runningTimer       = null;
        this.timePlaying        = null;
        this.midDownFlag        = false;
        this.cellMatrix         = [];

        this.initPlayArea();
        this.refreshFlagNumberDisplay();
        this.refreshTimer();
    }

    initPlayArea(){
        const tableDOM = document.createElement('div');
        tableDOM.setAttribute('id', 'play-area');
        for (let i = 0; i < this.numOfRows; i++) {
            const rowDOM = document.createElement('div');
            rowDOM.classList.add('row');
            let row = [];
            for (let j = 0; j < this.numOfCols; j++) {
                const cellDOM = document.createElement('div');
                cellDOM.classList.add('cell');
                rowDOM.appendChild(cellDOM);
                row.push(new Cell(i, j, cellDOM, this));
            }
            this.cellMatrix.push(row);
            tableDOM.appendChild(rowDOM);
        }
        document.getElementById('play-area-container').appendChild(tableDOM);

        //for each cell: setAdjacentCells();
        this.cellMatrixToList().forEach(cell => { cell.setAdjacentCells(); } );
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


    refreshFlagNumberDisplay(){
        this.mineNumberDisplay.innerHTML = `Flags: ${this.numOfRightClicked} / ${this.numOfMines}`;
    }


    startTimer(){
        this.startTime = Date.now();
        this.runningTimer = setInterval(this.refreshTimer.bind(this), 1000);
    }


    stopTimer(){
        if(this.runningTimer){
            clearInterval(this.runningTimer);
            this.refreshTimer();
        }
    }


    refreshTimer(){
        if(!this.startTime){
            this.timerDisplay.innerHTML = 'Time: ' + new Date(0).toISOString().substr(11, 8);
        }
        else{
            let timeElapsed = Date.now() - this.startTime;
            this.timerDisplay.innerHTML = 'Time: ' + new Date (timeElapsed).toISOString().substr(11, 8);
        }
    }


    setRandomMines(firstMine){
        let mineChoices = this.cellMatrixToList();

        //remove firstMine from choices.
        mineChoices.splice(firstMine.row*this.numOfCols + firstMine.col, 1);

        //Check correct initial numOfMines.
        if(this.numOfMines > mineChoices.length){
            window.alert('ERROR: more mines than cells! Change app.js specs.');
            this.numOfMines = 0;
            return;
        }
    
        //Picks n mines from leftover cell choices.
        for(let i = 0; i<this.numOfMines; i++){
            let randInt = Math.floor(Math.random() * mineChoices.length); //random number in [0, n).
            mineChoices[randInt].mineState = 'MINE!';
            mineChoices.splice(randInt, 1); //remove selected cell from mine choices.
        }
    }


    winCondition(){
        return this.numOfLeftClicked === this.numOfCols * this.numOfRows - this.numOfMines;
    }    


    gameWin(){
        if(!this.winSemaphore){
            return;
        }
        this.winSemaphore = false;            
        window.alert('You WON! :D');
        this.gameEnd();
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
        setTimeout(() => {
            window.alert('Sorry, you just lost :(');    //TODO Chrome: promises?
        } ,100);
        this.gameEnd();
    }


    gameEnd(){
        this.stopTimer();
        this.cellMatrixToList().forEach(cell => {
            cell.removeListeners();
        });

    }
}

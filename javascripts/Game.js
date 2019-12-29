'use strict';
/* jshint browser: true */
/* jshint esversion: 6 */


class Game {
    constructor(numOfRows, numOfCols, numOfMines, parentNode, gameType, style){
        this.numOfRows          = numOfRows;
        this.numOfCols          = numOfCols;
        let maxMines = this.numOfRows * this.numOfCols - 1;
        this.numOfMines = numOfMines > maxMines ? maxMines : numOfMines;
        this.gameType           = gameType; // String denoting the game type.
        this.style              = style;    // Style class.
        this.parentNode         = parentNode;
        this.playArea           = null;
        this.mineNumberDisplay  = document.getElementById('mine-number-display');
        this.timerDisplay       = document.getElementById('timer');
        this.numOfLeftClicked   = 0;
        this.numOfRightClicked  = 0;
        this.winSemaphore       = true; // Hack to prevent multiple wins on empty cell recursive left-click.
        this.lossSemaphore      = true; // TODO: different solution?
        this.firstClick         = true; // Mines are set only on the first left-click.
        this.listenersRemoved   = false;
        this.leftDownFlag       = false;
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
                row.push(new Cell(i, j, cellDOM, this));
            }
            this.cellMatrix.push(row);
            this.playArea.appendChild(rowDOM);
        }
        this.parentNode.appendChild(this.playArea);
        this.cellMatrixToList().forEach(cell => { this.setAdjacentCells(cell); } );

        this.setMouseFlagListeners();
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


    setMouseFlagListeners(){
        document.addEventListener('mouseup',   event => {
                if(event.button === 1) {this.midDownFlag = false;}
                else if(event.button === 0) {this.leftDownFlag = false;}
            });
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

    timeToString(time){ return (new Date(time)).toISOString().substr(11, 8); } // Garbage collector deletes the Date objects, no memory leaks here (hopefully).


    setRandomMines(firstMine){
        let mineChoices = this.cellMatrixToList();
        mineChoices.splice(firstMine.row*this.numOfCols + firstMine.col, 1); // Remove firstMine from choices.
        for(let i = 0; i<this.numOfMines; i++){ // Picks n mines from leftover cell choices.
            let randInt = Math.floor(Math.random() * mineChoices.length); // Random number in [0, n).
            mineChoices[randInt].hasMine = true;
            mineChoices.splice(randInt, 1); // Remove selected cell from mine choices.
        }
    }


    winCondition(){ return this.numOfLeftClicked === this.numOfCols * this.numOfRows - this.numOfMines; }    


    gameWin(){
        if(!this.winSemaphore){
            return;
        }
        this.winSemaphore = false;
        this.gameEnd();
        setTimeout(() => { // Prevent prompt from running before screen refresh (chromium). TODO: different solution?
            let userName = window.prompt(
                `You WON! :D\n` +
                `Game difficulty: ${this.gameType}\n` +
                `Your time is: ${ new Date(this.endTime).toISOString().substr(11, 12) } ms\n` +
                `Enter a name to save your score:`,
                "Super awesome guy (or girl)!");

            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:8787/highscores');
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = () => {
                let DONE = XMLHttpRequest.DONE,
                    OK = 200;
            	if (this.readyState === DONE) {
            		if (this.status === OK) {
            			console.log(xhr.responseText);
            		} else {
            			console.log('Ajax Error: ' + xhr.status);
            		}
            	}
            };
            xhr.send(`userName=${userName}&score=${this.endTime}`);
        }, 100);
        // Send win time and game type to the server (Node.js) via ajax...
    }


    gameLoss(clickedMine){
        if(!this.lossSemaphore){
            return;
        }
        this.lossSemaphore = false;
        this.cellMatrixToList().forEach(cell => {
            if(cell.hasMine && cell.clickState !== 'right-clicked'){
                cell.css.backgroundImage = this.style.image_Mine;}
            else if(cell.clickState === 'right-clicked' && !cell.hasMine){
                cell.css.backgroundImage = this.style.image_FlaggedWrong;}
        });
        clickedMine.css.backgroundImage = this.style.image_ClickedMine;
        this.gameEnd();
        setTimeout(() => { // Prevent alert from running before screen refresh (chromium).
            window.alert('Sorry, you just lost :(');
        }, 100);
    }


    gameEnd(){
        this.stopTimer();
        this.cellMatrixToList().forEach(cell => {
            cell.removeListeners();
        });
        this.listenersRemoved = true;
    }


    reInit(){
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
            cell.hasMine  = false;
            cell.clickState = 'not-clicked';
            cell.css.backgroundImage = cell.style.image_NotClicked;
            cell.css.backgroundSize = 'contain';
            cell.item.innerHTML = '';
            if(this.listenersRemoved === true){
                cell.setListeners();
            }
        });
        this.listenersRemoved = false;
    }
}

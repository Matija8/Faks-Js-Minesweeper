'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */

//Global game variables. Set as desired.
const gNumOfRows = 16,
    gNumOfCols  = 16,
    gNumOfMines = 40,
    gCellSize = '35px',
    gFontSize = '22px',
    
    gImage_NotClicked   = 'url("./images/not_clicked.png")',
    gImage_LeftClick    = 'url("./images/left_clicked.png")',
    gImage_Flag         = 'url("./images/flag.png")',
    gImage_Highlight    = 'url("./images/highlighted.png")',
    gImage_Mine         = 'url("./images/mine.png")',
    gImage_FlaggedWrong  = 'url("./images/mine_wrong.png")',
    gImage_ClickedMine  = 'url("./images/mine_clicked.png")';


//Object constructors:
class Game {
    constructor(numOfRows, numOfCols, numOfMines){
        this.numOfRows          = numOfRows;
        this.numOfCols          = numOfCols;
        this.numOfMines         = numOfMines;
        this.numOfLeftClicked   = 0;
        this.numOfRightClicked  = 0;
        this.startTime          = null;
        this.firstClick         = true; // Mines are set only on the first left-click.
        this.winSemaphore       = true; // Hack to prevent multiple wins on empty cell recursive left-click.
        this.lossSemaphore      = true;
        this.mineNumberDisplay  = document.getElementById('mine-number-display');
        this.timerDisplay       = document.getElementById('timer');
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
        setInterval(refreshTimerWrapper, 1000);
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
        return (this.numOfLeftClicked === this.numOfCols * this.numOfRows - this.numOfMines) && this.winSemaphore;
    }


    gameWin(){
        if(this.winSemaphore){
            this.winSemaphore = false;
            setTimeout(() => {
                window.alert('You WON! :D');
                location.reload();
            } ,100);
        }
    }


    gameLoss(clickedMine){
        if(this.lossSemaphore){
            this.lossSemaphore = false;
            this.cellMatrixToList().forEach(cell => {
                if(cell.mineState === 'MINE!' && cell.clickState !== 'right-clicked'){
                    cell.css.backgroundImage = gImage_Mine;}
                else if(cell.clickState === 'right-clicked' && cell.mineState !== 'MINE!'){
                    cell.css.backgroundImage = gImage_FlaggedWrong;}
            });
            clickedMine.css.backgroundImage = gImage_ClickedMine;
            setTimeout(() => {
                window.alert('Sorry, you just lost :(');
                location.reload();
            } ,100);
        }
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

        //Setting cell css properties.
        this.css = this.item.style;
        this.css.width = this.css.height = gCellSize;
        this.css.fontSize = gFontSize;        
        this.css.backgroundImage = gImage_NotClicked;
        this.css.backgroundSize = 'contain';
        
        //Adding event listeners.
        this.item.addEventListener('mousedown', (event) => { this.mouseDown(event); });
        this.item.addEventListener('mouseup', (event) => { if(event.button === 1) this.midUp(); });
        this.item.addEventListener('contextmenu', (event) => { event.preventDefault(); });
        this.item.addEventListener('mouseenter', () => { this.mouseIn(); });
        this.item.addEventListener('mouseout', () => { this.mouseOut(); });
    }


    setAdjacentCells(){
        let [row, col]  = [this.row, this.col],
            leftCheck   = (col === 0)                ?   col : col-1,
            rightCheck  = (col === this.game.numOfCols-1) ?   col : col+1,
            topCheck    = (row === 0)                ?   row : row-1,
            bottomCheck = (row === this.game.numOfRows-1) ?   row : row+1;
            
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
        if(this.game.midDownFlag){
            return;
        }
        let game = this.game;
        if(this.clickState === 'not-clicked'){
            this.clickState = 'left-clicked';
            if(game.firstClick){
                game.firstClick = false;
                game.setRandomMines(this);
                this.game.startTimer();
            }
            if(this.mineState === 'MINE!'){
                game.gameLoss(this);
            }
            else {
                game.numOfLeftClicked++;
                this.item.style.background = 'grey';
                this.css.backgroundImage = gImage_LeftClick;
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
        if(this.game.midDownFlag){
            return;
        }
        if(this.clickState === 'not-clicked'){
            this.clickState = 'right-clicked';
            //this.item.innerHTML = '🚩';
            this.css.backgroundImage = gImage_Flag;
            game.numOfRightClicked++;
            game.refreshFlagNumberDisplay();
        }
        else if(this.clickState === 'right-clicked'){
            this.clickState = 'not-clicked';
            //this.item.innerHTML = '';
            this.css.backgroundImage = gImage_NotClicked;
            game.numOfRightClicked--;
            game.refreshFlagNumberDisplay();
        }
    }


    midDown(){
        if(this.clickState === 'left-clicked'){
            let mineCount = this.countMines();
            this.adjacent.forEach( adj => {
                if(adj.clickState === 'right-clicked'){
                    mineCount--;
                }
            });
            if(mineCount === 0){
                this.adjacent.forEach(cell => cell.leftDown() );
            }
        }
        this.game.midDownFlag = true;
        this.mouseIn();
    }


    mouseIn(){
        if(this.game.midDownFlag){
            this.highlight();
        }
    }


    mouseOut(){
        if(this.game.midDownFlag){
            this.unHighlight();
        }
    }


    midUp(){
        this.unHighlight();
        this.game.midDownFlag = false;
    }


    highlight(){
        if(this.clickState === 'not-clicked'){
            this.css.backgroundImage = gImage_Highlight;
        }
        this.adjacent.forEach( adj => {
            if(adj.clickState === 'not-clicked'){
                adj.css.backgroundImage = gImage_Highlight;
            }
        });
    }


    unHighlight(){
        if(this.clickState === 'not-clicked'){
            this.css.backgroundImage = gImage_NotClicked;
        }
        this.adjacent.forEach( adj => {
            if(adj.clickState === 'not-clicked'){
                adj.css.backgroundImage = gImage_NotClicked;
            }
        });
    }
}// class Cell


const game = new Game(gNumOfRows, gNumOfCols, gNumOfMines);

function refreshTimerWrapper() { game.refreshTimer(); }
document.getElementById('new-game').addEventListener('click', (event) => { location.reload(); });
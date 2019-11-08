'use strict';
/* jshint browser: true */
/* jshint node: true */
/*jshint esversion: 6 */


class Cell {
    constructor(row, col, item, game){
        this.row        = row;
        this.col        = col;
        this.item       = item; //DOM object reference.
        this.game       = game; //Game object.
        this.style      = game.style;
        this.mineState  = 'no-mine'; // {'no-mine', 'MINE!'} 
        this.clickState = 'not-clicked'; // {'not-clicked', 'left-clicked', 'right-clicked'}
        this.adjacent   = [];

        //Setting cell css properties.
        this.css = this.item.style;
        this.css.width = this.css.height = this.style.cellSize;
        this.css.fontSize = this.style.fontSize;
        this.css.backgroundImage = this.style.image_NotClicked;
        this.css.backgroundSize = 'contain';
        
        //Adding event listeners.
        this.listenerFunctions = [];
        this.listenerFunctions.push([ 'mousedown',   event => { this.mouseDown(event); } ]);
        this.listenerFunctions.push([ 'mouseup',     event => { if(event.button === 1) this.midUp(); } ]);
        this.listenerFunctions.push([ 'mouseenter',  ()    => { this.mouseIn();  } ]);
        this.listenerFunctions.push([ 'mouseout',    ()    => { this.mouseOut(); } ]);
        this.listenerFunctions.push([ 'contextmenu', event => { event.preventDefault(); } ]);
        this.listenerFunctions.forEach(pair => { this.item.addEventListener(...pair);});
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
                this.leftDown();  break;
            case 1:
                this.midDown();   break;
            case 2:
                this.rightDown(); break;
        }
    }


    leftDown(){
        if(this.game.midDownFlag){
            return;
        }
        if(this.clickState === 'not-clicked'){
            this.clickState = 'left-clicked';
            if(this.game.firstClick){
                this.game.firstClick = false;
                this.game.setRandomMines(this);
                this.game.startTimer();
            }
            if(this.mineState === 'MINE!'){
                this.game.gameLoss(this);
            }
            else {
                this.game.numOfLeftClicked++;
                this.item.style.background = 'grey';
                this.css.backgroundImage = this.style.image_LeftClick;
                let mineCount = this.countMines();
                if(mineCount === 0){
                    this.adjacent.forEach(cell => cell.leftDown() );
                }
                else {
                    this.item.innerHTML = mineCount;
                }
                if(this.game.winCondition()){
                    this.game.gameWin();
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
            this.css.backgroundImage = this.style.image_Flag;
            this.game.numOfRightClicked++;
            this.game.refreshFlagNumberDisplay();
        }
        else if(this.clickState === 'right-clicked'){
            this.clickState = 'not-clicked';
            //this.item.innerHTML = '';
            this.css.backgroundImage = this.style.image_NotClicked;
            this.game.numOfRightClicked--;
            this.game.refreshFlagNumberDisplay();
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
            this.css.backgroundImage = this.style.image_Highlight;
        }
        this.adjacent.forEach( adj => {
            if(adj.clickState === 'not-clicked'){
                adj.css.backgroundImage = this.style.image_Highlight;
            }
        });
    }


    unHighlight(){
        if(this.clickState === 'not-clicked'){
            this.css.backgroundImage = this.style.image_NotClicked;
        }
        this.adjacent.forEach( adj => {
            if(adj.clickState === 'not-clicked'){
                adj.css.backgroundImage = this.style.image_NotClicked;
            }
        });
    }

    removeListeners(){
        this.listenerFunctions.forEach(pair => {
            this.item.removeEventListener(...pair);
        });
    }
}

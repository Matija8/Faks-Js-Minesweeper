'use strict';

class Style {
    constructor(cellSize = '35px', fontSize = '22px'){
        this.cellSize               = cellSize;
        this.fontSize               = fontSize;
        this.image_NotClicked      = 'url("./images/not_clicked.png")';
        this.image_LeftClick       = 'url("./images/left_clicked.png")';
        this.image_Flag            = 'url("./images/flag.png")';
        this.image_Highlight       = 'url("./images/highlighted.png")';
        this.image_Mine            = 'url("./images/mine.png")';
        this.image_FlaggedWrong    = 'url("./images/mine_wrong.png")';
        this.image_ClickedMine     = 'url("./images/mine_clicked.png")';
        this.menuItemDisplay       = 'inline-block';
    }
}

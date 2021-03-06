// Ruggles Rect
// A small Rubik's cube spin off
// By Nicholas Ruggles

// Start main IIFE
(function () {

"use strict";


// --- Functions ---

function randomizeBoard() {
    var randomInput = document.getElementById('random-moves');

    // Force natural number
    var moves = Math.floor(randomInput.value);
    if (moves<1)
        moves = 1;
    
    // Set form value to corrected version
    randomInput.value = moves;

    game.RugRect.randomizeBoard(moves);

}

function generateBoard() {
    var heightInput = document.getElementById('generate-height');
    var widthInput = document.getElementById('generate-width');
    
    // Force height/width to be integers
    var y = Math.floor(heightInput.value);
    var x = Math.floor(widthInput.value);

    // Force height/width to be greater than zero
    if (y<1)
        y = 1;
    if (x<1)
        x = 1;

    // Set form values to corrected height width
    // This suggests to user that these are allowed values
    heightInput.value = y;
    widthInput.value = x;

    game.RugRect = new game.RugglesRect(x, y);
}

function canvasToTile(canvasX, canvasY, tileI, tileJ) {
    // Takes canvas coordinates and board position
    // returns pixel coordinates relative to given tile

    var x = canvasX - game.BOARD_X - 
        (game.INTERNAL_WIDTH + game.BOARD_GAP)*tileI;
    var y = canvasY - game.BOARD_Y -  
        (game.INTERNAL_HEIGHT + game.BOARD_GAP)*tileJ;

    return {
        x: x,
        y: y
    };
}

function isInternal (tile) {
    return tile instanceof game.Internal;
}

function isEdge (tile) {
    return tile instanceof game.Edge;
}

function isHorizEdge (tile) {
    return isEdge(tile) && (tile.direction == 'left' || 
                            tile.direction == 'right');
}

function isVertEdge (tile) {
    return isEdge(tile) && (tile.direction == 'up' ||
                            tile.direction == 'down');
}

function createInternal () {
    var internal = new game.Internal(game.FRONT_COLOR, game.BACK_COLOR);
    return internal;
}

function createEdge (direction) {
    if (direction == 'left')
        var color = game.LEFT_COLOR;
    else if (direction == 'right')
        var color = game.RIGHT_COLOR;
    else if (direction == 'up')
        var color = game.UP_COLOR;
    else
        var color = game.DOWN_COLOR;
    var edge = new game.Edge(color, direction);
    return edge;
}

// Update functions
function update() {

    if (game.clicked) {
        game.clicked = false;

        //printClick()
        var collision = game.RugRect.collide(game.clickedX, game.clickedY);
        if (collision)
            rotRect(collision);
    }

}

function rotRect(collision) {
    var x = collision.x;
    var y = collision.y;
    var tile = collision.tile;

    if (tile instanceof game.Edge) {
        if (tile.direction == 'up' ||
            tile.direction == 'down') {
            game.RugRect.rotColumn(x);
        }       
        if (tile.direction == 'left' ||
            tile.direction == 'right') {
            game.RugRect.rotRow(y);
        }
    }
    
}

function printClick() {
    console.log("("+game.clickedX+", "+game.clickedY+")");
}

function getMouseCoords(evt) {
    var rect = game.canvas.getBoundingClientRect();
    //var root = document.documentElement;

    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;

    var scale = game.scaleFactor;

    var mousePos = {x: mouseX/scale, y: mouseY/scale};

    //console.log("event coords: ("+evt.clientX+", "+evt.clientY+")");
    //console.log("window coords: ("+rect.left+", "+rect.top+")");
    //console.log("scroll offset: ("+root.scrollLeft+", "+root.scrollTop+")");

    return mousePos
}

function updateMouse(evt) {
    var mousePos = getMouseCoords(evt);
    game.mouseX = mousePos.x
    game.mouseY = mousePos.y
}

function mouseClick(evt) {
    var mousePos = getMouseCoords(evt);
    game.clickedX = mousePos.x;
    game.clickedY = mousePos.y;
    game.clicked = true;
}

// Drawing Functions
function render(){

    game.scaleFactor = getScaleFactor();
    //console.log(game.scaleFactor);
    game.canvasContext.scale(game.scaleFactor, game.scaleFactor);

    drawBackground(game.BG_COLOR);
    game.RugRect.draw(game.BOARD_X, game.BOARD_Y);
}

function drawRect(color, x, y, width, height) {
    game.canvasContext.fillStyle = color;
    game.canvasContext.fillRect(x, y, width, height);
}

function drawBackground(color) {
    var scale = game.scaleFactor;
    drawRect(color, 0, 0, game.canvas.width/scale, game.canvas.height/scale);
}

function drawMousePos() {
    game.canvasContext.font = "12px Arial";
    game.canvasContext.fillStyle = 'purple';
    game.canvasContext.fillText("(" + Math.floor(game.mouseX) + ", " + Math.floor(game.mouseY) + ")", game.mouseX, game.mouseY);
}

function positionCube() {
    game.BOARD_X = game.INTERNAL_SIZE;
    game.BOARD_Y = game.INTERNAL_SIZE;
}

function resizeCanvas() {
    game.canvas.width = window.innerWidth*9/10;
    game.canvas.height = window.innerHeight*7/10;
}

function getScaleFactor() {

    // Calculate unscaled cube size
    var numCols = game.RugRect.board[0].length;
    var sizeX = (game.INTERNAL_SIZE + game.BOARD_GAP)*(numCols + 1) + 2*game.EDGE_LENGTH;

    var numRows = game.RugRect.board.length;
    var sizeY = (game.INTERNAL_SIZE + game.BOARD_GAP)*(numRows + 1)  + 2*game.EDGE_LENGTH;

    //console.log(sizeY);

    // Calculate ratio of size to fillable canvas
    var filledCanvasX = (game.canvas.width)*1;
    var filledCanvasY = (game.canvas.height)*1;

    var ratioX = filledCanvasX/sizeX;
    var ratioY = filledCanvasY/sizeY;

    //console.log("("+ratioX+", "+ratioY+")");
   
    // The minimum of the two ratios is the scale factor.
    var scaleFactor = Math.min(ratioX, ratioY);

    return scaleFactor
}

// Testing & Debug Functions
function testDraw() {
//    game.testBoard.draw(50, 50);
    drawMousePos();
}

function testInit() {
    game.testInt = new game.Internal('white', 'yellow');
    console.log("game.testInt Initiated");

    game.testEdge = createEdge('left');
    console.log("game.testEdge Initiated");

    game.testBoard = new game.RugglesRect(5,6);
    console.log("game.testBoard Initiated");

/*
    game.testBoard.rotColumn(3);
    game.testBoard.rotColumn(4);
    game.testBoard.rotRow(4);
    game.testBoard.rotRow(3);  */
}

// --- Main Loop ---

function gameLoop() {
    // --- Call Frame ---
    window.requestAnimationFrame( gameLoop );
    //console.log("I am the main loop");
    
    // --- Update ---
    update();


    // --- Render ---
    resizeCanvas();
    positionCube();
    render();


    // Testing
    testDraw();
}

//  --- window.onload ---
window.onload = function() {

// Game is our global namespace
window.game = {};

// --- Objects ---

// Ruggles Rect object
game.RugglesRect = function (x, y) {

    // Generates x by y gameboard
    this.generate(x,y);

}

game.RugglesRect.prototype.draw = function(boardX,boardY) {

    
    for (var i=0; i<this.board.length; i++) {
        for (var j=0; j<this.board[i].length; j++) {
            var x = boardX + (game.INTERNAL_WIDTH + game.BOARD_GAP)*j;
            var y = boardY + (game.INTERNAL_HEIGHT + game.BOARD_GAP)*i;
            for (var k=0; k<this.board[i][j].length; k++) {
                this.board[i][j][k].draw(x, y);
            }
        }
    }
}

game.RugglesRect.prototype.generate = function(x, y) {

    // Initialize board
    this.board = new Array(y);
    for (var i=0; i<y; i++) { 
        this.board[i] = new Array(x);
        for (var j=0; j<x; j++) {
            this.board[i][j] = new Array();

            // Add internal pieces
            this.board[i][j].push(createInternal());
            // Add edge pieces
            if (i == 0)
                this.board[i][j].push(createEdge('up'));
            if (i == y-1)
                this.board[i][j].push(createEdge('down'));
            if (j == 0)
                this.board[i][j].push(createEdge('left'));
            if (j == x-1)
                this.board[i][j].push(createEdge('right'));
        }
    }
}

game.RugglesRect.prototype.flipRow = function(y) {
    
    // Loop thru every tile in the yth row, flip each internal
    // and horizontal edge
    for (var i=0; i<this.board[y].length; i++) {
        for (var j=0; j<this.board[y][i].length; j++) {
            if (isInternal(this.board[y][i][j]) ||
                isHorizEdge(this.board[y][i][j]) )
                this.board[y][i][j].flip();
        }
    }
}

game.RugglesRect.prototype.flipColumn = function(x) {
    
    // Loop thru every tile in the xth column
    // flip every internal and vertical edge
    for (var i=0; i<this.board.length; i++) {        
        for (var j=0; j<this.board[i][x].length; j++) {
            if (isInternal(this.board[i][x][j]) ||
                isVertEdge(this.board[i][x][j])  )
                this.board[i][x][j].flip();
        }
    }
}

game.RugglesRect.prototype.swap = function(x1, y1, x2, y2) {
    var tileHold = this.board[y1][x1];
    this.board[y1][x1] = this.board[y2][x2];
    this.board[y2][x2] = tileHold
}

game.RugglesRect.prototype.swapColumn = function(x) {
    // Number of swaps
    var n = Math.floor(this.board.length/2);
    var j;
    for (var i=0; i<n; i++) {
        j = this.board.length - i - 1;
        this.swap(x, i, x, j);
    }
}

game.RugglesRect.prototype.swapRow = function(y) {
    // Number of swaps
    var n = Math.floor(this.board[y].length/2);
    var j;
    for (var i=0; i<n; i++) {
        j = this.board[y].length - i - 1;
        this.swap(i, y, j, y);
    }
}

game.RugglesRect.prototype.rotColumn = function(x) {
    this.flipColumn(x);
    this.swapColumn(x);
}

game.RugglesRect.prototype.rotRow = function(y) {
    this.flipRow(y);
    this.swapRow(y);
}

game.RugglesRect.prototype.collide = function(canvasX, canvasY) {

    var tileCoord;
    // Loop through every board position
    for (var i=0; i<this.board.length; i++) {
        for (var j=0; j<this.board[i].length; j++) {
            tileCoord = canvasToTile(canvasX, canvasY, j, i);
            //console.log("("+tileCoord.x+", "+tileCoord.y+")");
            
            // Loop thru every tile in each space
            for (var k=0; k<this.board[i][j].length; k++) {
                if (this.board[i][j][k].collide(tileCoord.x, tileCoord.y)) {
                    // console.log("("+j+", "+i+")");
                    // Return piece type, along with board coordinates
                    var collision = {x: j, y: i, tile: this.board[i][j][k]};
                    return collision;
                }
            }
        }
    }
    return null;
}

game.RugglesRect.prototype.randomMove = function() {
    var coinFlip = Math.random();
    if (coinFlip > 0.5) {
        var randomRow = Math.floor(Math.random() * this.board.length);
        this.rotRow(randomRow);
    }
    else {
        var randomColumn = Math.floor(Math.random() * this.board[0].length);
        this.rotColumn(randomColumn);
    }
}

game.RugglesRect.prototype.randomizeBoard = function(moves) {
    for (var i=0; i<moves; i++)
        this.randomMove();
}


// Tile object
game.Tile = function (color) {
    this.color = color;
    this.rect = null; // Mandatory, but defined in children
};

game.Tile.prototype.draw = function (canvasX,canvasY) {
    var x = canvasX + this.rect.x;
    var y = canvasY + this.rect.y;
    drawRect(this.color, x, y, this.rect.width, this.rect.height);
}

game.Tile.prototype.collide = function (relX, relY) {
    // Returns true if relX, relY within rect
    if (relX >= this.rect.x  &&
        relX <= this.rect.x + this.rect.width) {
        if (relY >= this.rect.y &&
            relY <= this.rect.y + this.rect.height) {
            return true;
        }
    }
    return false;
}

// Internal object - child of Tile
game.Internal = function (color, altColor) {
    game.Tile.call(this, color);
    this.altColor = altColor;

    this.rect = {
    x: 0,
    y: 0,
    width: game.INTERNAL_WIDTH,
    height: game.INTERNAL_HEIGHT,
    };
}

game.Internal.prototype = Object.create(game.Tile.prototype);
game.Internal.prototype.constructor = game.Internal;

game.Internal.prototype.flip = function () {
    var colorHolder = this.color;
    this.color = this.altColor;
    this.altColor = colorHolder;
}   

// Edge Object - child of Tile
game.Edge = function(color, direction) {
    game.Tile.call(this, color);

    //orientation can be either 
    //'up', 'down', 'left', or 'right'
    this.direction = direction;

    this.buildRect();
}

game.Edge.prototype = Object.create(game.Tile.prototype);
game.Edge.prototype.constructor = game.Edge;

game.Edge.prototype.buildRect = function() {
    if (this.direction == 'left' || this.direction == 'right') {
        var width = game.EDGE_THICKNESS;
        var height = game.EDGE_LENGTH;
        var adjY = 0;
        if (this.direction == 'left') {
            var adjX = -(game.INTERNAL_WIDTH/2 + game.EDGE_PADDING);
        } else {
            var adjX = +(game.INTERNAL_WIDTH/2 + game.EDGE_PADDING);
        }

    }
    if (this.direction == 'up' || this.direction == 'down') {
        var height = game.EDGE_THICKNESS;
        var width = game.EDGE_LENGTH;
        var adjX = 0;
        if (this.direction == 'up') {
            var adjY = -(game.INTERNAL_HEIGHT/2 + game.EDGE_PADDING);
        } else {
            var adjY = +(game.INTERNAL_HEIGHT/2 + game.EDGE_PADDING);
        }
    }
 
    var centerX = game.INTERNAL_WIDTH/2;
    var centerY = game.INTERNAL_HEIGHT/2;

    var x = centerX - width/2 + adjX;
    var y = centerY - height/2 + adjY;

    this.rect = {
        x: x,
        y: y,
        width: width,
        height: height
    };    
}

game.Edge.prototype.flip = function() {
    if (this.direction == 'up')
        this.direction = 'down';
    else if (this.direction == 'down')
        this.direction = 'up';
    else if (this.direction == 'left')
        this.direction = 'right';
    else 
        this.direction = 'left';

    this.buildRect();
}

// --- Initialize Variables ---
game.BG_COLOR = 'black';

game.INTERNAL_SIZE = 50;
game.INTERNAL_WIDTH = game.INTERNAL_SIZE;
game.INTERNAL_HEIGHT = game.INTERNAL_SIZE;

game.EDGE_LENGTH = game.INTERNAL_SIZE;
game.EDGE_THICKNESS = 30;
game.EDGE_PADDING = 20;

game.BOARD_GAP = 5;

game.FRONT_COLOR = 'white';
game.BACK_COLOR = 'yellow';
game.UP_COLOR = 'red';
game.DOWN_COLOR = 'orange';
game.LEFT_COLOR = 'blue';
game.RIGHT_COLOR = 'green';

game.scaleFactor = 1;

// Game Canvas
game.canvas = document.getElementById('gameCanvas');
game.canvasContext = game.canvas.getContext('2d');
resizeCanvas();

game.BOARD_EDGE_DIST = 0.15;

positionCube();

//game.canvasContext.scale(1.5, 1.5);

// HTML Forms
game.generateButton = document.getElementById('generate-button');
game.randomizeButton = document.getElementById('randomize-button');

// Initialize Objects
game.RugRect = new game.RugglesRect(3, 3);
game.RugRect.randomizeBoard(50);


// Testing
//testInit();

// Grab & update mouse movement
game.mouseX = 0;
game.mouseY = 0;
game.canvas.onmousemove = function(evt) {updateMouse(evt)};

game.clicked = false;
game.clickedX = 0;
game.clickedY = 0;
game.canvas.onclick = function(evt) {mouseClick(evt)}; 

// Grab form input
game.generateButton.onclick = function() {generateBoard()};
game.randomizeButton.onclick = function() {randomizeBoard()};

// Insert html event listeners

// --- Run Main Loop ---

gameLoop();

// End window.onload
};

// End IIFE
})();


// Ruggles Rect
// A small Rubik's cube spin off
// By Nicholas Ruggles

// Start main IIFE
(function () {

"use strict";


// --- Functions ---
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

// Drawing Functions
function render(){
    drawBackground(game.BG_COLOR);
}

function drawRect(color, x, y, width, height) {
    game.canvasContext.fillStyle = color;
    game.canvasContext.fillRect(x, y, width, height);
}

function drawBackground(color) {
    drawRect(color, 0, 0, game.canvas.width, game.canvas.height);
}

// Testing & Debug Functions
function testDraw() {
//    game.testInt.draw(50, 50);
//    game.testEdge.draw(50, 50);
//    game.testBoard.board[1][1][0].draw(100, 100)
    game.testBoard.draw(50, 50);
}

function testInit() {
    game.testInt = new game.Internal('white', 'yellow');
    console.log("game.testInt Initiated");

//    game.testEdge = new game.Edge('red', 'up');
    game.testEdge = createEdge('up');
    console.log("game.testEdge Initiated");

    game.testBoard = new game.RugglesRect(5,4);
    console.log("game.testBoard Initiated");
}

// --- Main Loop ---

function gameLoop() {
    // --- Call Frame ---
    window.requestAnimationFrame( gameLoop );
    //console.log("I am the main loop");
    
    // --- Input ---


    // --- Update ---

    // --- Render ---
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

// Tile object
game.Tile = function (color) {
    this.color = color;
    this.rect = null; // Mandatory, but defined in children
};

game.Tile.prototype.draw = function (canvasX,canvasY) {
    var x = canvasX - this.rect.x;
    var y = canvasY - this.rect.y;
    drawRect(this.color, x, y, this.rect.width, this.rect.height);
}

game.Tile.prototype.collide = function (relX, relY) {
    // Currently a placeholder, will add later
    // Returns true if relX, relY within rect
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
            var adjX = (game.INTERNAL_WIDTH/2 + game.EDGE_PADDING);
        } else {
            var adjX = -(game.INTERNAL_WIDTH/2 + game.EDGE_PADDING);
        }

    }
    if (this.direction == 'up' || this.direction == 'down') {
        var height = game.EDGE_THICKNESS;
        var width = game.EDGE_LENGTH;
        var adjX = 0;
        if (this.direction == 'up') {
            var adjY = (game.INTERNAL_HEIGHT/2 + game.EDGE_PADDING);
        } else {
            var adjY = -(game.INTERNAL_HEIGHT/2 + game.EDGE_PADDING);
        }
    }
 
    var centerX = -game.INTERNAL_WIDTH/2;
    var centerY = -game.INTERNAL_HEIGHT/2;

    var x = centerX + width/2 + adjX;
    var y = centerY + height/2 + adjY;

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

// --- Initialize variables ---
game.BG_COLOR = 'black';

game.INTERNAL_WIDTH = 40;
game.INTERNAL_HEIGHT = 40;

game.EDGE_LENGTH = 40;
game.EDGE_THICKNESS = 5;
game.EDGE_PADDING = 10;

game.BOARD_GAP = 5;

game.FRONT_COLOR = 'white';
game.BACK_COLOR = 'yellow';
game.UP_COLOR = 'red';
game.DOWN_COLOR = 'orange';
game.LEFT_COLOR = 'blue';
game.RIGHT_COLOR = 'green';

// Game Canvas
game.canvas = document.getElementById('gameCanvas');
game.canvasContext = game.canvas.getContext('2d');

// Initialize Objects

// Testing
testInit();

// --- Run Main Loop ---

gameLoop();

// End window.onload
};

// End IIFE
})();


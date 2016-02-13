// Ruggles Rect
// A small Rubik's cube spin off
// By Nicholas Ruggles

// Start main IIFE
(function () {

"use strict";


// --- Functions ---

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
    game.testInt.draw(50, 50);
    game.testEdge.draw(50, 50);
}

function testInit() {
    game.testInt = new game.Internal('white', 'yellow');
    console.log("game.testInt Initiated");

    game.testEdge = new game.Edge('red', 'up');
    console.log("game.testEdge Initiated");
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


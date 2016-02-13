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
    game.testTile.draw(50, 50);
}

function testInit() {
    game.testTile = new game.Internal('white', 'yellow');
    console.log("game.testTile Initiated");
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

// --- Initialize variables ---
game.BG_COLOR = 'black';

game.INTERNAL_WIDTH = 40;
game.INTERNAL_HEIGHT = 40;

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


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
    game.testTile.draw(50, 50);
}

function drawRect(color, x, y, width, height) {
    game.canvasContext.fillStyle = color;
    game.canvasContext.fillRect(x, y, width, height);
}

function drawBackground(color) {
    drawRect(color, 0, 0, game.canvas.width, game.canvas.height);
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

// Internal object - child of Tile
game.Internal = function (color) {
    game.Tile.call(this, color);

    this.rect = {
    x: 0,
    y: 0,
    width: game.INTERNAL_WIDTH,
    height: game.INTERNAL_HEIGHT,
    };
}

game.Internal.prototype = Object.create(game.Tile.prototype);
game.Internal.prototype.constructor = game.Internal;

// --- Initialize variables ---
game.BG_COLOR = 'black';

game.INTERNAL_WIDTH = 10;
game.INTERNAL_HEIGHT = 10;

// Game Canvas
game.canvas = document.getElementById('gameCanvas');
game.canvasContext = game.canvas.getContext('2d');

// Initialize Objects
game.testTile = new game.Internal('white');

// --- Run Main Loop ---

gameLoop();

// End window.onload
};

// End IIFE
})();


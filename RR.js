// Ruggles Rect
// A small Rubik's cube spin off
// By Nicholas Ruggles

// Start main IIFE
(function () {

"use strict";

// --- Objects ---

// --- Functions ---

// Drawing Functions
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
    drawBackground('black');
}

//  --- window.onload ---
window.onload = function() {

// Game is our global namespace
window.game = {};

// --- Initialize variables ---

// Game Canvas
game.canvas = document.getElementById('gameCanvas');
game.canvasContext = game.canvas.getContext('2d');

// --- Run Main Loop ---

gameLoop();

// End window.onload
};

// End IIFE
})();


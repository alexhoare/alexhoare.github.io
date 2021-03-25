console.log(content);

introStage = new Stage("intro");

player = new Player(0, 11 * tileHeight, 1.5 * tileWidth, tileHeight * 3, "grounded");

game = new Game(player, introStage);
game.resize();
game.draw();

document.addEventListener("keydown", keydown, false);
document.addEventListener("keyup", keyup, false);
game.canvas.addEventListener("click", mouseClick, false);

function keydown(e) {
    game.keydown(e);
}

function keyup(e) {
    game.keyup(e);
}

function mouseClick(e) {
    game.mouseClick(e.pageX, e.pageY);
}

id = setInterval(gameLoop, 5);


function gameLoop() {
    game.clearContext();
    game.player.move();
    game.checkForCollision(game.player);
    game.clearContext();
    game.resize();
    game.draw();
}

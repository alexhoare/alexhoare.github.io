console.log(content);

introStage = new Stage("intro");

player = new Player(0, 11 * tileHeight, 1.5 * tileWidth, tileHeight * 3, "grounded");

game = new Game(player, introStage);
game.resize();
game.draw();

document.addEventListener("keydown", keydown, true);
document.addEventListener("keyup", keyup, true);

function keydown(e) {
    game.keydown(e);
}

function keyup(e) {
    game.keyup(e);
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

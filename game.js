class Game {
    constructor(player, stage) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        this.context.webkitImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = true;

        this.player = player;
        this.stage = stage;


        this.personalAd = false;
    }
    draw() {

        this.stage.draw(this.context);
        if (!this.personalAd) {
            this.player.draw(this.context);
        }
    }
    resize() {
        var windowHeight = document.documentElement.clientHeight - 20;
        var windowWidth  = document.documentElement.clientWidth - 20;
        // console.log(windowHeight, windowWidth);

        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;
        // console.log(this.canvas);

        var x = windowWidth / (tileWidth * 30), y = windowHeight / (tileHeight * 15);
        // console.log(x, y);
        this.context.scale(x, y);
    }
    checkForCollision() {
        if (this.personalAd) {
            return;
        }
        this.stage.checkForCollision(this.player);
        // console.log(player.x);
        if (this.stage.collisionState == "incrementStage") {
            this.incrementStage();
            // return;
        }
        // else if (this.player.x < 0) {
        //     this.decrementStage();
        // }
        else if (this.player.y > 15 * tileHeight) {
            this.player.x = this.stage.spawnPoint[0] * tileWidth;
            this.player.y = this.stage.spawnPoint[1] * tileHeight;
            this.player.dy = 0;
        }
    }
    keydown(e) {
        if (this.personalAd) {
            return;
        }
        switch (e.key) {
            case "ArrowLeft":
                player.movingLeft = true;
                break;
            case "ArrowRight":
                player.movingRight = true;
                break;
            case "ArrowUp":
                this.player.jump(-16, this.stage.name == "country");
                break;
            default:
                console.log(e.key + " pressed!");
        }
    }
    keyup(e) {
        if (this.personalAd) {
            return;
        }
        switch (e.key) {
            case "ArrowLeft":
                player.movingLeft = false;
                break;
            case "ArrowRight":
                player.movingRight = false;
                break;
            default:
                console.log(e.key + " up");
        }
    }
    clearContext() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    incrementStage() {
        var stageIndex = stageCycle.indexOf(this.stage.name);
        console.log("stage switched to " + stageCycle[stageIndex + 1]);
        this.stage = new Stage(stageCycle[stageIndex + 1]);


        if (this.stage.name == "personalAd") {
            this.personalAd = true;
            this.player.exists = false;
            return;
        }

        this.player.x = this.stage.spawnPoint[0] * tileWidth;
        this.player.y = this.stage.spawnPoint[1] * tileHeight;
        this.player.dy = 0;

        if (this.stage.name == "country") {
            console.log("switched to country stage");
            this.player.ddy = 0.06;
            this.player.jumping = false;
        }
        else {
            this.player.ddy = 0.4;
        }
    }
    decrementStage() {
        var stageIndex = stageCycle.indexOf(this.stage.name);
        if (stageIndex == 0) {
            return;
        }
        this.player.x = 30 * tileWidth - this.player.width;
        console.log("stage switched to " + stageCycle[stageIndex - 1]);
        this.stage = new Stage(stageCycle[stageIndex - 1]);
    }
}

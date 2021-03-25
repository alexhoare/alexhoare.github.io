var playerSpriteFrames = 6;
var spriteWidth = 80;

class Player {
    constructor(x, y, width, height, state) {
        this.x = x;
        this.y = y; 
        this.dy = 0;
        this.ddy = 0.4;
        this.width = width;
        this.height = height;

        this.jumping = false;
        this.onLadder = false;

        this.movingRight = false;
        this.movingLeft = false;

        this.animationState = "none";
        this.animationFrame = 0;

        this.animationSpacing = 10;
        this.animationSpacingCounter = 0;

        this.exists = true;

        this.slammingGround = false;
    }
    // move is going to be called by game to use gravity
    move() {
        if (!this.exists) {
            return;
        }
        if (this.movingLeft && !this.movingRight) {
            this.x -= 3;
            if (this.animationState != "movingLeft") {
                this.animationFrame = 0;
                this.animationSpacingCounter = 0;
            }
            this.animationState = "movingLeft";
            if (this.animationSpacingCounter >= this.animationSpacing) {
                this.animationSpacingCounter = 0;
                this.animationFrame = (this.animationFrame + 1) % playerSpriteFrames;
            }
            this.animationSpacingCounter += 1;
        }
        else if (this.movingRight && !this.movingLeft) {
            this.x += 3;
            if (this.animationState != "movingRight") {
                this.animationFrame = 0;
                this.animationSpacingCounter = 0;
            }
            this.animationState = "movingRight";
            if (this.animationSpacingCounter >= this.animationSpacing) {
                this.animationSpacingCounter = 0;
                this.animationFrame = (this.animationFrame + 1) % playerSpriteFrames;
            }
            this.animationSpacingCounter += 1;
        }
        else {
            this.animationState = "none";
            this.animationFrame = 0;
            this.animationSpacingCounter = 0;
        }
        if (this.onLadder) {
            this.dy = -3;
            this.y += this.dy;
            return;
        }
        this.y += this.dy;
        this.dy += this.ddy;
    }
    draw(context) {
        if (!this.exists) {
            return;
        }
        if (this.y < 0) {
            // context.fillRect(Math.floor(this.x), 0, this.width, Math.max(0, this.height + this.y));
            var image = document.getElementById("playerStanding");
            context.drawImage(image, 0, -this.y, image.width, Math.max(0, image.height + this.y), Math.floor(this.x), 0, this.width, Math.max(0, this.height + this.y));
            // context.drawImage(image, this.x, this.y, this.widththis.height);
            return;
        }
        if (this.slammingGround) {
            var image = document.getElementById("playerLanding");
            context.drawImage(image, Math.floor(this.x), this.y, this.width, this.height);
            return;
        }




        switch (this.animationState) {
            case "movingRight":
                var sx = spriteWidth * this.animationFrame, sy = 0, sw = spriteWidth, sh = 115;
                var image = document.getElementById("playerMoving");
                context.drawImage(image, sx, sy, sw, sh, Math.floor(this.x), this.y, this.width, this.height);
                break;

            case "movingLeft":
                var sx = spriteWidth * this.animationFrame, sy = 0, sw = spriteWidth, sh = 115;
                var image = document.getElementById("playerMoving");
                var canvasWidth = 30 * tileWidth;
                context.save();
                context.translate(canvasWidth, 0);
                context.scale(-1, 1);
                context.drawImage(image, sx, sy, sw, sh, canvasWidth - Math.floor(this.x), this.y, -this.width, this.height);
                context.restore();
                break;

            case "none":
                var image = document.getElementById("playerStanding");
                context.drawImage(image, Math.floor(this.x), this.y, this.width, this.height);
                // context.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
                break;
                
        }
    }
    jump(initialVelocity, inWaterStage=false) {
        if (this.jumping) {
            return;
        }
        if (inWaterStage) {
            this.dy = initialVelocity / 3;
        }
        else {
            this.dy = initialVelocity;
        }
        this.jumping = true && !inWaterStage;
    }
    stopJumping() {
        this.jumping = false;
    }
}

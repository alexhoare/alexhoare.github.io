groundTiles = []

var tileWidth = 64, tileHeight = 64, tileSpacing = 4;


var collidableTiles = [2, 8, 9, 20, 21, 22, 47, 49, 50, 58, 59, 71, 78, 79, 89, 90, 91];

var stageCycle = ["intro", "self", "family", "country", "world", "ending", "personalAd"];
var spawnPoints = {
    "intro": [0, 11],
    "self": [0, 11],
    "family": [1, 13],
    "country": [0, 3],
    "world": [0, 7],
    "ending": [2, 11]
}

function rectOverlapsRect(x1, y1, width1, height1, x2, y2, width2, height2) {
    return (x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2);
}

function pointInRect(pointX, pointY, x, y, width, height) {
    var xInBounds = pointX >= x && pointX <= x + width;
    console.log(xInBounds);
    var yInBounds = pointY >= y && pointY <= y + height;
    console.log(yInBounds);
    return xInBounds && yInBounds;
}

class Stage {
    constructor(name) {
        this.name = name;

        if (name == "personalAd") {
            return;
        }

        this.tileMap = tileMaps[name];

        for (var i = 0; i < this.tileMap.length; i++) {
            for (var j = 0; j < this.tileMap[i].length; j++) {
                if (this.tileMap[i][j] == 8 || this.tileMap[i][j] == 9) {
                    console.log("mystery box at " + j + ", " + i);
                }
            }
        }

        this.spawnPoint = spawnPoints[name];
        this.width = this.tileMap.length * tileWidth;
        this.height = this.tileMap[0].length * tileHeight;
        this.tileImage = document.getElementById("tileImage");
        this.collisionState = "none";
        this.images = content[this.name];
        console.log(this.images);
    }
    draw(context) {
        var backgroundImage = document.getElementById(this.name + "Background");
        context.drawImage(backgroundImage, 0, 0, 30*tileWidth, 15*tileHeight);

        if (this.name == "personalAd") {
            return;
        }

        if (this.images != null) {
            for (var i = 0; i < this.images.length; i++) {
                if (this.images[i].visible) {
                    var image = document.getElementById(this.images[i]["name"] + "Content");
                    var dimensions = this.images[i]["dimensions"];
                    if (this.images[i]["name"] == "america") {
                        context.globalAlpha = 0.2;
                    }
                    context.drawImage(image, tileHeight * dimensions[0], tileWidth * dimensions[1], tileHeight * dimensions[2], tileWidth * dimensions[3]);
                    context.globalAlpha = 1;
                }
            }
        }

        for (var i = 0; i < this.tileMap.length; i++) {
            for (var j = 0; j < this.tileMap[i].length; j++) {
                var gid = this.tileMap[i][j];

                if (gid == 0) {
                    continue;
                }

                gid -= 1;

                var dx = j * tileWidth;
                var dy = i * tileHeight;
                
                var sx = (tileWidth + tileSpacing) * (gid % (this.tileImage.width / (tileWidth + tileSpacing)));
                var sy = (tileHeight + tileSpacing) * Math.floor(gid / (this.tileImage.width / (tileWidth + tileSpacing)));
                // console.log(sx, sy);

                // console.log(sx, sy, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);

                context.drawImage(this.tileImage, sx, sy, tileWidth, tileHeight, dx, dy, tileWidth, tileHeight);
                // context.strokeRect(dx, dy, tileWidth, tileHeight);

            }
        }
    }
    checkForCollision(player) {
        var minRow = Math.max(Math.floor(player.y / tileHeight), 0), maxRow = Math.ceil((player.y + player.height) / tileHeight);
        var minCol = Math.max(Math.floor(player.x / tileWidth), 0), maxCol = Math.ceil((player.x + player.width) / tileWidth);

        this.collisionState = "none";
        for (var i = 0; i < stageEndPoints[this.name].length; i++) {
            var tileX = stageEndPoints[this.name][i][0] * tileHeight, tileY = stageEndPoints[this.name][i][1] * tileWidth;
            if (rectOverlapsRect(player.x, player.y, player.width, player.height, tileX, tileY, tileWidth, tileHeight)) {
                // console.log(player + ", (" + tileX + ", " + tileY + ")");
                this.collisionState = "incrementStage";
                // debugger;
            }
        }

        player.onLadder = false;
        // console.log(minCol, minRow);
        for (var i = minRow; i < maxRow && i < this.tileMap.length; i++) {
            for (var j = minCol; j < maxCol && j < this.tileMap[i].length; j++) {
                var tileX = j * tileWidth, tileY = i * tileHeight;

                if (this.tileMap[i][j] == 86 && rectOverlapsRect(player.x, player.y, player.width, player.height, tileX, tileY, tileWidth, tileHeight)) {
                    player.onLadder = true;
                    continue;
                }

                // console.log(this.images);
                // debugger;
                var isImage = false;
                var imageIndex = -1;
                if (this.images != null) {
                    for (var k = 0; k < this.images.length; k++) {
                        // console.log(this.images[k]["hitbox"]);
                        // console.log(i, j);
                        // debugger;
                        if (this.images[k]["hitbox"][0] == j && this.images[k]["hitbox"][1] == i) {
                            // console.log("player touched image hitbox at ", i, j);
                            isImage = true;
                            imageIndex = k;
                        }
                    }
                }

                if (isImage || (collidableTiles.includes(this.tileMap[i][j]) && rectOverlapsRect(player.x, player.y, player.width, player.height, tileX, tileY, tileWidth, tileHeight))) {
                    var xOverlap = 0;
                    if (player.x > tileX) {
                        xOverlap = player.x - (tileX + tileWidth);
                    }
                    else {
                        xOverlap = tileX - (player.x + player.width);
                    }
                    var yOverlap = 0;
                    if (player.y > tileY) {
                        yOverlap = player.y - (tileY + tileHeight);
                    }
                    else {
                        yOverlap = tileY - (player.y + player.height);
                    }
                    if (xOverlap >= yOverlap) {
                        if (player.x < tileX) {
                            player.x += xOverlap;
                        }
                        else {
                            player.x -= xOverlap;
                        }
                    }
                    else {
                        if (player.y < tileY) {
                            if (player.slammingGround) {
                                if (isImage) {
                                    console.log("collided with image hitbox at " + this.images[imageIndex]["hitbox"]);
                                    this.images[imageIndex]["visible"] = true;
                                }
                                console.log("player slammed ground");
                                // player.slammingGround = false;
                            }
                            player.y += yOverlap;
                            player.stopJumping();
                        }
                        else {
                            if (isImage) {
                                console.log("collided with image hitbox at " + this.images[imageIndex]["hitbox"]);
                                this.images[imageIndex]["visible"] = true;
                                // continue;
                            }
                            player.y -= yOverlap;
                        }
                        player.dy = 0;
                        // console.log("player collided with platform");
                    }
                }
            }
        }
    }
    tileToURL(tileRow, tileCol) {
        if (this.images == null) {
            return "";
        }
        for (var i = 0; i < this.images.length; i++) {
            var dimensions = this.images[i]["dimensions"];
            if (pointInRect(tileCol, tileRow, dimensions[0], dimensions[1], dimensions[2], dimensions[3])) {
                return this.images[i]["url"];
            }
        }
        return "";
    }
}

var stageEndPoints = {
    "intro" : [[29, 12], [29, 13]],
    "self" : [[28, 0], [29, 0]],
    "family" : [[29, 11], [29, 10]],
    "country" : [[28, 10], [28, 11]],
    "world" : [[27,10],[28,10]],
    "ending" : [[27,13],[27,12]]
}

var tileMaps = {
    "intro": [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]],
    "self" : [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,47,8,47,0,0,0,8,47,47,47,0,0,0,0,0,8,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,86,0],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]],
    "family" : [
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,79,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,79,79,0,0,0,0,0,0,89,90,90,91,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[86,86,0,0,0,0,0,0,0,0,0,89,90,91,0,0,0,0,0,0,0,0,0,0,0,0,20,21,22,0],
[86,86,0,0,89,90,91,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,0,0],
[86,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,0]],
    "country" : [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,58,59],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,81],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
    "world" : [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,49,49,49,49,0,0,0,0,0,49,49,49,49,49],
[0,0,0,0,0,0,0,0,0,0,8,49,49,0,0,0,0,0,0,0,0,0,0,0,0,49,49,38,39,49],
[49,49,49,49,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,17,0],
[49,49,49,49,49,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[49,49,49,49,49,49,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[49,49,49,49,49,49,49,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50]],
    "ending" : [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,45,45,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,67,48,69,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,23,23,23,45],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,48,46,48,48],
[59,58,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,48,68,48,48],
[81,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,48,68,48,48],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]]
}

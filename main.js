var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Rainbowgirl(game, spritesheet) {
    this.animation = new Animation(spritesheet, 125, 125, 4, 0.06, 16, true, 0.65);
    this.x = 940;
    this.y = (529-125);
    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
}

Rainbowgirl.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Rainbowgirl.prototype.update = function () {
    // if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x -= this.game.clockTick * this.speed;
    if (this.x < (-125)) this.x = (940);
}


// inheritance
function Grant(game, spritesheet) {
    this.animation = new Animation(spritesheet, 167, 292, 12, 0.05, 64, true, 0.5);
    this.speed = 275;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 375);
}

Grant.prototype = new Entity();
Grant.prototype.constructor = Grant;

Grant.prototype.update = function () {
    if(this.animation.elapsedTime < this.animation.totalTime * 56 / 64
    || this.animation.elapsedTime > this.animation.totalTime * 61 / 64){
        this.x += this.game.clockTick * this.speed;
    }

    if (this.x > 940) this.x = -167;
    Entity.prototype.update.call(this);
}

Grant.prototype.draw = function () {

    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// // inheritance 
function BlueGuy(game, spritesheet) {
    this.animation = new Animation(spritesheet, 170, 240, 5, 0.08, 10, true, .3);
    this.speed = 300;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 375);
}

BlueGuy.prototype = new Entity();
BlueGuy.prototype.constructor = BlueGuy;

BlueGuy.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 940) this.x = -230;
    Entity.prototype.update.call(this);
}

BlueGuy.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/rainbow.png");
AM.queueDownload("./img/blueHair.png");
// AM.queueDownload("./img/jason.gif");
AM.queueDownload("./img/background2.jpg");
AM.queueDownload("./img/batman.png");
AM.queueDownload("./img/runningGrant.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background2.jpg")));



    gameEngine.addEntity(new BlueGuy(gameEngine, AM.getAsset("./img/blueHair.png")));
    gameEngine.addEntity(new Rainbowgirl(gameEngine, AM.getAsset("./img/rainbow.png")));
    gameEngine.addEntity(new Grant(gameEngine, AM.getAsset("./img/runningGrant.png")));
    console.log("All Done!");
});
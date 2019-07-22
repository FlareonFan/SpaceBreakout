var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {preload: preload, create: create,
update: update});

//sets the ball, paddle and bricks
var ball;
var paddle;
var bricks;

//sets the info for creating new bricks and status of current bricks
var newBrick;
var brickInfo;

//displays score text
var scoreText;
//sets score to zero at start of game
var score = 0;

//sets number of lives player has at the start of the game
var lives = 3;
//displays lives text
var livesText;
//updates if a life is a lost
var lifesLostText;

//detects if a player is playing or not
var playing = false;
//start button
var startButton;

function preload() {
	//sets up the playing field parameters
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlsignVertically = true;
	//sets background color to Orange
	game.stage.backgroundColor = '#BFFF00';
	//loads the ball asset
	game.load.image('ball' , 'assets/ball.png');
	//loads the ship asset
	game.load.image('paddle' , 'assets/player_ship.png');
	//loads the enemies asset
	game.load.image('brick' , 'assets/enemy_3.png');
	game.load.spritesheet('button' , 'assets/button.png', 120, 40);
}

function create() {
	//starts the Phaser physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
		//sets the physics parameters
    ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
    ball.anchor.set(0.5);
	//sets the balls physics
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);
//sets the paddle physics
    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
	
	initBricks();
	
	scoreText = game.add.text(5,5, 'Score: 0', { font: '18px Tahoma', fill: '#8E35EF' });
	livesText = game.add.text(game.world.width-5, 5, 'Lives:' +lives, { font: '18px Tahoma', fill: '#8E35EF' });
	livesText.anchor.set(1,0);
	lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'One chance at saving Earth gone, click to continue',  { font: '18px Tahoma', fill: '#8E35EF' });
	lifeLostText.anchor.set(0.5);
	lifeLostText.visible = false;
	
	 startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);
}

function update() {
	game.physics.arcade.collide(paddle, ball);
	game.physics.arcade.collide(ball,bricks, ballHitBrick);
	
if(playing){
	paddle.x = game.input.x || game.world.width*0.5;
}
	
}
function ballHitBrick(ball, brick) {
	//removes brick upon collision
	brick.kill();
	//adds 10 points to the current score
	score += 10;
	//updates the score text
	scoreText.setText('Score: ' +score);
	
	//checks how many enemies are still alive on the field
	var count_alive = 0;
	for(i = 0; i < bricks.children.length; i++) {
		if(bricks.children[i].alive == true) {
			count_alive++;
		}
	} 
	//if all enemies have been destroyed
	if (count_alive == 0) {
		alert('You have saved Earth, Mighty Hero!!');
		location.reload();
	}
}

function startGame() {
    startButton.destroy();
    ball.body.velocity.set(200, -200);
    playing = true;
}

function ballLeaveScreen() {
	 lives--;
    if(lives) {
        livesText.setText('Lives: '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(150, -150);
	}, this); }

else {
	alert('You have doomed Earth! Game Over!!');
	alert('Game designed by Kirstin Jackson for 3rd Year Games Development, UWS.');
	alert('Thanks for Playing');
	location.reload();
}
}

function initBricks() {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 3,
            col: 7
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    }
    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (c*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (r*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}
	

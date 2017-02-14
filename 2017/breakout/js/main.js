var game = new Phaser.Game(800, 600, Phaser.AUTO, 'breakout', { preload: preload, create: create, update: update });

var ball, paddle, bricks;
var ballOnPaddle = true;

function preload() {
  game.load.image('brick', 'res/brick.png');
  game.load.image('paddle', 'res/paddle.png');
  game.load.image('ball', 'res/ball.png');
}

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  We check bounds collisions against all walls other than the bottom one
  game.physics.arcade.checkCollision.down = false;

  createBricks();
  createPaddle();
  createBall();
  game.input.onDown.add(releaseBall, this);

}

function update() {
  updatePaddle();
  updateBall();
}

function releaseBall() {

  if (ballOnPaddle){
    ballOnPaddle = false;
    ball.body.velocity.y = -300;
    ball.body.velocity.x = -75;
  }

}

function ballLost() {
  ballOnPaddle = true;
  ball.reset(paddle.body.x + 16, paddle.y - 16);
}


function ballHitBrick(_ball, _brick) {
  _brick.kill();
}

function ballHitPaddle(_ball, _paddle) {

  var diff = 0;

  if (_ball.x < _paddle.x){
    //  Ball is on the left-hand side of the paddle
    diff = _paddle.x - _ball.x;
    _ball.body.velocity.x = (-10 * diff);
  }
  else if (_ball.x > _paddle.x){
    //  Ball is on the right-hand side of the paddle
    diff = _ball.x -_paddle.x;
    _ball.body.velocity.x = (10 * diff);
  }
  else
  {
    //  Ball is perfectly in the middle
    //  Add a little random X to stop it bouncing straight up!
    _ball.body.velocity.x = 2 + Math.random() * 8;
  }

}
function createBricks(){
  bricks = game.add.group();
  bricks.enableBody = true;
  bricks.physicsBodyType = Phaser.Physics.ARCADE;


  var brick;

  for (var y = 0; y < 4; y++)
  {
    for (var x = 0; x < 15; x++)
    {
      brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'brick');
      brick.body.bounce.set(1);
      brick.body.immovable = true;
    }
  }

}

function createPaddle(){
  paddle = game.add.sprite(game.world.centerX, 500, 'paddle');
  paddle.anchor.setTo(0.5, 0.5);

  game.physics.enable(paddle, Phaser.Physics.ARCADE);

  paddle.body.collideWorldBounds = true;
  paddle.body.bounce.set(1);
  paddle.body.immovable = true;

}

function updatePaddle(){
  if(game.input.x <= paddle.width/2){
    paddle.x = paddle.width/2;
  }else if(game.input.x >= game.width - paddle.width/2){
    paddle.x = game.width - paddle.width/2;
  }else{
    paddle.x = game.input.x;
  }
}

function createBall(){
  ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'ball');
  ball.anchor.set(0.5);
  ball.checkWorldBounds = true;

  game.physics.enable(ball, Phaser.Physics.ARCADE);

  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);

  ball.events.onOutOfBounds.add(ballLost, this);
}

function updateBall(){
  if (ballOnPaddle){
    ball.body.x = paddle.x;
  }else{
    game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
    game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
  }

}


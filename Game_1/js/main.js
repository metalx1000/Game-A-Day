var game = new Phaser.Game(720, 480, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.image('ship', 'res/sprites/ship.png');
  game.load.image('rock', 'res/sprites/rock.png');
  game.load.image('starfield', 'res/starfield.png');
}

var sprite,starfield,rocks,timer;

function create() {

  //Center Game on Page
  //game.scale.pageAlignHorizontally=true;
  game.scale.pageAlignVertically = true;
  //game.scale.pageVertically = true;
  game.physics.startSystem(Phaser.Physics.ARCADE);

  timer = game.time.time;
  
  game.stage.backgroundColor = '#0072bc';

  //  The scrolling starfield background
  starfield = game.add.tileSprite(0, 0, 720, 480, 'starfield');

  rocks = game.add.group();
  rocks.enableBody = true;

  sprite = game.add.sprite(400, 300, 'ship');
  sprite.scale.setTo(.2,.2);
  sprite.anchor.setTo(0.5, 0.5);
  

  //  Enable Arcade Physics for the sprite
  game.physics.enable(sprite, Phaser.Physics.ARCADE);

  //  Tell it we don't want physics to manage the rotation
  sprite.body.allowRotation = false;

    
  // Stretch to fill
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;  
  //Go Full Screen when Game Window Clicked  
  game.input.onDown.add(gofull, this);

}

function update() {
  //Rotate ship and Follow cursor
  sprite.rotation = game.physics.arcade.moveToPointer(sprite, 30, game.input.activePointer, 500);
  //game.physics.arcade.moveToPointer(sprite, 30, game.input.activePointer, 500); #follow cursor
  if(game.time.time > timer + 3000){
    timer = game.time.time;
    create_rock();
  }
  
  rocks.forEach(function(rock) {
    //if(game.time.time > rock.create_time + 10000){  
    if(rock.position.x > game.width + 1000 || rock.position.x < -800){  
      rock.body = null;
      rock.destroy();
    }
  }, this)
}

function render() {

}


function gofull() {
  game.scale.startFullScreen();

}

function create_rock(){
  var rock = rocks.create(game.width + Math.random() * 200, Math.random()*game.height, 'rock');
  rock.scale.setTo(.2,.2);
  rock.body.velocity.x = (Math.random() * 20 + 10) * -1; 
  rock.body.velocity.y = (Math.random() * 20 - 10); 
  rock.body.angularVelocity=Math.random()*20;
  rock.create_time = game.time.time;
  
  var rock = rocks.create(Math.random() * -400 - 200, Math.random()*game.height, 'rock');
  rock.scale.setTo(.2,.2);
  rock.body.velocity.x = (Math.random() * 20 + 10); 
  rock.body.velocity.y = (Math.random() * 20 - 10); 
  rock.body.angularVelocity=Math.random()*20;
  rock.create_time = game.time.time;
}
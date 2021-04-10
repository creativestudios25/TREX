//VARIABLE DECLARATION

//SPRITE
var trex, trex_running, trex_collided;
var ground, invisible_ground, ground_pic;
var cloud, cloud_pic;
var cactus, cac1, cac2, cac3, cac4, cac5, cac6;
var score = 0;
var restart, restart_pic, title, title_pic;

//SOUND
var jump, checkpoint, die;

//GROUP
var cac_group, cld_group;

//GAMESTATE
var END = 0;
var PLAY = 1;
var gamestate = PLAY;



//ANIMATION AND IMAGE
function preload() {

  //TREX ANIMATION
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  //GROUND IMAGE
  ground_pic = loadImage("ground2.png");

  //CREATING CLOUD IMAGE
  cloud_pic = loadImage("cloud.png");

  //CREATING CACTUS IMAGE
  cac1 = loadImage("cac1.png");
  cac2 = loadImage("cac2.png");
  cac3 = loadImage("cac3.png");
  cac4 = loadImage("cac4.png");
  cac5 = loadImage("cac5.png");
  cac6 = loadImage("cac6.png");


  //CREATING IMAGE FOR GAME END
  restart_pic = loadImage("restart.png");
  title_pic = loadImage("gameOver.jpg")

  //SOUND TRACK
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");

}



//SPRITE AND THEIR PROPERTIES
function setup() {

  createCanvas(600, 200);
  console.log("WELOCOME TO TREX GAME \nPRESS SPACEBAR OR UP KEY FOR JUMP");

  //CREATING TREX 
  trex = createSprite(50, 100, 50, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.depth = 1

  //CREATING GROUND
  ground = createSprite(200, 180, 400, 0);
  ground.addImage("ground", ground_pic);

  //INVISIBLE GROUND
  invisible_ground = createSprite(180, 185, 400, 10);
  invisible_ground.visible = false;

  //CREATING GAME END SPRITES
  restart = createSprite(300, 100);
  restart.addImage(restart_pic);
  restart.scale = 0.555;
  restart.visible = false;

  title = createSprite(300, 50, 100 , 100);
  title.addImage(title_pic);
  title.scale = 0.299999;
  title.visible = false;

  //CREATING GROUP
  cac_group = new Group();
  cld_group = new Group();

  //CREATING COLLIDER
  trex.setCollider("circle", 0, 0, 42);
  //trex.debug = true;
}



//ONEVENT CODE
function draw() {

  background("white");
  text("score: " + score, 500, 50);

  //GAMESTATE CODE

  //PLAY CODE
  if (gamestate === PLAY) {

    //SCORE CODE
    //if (frameCount % 3 === 0) {}
    score = score + Math.round(getFrameRate() / 60)

    if (score % 100 === 0) {
      checkpoint.play();
    }


    //GROUND CODE
    ground.velocityX = -(2 + score / 100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //TREX JUMP CODE
    if (keyDown("space") && trex.y >= 154) {
      trex.velocityY = -10;
      jump.play();
    }
    if (keyDown("up") && trex.y >= 154) {
      trex.velocityY = -10;
      jump.play();
    }
    
    trex.velocityY = trex.velocityY + 0.5;


    //FUNCTION CALL
    createCloud();
    createCactus();

    //GAME END (AI)
    if (cac_group.isTouching(trex)) {
      //trex.velocityY = -10
      //jump.play();
      gamestate = END;
      die.play();
    }


    //END CODE
  } else if (gamestate == END) {

    //STOPING VELOCITY
    ground.velocityX = 0;
    cld_group.setVelocityXEach(0)
    cac_group.setVelocityXEach(0)

    //STOPING LIFETIME
    cld_group.setLifetimeEach(-1);
    cac_group.setLifetimeEach(-1);

    //CHANGING TREX 
    trex.changeAnimation("collided", trex_collided);
    trex.velocityY = 0;

    //END SPRITES
    restart.visible = true;
    title.visible = true;

    //RESET CODE
    if (mousePressedOver(restart)) {
      reset();
    }
  }
  //STOP TREX FROM FALLING
  trex.collide(invisible_ground);
  
  drawSprites();
}



//CREATING CLOUD FUNCTION
function createCloud() {

  if (frameCount % 60 === 0) {

    cloud = createSprite(600, 50, 40, 40);
    cloud.addImage("CLOUD", cloud_pic);

    //CLOUD PROPERTIES
    cloud.y = Math.round(random(10, 60));
    cloud.velocityX = -3;
    cloud.depth = trex.depth - 1;

    //LIFETIME FOR CLOUD
    cloud.lifetime = 210;

    //CLOUD GROUP
    cld_group.add(cloud);
  }
}


//CREATING CACTUS FUNCTION
function createCactus() {

  if (frameCount % 60 === 0) {

    cactus = createSprite(580, 158, 35, 35);

    //CACTUS PROPERTIES
    cactus.velocityX = -(6 + score / 100);
    cactus.scale = 0.6;

    //LIFETIME FOR CACTUS
    cactus.lifetime = 250;

    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1:
        cactus.addImage(cac1);
        cactus.y = 159;
        break;
      case 2:
        cactus.addImage(cac2);
        cactus.y = 159;
        break;
      case 3:
        cactus.addImage(cac3);
        cactus.y = 159;
        break;
      case 4:
        cactus.addImage(cac4);
        cactus.y = 153;
        break;
      case 5:
        cactus.addImage(cac5);
        cactus.y = 153;
        break;
      case 6:
        cactus.addImage(cac6);
        cactus.y = 152;
        break;
      default:
        break;
    }

    //CACTUS GROUP
    cac_group.add(cactus);
  }
}

//RESET THE GAME
function reset() {

  //CHANGING GAMESTATE
  gamestate = PLAY;

  //CHANGING VISIBLITY
  restart.visible = false;
  title.visible = false;

  //DESTROYING SPRITES
  cac_group.destroyEach();
  cld_group.destroyEach();

  //CHANGING ANIMATION
  trex.changeAnimation("running", trex_running);

  //SETTING SCORE
  score = 0;
}
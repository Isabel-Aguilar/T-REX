var PLAY = 1;
var END = 0;
var gameState = PLAY;

var dieS, checkPS, jumpS;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, restartBImage,GameOverImage;
var restartSprite, gameOver;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  dieS = loadSound("die.mp3");
  checkPS = loadSound("checkPoint.mp3");
  jumpS = loadSound("jump.mp3")

  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  GameOverImage = loadImage("gameOver.png");
  restartBImage = loadImage("restart.png");

  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  restartSprite = createSprite(200, 150);
  restartSprite.addImage("restart", restartBImage);
  restartSprite.visible = false;
  restartSprite.scale = 0.5;

  gameOver = createSprite(200, 100);
  gameOver.addImage("gameOver", GameOverImage);
  gameOver.visible = false;
  gameOver.scale = 0.5;

  trex = createSprite((windowWidth/2)-200,windowHeight/2,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.7;
  
  ground = createSprite(200,height-150,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height-150,400,10);
  invisibleGround.visible = false;
  invisibleGround.debug = true
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  //Agregar hitbox 
  trex.setCollider("rectangle",0,0,50,100);
  
  score = 0
}

function draw() {
  background(180);
  //mostrar la puntuación
  textFont("IMPACT");
  textSize(25)
  text("Puntuación : "+ score, 500,50);
  
  console.log("esto es  ",gameState)
  console.log(trex.y)
  trex.velocityY = trex.velocityY + 0.5

  console.log(trex.y)
  if(gameState === PLAY){
    trex.changeAnimation("running")
    //mover el suelo
    ground.velocityX = -4;
    //puntuación
    score = score + Math.round(frameCount/20);
    
    if (score>0 && score%1000 === 0){
      checkPS.play();
    }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("space") && trex.y == 435 || mouseDown() && trex.y == 435) {
        trex.velocityY = -12;
        jumpS.play();
    }
    
    //agregar gravedad
    
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieS.play();
    }
  }
   else if (gameState === END) {
     ground.velocityX = 0;
     trex.changeAnimation("collided")
     restartSprite.visible = true
     gameOver.visible = true
     
     

     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 //Programacion del return
  if (mousePressedOver(restartSprite))
     {
      reset();
     }
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-180,10,40);
   obstacle.velocityX = -6;
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.9;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(windowWidth,windowHeight+300,40,10);
    cloud.y = Math.round(random(100,190));
    cloud.addImage(cloudImage);
    cloud.scale = 2;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 450;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //ajustar la profundidad
   cloudsGroup.add(cloud);
    }
}

function reset()
{
  gameState = PLAY
  restartSprite.visible = false
  gameOver.visible = false
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation(trex_running);
  score = 0;
}

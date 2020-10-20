
class gameobject {
  constructor(ctx, x, y, vx, vy){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.isColliding = false;
  }
}

class square extends gameobject{
  static width = 5;
  static height = 5;
  constructor(ctx, x, y, vx, vy){
    super(ctx, x, y, vx, vy);
  }

  draw(){
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = this.isColliding ? '#F9E204' : '#0099b0';
    this.ctx.fillRect(this.x, this.y,square.width,square.height);
  }
  update(){
    this.x += this.vx ;
    this.y += this.vy ;
  }


};



class circle extends gameobject{
  static width = 5;
  static height = 5;
  static start = 0;
  static end = 2 * Math.PI;
  constructor(ctx, x, y, r, vx, vy){
    super(ctx, x, y, vx, vy);
    this.r = r;
    this.percent = 0;
  }

  draw(){

    this.ctx.fillStyle = this.isColliding ? '#F9E204' : '#000000' ;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, circle.start, circle.end);
    this.ctx.fill()
    //this.ctx.restore();
  }
  update(){
    this.x += this.vx ;
    this.y += this.vy ;

  }
  clear(){
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  sparklingx(){
    this.vx -= 0.05;
    this.x += 1
  }
  sparklingy(){
    this.vy -= 0.05;
    this.y += 1
  }
  movedown(){
    this.y += 3;
  }

  moveup(){
    this.y -= 3;
  }

  moveleft(){
    this.x -= 3;
  }

  moveright(){
    this.x += 3;
  }

  negatex(){
    this.vx = -this.vx;
    this.isColliding = true;
  }

  negatey(){
    this.vy = -this.vy;
    this.isColliding = true;
  }

};
function detectCollisions(gameObjects){
    let obj1;
    let obj2;
    function circleIntersect(x1, y1, r1, x2, y2, r2) {

      // Calculate the distance between the two circles
      let squareDistance = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));

      // When the distance is smaller or equal to the sum
      // of the two radius, the circles touch or overlap
      return squareDistance <= (r1 + r2)
    }
    function wall(obj){
      if (obj.x + obj.r >= canvas.width) obj.negatex();
      if (obj.x - obj.r < 0) obj.negatex();
      if (obj.y + obj.r >= canvas.height) obj.negatey();
      if (obj.y - obj.r < 0) obj.negatey();
    }
    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        wall(obj1);
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];
            if (circleIntersect(obj1.x, obj1.y, obj1.r, obj2.x, obj2.y, obj2.r)){
                obj1.isColliding = true;
                obj2.isColliding = true;
                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt(Math.pow((obj2.x-obj1.x),2)+ Math.pow((obj2.y-obj1.y),2));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                ;
                if (speed < 0){
                  return
                }

                obj1.vx -= (speed * vCollisionNorm.x);
                obj1.vy -= (speed * vCollisionNorm.y);
                obj2.vx += (speed * vCollisionNorm.x);
                obj2.vy += (speed * vCollisionNorm.y);
            }
        }
    }
}


let gameObjects = [];

const ctx = document.getElementById('canvas').getContext('2d');

// gameObjects.push(new circle(ctx,150, 100, 10,1,0.5));
// gameObjects.push(new circle(ctx,150, 160, 10, 0.1,0.5));
// gameObjects.push(new circle(ctx,100, 10, 10, 10,0.5));
// gameObjects.push(new circle(ctx,230, 110, 10, 1,0.5));
// gameObjects.push(new circle(ctx,160, 60, 10, 0.1,0.4));
// gameObjects.push(new circle(ctx,200, 110, 10, 0.6,0.5));
// gameObjects.push(new circle(ctx,160, 110, 10, 2,0.5));




function init() {

  window.requestAnimationFrame(animate);
};
const canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let time = new Date();
let sec = time.getSeconds();
let radius = 1;
let objectnumber = 3;
let verticalVelocity = []
function generate(x,y){
  for( let i=0; i< objectnumber; i++){
    if (gameObjects.length > 1000) continue;
    gameObjects.push(new circle(ctx, x, y, radius, Math.random()*0.5,-Math.random()));
    gameObjects.push(new circle(ctx, x, y, radius, -Math.random()*0.5,-Math.random()));

  }
}

// function check(object){
//   let y = [];
//   for( let i=0; i< object.length; i++){
//     y.push(object[i].y);
//   }
// }

function animate(){
  generate(Math.random()*canvas.width,Math.random()*canvas.height);

  for (let i = 0; i < gameObjects.length; i++) {

    gameObjects[i].update();
    // gameObjects[i].moveleft();
    // gameObjects[i].sparklingy();
  }

  if (gameObjects[gameObjects.length-1].x < -350) {
    gameObjects = [];
    // generate(canvas.width/2,canvas.height/2);
  }
  detectCollisions(gameObjects);

  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].clear();
  };

  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].draw();
  };

  window.requestAnimationFrame(animate);
}

init();

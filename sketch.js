// variables
let size, col, sym, strokeFlag, fillFlag, strWt;
let mandala = [];

function setup() {
  createCanvas(600, 600);
  // createCanvas(600,600, SVG);
  background(225);
  colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);

  size = 20;
  col = color(random(360), 80, 80);
  sym = 3;
  strokeFlag = true;
  fillFlag = true;
  strWt = 2;
}

function draw() {
  // background(255);
  translate(width / 2, height / 2);
  for (let i = 0; i < mandala.length; i++) {
    mandala[i].display();
  }
}

function mouseClicked() {
  size = int(random(10, 30));
  col = color(int(random(360)), 80, 80);
  sym = int(random(2, 12));
  strokeFlag = random([true, false]);
  fillFlag = random([true, false]);
  strWt = random(0.5, 5);

  if (!strokeFlag && !fillFlag) {
    fillFlag = true;
  }
  let p = new Particle(size, col, sym, strokeFlag, fillFlag, strWt);
  mandala.push(p);

  // if (fillFlag) {
  //   fill(col);
  // } else {
  //   noFill();
  // }

  // if (strokeFlag) {
  //   stroke(col);
  // } else {
  //   noStroke();
  // }

  // let d = 360 / sym;
  // print(d);
  // push();
  // for(let i = 0; i < sym; i++)
  // {
  //   line(0,0,mouseX-width/2, mouseY-height/2);
  //   circle(mouseX-width/2, mouseY-height/2, size);
  //   rotate(d);
  // }
  // pop();
}

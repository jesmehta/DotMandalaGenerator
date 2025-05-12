// variables
let size, col, sym, strokeFlag, fillFlag, strWt;
let mandala;

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
  translate(width/2, height/2);

}

function mouseClicked() {
  if (fillFlag) {
    fill(col);
  } else {
    noFill();
  }

  if (strokeFlag) {
    stroke(col);
  } else {
    noStroke();
  }

  let d = 360 / sym;
  print(d);
  push();
  for(let i = 0; i < sym; i++)
  {
    line(0,0,mouseX-width/2, mouseY-height/2);
    circle(mouseX-width/2, mouseY-height/2, size);
    rotate(d);
  }
  pop();
}

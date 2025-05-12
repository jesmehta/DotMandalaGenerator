/*Boilerplate
let cluster = [];

for(let i = 0;i < 10;i++)
{
let p = new Particle();
cluster.push(p);
}

for(let i = 0;i < cluster.length;i++)
{
cluster[i].display();
cluster[i].update();
}

*/

class Particle {
  constructor(size, col, sym, strokeFlag, fillFlag, strWt) {
    this.posX = mouseX - width / 2;
    this.posY = mouseY - height / 2;
    this.size = size;
    this.col = col;
    this.sym = sym;
    this.strokeFlag = strokeFlag;
    this.fillFlag = fillFlag;
    this.strWt = strWt;
  }

  display() {
    if (this.fillFlag) {
      fill(this.col);
    } else {
      noFill();
    }

    if (this.strokeFlag) {
      stroke(this.col);
    } else {
      noStroke();
    }

    let d = 360 / this.sym;
    // print(d);
    push();
    for (let i = 0; i < sym; i++) {
      // line(0,0,mouseX-width/2, mouseY-height/2);
      circle(this.posX, this.posY, this.size);
      rotate(d);
    }
    pop();
  }
}

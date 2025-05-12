// dot.js — corrected and simplified for RGB mode, centered canvas, and proper symmetry

class Dot {
  constructor(x, y, size, col, strWt, strokeFlag, fillFlag, sym, strokeCol) {
    this.x = x; // absolute canvas coordinates
    this.y = y;
    this.size = size;
    this.col = col; // hex string (e.g. "#33ccff")
    this.strWt = strWt;
    this.strokeFlag = strokeFlag;
    this.fillFlag = fillFlag;
    this.sym = sym;
    this.strokeCol = strokeCol; // hex string
  }

  show() {
    push();
    translate(width / 2, height / 2); // center the drawing

    for (let i = 0; i < this.sym; i++) {
      push();
      rotate((360 / this.sym) * i);

      if (this.fillFlag) {
        fill(this.col);
      } else {
        noFill();
      }

      if (this.strokeFlag) {
        stroke(this.strokeCol);
        strokeWeight(this.strWt);
      } else {
        noStroke();
      }

      ellipse(this.x - width / 2, this.y - height / 2, this.size);
      pop();
    }

    pop();
  }

  export() {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
      col: this.col,
      strWt: this.strWt,
      strokeFlag: this.strokeFlag,
      fillFlag: this.fillFlag,
      sym: this.sym,
      strokeCol: this.strokeCol
    };
  }
}

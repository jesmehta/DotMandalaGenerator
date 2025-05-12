let sizeSlider, colorPicker;
let previewSize = 25;
let previewColor = "#3366ff";
let previewCtx;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-holder");

  sizeSlider = document.getElementById("sizeSlider");
  colorPicker = document.getElementById("colorPicker");
  
  // Setup preview canvas
  const previewCanvas = document.getElementById("sizePreviewCanvas");
  previewCtx = previewCanvas.getContext("2d");


  // update both size and color on input
  sizeSlider.addEventListener("input", () => {
    previewSize = parseInt(sizeSlider.value);
    updateSizePreview();
  });

  colorPicker.addEventListener("input", () => {
    previewColor = colorPicker.value;
    updateSizePreview();
  });

  updateSizePreview();  // call once after assigning previewSize and previewColor

}

function draw() {
  background(255);

  // mouse-following preview
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    fill(hexToRGBA(previewColor, 0.4));
    stroke(previewColor);
    strokeWeight(1);
    ellipse(mouseX, mouseY, previewSize);
  }
}

function updateSizePreview() {
  previewCtx.clearRect(0, 0, 60, 60);
  previewCtx.fillStyle = hexToRGBA(previewColor, 0.4);
  previewCtx.beginPath();
  previewCtx.arc(30, 30, previewSize / 2, 0, 2 * Math.PI);
  previewCtx.fill();

  previewCtx.strokeStyle = previewColor;
  previewCtx.lineWidth = 1;
  previewCtx.stroke();
}

function hexToRGBA(hex, alpha = 1) {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

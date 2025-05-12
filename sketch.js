let sizeSlider, fillColorPicker, strokeColorPicker, strokeWeightSlider, symmetrySlider;
let previewSize = 25;
let previewCtx;
let fillColor = "#3366ff";
let strokeColor = "#000000";
let strokeWeightVal = 1;
let symmetry = 6;
let drawMode = "fill";

function setup() {
  let canvas = createCanvas(700, 700);
  canvas.parent('canvas-holder');
  noCursor();

  // Get UI elements
  sizeSlider = document.getElementById('sizeSlider');
  fillColorPicker = document.getElementById('fillColorPicker');
  strokeColorPicker = document.getElementById('strokeColorPicker');
  strokeWeightSlider = document.getElementById('strokeWeightSlider');
  symmetrySlider = document.getElementById('symmetrySlider');
  previewCtx = document.getElementById('sizePreviewCanvas').getContext('2d');

const symmetryLabel = document.getElementById('symmetryLabel');
symmetrySlider.addEventListener('input', () => {
  symmetry = parseInt(symmetrySlider.value);
  symmetryLabel.textContent = `Symmetry: ${symmetry}`;
  updateSizePreview();
});

  document.querySelectorAll('input[name="drawMode"]').forEach((radio) => {
    radio.addEventListener('input', () => {
      drawMode = radio.value;
      updateSizePreview();
    });
  });

  // Set initial values
  updateFromUI();

  // Event listeners
  sizeSlider.addEventListener('input', () => {
    previewSize = parseFloat(sizeSlider.value);
    updateSizePreview();
  });

  fillColorPicker.addEventListener('input', () => {
    fillColor = fillColorPicker.value;
    updateSizePreview();
  });

  strokeColorPicker.addEventListener('input', () => {
    strokeColor = strokeColorPicker.value;
    updateSizePreview();
  });

  strokeWeightSlider.addEventListener('input', () => {
    strokeWeightVal = parseFloat(strokeWeightSlider.value);
    updateSizePreview();
  });

  symmetrySlider.addEventListener('input', () => {
    symmetry = parseInt(symmetrySlider.value);
    updateSizePreview();
  });

  updateSizePreview();
}

function updateFromUI() {
  previewSize = parseFloat(sizeSlider.value);
  fillColor = fillColorPicker.value;
  strokeColor = strokeColorPicker.value;
  strokeWeightVal = parseFloat(strokeWeightSlider.value);
  symmetry = parseInt(symmetrySlider.value);
}

function draw() {
  background(255);

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    push();
    translate(mouseX, mouseY);

    for (let i = 0; i < symmetry; i++) {
      push();
      rotate((360 / symmetry) * i);
      drawPreviewCircle();
      pop();
    }

    pop();
  }
}

function drawPreviewCircle() {
  if (drawMode === "fill" || drawMode === "both") {
    fill(hexToRGBA(fillColor, 0.4));
  } else {
    noFill();
  }

  if (drawMode === "stroke" || drawMode === "both") {
    stroke(strokeColor);
    strokeWeight(strokeWeightVal);
  } else {
    noStroke();
  }

  ellipse(0, 0, previewSize);
}

function updateSizePreview() {
  previewCtx.clearRect(0, 0, 60, 60);

  previewCtx.beginPath();
  previewCtx.arc(30, 30, previewSize / 2, 0, 2 * Math.PI);
  previewCtx.closePath();

  if (drawMode === "fill" || drawMode === "both") {
    previewCtx.fillStyle = hexToRGBA(fillColor, 0.4);
    previewCtx.fill();
  }

  if (drawMode === "stroke" || drawMode === "both") {
    previewCtx.strokeStyle = strokeColor;
    previewCtx.lineWidth = strokeWeightVal;
    previewCtx.stroke();
  }
}

function hexToRGBA(hex, alpha = 1) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

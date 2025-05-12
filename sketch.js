// sketch.js — Full version restored after troubleshooting

let sizeSlider, fillColorPicker, strokeColorPicker, strokeWeightSlider, symmetrySlider;
let drawModeRadios;
let gridToggle, gridSymmetrySlider, gridRadiusGapSlider;
let previewCtx;
let size = 25;
let col = '#3366ff';
let strokeCol = '#000000';
let strWt = 1;
let sym = 6;
let fillFlag = true;
let strokeFlag = false;
let mandala = [];
let gridLayer;
let showGrid = true;
let gridSym = 12;
let gridGap = 50;

function setup() {
  console.log("Setup starting...");
  let canvas = createCanvas(700, 700);
  canvas.parent('canvas-holder');
  noCursor();
  colorMode(RGB, 255);
  angleMode(DEGREES);
  noLoop();

  gridLayer = createGraphics(700, 700);
  gridLayer.colorMode(RGB, 255);
  gridLayer.angleMode(DEGREES);

  sizeSlider = document.getElementById('sizeSlider');
  fillColorPicker = document.getElementById('fillColorPicker');
  strokeColorPicker = document.getElementById('strokeColorPicker');
  strokeWeightSlider = document.getElementById('strokeWeightSlider');
  symmetrySlider = document.getElementById('symmetrySlider');
  gridToggle = document.getElementById('gridToggle');
  gridSymmetrySlider = document.getElementById('gridSymmetrySlider');
  gridRadiusGapSlider = document.getElementById('gridRadiusGapSlider');
  previewCtx = document.getElementById('sizePreviewCanvas')?.getContext('2d');
  drawModeRadios = document.querySelectorAll('input[name="drawMode"]');

  document.getElementById('symmetryLabel').textContent = `Symmetry: ${symmetrySlider.value}`;
  document.getElementById('gridSymmetryLabel').textContent = `Grid Symmetry: ${gridSym}`;

  bindUI();
  bindAdminControls();
  drawGrid();
  updateSizePreview();
  console.log("Setup complete");
  redraw();
}

function draw() {
  console.log("Draw running");
  background(255);
  if (showGrid) image(gridLayer, 0, 0);

  for (let d of mandala) {
    d.show();
  }

  if (mouseInCanvas()) {
    push();
    translate(width / 2, height / 2);
    for (let i = 0; i < sym; i++) {
      push();
      rotate((360 / sym) * i);
      drawDotPreview();
      pop();
    }
    pop();
  }
}

function mousePressed() {
  if (!mouseInCanvas()) return;
  mandala.push(new Dot(mouseX, mouseY, size, col, strWt, strokeFlag, fillFlag, sym, strokeCol));
  redraw();
}

function mouseMoved() {
  redraw();
}

function drawDotPreview() {
  if (fillFlag) fill(col);
  else noFill();
  if (strokeFlag) {
    stroke(strokeCol);
    strokeWeight(strWt);
  } else noStroke();
  ellipse(mouseX - width / 2, mouseY - height / 2, size);
}

function mouseInCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function updateSizePreview() {
  if (!previewCtx) return;
  previewCtx.clearRect(0, 0, 60, 60);
  previewCtx.beginPath();
  previewCtx.arc(30, 30, size / 2, 0, 2 * Math.PI);
  previewCtx.closePath();

  if (fillFlag) {
    previewCtx.fillStyle = col;
    previewCtx.fill();
  }

  if (strokeFlag) {
    previewCtx.strokeStyle = strokeCol;
    previewCtx.lineWidth = strWt;
    previewCtx.stroke();
  }
}

function bindUI() {
  sizeSlider.addEventListener('input', () => {
    size = parseFloat(sizeSlider.value);
    updateSizePreview();
    redraw();
  });

  fillColorPicker.addEventListener('input', () => {
    col = fillColorPicker.value;
    updateSizePreview();
    redraw();
  });

  strokeColorPicker.addEventListener('input', () => {
    strokeCol = strokeColorPicker.value;
    updateSizePreview();
    redraw();
  });

  strokeWeightSlider.addEventListener('input', () => {
    strWt = parseFloat(strokeWeightSlider.value);
    updateSizePreview();
    redraw();
  });

  symmetrySlider.addEventListener('input', () => {
    sym = parseInt(symmetrySlider.value);
    document.getElementById('symmetryLabel').textContent = `Symmetry: ${sym}`;
    updateSizePreview();
    redraw();
  });

  drawModeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const mode = document.querySelector('input[name="drawMode"]:checked').value;
      fillFlag = mode === 'fill' || mode === 'both';
      strokeFlag = mode === 'stroke' || mode === 'both';
      updateSizePreview();
      redraw();
    });
  });

  gridToggle.addEventListener('change', () => {
    showGrid = gridToggle.checked;
    redraw();
  });

  gridSymmetrySlider.addEventListener('input', () => {
    gridSym = parseInt(gridSymmetrySlider.value);
    document.getElementById('gridSymmetryLabel').textContent = `Grid Symmetry: ${gridSym}`;
    drawGrid();
    redraw();
  });

  gridRadiusGapSlider.addEventListener('input', () => {
    gridGap = parseInt(gridRadiusGapSlider.value);
    drawGrid();
    redraw();
  });
}

function bindAdminControls() {
  document.getElementById('clearBtn').onclick = () => {
    mandala = [];
    redraw();
  };

  document.getElementById('undoBtn').onclick = () => {
    mandala.pop();
    redraw();
  };

  document.getElementById('savePngBtn').onclick = () => {
    let original = showGrid;
    showGrid = false;
    redraw();
    saveCanvas(getDateTimeString("dotMandala_"), 'png');
    showGrid = original;
    redraw();
  };

  document.getElementById('exportJsonBtn').onclick = () => {
    let data = JSON.stringify(mandala.map(dot => dot.export()), null, 2);
    let blob = new Blob([data], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = getDateTimeString("dotMandala_") + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('importJsonBtn').onclick = () => {
    document.getElementById('importJsonInput').click();
  };

  document.getElementById('importJsonInput').addEventListener('change', (e) => {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (event) {
      try {
        let imported = JSON.parse(event.target.result);
        mandala = imported.map(d => new Dot(d.x, d.y, d.size, d.col, d.strWt, d.strokeFlag, d.fillFlag, d.sym, d.strokeCol));
        redraw();
      } catch (err) {
        alert('Invalid file format!');
      }
    };
    reader.readAsText(file);
  });
}

function drawGrid() {
  gridLayer.clear();
  gridLayer.push();
  gridLayer.translate(width / 2, height / 2);
  gridLayer.stroke(200);
  gridLayer.strokeWeight(0.5);
  gridLayer.noFill();

  let maxRadius = dist(0, 0, width / 2, height / 2);

  for (let r = gridGap; r < maxRadius; r += gridGap) {
    gridLayer.ellipse(0, 0, r * 2, r * 2);
  }

  for (let i = 0; i < gridSym; i++) {
    gridLayer.push();
    gridLayer.rotate((360 / gridSym) * i);
    gridLayer.line(0, 0, 0, -maxRadius);
    gridLayer.pop();
  }

  gridLayer.pop();
}

function getDateTimeString(pre = "") {
  let d = new Date();
  let ds = nf(d.getFullYear(), 4) +
           nf(d.getMonth() + 1, 2) +
           nf(d.getDate(), 2) + "_" +
           nf(d.getHours(), 2) +
           nf(d.getMinutes(), 2) +
           nf(d.getSeconds(), 2);
  return pre + ds;
}

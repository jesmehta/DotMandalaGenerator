let sizeSlider, fillColorPicker, strokeColorPicker, strokeWeightSlider, symmetrySlider;
let drawModeRadios;
let previewCtx;
let size = 25;
let col = '#3366ff';
let strokeCol = '#000000';
let strWt = 1;
let sym = 6;
let fillFlag = true;
let strokeFlag = false;
let mandala = [];

function setup() {
  let canvas = createCanvas(700, 700);
  canvas.parent('canvas-holder');
  noCursor();

  colorMode(RGB, 255); // 🟢 switch to RGB mode

  // UI elements
  sizeSlider = document.getElementById('sizeSlider');
  fillColorPicker = document.getElementById('fillColorPicker');
  strokeColorPicker = document.getElementById('strokeColorPicker');
  strokeWeightSlider = document.getElementById('strokeWeightSlider');
  symmetrySlider = document.getElementById('symmetrySlider');
  previewCtx = document.getElementById('sizePreviewCanvas').getContext('2d');
  drawModeRadios = document.querySelectorAll('input[name="drawMode"]');

  document.getElementById('symmetryLabel').textContent = `Symmetry: ${symmetrySlider.value}`;
  bindUI();
  bindAdminControls();
  updateSizePreview();
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  for (let d of mandala) {
    d.show();
  }

  if (mouseInCanvas()) {
    push();
    translate(mouseX - width / 2, mouseY - height / 2);
    for (let i = 0; i < sym; i++) {
      rotate((360 / sym) * i);
      drawDotPreview();
    }
    pop();
  }
}

function mousePressed() {
  if (!mouseInCanvas()) return;
  let mx = mouseX;
  let my = mouseY;
  mandala.push(new Dot(mx, my, size, col, strWt, strokeFlag, fillFlag, sym, strokeCol));
}

function drawDotPreview() {
  if (fillFlag) fill(col);
  else noFill();
  if (strokeFlag) {
    stroke(strokeCol);
    strokeWeight(strWt);
  } else noStroke();
  ellipse(0, 0, size);
}

function updateSizePreview() {
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

function mouseInCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function bindUI() {
  sizeSlider.addEventListener('input', () => {
    size = parseFloat(sizeSlider.value);
    updateSizePreview();
  });

  fillColorPicker.addEventListener('input', () => {
    col = fillColorPicker.value;
    updateSizePreview();
  });

  strokeColorPicker.addEventListener('input', () => {
    strokeCol = strokeColorPicker.value;
    updateSizePreview();
  });

  strokeWeightSlider.addEventListener('input', () => {
    strWt = parseFloat(strokeWeightSlider.value);
    updateSizePreview();
  });

  symmetrySlider.addEventListener('input', () => {
    sym = parseInt(symmetrySlider.value);
    document.getElementById('symmetryLabel').textContent = `Symmetry: ${sym}`;
    updateSizePreview();
  });

  drawModeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const mode = document.querySelector('input[name="drawMode"]:checked').value;
      fillFlag = mode === 'fill' || mode === 'both';
      strokeFlag = mode === 'stroke' || mode === 'both';
      updateSizePreview();
    });
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
    saveCanvas('mandala_' + nf(frameCount, 4), 'png');
  };

  document.getElementById('exportJsonBtn').onclick = () => {
    let data = JSON.stringify(mandala.map(dot => dot.export()), null, 2);
    let blob = new Blob([data], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'mandala.json';
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

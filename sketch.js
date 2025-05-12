let sizeSlider, hueSlider, satSlider, brightSlider, symmetryInput, usePaletteCheckbox;
let saveBtn, resetBtn, undoBtn, redoBtn, exportBtn, importBtn, importFileInput;
let centerX, centerY;
let strokes = [];
let redoStack = [];
let palettes = [];
let currentPalette = [];
let gridLayer;

window.onload = function() {

function setup() {
    let canvas = createCanvas(700, 700);
    canvas.parent('canvas-holder');

    colorMode(HSB, 360, 100, 100);
    angleMode(DEGREES);

    centerX = width / 2;
    centerY = height / 2;

    gridLayer = createGraphics(width, height);
    gridLayer.colorMode(HSB, 360, 100, 100);
    gridLayer.angleMode(DEGREES);

    drawGrid();

    // NOW HTML is ready, connect inputs:
    sizeSlider = $('#size');
    hueSlider = $('#hue');
    satSlider = $('#saturation');
    brightSlider = $('#brightness');
    symmetryInput = $('#symmetries');
    usePaletteCheckbox = $('#usePalette');

    saveBtn = $('#saveBtn');
    resetBtn = $('#resetBtn');
    undoBtn = $('#undoBtn');
    redoBtn = $('#redoBtn');
    exportBtn = $('#exportBtn');
    importBtn = $('#importBtn');
    importFileInput = $('#importFile');

    saveBtn.click(() => saveCanvas('radial_symmetry', 'png'));

    resetBtn.click(() => {
        strokes = [];
        redoStack = [];
        background(0);
        drawGrid();
    });

    undoBtn.click(undo);
    redoBtn.click(redo);
    exportBtn.click(exportDesign);

    importBtn.click(() => importFileInput.click());
    importFileInput.change(handleImport);

    symmetryInput.on('input', () => {
        drawGrid();
    });

    palettes = [
        [ [0, 80, 90], [30, 80, 90], [60, 80, 90], [120, 80, 90], [240, 80, 90], [300, 80, 90] ],
        [ [210, 90, 90], [190, 80, 80], [170, 70, 70], [150, 80, 90] ],
        [ [320, 80, 90], [0, 80, 70], [340, 80, 50], [300, 70, 80] ]
    ];
}

}; // window.onload ends here




function draw() {
    background(0);          // wipe previous frame
    image(gridLayer, 0, 0); // draw grid fresh every frame
    drawAllStrokes();       // draw strokes from history
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        showPreview();      // live preview
    }
}





function mousePressed() {
    if (mouseX < centerX - width/2 || mouseX > centerX + width/2) return; // Optional safety if needed
    if (mouseY < 0 || mouseY > height) return; // Optional safety if needed

    let newStroke = {
        x: mouseX,
        y: mouseY,
        size: parseInt(sizeSlider.val()),
        hue: parseInt(hueSlider.val()),
        sat: parseInt(satSlider.val()),
        bright: parseInt(brightSlider.val()),
        symmetries: parseInt(symmetryInput.val()),
        usePalette: usePaletteCheckbox.is(':checked')
    };

    strokes.push(newStroke);
    redoStack = [];
    drawStroke(newStroke);
}


function drawStroke(s) {
    let dx = s.x - centerX;
    let dy = s.y - centerY;
    let angleStep = 360 / s.symmetries;

    push();
    translate(centerX, centerY);

    for (let i = 0; i < s.symmetries; i++) {
        push();
        rotate(i * angleStep);

        let colorToUse;
        if (s.usePalette) {
            if (currentPalette.length === 0) {
                currentPalette = random(palettes);
            }
            colorToUse = random(currentPalette);
            fill(colorToUse[0], colorToUse[1], colorToUse[2]);
        } else {
            fill(s.hue, s.sat, s.bright);
        }

        noStroke();
        ellipse(dx, dy, s.size, s.size);
        pop();
    }

    pop();
}

function drawAllStrokes() {
    for (let s of strokes) {
        drawStroke(s);
    }
}


function showPreview() {
    let previewSize = parseInt(sizeSlider.val());
    let previewHue = parseInt(hueSlider.val());
    let previewSat = parseInt(satSlider.val());
    let previewBright = parseInt(brightSlider.val());
    let previewSymmetries = parseInt(symmetryInput.val());
    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    let angleStep = 360 / previewSymmetries;

    push();
    translate(centerX, centerY);
    for (let i = 0; i < previewSymmetries; i++) {
        push();
        rotate(i * angleStep);
        noFill();
        stroke(previewHue, previewSat, previewBright); // live color preview
        strokeWeight(2);
        ellipse(dx, dy, previewSize, previewSize);
        pop();
    }
    pop();
}


// function clearPreview() {
//     noLoop();
//     redrawAll();
//     loop();
// }

function undo() {
    if (strokes.length > 0) {
        redoStack.push(strokes.pop());
        redraw();
    }
}

function redo() {
    if (redoStack.length > 0) {
        strokes.push(redoStack.pop());
        redraw();
    }
}

function exportDesign() {
    let designData = JSON.stringify(strokes, null, 2);
    let blob = new Blob([designData], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = 'radial_symmetry_design.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function handleImport(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            let importedData = JSON.parse(e.target.result);
            strokes = importedData;
            redoStack = [];
            redraw();
        } catch (err) {
            alert("Invalid file format!");
        }
    };
    reader.readAsText(file);
}

function drawGrid() {
    gridLayer.clear(); // clean old grid

    gridLayer.push();
    gridLayer.translate(centerX, centerY);
    gridLayer.stroke(220, 10, 70); // light grayish lines
    gridLayer.strokeWeight(0.5);
    gridLayer.noFill();

    let maxRadius = min(width, height) / 2;

    // Radial circles every 50 pixels
    for (let r = 50; r < maxRadius; r += 50) {
        gridLayer.ellipse(0, 0, r * 2, r * 2);
    }

    // Radial lines for symmetries
    let symmetries = parseInt(symmetryInput.val());
    let angleStep = 360 / symmetries;

    for (let a = 0; a < 360; a += angleStep) {
        gridLayer.push();
        gridLayer.rotate(a);
        gridLayer.line(0, 0, 0, -maxRadius);
        gridLayer.pop();
    }

    gridLayer.pop();
}


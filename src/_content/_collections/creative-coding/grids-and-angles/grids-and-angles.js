const settings = {
  canvasWidth: null,
  canvasHeight: null,
  gap: null,
  cellGapRate: 0.05,
  lineGap: 3,
  cellsX: 3,
  frequency: 1,
  scale: 5,
  segments: 4,
  chaos: 1,
}

let boxes = [];

function setup() {
  noLoop();
  settings.canvasWidth = getCanvasWidth();
  settings.canvasHeight = getCanvasWidth();

  const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
  canvas.parent('canvasContainer');
  canvas.mouseClicked(redraw);
}

function draw() {
  settings.gap = settings.cellGapRate * settings.canvasWidth;
  boxes = []
  noStroke();
  background('#f5f1e6');

  let x, y;

  // width/height are determined by num of cells, subtracting gaps to allow for space
  const w = settings.canvasWidth / settings.cellsX - settings.gap - (settings.gap / settings.cellsX);
  const h = settings.canvasHeight / settings.cellsX - settings.gap - (settings.gap / settings.cellsX);

  for (let i = 0; i < settings.cellsX; i++) {
    for (let j = 0; j < settings.cellsX; j++) {
      x = settings.gap + (w + settings.gap) * i;
      y = settings.gap + (h + settings.gap) * j;

      boxes.push(new Box(x, y, w, h))
    }
  }

  // Draw each box
  boxes.forEach(box => {
    box.draw();
  });
}

class Box {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.spacing = settings.lineGap;
  }

  bounding() {
    noFill();
    stroke('#000');
    strokeWeight(1);
    rect(this.x, this.y, this.width, this.height);
  }

  linesVertical() {
    let x1, y1, x2, y2, noise;
    let side = getRandomInt(0, 2);
    if (side == 0) return;

    // Two possible orientations, left and right
    if (side == 1) {
      for (let i = this.x; i < this.x + this.width / 2; i += this.spacing) {
        x1 = i;
        y1 = this.y;
        x2 = i;
        y2 = this.y + this.height;
        noise = {
          scale: getRandomInt(5, settings.scale),
          segments: getRandomInt(2, settings.segments),
          frequency: getRandomInt(5, settings.frequency),
          chaos: settings.chaos,
        }

        noisyLine(x1, y1, x2, y2, noise);
      }
    } else if (side == 2) {
      for (let i = this.x + this.width / 2; i < this.x + this.width; i += this.spacing) {
        x1 = i;
        y1 = this.y;
        x2 = i;
        y2 = this.y + this.height;
        noise = {
          scale: getRandomInt(5, settings.scale),
          segments: getRandomInt(2, settings.segments),
          frequency: getRandomInt(5, settings.frequency),
          chaos: settings.chaos,
        }

        noisyLine(x1, y1, x2, y2, noise);
      }
    }
  }

  linesHorizontal() {
    let x1, y1, x2, y2, noise;
    let side = getRandomInt(0, 2);
    if (side == 0) return;

    // Two possible orientations, top and bottom
    if (side == 1) {
      for (let i = this.y; i < this.y + this.height / 2; i += this.spacing) {
        x1 = this.x;
        y1 = i;
        x2 = this.x + this.width;
        y2 = i;
        noise = {
          scale: getRandomInt(5, settings.scale),
          segments: getRandomInt(2, settings.segments),
          frequency: getRandomInt(5, settings.frequency),
          chaos: settings.chaos,
        }

        noisyLine(x1, y1, x2, y2, noise);
      }
    } else if (side == 2) {
      for (let i = this.y + this.width / 2; i < this.y + this.height; i += this.spacing) {
        x1 = this.x;
        y1 = i;
        x2 = this.x + this.width;
        y2 = i;
        noise = {
          scale: getRandomInt(5, settings.scale),
          segments: getRandomInt(2, settings.segments),
          frequency: getRandomInt(5, settings.frequency),
          chaos: settings.chaos,
        }

        noisyLine(x1, y1, x2, y2, noise);
      }
    }
  }

  linesDiagonal() {
    let x1, y1, x2, y2, noise;
    // Four possible orientations, topleft, bottomleft, topright, bottomright
    let corner = getRandomInt(-1, 4);
    if (corner <= 0) return;

    for (let i = 0; i < this.width; i += this.spacing) {

      if (corner == 1) {
        x1 = this.x + i;
        y1 = this.y;
        x2 = this.x;
        y2 = this.y + i;
      } else if (corner == 2) {
        x1 = this.x;
        y1 = this.y + this.height - i;
        x2 = this.x + i;
        y2 = this.y + this.height;
      } else if (corner == 3) {
        x1 = this.x + this.width - i;
        y1 = this.y;
        x2 = this.x + this.width;
        y2 = this.y + i;
      } else if (corner == 4) {
        x1 = this.x + this.width - i;
        y1 = this.y + this.height;
        x2 = this.x + this.width;
        y2 = this.y + this.height - i;
      }

      noise = {
        scale: getRandomInt(5, settings.scale),
        segments: getRandomInt(2, settings.segments),
        frequency: getRandomInt(5, settings.frequency),
        chaos: settings.chaos,
      }

      noisyLine(x1, y1, x2, y2, noise);
    }
  }

  draw() {
    strokeWeight(1);

    stroke('#db6d41');
    this.linesVertical();

    stroke('#7e6f6c');
    this.linesHorizontal();

    stroke('#c7646c');
    this.linesDiagonal();
  }
}

/* Tweakpane
 * ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Settings', container: document.querySelector('.project__tweak-settings') })
const cellSettings = pane.addFolder({ title: 'Cell Settings' });
cellSettings.addInput(settings, 'cellsX', { min: 2, max: 12, step: 1 })
cellSettings.addInput(settings, 'cellGapRate', { min: 0.00, max: 0.10, step: 0.005 })
const lineSettings = pane.addFolder({ title: 'Line Settings' });
lineSettings.addInput(settings, 'lineGap', { min: 1, max: 30, step: 1 })
lineSettings.addInput(settings, 'segments', { min: 1, max: 30, step: 1 })
lineSettings.addInput(settings, 'scale', { min: 1, max: 50, step: 1 })
lineSettings.addInput(settings, 'frequency', { min: 1, max: 10, step: 1 })
lineSettings.addInput(settings, 'chaos', { min: 1, max: 10, step: 1 })
const saveButton = pane.addButton({ title: 'Save Image' });

pane.on('change', function () {
  redraw();
});

saveButton.on('click', function () {
  saveCanvas('generated-image', 'png');
});
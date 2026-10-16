const settings = {
  canvasWidth: null,
  canvasHeight: null,
  canvasGapRate: 0.02,
  canvasGap: null,
  lineHeightRate: 0.04,
  lineHeight: null,
  lineGapRate: 0.03,
  lineGap: null,
  lines: [],
  maxWordWidth: 150,
  wordGap: 30,
  segments: 4,
  frequency: 1,
  scale: 10,
};

function setup() {
  noLoop();
  settings.canvasWidth = getCanvasWidth();
  settings.canvasHeight = getCanvasWidth();
  console.log(settings.canvasWidth, settings.canvasHeight)

  const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
  canvas.parent('canvasContainer');
  canvas.mouseClicked(redraw);
}

function draw() {
  settings.lines = [];
  noStroke();
  background('#f5f1e6');
  strokeWeight(1);

  settings.canvasGap = settings.canvasWidth * settings.canvasGapRate;
  settings.lineHeight = settings.canvasHeight * settings.lineHeightRate;
  settings.lineGap = settings.canvasHeight * settings.lineGapRate;

  let x, y, w, h;
  let i = 0;
  do {
    w = settings.canvasWidth - settings.canvasGap * 2;
    h = settings.lineHeight;
    x = settings.canvasGap;
    y = (settings.lineGap * i) + (h * i) + settings.canvasGap;

    if (y + settings.lineHeight < settings.canvasHeight - (settings.canvasGapRate * 2)) {
      settings.lines.push(new Line(x, y, w, h));
      i++;
    }
  } while (y + settings.lineHeight + settings.lineGap < settings.canvasHeight - (settings.canvasGapRate * 2));

  settings.lines.forEach(line => {
    line.draw();
  });
}

class Line {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.characterWidth = settings.characterWidth;
    this.wordGap = settings.wordGap;
    this.words = [];
  }

  bounding() {
    noFill();
    stroke('#000');
    strokeWeight(1);
    rect(this.x, this.y, this.width, this.height);
  }

  draw() {
    noFill();
    stroke('#000');
    let totalWordWidth = 0;

    do {
      let x, y, width, height;
      x = this.x + totalWordWidth;
      y = this.y;

      // ideal max width is 150px, if there is less space than that then the max width is the remaining empty space
      let maxWidth = this.width + this.x - totalWordWidth > settings.maxWordWidth ? settings.maxWordWidth : this.width + this.x - totalWordWidth;

      if (getRandomInt(0, 6) == 0) {
        width = 20;
      } else {
        width = getRandomInt(30, maxWidth);
      }
      totalWordWidth += width + this.wordGap;
      height = this.height;

      // Random
      if (totalWordWidth < this.width) {
        this.words.push(new Word(x, y, width, height));
      }
    } while (totalWordWidth < this.width + settings.canvasGap);

    this.words.forEach(word => {
      word.draw();
    })
  }
}

class Word {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.characters = [];
  }

  bounding() {
    stroke('#000');
    strokeWeight(1);
    rect(this.x, this.y, this.width, this.height);
  }

  draw() {
    let totalCharacterWidth = 0;
    let width = 0;
    do {
      width = getRandomInt(5, 10);

      totalCharacterWidth += width;

      if (totalCharacterWidth < this.width) {
        this.characters.push(new Character(this.x + totalCharacterWidth, this.y, width, this.height));
      }
    } while (totalCharacterWidth < this.width);

    this.characters.forEach(character => {
      character.draw();
    });
  }
}

class Character {

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  draw() {
    let xstart, ystart, lineStyle;
    let x1, x2, y1, y2;
    let numSegments = getRandomInt(1, 4);
    for (let i = 0; i < numSegments; i++) {
      lineStyle = getRandomInt(0, 1) == 0 ? 'line' : 'curve';
      if (i == 0) {
        // first segment of a character
        x1 = this.x;
        y1 = this.y + (this.height / 2);
        x2 = getRandomInt(this.x, this.x + this.width);
        y2 = getRandomInt(this.y, this.y + this.height);
        xstart = x2;
        ystart = y2;
      } else if (i == numSegments - 1) {
        // last segment of a character, should end on the right center to flow with other characters
        x1 = xstart;
        y1 = ystart;
        x2 = this.x + this.width;
        y2 = this.y + (this.height / 2);
      } else {
        // every other segment of a character
        x1 = xstart;
        y1 = ystart;
        x2 = getRandomInt(this.x, this.x + this.width);
        y2 = getRandomInt(this.y, this.y + this.height);
        xstart = x2;
        ystart = y2;
      }

      strokeWeight(1);
      stroke('#000');

      if (lineStyle == 'curve') {
        noisyLine(x1, y1, x2, y2, { segments: 6, scale: 4, frequency: 0.1, chaos: 1 })
      } else if (lineStyle == 'line') {
        noisyLine(x1, y1, x2, y2, { segments: 1, scale: 1, frequency: 1, chaos: 1 });
      }

    }
  }
}


/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const lineSettings = pane.addFolder({ title: 'Line Settings' });
lineSettings.addInput(settings, 'canvasGapRate', { min: 0, max: 0.1, step: 0.001, label: 'Margin' });
lineSettings.addInput(settings, 'lineHeightRate', { min: 0, max: 0.1, step: 0.001, label: 'Line Height' });
lineSettings.addInput(settings, 'lineGapRate', { min: 0, max: 0.3, step: 0.001, label: 'Line Gap' });
const characterSettings = pane.addFolder({ title: 'Character Settings' });
characterSettings.addInput(settings, 'maxWordWidth', { min: 10, max: 300, step: 1, label: 'Max Word Width' });
characterSettings.addInput(settings, 'wordGap', { min: 15, max: 90, step: 1, label: 'Word Space' });

const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
  saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
  redraw();
});
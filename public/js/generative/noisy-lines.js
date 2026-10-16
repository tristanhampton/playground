
const settings = {
  canvasWidth: null,
  canvasHeight: null,
  frequency: 1,
  scale: 20,
  speed: 10,
  segments: 3,
};

let points = [];

function setup() {
  settings.canvasWidth = getCanvasWidth();
  settings.canvasHeight = getCanvasWidth();
  const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
  canvas.parent('canvasContainer');
  canvas.mouseClicked(pushPoint);
}

function draw() {
  noStroke();
  background('#f5f1e6');

  strokeWeight(1);
  stroke('#2b2b2b');
  noisyLine(
    100,
    100,
    600,
    600,
    {
      scale: settings.scale,
      frequency: settings.frequency,
      speed: settings.speed,
      segments: settings.segments,
    }
  );

  points.forEach(coordinate => {


    for (i = 1; i < points.length; i++) {
      secondCoordinate = points[i - 1];
      strokeWeight(6)
      point(coordinate.x, coordinate.y);

      strokeWeight(1);
      // noisyLine(
      //   coordinate.x,
      //   coordinate.y,
      //   secondCoordinate.x,
      //   secondCoordinate.y,
      //   {
      //     scale: settings.scale,
      //     frequency: settings.frequency,
      //     speed: settings.speed,
      //     segments: settings.segments
      //   }
      // );
    }
  });
}

function pushPoint() {
  points.push(createVector(mouseX, mouseY));
}


/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const saveButton = pane.addButton({ title: 'Save Image' });
const lineSettings = pane.addFolder({ title: 'Line Settings' });
lineSettings.addInput(settings, 'scale', { min: 1, max: 100, step: 1 });
lineSettings.addInput(settings, 'frequency', { min: 1, max: 100, step: 1 });
lineSettings.addInput(settings, 'speed', { min: 1, max: 100, step: 1 });
lineSettings.addInput(settings, 'segments', { min: 1, max: 20, step: 1 });

saveButton.on('click', function () {
  saveCanvas('generated-image', 'png');
});
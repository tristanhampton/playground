const settings = {
	canvasWidth: null,
	canvasHeight: null,
	radius: 20,
	angle: 0,
	numPoints: 17,
	numInnerPoints: 4,
	circleRadius: 460,
	innerCircleWidth: 140,
	innerCircleHeight: 140,
	coordinates: [],
	secondaryCoordinates: [],
};

let scale;

function setup() {
	noLoop();
	settings.canvasWidth = getCanvasWidth();
	settings.canvasHeight = getCanvasWidth();

	const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

}

function draw() {
	noStroke();
	background('#f5f1e6');
	settings.coordinates = [];
	settings.secondaryCoordinates = [];

	let r = settings.canvasWidth * settings.radius / 200;
	let xCenter = settings.canvasWidth / 2;
	let yCenter = settings.canvasHeight / 2;

	settings.coordinates = getPointsOnEllipse(xCenter, yCenter, settings.numPoints, r);

	strokeWeight(1);
	noFill();
	stroke('#000');

	settings.coordinates.forEach(point => {

		ellipse(point.x, point.y, settings.circleRadius);


		settings.secondaryCoordinates.push(getPointsOnEllipse(point.x, point.y, settings.numInnerPoints, settings.circleRadius / 2))
	});

	settings.secondaryCoordinates.forEach(circle => {
		circle.forEach(point => {
			ellipse(point.x, point.y, settings.innerCircleWidth, settings.innerCircleHeight);
		});
	});
}

/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const mandalaSettings = pane.addFolder({ title: 'Mandala Settings' });
mandalaSettings.addInput(settings, 'radius', { min: 1, max: 100, step: 1, label: 'Mandela Radius' })
const circleSettings = pane.addFolder({ title: 'Circle Settings' });
circleSettings.addInput(settings, 'numPoints', { min: 2, max: 48, step: 1, label: 'Number of Circles' });
circleSettings.addInput(settings, 'circleRadius', { min: 100, max: 800, step: 1, label: 'Circle Radius' });
circleSettings.addInput(settings, 'numInnerPoints', { min: 2, max: 8, step: 1, label: 'Number of Inner Circles' });
circleSettings.addInput(settings, 'innerCircleWidth', { min: 5, max: 400, step: 1, label: 'Inner Circle Width' });
circleSettings.addInput(settings, 'innerCircleHeight', { min: 5, max: 400, step: 1, label: 'Inner Circle Height' });
const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
	redraw();
});
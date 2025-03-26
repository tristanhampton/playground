const settings = {
	points: [],
	gap: null,
	colors: null,
	margin: 0,
	numCellsWidth: null,
	numCellsHeight: null,
};

function setup() {
	noLoop();

	// Create and place the canvas
	const canvas = createCanvas(getCanvasWidth(), getCanvasWidth());
	canvas.parent('canvasContainer');
	canvas.mouseClicked(function() {
		setup();
		redraw();
	});

	settings.points = [];
	settings.gap = width*0.038;
	settings.colors = risoColors(5);
	settings.margin = width * 0.1;
	settings.numCellsWidth = Math.ceil((width - settings.margin * 2) / settings.gap);
	settings.numCellsHeight = Math.ceil((height - settings.margin * 2) / settings.gap);

	// create a grid of points to work with
	for (i = 0; i < settings.numCellsHeight; i++) {
		for (j = 0; j < settings.numCellsWidth; j++) {
			const x_ = j * settings.gap + settings.margin;
			const y_ = i * settings.gap + settings.margin;
			settings.points.push(createVector(x_, y_));
		}
	}
}

function draw() {
	background(settings.colors[getRandomInt(0, settings.colors.length-1)].hex)
	push();
	noStroke();
	fill('#f5f1e6');
	rect(settings.margin/2, settings.margin/2, width - settings.margin, height - settings.margin)
	pop();
	const curveHeight = settings.points[getRandomInt(10, settings.points.length-10)]
	const topPoint = settings.points[getRandomInt(0,settings.numCellsWidth)];
	const bottomPoint = settings.points[settings.points.length - getRandomInt(1, settings.numCellsWidth)];

	

	settings.points.forEach(coordinate => {
		push();
		noFill();
		strokeWeight(1);
		stroke(settings.colors[getRandomInt(0, settings.colors.length-1)].hex);

		// draw a square at the point
		square(coordinate.x, coordinate.y, getRandomInt(3,8));

		// draw a curve to either the top point or bottom point
		if (coordinate.y < curveHeight.y + settings.gap) {
			let anchorStart = [coordinate.x, coordinate.y];
			let control1 = [coordinate.x, coordinate.y * 1.2];
			let control2 = [coordinate.x, height]
			let anchorEnd = [topPoint.x, topPoint.y];
			bezier(...anchorStart, ...control1, ...control2, ...anchorEnd);
		} else {
			let anchorStart = [coordinate.x, coordinate.y];
			let control1 = [coordinate.x, curveHeight.y];
			let control2 = [coordinate.x, height/2]
			let anchorEnd = [bottomPoint.x, bottomPoint.y];
			bezier(...anchorStart, ...control1, ...control2, ...anchorEnd);
		}
		pop();
	});
}

/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
// const folder = pane.addFolder({ title: 'Folder' });
// folder.addInput(settings, 'variable', { min: 0, max: 100, step: 1, label: 'Variable' });
const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});
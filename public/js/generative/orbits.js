const settings = {
	width: null,
	height: null,
	gap: 0,
	margin: 0,
	numCellsWidth: 4,
	numCellsHeight: 4,
	cellSize: null,
};

let systems = [];

function setup() {
	noLoop();
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(function() {
		systems = [];
		setup();
		redraw();
	});

	settings.gap = width * 0.038;
	settings.margin = width * 0.1;
	settings.cellSize = (width - (settings.margin * 2) - (settings.gap * (settings.numCellsWidth-1))) / settings.numCellsWidth;

	// create a grid of points to work with
	for (i = 0; i < settings.numCellsHeight; i++) {
		for (j = 0; j < settings.numCellsWidth; j++) {
			// const x_ = settings.margin + (j + 1) * (settings.cellSize + settings.gap);
			const x_ = settings.margin + (j*settings.cellSize) + (j*settings.gap);
			const y_ = i * (settings.gap + settings.cellSize) + settings.margin;
			const size_ = settings.cellSize * 0.8;
			systems.push(new solarSystem({ x: x_, y: y_, size: size_ }));
		}
	}
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);

	// debugCanvas();

	systems.forEach(system => {
		system.draw();
		// system.debug();
	})
}

class solarSystem {
	constructor(props) {
		this.x = props.x;
		this.y = props.y;
		this.size = props.size;
		this.paths = getRandomInt(1, 3);
		this.pathDiameters = [];
		this.setDiameters();
		this.largestDiameter = Math.max(...this.pathDiameters);
		this.pathWidth = 1;
	}

	draw() {
		for (let i = 0; i < this.paths; i++) {

			//--- draw the orbit path
			push();
			translate(this.x + this.size/2, this.y + this.size/2);
			stroke('#111');
			noFill();
			strokeWeight(this.pathWidth);
			circle(0, 0, this.pathDiameters[i]);
			pop();

			//--- draw a planet
			push();
			translate(this.x + this.size / 2, this.y + this.size / 2);

			// get a point along the edge of the diameter
			const planetCenter = randomAlongCircle(this.pathDiameters[i] / 2);
			const planetSize = mapRange(this.pathDiameters[i] * Math.random(), 10, this.largestDiameter * 0.3, this.largestDiameter * 0.1, this.largestDiameter * 0.2, true);
			noStroke();
			fill('#111');
			circle(planetCenter.x, planetCenter.y, planetSize);
			pop();
		}
	}

	setDiameters() {
		for (let i = 0; i < this.paths; i++) {
			this.pathDiameters.push(this.size * Math.random());
		}
	}

	debug() {
		push();
		rectMode(CENTER)
		noFill();
		stroke('#800');
		strokeWeight(1);
		translate(this.x + this.size / 2, this.y + this.size / 2);
		rect(0, 0, this.size, this.size);
		pop();
	}
}

function debugCanvas() {

	// paint the margins
	push();
	noStroke();
	fill('#0036');
	rect(0, 0, width, settings.margin);
	rect(0, 0, settings.margin, height);
	rect(0, height - settings.margin, width, settings.margin);
	rect(width - settings.margin, 0, settings.margin, height);
	pop();
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

pane.on('change', function () {
	redraw();
});
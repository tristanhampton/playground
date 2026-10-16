const settings = {
	width: null,
	height: null,
	cells: [],
	cellSize: 50,
};

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(setup);

	settings.cells = [];
	settings.cellSize = mapRange(width, 300, 800, 10, 60, true);

	for (let i = settings.cellSize * -1; i < settings.height + settings.cellSize; i += settings.cellSize*1.4) {
		for (let j = settings.cellSize * -1; j < settings.width + settings.cellSize; j += settings.cellSize*1.4) {
			const x = j;
			const y = i;
			const w = settings.cellSize;
			const h = settings.cellSize;

			if (getRandomInt(1, 4) == 1) {
				settings.cells.push(new Cell({ x: x, y: y, w: w, h: h }));
			}
		}
	}

}

function draw() {
	noStroke();
	background('#f5f1e6');

	settings.cells.forEach(cell => {
		cell.update();
		cell.draw();
	});
}

class Cell {
	constructor(props) {
		this.x = props.x;
		this.y = props.y;
		this.w = props.w;
		this.h = props.h;
		this.hyp = 
		this.startX = props.x;
		this.startY = props.y;
		this.maxHeight = getRandomInt(10, floor(height/5));
		this.currentHeight = 0;
	}

	update() {
		const currentTimeInSeconds = Math.floor(Date.now() / 1000);
		let offset = noise(this.x, currentTimeInSeconds) - 0.5;
		offset *= PI;

		// don't let cells go below their starting point
		if (this.currentHeight <= 0 && offset < 0) {
			offset = 0;
		}

		// Don't let cells go higher than their max height
		if (this.currentHeight >= this.maxHeight && offset > 0) {
			offset = 0;
		}

		this.y -= offset;
		this.currentHeight += offset;
	}

	draw() {
		// draw the base as a diamond shape
		push();
		fill('#111');
		translate(this.startX, this.startY);
		beginShape();
		vertex(0,0);
		vertex(this.w/2, -this.h/3);
		vertex(this.w, 0);
		vertex(this.w/2, this.h/3);
		vertex(0,0);
		endShape();
		pop();

		// draw height of column
		push();
		fill('#111');
		translate(this.startX, this.startY);
		beginShape();
		vertex(0,0);
		vertex(0, -this.currentHeight);
		vertex(this.w, -this.currentHeight);
		vertex(this.w, 0);
		endShape();
		pop();

		// Draw the top of the column
		push();
		fill('#fff');
		stroke('#fff');
		strokeWeight(1);
		translate(this.startX, this.startY);
		beginShape();
		vertex(0, -this.currentHeight);
		vertex(this.w / 2, -this.currentHeight - this.h / 3);
		vertex(this.w, -this.currentHeight);
		vertex(this.w / 2, -this.currentHeight + this.h / 3);
		endShape();
		pop();
	}

	deleteSelf() {
		// get index of self
		const index = settings.cells.indexOf(this);

		// remove self
		settings.cells.splice(index, 1);
	}
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
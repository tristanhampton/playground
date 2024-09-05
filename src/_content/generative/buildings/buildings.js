const settings = {
	width: null,
	height: null,
	cells: [],
	cellSize: 20,
};

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	for (let i = settings.cellSize * -1; i < settings.height + settings.cellSize; i += settings.cellSize*1.4) {
		for (let j = settings.cellSize * -1; j < settings.width + settings.cellSize; j += settings.cellSize*1.4) {
			const x = j;
			const y = i;
			const w = settings.cellSize;
			const h = settings.cellSize;

			if (getRandomInt(1, 7) == 1) {
				settings.cells.push(new Cell({ x: x, y: y, w: w, h: h }));
			}
		}
	}

	background('#f5f1e6');
}

function draw() {
	noStroke();

	settings.cells.forEach(cell => {
		cell.update();
		cell.draw();
		cell.stop();
	});
}

class Cell {
	constructor(props) {
		this.x = props.x;
		this.y = props.y;
		this.w = props.w;
		this.h = props.h;
		this.maxHeight = getRandomInt(10, floor(height/5));
		this.currentHeight = 0;
	}

	update() {
		const offset = noise(this.x);

		if (this.currentHeight < this.maxHeight) {
			this.y -= offset;
			this.currentHeight += offset;
		} else {
			this.deleteSelf();
		}
	}

	draw() {
		push();
		fill('#FFF');
		translate(this.x, this.y);
		stroke('#111');
		scale(1, 0.7)
		rotate(PI / 3);
		rect(0, 0, this.w, this.h);
		pop();
	}

	stop() {
		// if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
		// 	this.deleteSelf();
		// }
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
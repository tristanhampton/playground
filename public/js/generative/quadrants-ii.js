const settings = {
	gapScale: 0.02,
	marginScale: 0.05,
	topScale: 0.05,
	steps: 20,
	cellCount: 10,
};

function setup() {
	// Create and place the canvas
	const canvas = createCanvas(getCanvasWidth(), getCanvasWidth());
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);
	rectMode(CORNER);
}

function draw() {
	noLoop();
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);
	const grids = [];

	let topGap = height * settings.topScale;
	let margin = width * settings.marginScale;
	let gap = width * settings.gapScale;

	//--- Set up grid
	// width/height are determined by num of cells, subtracting gaps to allow for space
	let x, y, w, h
	w = (width - margin * 2 - gap * (settings.cellCount - 1)) / settings.cellCount;
	h = (height - margin * 2 - gap * (settings.cellCount - 1)) / settings.cellCount;

	// Rows
	for (let i = 0; i < settings.cellCount; i++) {
		y = margin + h * i + gap * i;

		// Columns
		for (let j = 0; j < settings.cellCount; j++) {
			x = margin + w * j + gap * j;
			grids.push(new grid(x, y, w, h, j, i));
		}
	}

	// draw the grids!
	grids.forEach(grid => {
		grid.drawGrid();
		grid.drawImg();
	});
}

class grid {
	constructor(x, y, gridWidth, gridHeight, colNum, rowNum) {
		this.x = x;
		this.y = y;
		this.width = gridWidth;
		this.height = gridHeight;
		this.cellCount = 10;
		this.c = 155;
		this.colNum = colNum;
		this.rowNum = rowNum;
	}

	drawGrid() {
		push();
		noFill();
		stroke(this.c);
		strokeWeight(0.2);
		translate(this.x, this.y);

		// Rows
		for (let i = 0; i < this.cellCount; i++) {

			// Columns
			for (let j = 0; j < this.cellCount; j++) {
				let x = this.width / this.cellCount * j;
				let y = this.height / this.cellCount * i;
				let cellWidth = this.width / this.cellCount;
				let cellHeight = this.height / this.cellCount;

				rect(x, y, cellWidth, cellHeight);
			}
		}
		pop();
	}

	drawImg() {

		// createGraphics creates a new drawing instance
		// it does not care where it is yet, which is handled later by image();
		// positioning is determined by using img.width and img.height instead of width/height
		// ex. img.circle(img.width/2, img.height/2, img.width/2)
		const img = createGraphics(this.width, this.height);
		let x, y, scaleX, scaleY;

		// create some scale factors based off of the col/row numbers
		scaleX = constrain(this.colNum/settings.cellCount * random(0.7, 2), 0.4, 1.5);
		scaleY = constrain(this.rowNum/settings.cellCount * random(0.7, 2), 0.4, 1.5);


		img.push();
		img.fill('#2223');
		img.stroke('#3335');

		// set center of drawing scaled off previous factors
		img.translate(img.width / 2 * scaleX, img.height / 2 * scaleY);
		img.beginShape();
		let angle = 0;
		let step = TWO_PI / settings.steps + 1;

		// scale radius with previous factors
		let r = constrain(img.width / 2 * random(1,2) * scaleX * scaleY, 0.3, img.width*1.5);
		for (let i = 0; i <= settings.steps; i++) {
			x = r * sin(angle) * random(0, 0.5);
			y = r * cos(angle) * random(0, 0.5);
			img.curveVertex(x, y);
			angle += step;
		}
		img.endShape();
		img.pop();

		// render the new render object with image()
		image(img, this.x, this.y, this.width, this.height);
	}
}


/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const gridTab = pane.addFolder({ title: 'Grid Settings' });
gridTab.addInput(settings, 'gapScale', { min: 0, max: 0.5, step: 0.01, label: 'Gap' });
gridTab.addInput(settings, 'marginScale', { min: 0, max: 0.5, step: 0.01, label: 'Margin' });
// gridTab.addInput(settings, 'topScale', { min: 0, max: 0.5, step: 0.01, label: 'Top Gap' });
gridTab.addInput(settings, 'cellCount', { min: 1, max: 10, step: 1, label: 'Cells' });

const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
	redraw();
});
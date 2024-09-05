const settings = {
	margin: 50,
	numColumns: 6,
	numRows: 6
}

let quadrants = [];

function preload() {

}

function setup() {
	noLoop();
	rectMode(CORNER);

	// Create and place the canvas
	const canvas = createCanvas(getCanvasWidth(), getCanvasWidth());
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);

	// reset quadrants
	quadrants = [];

	//--- Create Quadrants
	// width/height are determined by num of cells, subtracting gaps to allow for space
	const quadWidth = (width - settings.margin*2) / settings.numColumns;
	const quadHeight = (height - settings.margin*2) / settings.numRows;

	// column loop
	for(let i = 0; i < settings.numColumns; i++) {
		// row loop
		for(let j = 0; j < settings.numRows; j++) {
			let x,y;
			x = settings.margin + quadWidth * i;
			y = settings.margin + quadHeight * j;

			quadrants.push(new Quadrant(x,y,quadWidth,quadHeight));
		}
	}

	quadrants.forEach(quadrant => {
		quadrant.draw();
	});
}

class Quadrant {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;	
		this.debug = false;
		this.cells = getRandomInt(1,4);
		this.margin = 10;
		this.cellMargin = mapRange(width, 300, 2000, 5, 20, true) * getRandomInt(1,3);
		this.cellColumns = 4;
		this.cellRows = 4;
		this.cellStrokeWeight = mapRange(width, 300, 2000, 2, 10, true);
	}

	squareDesign1() {
		let x,y, layerWidth, layerHeight;
		let layers = getRandomInt(3,6);
		let totalStrokeWeight = 0;
		let cellStrokeWeight = this.cellStrokeWeight;

		for(let i=0; i < layers; i++) {
			layerWidth = this.width - totalStrokeWeight*2 - this.cellMargin*2*i - this.margin;
			layerHeight = this.height - totalStrokeWeight * 2 - this.cellMargin * 2 * i - this.margin;
			x = this.x + totalStrokeWeight + this.cellMargin*i + this.margin/2;
			y = this.y + totalStrokeWeight + this.cellMargin*i + this.margin/2;

			// 50% chance to fill in center
			if(i == layers -1 && getRandomInt(0,1)) {
				push();
				noStroke();
				fill('#000');
				translate(x, y);
				rect(0,0, layerWidth, layerHeight);
				pop();
				return;
			} 

			push();
			stroke('#000');
			strokeWeight(cellStrokeWeight);
			noFill();
			translate(x, y);
			rect(0, 0, layerWidth, layerHeight);
			pop();

			totalStrokeWeight += cellStrokeWeight;
		}
	}

	squareDesign2() {
		const cellWidth = (this.width - this.margin*2 - this.margin * 2) / this.cellColumns;
		const cellHeight = (this.height - this.margin*2 - this.margin * 2) / this.cellRows;

		// column loop
		for (let i = 0; i < this.cellColumns; i++) {
			// row loop
			for (let j = 0; j < this.cellRows; j++) {
				let x, y;
				x = this.x + this.margin*i + this.margin/2 + cellWidth*i;
				y = this.y + this.margin*j + this.margin/2 + cellHeight*j;

				push();
				strokeWeight(this.cellStrokeWeight);
				noFill();
				stroke('#000');
				translate(x, y);
				rect(0,0,cellWidth,cellHeight);
				pop();

				if(getRandomInt(0,1)) {
					push();
					noStroke();
					fill('#000');
					translate(x + this.cellStrokeWeight*2, y + this.cellStrokeWeight*2);
					rect(0, 0, cellWidth - this.cellStrokeWeight*4, cellHeight - this.cellStrokeWeight*4);
					pop();
				}
			}
		}
	}

	circleDesign1() {
		const cellWidth = (this.width - this.margin * 2 - this.margin * 2) / this.cellColumns;
		const cellHeight = (this.height - this.margin * 2 - this.margin * 2) / this.cellRows;

		// column loop
		for (let i = 0; i < this.cellColumns; i++) {
			// row loop
			for (let j = 0; j < this.cellRows; j++) {
				let x, y;
				x = this.x + this.margin * i + this.margin / 2 + cellWidth * i + cellWidth/2;
				y = this.y + this.margin * j + this.margin / 2 + cellHeight * j + cellWidth/2;

				push();
				strokeWeight(this.cellStrokeWeight);
				noFill();
				stroke('#000');
				translate(x, y);
				ellipse(0, 0, cellWidth, cellHeight);
				pop();

				if (getRandomInt(0, 1)) {
					push();
					noStroke();
					fill('#000');
					translate(x,y);
					ellipse(0, 0, cellWidth - this.margin, cellHeight - this.margin);
					pop();
				}
			}
		}
	}

	draw() {
		if(this.debug) {
			this.drawDebug();
		}

		if (this.cells == 1 || this.cells == 2) {
			this.squareDesign2();
		} else if(this.cells == 3) {
			this.circleDesign1();
		} else if(this.cells == 4) {
			this.squareDesign1();
		}
	}

	drawDebug() {
		// console.log('drawing a quadrant!');
		push();
		rectMode(CORNER);
		strokeWeight(2);
		stroke('#800');
		noFill();
		translate(this.x, this.y);
		rect(0, 0, this.width, this.height);
		pop();
	}
}


/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
// const folder = pane.addFolder({ title: 'Folder' });
// folder.addInput(settings, 'variable', { min: 0, max: 100, step: 1, label: 'Variable' });
pane.addInput(settings, 'margin', {min: 0, max: 100, step: 1, label: 'Margin'});
pane.addInput(settings, 'numColumns', { min: 1, max: 12, step: 1, label: 'Columns' });
pane.addInput(settings, 'numRows', { min: 1, max: 12, step: 1, label: 'Rows' });
const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
	redraw();
});
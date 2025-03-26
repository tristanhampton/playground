const settings = {
	width: null,
	height: null,
};

const cells = [];
let colors
const colors1 = [
	'#711DB0',
	'#C21292',
	'#EF4040',
	'#FFA732',
];

const colors2 = [
	'#FAA275',
	'#FF8C61',
	'#CE6A85',
	'#985277',
	'#5C374C',
];

const colors3 = [
	'#CEC2FF',
	'#B3B3F1',
	'#DCB6D5',
	'#CF8BA9',
	'#B15E6C',
]

const colors4 = ["#373f51","#008dd5","#dfbbb1","#f56476","#e43f6f"]
const colors5 = ["#52414c","#596157","#5b8c5a","#cfd186","#e3655b"]

colors = colors3;
const backgroundColor = '#3e3f44'

function setup() {
	noLoop();
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	const cellCount = 20;
	let x,y, size;
	size = width / cellCount;
	
	// rows
	for (let i = 0; i < cellCount; i++) {
		y = (size * i);
	
		// columns
		for (let j = 0; j < cellCount; j++) {
			x = (size * j);
			
			cells.push(new Cell(x,y,size));
		}
	}
}

function draw() {
	noStroke();
	background(backgroundColor);
	strokeWeight(1);
	noFill();
	

	cells.forEach(cell => {
		cell.draw();
	})
}

class Cell {
	constructor(x,y,size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.density = getRandomInt(5,20);
		this.orientation = getRandomInt(1,4);
		this.grid = getRandomInt(0,1);
		this.horizontalLines = getRandomInt(0,1);
		this.verticalLines = getRandomInt(0,1);
		this.noise = floor(noise(this.x, this.y) * 10);
		this.colorIndex = floor(mapRange(this.noise, 0, 10, 0, colors.length+1, false));
		this.color = colors[this.colorIndex];
	}

	draw() {
		push();
		stroke(this.color);
		strokeWeight(1.5)
		fill(backgroundColor);
		rect(this.x, this.y, this.x + this.size, this.y + this.size);
		pop();

		this.drawTriangle();
		this.drawGrid();
	}
	
	drawTriangle() {
		let x1,y1,x2,y2,x3,y3;

		if (this.orientation == 1) {
			// top left corner
			x1 = this.x;
			y1 = this.y;
			x2 = this.x + this.size;
			y2 = this.y + this.size;
			x3 = this.x;
			y3 = this.y + this.size;
		} else if (this.orientation == 2) {
			// top right corner
			x1 = this.x + this.size;
			y1 = this.y;
			x2 = this.x;
			y2 = this.y;
			x3 = this.x;
			y3 = this.y + this.size;
		} else if (this.orientation == 3) {
			// bottom right corner
			x1 = this.x + this.size;
			y1 = this.y + this.size;
			x2 = this.x + this.size;
			y2 = this.y;
			x3 = this.x;
			y3 = this.y;
		} else if (this.orientation == 4) {
			// bottom left corner
			x1 = this.x;
			y1 = this.y + this.size;
			x2 = this.x + this.size;
			y2 = this.y + this.size;
			x3 = this.x + this.size;
			y3 = this.y;
		}

		push();
		stroke(this.color);
		strokeWeight(2);
		fill(this.color);
		triangle(x1, y1, x2, y2, x3, y3);
		pop();
	}

	drawGrid() {
		if (this.grid) {
			this.drawVerticalLines();
			this.drawHorizontalLines();
			return;
		}

		if (this.verticalLines) {
			this.drawVerticalLines();
			return;
		}

		if (this.horizontalLines) {
			this.drawHorizontalLines();
			return;
		}
	}

	drawVerticalLines() {
		const columns = this.density;
		const gap = this.size/columns;

		push();
		strokeWeight(1);
		stroke(this.color);

		// vertical lines
		for(let i = 0; i < columns - 1; i++) {
			const x1 = this.x + gap * i + gap;
			const y1 = this.y;
			const x2 = x1;
			const y2 = this.y + this.size;
			line(x1, y1, x2, y2);
		}
		pop();
	}

	drawHorizontalLines() {
		const rows = this.density;
		const gap = this.size/rows;

		push();
		strokeWeight(1);
		stroke(this.color);

		//horizontal lines
		for(let i = 0; i < rows - 1; i++) {
			const x1 = this.x
			const y1 = this.y + gap * i + gap;
			const x2 = this.x + this.size;
			const y2 = y1;
			line(x1, y1, x2, y2);
		}
		pop();
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
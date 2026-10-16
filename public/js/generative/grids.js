const settings = {
	width: null,
	height: null,
};

let cols,rows,numCells,gw,gh,cw,ch,mx,my,x,y,n;
let frequency = 0.002;
let amplitude = 30;

const points = [];
const cells = [];


function setup() {
	noLoop();
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	cols = 12;
	rows = 6;
	numCells = cols * rows;

	// Grid
	gw = settings.width * 0.8;
	gh = settings.height * 0.8;

	// Cell
	cw = gw / cols;
	ch = gh / rows;

	// Margin
	mx = (settings.width - gw) / 2;
	my = (settings.height - gh) / 2;

	for (i = 0; i < numCells; i++) {
		x = (i % cols) * cw;
		y = Math.floor(i / cols) * ch;
		n = noise(x*frequency,y*frequency) * amplitude;

		x = getRandomInt(0,1) ? x-n : x+n;
		y = getRandomInt(0, 1) ? y - n : y + n;

		points.push(new Point({ x, y }));
	}
}

function draw() {
	noStroke();
	background('black');
	strokeWeight(1);

	push();
	translate(mx, my);
	translate(cw/2, ch/2);

	points.forEach(point => {
		point.draw();
	});
	pop();

	// Draw Lines
	push();
	translate(mx, my);
	translate(cw / 2, ch / 2);
	stroke('red');
	strokeWeight(2);
	noFill();
	for (let r = 0; r < rows; r++) {
		beginShape();
		for (let c = 0; c < cols; c++) {
			let point = points[r * cols + c];
			vertex(point.x, point.y);
		}
		endShape();
	}
	pop();

}

class Point {
	constructor({ x, y, control = false }) {
		this.x = x;
		this.y = y;
		this.control = control;
	}

	hitTest(x, y) {
		const dx = this.x - x;
		const dy = this.y - y;
		const dd = Math.sqrt(dx * dx + dy * dy);

		return dd < 20;
	}

	draw() {
		let fillStyle = this.control ? 'black' : 'red';
		push();
		fill(fillStyle);
		noStroke();
		translate(this.x, this.y)
		beginShape();
		circle(0, 0, 10);
		endShape();
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
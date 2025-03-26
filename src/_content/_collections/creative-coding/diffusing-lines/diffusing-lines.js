const settings = {
	width: null,
	height: null,
	colors: [],
	numColors: 4,
	numLines: 6,
	lines: [],
};

function setup() {
	noLoop();
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	settings.colors = risoColors(settings.numColors);
}

function draw() {
	noLoop();
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);
	settings.lines = [];
	settings.colors = risoColors(settings.numColors);

	for(let i=0; i<settings.numLines; i++) {
		let x=getRandomInt(10,settings.width);
		settings.lines.push(new DiffusingLine(x, 5, '#000'));
	}

	settings.lines.forEach(line => {
		line.draw();
	});
}

class DiffusingLine {

	constructor(x, strokeWeight, color) {
		this.x = x;
		this.strokeWeight = strokeWeight;
		this.lineEnd = settings.height * getRandomInt(40, 80) / 100

		let newColor = settings.colors[getRandomInt(0, settings.colors.length-1)].hex
		this.color = String(newColor)
	}

	lineSegment() {
		push();
		stroke(this.color);
		strokeWeight(this.strokeWeight);
		line(this.x, 0, this.x, this.lineEnd);
		pop();
	}
	
	diffusionSegment() {

		push();
		stroke(this.color);
		strokeWeight(5);
		for (let h = this.lineEnd; h < settings.height; h += (settings.height - this.lineEnd) / 10) {
			for(let w=0; w<100; w+=10 ) {
				point(this.x - w + 50, h);
			}
		}
		pop();


		// circle locater
		push(); 														 
		noFill();
		stroke('#000');
		strokeWeight(3);
		stroke(this.color)
		circle(this.x, this.lineEnd, 70);
		pop();
	}
	
	draw() {
		this.lineSegment();
		this.diffusionSegment();
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
const settings = {
	canvasWidth: null,
	canvasHeight: null,
	num: 20,
	angle: -30,
	rects: [],
	rectColors: [],
	numColors: 2,
	triangleYScale: 0.8,
	triangleXScale: 0.8,
	clipping: false,
	blend1: 0,
	blend2: 0,
};

function setup() {
	noLoop();
	settings.canvasWidth = getCanvasWidth();
	settings.canvasHeight = getCanvasWidth();
	
	// Create and place the canvas
	const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	// Set default blend modes
	settings.blend1 = OVERLAY;
	settings.blend2 = BLEND;
}

function draw() {
	// set canvas background
	background('#755979');
	noStroke();
	
	// clear rects and colours on redraw
	settings.rects = [];
	settings.rectColors = [];

	// Set colours that will be used
	settings.rectColors = risoColors(settings.numColors);

	// center context
	translate(settings.canvasWidth / 2, settings.canvasHeight / 2)

	// Draw Triangle and set to Clip
	if(settings.clipping) {
		stroke('#000');
		strokeWeight('10');
		noFill();
		let x1,y1,x2,y2,x3,y3;
		x1 = 0;
		y1 = settings.canvasHeight / 2 * -1 * settings.triangleYScale;
		x2 = settings.canvasHeight / 2 * settings.triangleXScale;
		y2 = settings.canvasHeight / 2 * settings.triangleYScale;
		x3 = settings.canvasHeight / 2 * -1 * settings.triangleXScale;
		y3 = settings.canvasHeight / 2 * settings.triangleYScale;
		triangle(x1, y1, x2, y2, x3, y3)
		drawingContext.clip();
	}

	// Create an array of rectangles
	for(i=0; i < settings.num; i++) {
		let x, y, w, h;
		x = getRandomInt(0, settings.canvasWidth) - settings.canvasWidth/2;
		y = getRandomInt(0, settings.canvasHeight) - settings.canvasHeight/2;
		w = getRandomInt(settings.canvasWidth * 0.4, settings.canvasWidth * 0.8);
		h = getRandomInt(settings.canvasHeight * 0.05, settings.canvasHeight * 0.4);

		settings.rects.push({x,y,w,h});
	}

	// Draw each rectangle
	settings.rects.forEach(rect => {
		let strokeColor = settings.rectColors[getRandomInt(0, settings.numColors - 1)].hex;
		let fillColor = settings.rectColors[getRandomInt(0, settings.numColors - 1)].hex;
		angle = settings.angle;
		
		blendMode(getRandomInt(0, 1) < 1 ? settings.blend1 : settings.blend2);
		const {x,y,w,h} = rect;
		stroke(strokeColor);
		strokeWeight(6);
		fill(fillColor);

		push();
		translate(x,y);
		drawSkewedRect(w,h,angle);
		pop();
		blendMode(BLEND);
	});
	
}

/* Functions
 * ----------------------------------------------- */
const drawSkewedRect = (w = 600,h = 200,degrees = -45) => {
	const angle = radians(degrees);
	const rx = Math.cos(angle) * w;
	const ry = Math.sin(angle) * w;

	push();

	// set the center of the shape to be the canvas transformed position
	translate(rx * -0.5, (ry + h) * -0.5);

	// Draw the shape
	beginShape();
	vertex(0, 0);
	vertex(rx, ry);
	vertex(rx, ry + h);
	vertex(0, h);
	vertex(0, 0)
	endShape();
	pop();
}

/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const saveButton = pane.addButton({ title: 'Save Image' });
const rectangleSettings = pane.addFolder({ title: 'Rectangle Settings' });
rectangleSettings.addInput(settings, 'angle', { min: -360, max: 360, step: 1, label: 'Angle' });
rectangleSettings.addInput(settings, 'num', { min: 10, max: 100, step: 2, label: 'Number of Rectangles' });
rectangleSettings.addInput(settings, 'numColors', { min: 2, max: 10, step: 1, label: 'Number of Colours' });
const triangleSettings = pane.addFolder({ title: 'Triangle Settings' });
triangleSettings.addInput(settings, 'clipping', {label: 'Clips'});
triangleSettings.addInput(settings, 'triangleXScale', { min: 0.3, max: 1, step: 0.1, label: 'X Scale' });
triangleSettings.addInput(settings, 'triangleYScale', { min: 0.3, max: 1, step: 0.1, label: 'Y Scale' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
	redraw();
});
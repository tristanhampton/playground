const settings = {
	width: null,
	height: null,
};

function preload() {

}

function setup() {
	noLoop();
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);

	let cols = 5;
	let spacer = settings.width/20;
	console.log(spacer)
	let maxWidth = settings.width/cols - spacer;
	let maxHeight = settings.height/cols - spacer;
	let minWidth = settings.width/40;
	let minHeight = settings.height/40;

	// row
	for (let i = 0; i < cols; i++) {
		let x = settings.height/cols * (i+1) - settings.width/cols/2;

		// column
		for (let j = 0; j < 8; j++) {
			let y = settings.width/cols * (j+1) - settings.height/cols/2;

			// drawing
			for (let k = 0; k < j+i + 1; k++) {
				let w = getRandomInt(minWidth,maxWidth);
				let h = getRandomInt(minHeight,maxHeight);
				let arcDiv = getRandomInt(2,15);
				let arcStart = getRandomInt(0,360);
				push();
				translate(x,y);
				noFill();
				stroke('#000');
				strokeWeight(2)
				arc(0,0,w, h, arcStart, TWO_PI/arcDiv)
				pop();
			}
		}
	}
}

/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
	redraw();
});
const settings = {
	width: null,
	height: null,
	numCellsWidth: null,
	numCellsHeight: null,
	margin: null,
	points: [],
	gap: 30,
};

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height, WEBGL);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(()=> {
		setup();
	});

	settings.points = [];
	settings.margin = width * 0.04;
	settings.numCellsWidth = Math.ceil((width - settings.margin * 2) / settings.gap);
	settings.numCellsHeight = Math.ceil((height - settings.margin * 2) / settings.gap);

	// create a grid of points to work with
	// for (i = settings.numCellsHeight*0.3; i < settings.numCellsHeight; i++) {
	// 	for (j = 0; j < settings.numCellsWidth; j++) {
	// 		const x_ = j * settings.gap + settings.margin;
	// 		const y_ = i * settings.gap + settings.margin;
	// 		settings.points.push(new Column({x: x_, y: y_}));
	// 	}
	// }

	for (i = settings.numCellsHeight*0.3; i < settings.numCellsHeight; i++) {
		const x_ = settings.margin;
		const y_ = i * settings.gap + settings.margin;
		settings.points.push(new Column({x: x_, y: y_, z: i}));
	}
	background('#f5f1e6');
}

function draw() {
	strokeWeight(1);

	settings.points.forEach(column => {
		column.update();
		column.draw();
	});
}

class Column {
	constructor(props) {
		this.x = props.x;
		this.y = props.y;
		this.z = props.z;
		this.w = 4;
		this.h = height - this.y - settings.margin*2;
		this.dist = this.w;
	}

	update() {
		// update direction
		const currentTimeInSeconds = Math.floor(Date.now() / 1000);
		let theta = noise(this.x * 0.005, this.y * 0.005) * PI * 3;
		let v = p5.Vector.fromAngle(theta, this.dist);
		this.y += v.y;
		
		theta = noise(this.x * 0.005, this.y * 0.005, currentTimeInSeconds) * PI * 3;
		v = p5.Vector.fromAngle(theta, this.dist);

		if (v.x<0) {
			v.x *= -1;
		}

		this.x += v.x;
		
		
		// delete self if outside of new position
		if (this.x > width - settings.margin || this.x < settings.margin) {
			this.deleteSelf();
		}

		if (this.y > height - settings.margin || this.y < settings.margin) {
			this.deleteSelf();
		}

		// update height
		this.h = height - settings.margin*2 - (height - this.y);
		this.h = height - this.y - settings.margin*2
	}

	draw() {
		push();
		strokeWeight(1);
		stroke('#ccc');
		fill('#666');
		// rect(this.x, this.y, this.w, this.h);
		translate(-width/2 + this.x, -height/2 + this.y, this.z)
		box(this.w, this.y, this.w)
		pop();
	}

	deleteSelf() {
		// get index of self
		const index = settings.points.indexOf(this);

		// remove self
		settings.points.splice(index, 1);
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
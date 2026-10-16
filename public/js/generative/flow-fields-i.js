const settings = {
	width: null,
	height: null,
	pal: [],
	squiggliness: 1 / 250,
	lineStroke: 1,
	freq: 4,
	gridWidth: 100,
	gridHeight: 100,
	grid: 10,
	particles: [],
	cells: [],
};

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	background('#f5f1e6');
	noStroke();
	settings.pal = ["#222", "#444", "#666", "#888", "#aaa", "#ccc"];

	// set squiggliness as a factor of the canvas width. Smaller screen = more intense curves
	settings.squiggliness = settings.width / 40000;
	settings.squiggliness = mapRange(settings.width, 1500, 300, 1, 5, true) / 1000;
	console.log(settings.squiggliness);

	// set frequency as a factor of canvas width. Smaller screen = more particles
	settings.freq = settings.width / 200;
	settings.freq = mapRange(settings.width, 300, 1500, 1, 6, true)

	// set size of grid as a factor of canvas width. Smaller screen = less cells
	settings.grid = floor(mapRange(settings.width, 300, 800, 4, 8, true));

	let w_ = settings.width/settings.grid;
	let h_ = settings.height/settings.grid;
	for (let i = 0; i < settings.grid; i++) {
		let x_ = i * w_;

		for (let j = 0; j < settings.grid; j++) {
			let y_ = j * h_;

			settings.cells.push(new Cell(x_, y_, w_, h_, i, j));
		}
	}

	// draw grid and particles within
	for (cell of settings.cells) {
		cell.draw();

		for(let x = cell.x; x < cell.x + cell.w; x += settings.freq) {
			let x_ = x;
			let y_ = cell.y;
			let s_ = settings.lineStroke;
			let c_ = color(settings.pal[floor(random(settings.pal.length))]);

			settings.particles.push(new Particle(x_, y_, s_, c_, cell));
			settings.particles.push(new Particle(x_, y_ + cell.h, s_, c_, cell));
		}

		for(let y = cell.y; y < cell.y + cell.h; y += settings.freq) {
			let x_ = cell.x;
			let y_ = y;
			let s_ = settings.lineStroke;
			let c_ = color(settings.pal[floor(random(settings.pal.length))]);

			settings.particles.push(new Particle(x_, y_, s_, c_, cell));
			settings.particles.push(new Particle(x_ + cell.h, y_, s_, c_, cell));
		}
	}
}

function draw() {
	for (let p of settings.particles) {
		p.draw();
		p.move();
		p.stop();
	}
}

class Cell {
	constructor(x_, y_, w_, h_, xid_, yid_) {
		this.x = x_;
		this.y = y_;
		this.w = w_;
		this.h = h_;
		this.xid = xid_;
		this.yid = yid_;
	}

	draw() {
		push();
		noFill();
		stroke('#111');
		rect(this.x, this.y, this.w, this.h);
		pop();
	}
}

class Particle {
	constructor(x_, y_, s_, c_, cell_) {
		this.x = x_;
		this.y = y_;
		this.size = s_;
		this.c = c_;
		this.cell = cell_;
		this.offset = PI * max(1, this.cell.xid) + max(1, this.cell.yid * 10);
		this.dist = 0.75;
	}

	move() {
		let theta = noise(this.x * settings.squiggliness, this.y * settings.squiggliness) * this.offset;
		let v = p5.Vector.fromAngle(theta, this.dist);
		this.x += v.x;
		this.y += v.y;
	}

	draw() {
		fill(this.c)
		ellipse(this.x, this.y, this.size)
	}

	stop() {
		if (this.x > this.cell.x + this.cell.w || this.x < this.cell.x) {
			this.dist = 0;
		}
		if (this.y > this.cell.y + this.cell.h || this.y < this.cell.y) {
			this.dist = 0;
		}
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
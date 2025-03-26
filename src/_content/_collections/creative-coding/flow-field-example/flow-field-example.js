const settings = {
	width: null,
	height: null,
	pal: [],
	// n: 100,
	squiggliness: 1 / 200,
	lineStroke: 1,
	freq: 4,
	particles: [],
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
	settings.pal = ["#04a3bd", "#f0be3d", "#931e18", "#da7901", "#247d3f", "#20235b"]//Lakota

	// create all the particles
	for (let x = 0; x < settings.width; x += settings.freq) {
		let x_ = x;
		let s_ = settings.lineStroke;
		let cNum = floor(random(settings.pal.length))
		let c_ = color(settings.pal[cNum])
		settings.particles.push(new Particle(x_, 0, s_, c_));
		settings.particles.push(new Particle(x_, settings.height, s_, c_));
	}

	for (let y = 0; y < settings.height; y += settings.freq) {
		let y_ = y;
		let s_ = settings.lineStroke;
		let cNum = floor(random(settings.pal.length))
		let c_ = color(settings.pal[cNum])
		settings.particles.push(new Particle(0, y_, s_, c_));
		settings.particles.push(new Particle(settings.width, y_, s_, c_));
	}
}

function draw() {
	for (let p of settings.particles) {
    p.draw();
    p.move();
    p.stop();
  }
}

class Particle {
	constructor(x_, y_, s_, c_) {
		this.x = x_;
		this.y = y_;
		this.size = s_;
		this.c = c_;

		this.dist = 0.75;
	}

	move() {
		let theta = noise(this.x * settings.squiggliness, this.y * settings.squiggliness) * PI * 2;
		let v = p5.Vector.fromAngle(theta, this.dist);
		this.x += v.x;
		this.y += v.y;
	}

	draw() {
		fill(this.c)
		ellipse(this.x, this.y, this.size)
	}

	stop() {
		if (this.x > settings.width || this.x < 0) {
			this.dist = 0;
		}
		if (this.y > settings.height || this.height < 0) {
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
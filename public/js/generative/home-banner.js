const settings = {
	width: null,
	height: null,
	freq: 100,
	size: 0.1,
	dist: 0.5,
	points: [],
	squiggliness: 1 / 250,
	colors: ['#FFF', '#FFF', '#FFF'],
	maxPoints: 100,
	spawnChance: 20000,
	endChance: 80000,
};

function setup() {
	settings.width = document.querySelector('#canvasContainer').offsetWidth;
	settings.height = document.querySelector('#canvasContainer').offsetHeight;

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	background('#000');
	noStroke();
	settings.points = [];

	// Create particles along the bottom of canvas
	for (let i = settings.width / 2; i < settings.width; i += settings.freq) {
		let x_ = i;
		let y_ = settings.height;
		let s_ = settings.size;
		let c_ = color(settings.colors[floor(random(settings.colors.length))]);
		settings.points.push(new Particle({ x_: x_, y_: y_, s_: s_, c_: c_ }));
	}

	// Create particles along the right side of canvas
	for (let i = settings.height / 2; i < settings.height; i += settings.freq) {
		let x_ = settings.width;
		let y_ = i;
		let s_ = settings.size;
		let c_ = color(settings.colors[floor(random(settings.colors.length))]);
		settings.points.push(new Particle({x_:x_, y_:y_, s_:s_, c_:c_}));
	}
}

function draw() {
	// Draw all the particles! 
	for (let p of settings.points) {
		p.draw();
		p.move();
		p.stop();
	}
}

class Particle {
	constructor(props) {
		this.x = props.x_;
		this.y = props.y_;
		this.size = props.s_;
		this.color = props.c_;
		this.offset = PI * 2;
		this.dist = settings.dist;
		this.spawned = props.spawned;
		this.endChance = settings.endChance;
		this.spawnChance = settings.spawnChance;

		// get a set of random numbers for use later
		const numbers = Array(100).fill().map((_, index) => index + 1);
		numbers.sort(() => Math.random() - 0.5);
		this.set = numbers.slice(0, 8);

		if (this.spawned) {
			this.offset = getRandomInt(0, 1) ? this.offset + PI * -6 : this.offset + PI * 6;
			this.spawnChance = this.spawnChance / 2;
			this.endChance = this.endChance / 2;
		}
	}

	move() {
		// Create new vectors based off of noise
		let theta = noise(this.x * settings.squiggliness, this.y * settings.squiggliness) * this.offset;
		let v = p5.Vector.fromAngle(theta, this.dist);

		// I really only want these numbers to move up and left, so make them negative
		if (v.x > 0 && !this.spawned) {
			v.x *= -1;
		}

		if (v.y > 0 && !this.spawned) {
			v.y *= -1;
		}

		// If this is not an original branch, make it go a new direction
		if (this.spawned) {
			v.x += PI;
			v.y += PI;
			this.spawned = false;
		}

		// Set a radndom chance that this branch will end
		if (getRandomInt(1, this.endChance) == this.set[0]) {
			this.deleteSelf();
		}

		// update x and y
		this.x += v.x;
		this.y += v.y;
	}

	draw() {

		// create a sort of "brush" by placing points inside a circle
		let radius = noise(this.x * 0.5);
		radius = mapRange(radius, 0, 1, 0.5, 1, true);
		for (let i = 0; i < 500; i++) {
			fill(this.color)
			let vector = randomInsideCircle(radius);
			ellipse(this.x + vector.x, this.y + vector.y, this.size);
		}

		// Set a random chance that a branch will spawn a new branch
		if (getRandomInt(1, this.spawnChance) == 10 && settings.points.length < settings.maxPoints) {
			let x_ = this.x;
			let y_ = this.y;
			let s_ = settings.size;
			let c_ = this.color;
			settings.points.push(new Particle({x_:x_, y_:y_, s_:s_, c_:c_, spawned:true}));
		}

	}

	stop() {

		// If branch is outside of canvase, stop it
		if (this.x > settings.width || this.x < 0) {
			this.deleteSelf();
		}
		if (this.y > settings.height || this.y < 0) {
			this.deleteSelf();
		}
	}

	deleteSelf() {

		// get index of self
		const index = settings.points.indexOf(this);

		// remove self
		settings.points.splice(index, 1);
	}
}

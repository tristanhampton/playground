const settings = {
	width: null,
	height: null,
};

const particles = [];
const cursor = { x:9999, y:9999 }
let colors;


function preload() {
	
}

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();
	colors = risoColors(20);
	
	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(onMouseDown);
	
	let x,y,particle, radius;
	let pos;
	const numCircles = 15;
	const gapCircle = 8;
	const gapDot = 4;
	let dotRadius = 12;
	let cirRadius = 0;
	const fitRadius = dotRadius;

	for (let i = 0; i < numCircles; i++) {
		const circumferance = Math.PI * 2 * cirRadius;
		const numFit = i ? Math.floor(circumferance / (fitRadius * 2 + gapDot)) : 1;
		const fitSlice = Math.PI * 2 / numFit;

		for (let j = 0; j < numFit; j++) {
			const theta = fitSlice * j;

			x = Math.cos(theta) * cirRadius;
			y = Math.sin(theta) * cirRadius;

			x += width*0.5;
			y += height*0.5;

			radius = dotRadius;

			particle = new Particle({x,y, radius});
			particles.push(particle);
		}

		// move to next ring of circles
		cirRadius += fitRadius * 2 + gapCircle;

		// reduce size of particles
		dotRadius = (1 - quadOut(i / numCircles)) * fitRadius;
	}

	// sort so smaller circles are behind larger ones
	particles.sort((a,b) => a.scale - b.scale);
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);
	
	particles.forEach(particle => {
		particle.update();
		particle.draw();
	});
}

function onMouseDown(e) {
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);

	onMouseMove(e);
}

function onMouseMove(e) {
	const x = (e.offsetX / canvas.offsetWidth) * width;
	const y = (e.offsetY / canvas.offsetHeight) * height;

	cursor.x = x;
	cursor.y = y;
}

function onMouseUp() {
	window.removeEventListener('mousemove', onMouseMove);
	window.removeEventListener('mouseup', onMouseUp);

	cursor.x = 9999;
	cursor.y = 9999;

}

class Particle {
	constructor({x,y,radius = 10}) {
		// position
		this.x = x;
		this.y = y;

		// acceleration
		this.ax = 0;
		this.ay = 0;

		// velocity
		this.vx = 0;
		this.vy = 0;

		// initial position
		this.ix = x;
		this.iy = y;

		// initial size
		this.radius = radius;
		this.scale = 1;

		this.color = colors[0];
		this.moveColor = colors[getRandomInt(0, colors.length-1)];

		// physics factors
		this.minDist = getRandomInt(100,200);
		this.pushFactor = getRandomInt(1,2) / 100;
		this.pullFactor = getRandomInt(2, 6) / 1000;
		this.dampFactor = getRandomInt(90,95) / 100;
		this.isMoving = false;
	}

	update() {
		let dx, dy, dd, distDelta;
		let idxColor;

		// pull force
		dx = this.ix - this.x;
		dy = this.iy - this.y;
		dd = Math.sqrt(dx * dx + dy * dy); // hypotnuse
		this.ax = dx * this.pullFactor;
		this.ay = dy * this.pullFactor;
		
		// change scale
		this.scale = mapRange(dd, 0, 200, 1, 5);

		// push force
		dx = this.x - cursor.x;
		dy = this.y - cursor.y;
		dd = Math.sqrt(dx*dx + dy*dy); // hypotnuse
		distDelta = this.minDist - dd;

		if(dd < this.minDist) {
			this.ax += (dx/dd) * distDelta * this.pushFactor;
			this.ay += (dy/dd) * distDelta * this.pushFactor;
		}

		// update velocity
		this.vx += this.ax;
		this.vy += this.ay;

		// dampen velocity
		this.vx *= this.dampFactor;
		this.vy *= this.dampFactor;

		// update position
		this.x += this.vx;
		this.y += this.vy;

		// check if moving
		// console.log(this.vx)
		if (this.vx > -0.01 && this.vx < 0.01) {
			this.vx = 0;
		}

		if (this.vy > -0.01 && this.vy < 0.01) {
			this.vy = 0;
		}

		if (this.vx == 0 && this.vy == 0) {
			this.isMoving = false;
		} else {
			this.isMoving = true;
		}
	}
	
	draw() {
		push();
		translate(this.x, this.y);
		if (this.isMoving) {
			fill(this.moveColor.hex);
		} else {
			fill(this.color.hex);
		}
		beginShape();
		arc(0,0,this.radius * this.scale,this.radius * this.scale,0,Math.PI*2);
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
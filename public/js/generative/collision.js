const settings = {
	width: null,
	height: null,
	gravity: 3,
};
const Engine = Matter.Engine;
const World = Matter.World;
const MouseConstraint = Matter.MouseConstraint;
const Mouse = Matter.Mouse;
const Bodies = Matter.Bodies;

let engine, world, mConstraint

const circles = [];
const boxes = [];
const grounds = [];
const sizes = []

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();
	
	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);
	
	engine = Engine.create();
	world = engine.world;

	sizes.push(settings.width / 5);
	sizes.push(settings.width / 10);
	sizes.push(settings.width / 20);
	sizes.push(settings.width / 30);
	sizes.push(settings.width / 40);

	grounds.push(new Boundary(0, height / 2, 10, height));
	grounds.push(new Boundary(width, height / 2, 10, height));
	grounds.push(new Boundary(0, 0, width, 10));
	grounds.push(new Boundary(width / 2, height, width, 10));
	World.add(world, grounds);

	let options = {
		mouse: Mouse.create(canvas.elt)
	}
	mConstraint = MouseConstraint.create(engine, options);
	World.add(world, mConstraint);
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);

	if (frameCount % 5 === 0) {
		let size = random(sizes);
		if (random() < 0.5) {
			boxes.push(new Box(width / 2, 80, size, size));
		} else {
			circles.push(new Circle(width / 2, 80, size / 2));
		}
	}

	Engine.update(engine);

	for (let box of boxes) {
		box.draw();
	}
	for (let circle of circles) {
		circle.draw();
	}
	for (let ground of grounds) {
		ground.draw();
	}
}



/* Objects
 * ----------------------------------------------- */
class Boundary {
	constructor(x, y, w, h) {
		let options = {
			friction: 0.3,
			restitution: 1,
			isStatic: true,
			//      angle: PI / 4
		};
		// https://brm.io/matter-js/docs/classes/Bodies.html
		this.body = Bodies.rectangle(x, y, w, h, options);
		this.w = w;
		this.h = h;
		World.add(world, this.body);
	}

	draw() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		strokeWeight(1);
		noStroke();
		fill('#000');
		rect(0, 0, this.w, this.h);
		pop();
	}
}

class Box {
	constructor(x, y, w, h) {
		let options = {
			friction: 0.3,
			restitution: 0.6
		};
		this.body = Bodies.rectangle(x, y, w, h, options);
		this.w = w;
		this.h = h;
		World.add(world, this.body);
	}

	draw() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		strokeWeight(1);
		stroke(255);
		fill(127);
		rect(0, 0, this.w, this.h);
		pop();
	}
}

class Circle {
	constructor(x, y, r) {
		let options = {
			friction: 0.3,
			restitution: 0.6
		};
		this.body = Bodies.circle(x, y, r, options);
		this.r = r;
		World.add(world, this.body);
	}

	draw() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		strokeWeight(1);
		stroke(255);
		fill(127);
		ellipse(0, 0, this.r * 2);
		pop();
	}
}


/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
// const folder = pane.addFolder({ title: 'Folder' });
// folder.addInput(settings, 'variable', { min: 0, max: 100, step: 1, label: 'Variable' });
const playPauseButton = pane.addButton({ title: 'Play/Pause' });
const saveButton = pane.addButton({ title: 'Save Image' });

playPauseButton.on('click', function() {
	if(isLooping()) {
		noLoop();
	} else {
		loop();
	}
});

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
	redraw();
});
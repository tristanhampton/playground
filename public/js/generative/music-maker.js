const settings = {
	width: null,
	height: null,
};

const Engine = Matter.Engine;
const World = Matter.World;
const MouseConstraint = Matter.MouseConstraint;
const Mouse = Matter.Mouse;
const Bodies = Matter.Bodies;
const Detectors = Matter.Detector;
const Events = Matter.Events;

let engine, world, mConstraint

const circles = [];
const boxes = [];
const grounds = [];
const sizes = [];
const platforms = [];

function preload() {

}

function setup() {
	noLoop()
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	engine = Engine.create();
	world = engine.world;

	grounds.push(new Boundary(0, height / 2, 2, height));
	grounds.push(new Boundary(width, height / 2, 2, height));
	grounds.push(new Boundary(0, 0, width, 2));
	grounds.push(new Boundary(width / 2, height, width, 2));
	World.add(world, grounds);

	let options = {
		mouse: Mouse.create(canvas.elt)
	}
	mConstraint = MouseConstraint.create(engine, options);
	World.add(world, mConstraint);

	platforms.push(new Platform(300, 300, 200, 5, 45));
	circles.push(new Circle(350, 200, 20));
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);



	Engine.update(engine);

	for (let circle of circles) {
		circle.draw();
	}

	for (let ground of grounds) {
		ground.draw();
	}

	platforms.forEach(platform => {
		platform.draw();
	});

	Events.on(engine, 'collisionStart', function (event) {
		var pairs = event.pairs;

		// change object colours to show those starting a collision
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			// pair.bodyA.render.fillStyle = '#333';
			// pair.bodyB.render.fillStyle = '#333';
		}
		console.log(pairs[0])
	});
}



/* Objects
 * ----------------------------------------------- */
class Boundary {
	constructor(x, y, w, h) {
		let options = {
			friction: 0.3,
			restitution: 0.3,
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

class Platform {
	constructor(x, y, w, h, angle) {
		let options = {
			friction: 0.3,
			restitution: 1,
			isStatic: true,
			angle: PI / 4
		};
		// https://brm.io/matter-js/docs/classes/Bodies.html
		this.body = Bodies.rectangle(x, y, w, h, options);
		this.detector = Detectors.create();
		this.w = w;
		this.h = h;
		World.add(world, this.body);
	}

	update() {

	}

	draw() {
		this.update();
		let pos = this.body.position;
		let angle = this.body.angle;

		if (this.detector.pairs) {
			console.log(this.detector);
		}

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

class Circle {
	constructor(x, y, r) {
		let options = {
			friction: 0.3,
			restitution: 1
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

playPauseButton.on('click', function () {
	if (isLooping()) {
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
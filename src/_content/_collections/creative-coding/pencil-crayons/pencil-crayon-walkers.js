let walkers = [];

const settings = {
	canvasWidth: null,
	canvasHeight: null,
};

function setup() {
	settings.canvasWidth = getCanvasWidth();
	settings.canvasHeight = getCanvasWidth();
	const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
	canvas.parent('canvasContainer');

	noStroke();
	background('#f5f1e6');
	draw();
}

// Handles click events
function mouseClicked() {
	const x = mouseX;
	const y = mouseY;

	walkers.push(new Pencil(x, y));
}

// Handles touch events on mobile
function touchStarted() {
	const x = touches[0].x;
	const y = touches[0].y;

	walkers.push(new Pencil(x, y));
}

function draw() {
	walkers.forEach(walker => {
		if (!walker.isOut()) {
			walker.velocity();
			walker.move();
			walker.draw();
		}
	});
}

class Pencil {
	constructor(x, y, colour, weight) {
		this.x = x || random(width);
		this.y = y || random(height);
		this.velocityX = 0;
		this.velocityY = 0;
		this.draw();
		this.weight = weight || random(0, 9);
		this.minWeight = 0;
		this.maxWeight = 0;
		this.colour = colour || this.randomColour();
	}

	randomColour() {
		const colour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		return colour;
	}

	isOut() {
		return (this.x < 0 || this.x > width || this.y < 0 || this.y > height);
	}

	velocity() {
		this.velocityX += random(-0.25, 0.25);
		this.velocityY += random(-0.25, 0.25);
	}

	move() {
		this.x += this.velocityX;
		this.y += this.velocityY;
	}

	draw() {
		fill(`${this.colour}`);
		let loops = 0;

		if (this.weight < 3) {
			loops = 2;
			this.minWeight = -2;
			this.maxWeight = 2;
		} else if (this.weight >= 3 && this.weight < 6) {
			loops = 4;
			this.minWeight = -4;
			this.maxWeight = 4;
		} else if (this.weight >= 6) {
			loops = 6;
			this.minWeight = -4;
			this.maxWeight = 4;
		}

		for (let i = 0; i < loops; i++) {
			circle(this.x + random(this.minWeight, this.maxWeight), this.y + random(this.minWeight, this.maxWeight), 2, 2);
		}
	}
}

/* Tweakpane
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});
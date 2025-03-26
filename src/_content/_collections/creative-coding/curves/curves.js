const settings = {
	width: null,
	height: null,
};

let points = [];

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');

	strokeWeight(1);
	points.push(new Point({x:200, y:540}));
	points.push(new Point({x:200, y:850, control:true}));
	points.push(new Point({x:800,y:540}));
	points.push(new Point({ x: 600, y: 700 }));
	points.push(new Point({ x: 640, y: 900 }));
}

function draw() {
	background('#f5f1e6');
	noFill();

	// Draw lines to each point
	push();
	stroke('#999');
	beginShape();
	vertex(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) {
		vertex(points[i].x, points[i].y);
	}
	endShape();
	pop();

	// Draw points halfway down each line
	push();
	beginShape();
	vertex(points[0].x, points[0].y);
	for(i=0; i < points.length - 1; i++) {
		const curr = points[i];
		const next = points[i+1];

		const mx = curr.x + (next.x - curr.x) / 2;
		const my = curr.y + (next.y - curr.y) / 2;

		fill('red');
		noStroke();
		circle(mx,my, 5);

		noFill();
		stroke('blue');
		quadraticVertex(curr.x, curr.y, mx, my)
	}
	vertex(points[points.length - 1].x, points[points.length - 1].y)
	endShape();
	pop();

	points.forEach(point => {
		point.draw();
	});
}

function mousePressed(e) {
	const x = e.offsetX;
	const y = e.offsetY;
	
	let hit = false;
	points.forEach(point => {
		point.isDragging = point.hitTest(x,y);

		if(!hit && point.isDragging) {
			hit = true;
		}
	});

	if(!hit) {
		points.push(new Point({x,y}))
	}
}

function mouseDragged(e) {
	const x = e.offsetX;
	const y = e.offsetY;

	points.forEach(point => {
		if(point.isDragging) {
			point.x = x;
			point.y = y;
		}
	});
}

class Point {
	constructor({x,y,control = false}) {
		this.x = x;
		this.y = y;
		this.control = control;
	}

	hitTest(x,y) {
		const dx = this.x - x;
		const dy = this.y - y;
		const dd = Math.sqrt(dx*dx + dy*dy);

		return dd < 20;
	}

	draw() {
		let fillStyle = this.control ? 'red' : 'black';
		push();
		fill(fillStyle);
		noStroke();
		translate(this.x, this.y)
		beginShape();
		circle(0,0,10);
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
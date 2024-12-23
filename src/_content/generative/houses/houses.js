const settings = {
	width: null,
	height: null,
};

function preload() {

}

function setup() {
	noLoop();
	settings.width = 3000;
	settings.height = 3000;

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);

	const house = new House({x: width*0.5 - 250, y: height*0.5 - 250});

	house.draw();
}

class House {
	constructor({x, y, width = 500, height = 500}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw() {
		// Build the south facing wall
		const sOffset = this.width*0.05;
		const sp1 = {x: this.x, y: this.y};
		const sp2 = {x: this.x + this.width/2, y: this.y - sOffset};
		const sp3 = {x: sp2.x + this.width/2, y: sp2.y + sOffset};
		const sp4 = {x: sp2.x + this.width/2, y: sp2.y + this.height + sOffset};
		const sp5 = {x: this.x + this.width/2, y: this.y + this.height - sOffset};
		const sp6 = {x: this.x, y: this.y + this.height};

		push();
		stroke(0);
		strokeWeight(3);
		noFill();
		beginShape();
		vertex(sp1.x, sp1.y);
		vertex(sp2.x, sp2.y);
		vertex(sp3.x, sp3.y);
		vertex(sp4.x, sp4.y);
		vertex(sp5.x, sp5.y);
		vertex(sp6.x, sp6.y);
		vertex(sp1.x, sp1.y);
		
		endShape(CLOSE);
		pop();

		// Build the west facing wall
		const wOffset = this.width*0.2;
		const wp1 = {x: sp3.x, y: sp3.y};
		const wp2 = {x: sp3.x + this.width*0.5, y: sp3.y - wOffset};
		const wp3 = {x: sp4.x + this.width*0.5, y: sp4.y - wOffset};
		const wp4 = {x: sp4.x, y: sp4.y};

		push();
		stroke(0);
		strokeWeight(3);
		noFill();
		quad(wp1.x, wp1.y, wp2.x, wp2.y, wp3.x, wp3.y, wp4.x, wp4.y);
		pop();

		// Build the roof
		const rOffset = this.width * 0.05;
		const rp1 = {x: sp2.x, y: sp2.y};
		const rp2 = {x: sp2.x + rOffset, y: sp3.y - rOffset};
		const rp3 = {x: sp3.x + rOffset, y: sp3.y - rOffset};
		const rp4 = {x: sp3.x, y: sp3.y};

		push();
		stroke(0);
		strokeWeight(3);
		quad(rp1.x, rp1.y, rp2.x, rp2.y, rp3.x, rp3.y, rp4.x, rp4.y);
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
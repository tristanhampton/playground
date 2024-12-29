const settings = {
  gap: null,
  cellGapRate: 0.04,
  lineGap: 3,
  cellsX: 10,
  frequency: 1,
  scale: 5,
  segments: 4,
  chaos: 1,
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

	settings.gap = settings.cellGapRate * width;
  const houses = []
  noStroke();
  background('#f5f1e6');

  // width/height are determined by num of cells, subtracting gaps to allow for space
  const w = width / settings.cellsX - settings.gap - (settings.gap / settings.cellsX);
  const h = height / settings.cellsX - settings.gap - (settings.gap / settings.cellsX);

  for (let i = 0; i < settings.cellsX; i++) {
    for (let j = 0; j < settings.cellsX; j++) {
      const x = settings.gap + (w + settings.gap) * i;
      const y = settings.gap + (h + settings.gap) * j;

      houses.push(new House({x: x, y: y, width: w, height: h}))
    }
  }

  // Draw each box
  houses.forEach(house => {
    house.draw();
		house.bound();
  });
}

class House {
	constructor({x, y, width = 500, height = 500}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw() {
		console.info('Drawing house at', this.x, this.y);
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
		fill('#f5f1e6');
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
		fill('#f5f1e6');
		quad(wp1.x, wp1.y, wp2.x, wp2.y, wp3.x, wp3.y, wp4.x, wp4.y);
		pop();

		// Build the right roof
		let rXOffset = this.width * 0.5;
		let rYOffset = this.width * 0.2;
		const rp1 = {x: sp2.x, y: sp2.y};
		const rp2 = {x: sp3.x, y: sp3.y};
		const rp3 = {x: wp2.x, y: wp2.y };
		const rp4 = {x: sp2.x + rXOffset, y: sp2.y - rYOffset};

		push();
		stroke(0);
		strokeWeight(3);
		fill('#f5f1e6');
		quad(rp1.x, rp1.y, rp2.x, rp2.y, rp3.x, rp3.y, rp4.x, rp4.y);
		pop();

		// Build the left roof
		rXOffset = this.width * 0.5;
		rYOffset = this.width * 0.2;
		const lrp1 = {x: sp1.x, y: sp1.y};
		const lrp2 = {x: sp2.x, y: sp2.y};
		const lrp3 = {x: rp4.x, y: rp4.y };
		const lrp4 = {x: sp1.x + rXOffset, y: sp1.y - rYOffset};

		push();
		stroke(0);
		strokeWeight(3);
		fill('#f5f1e6');
		quad(lrp1.x, lrp1.y, lrp2.x, lrp2.y, lrp3.x, lrp3.y, lrp4.x, lrp4.y);
		pop();
	}

	bound() {
		push();
		stroke('red');
		strokeWeight(2);
		noFill();
		rect(this.x, this.y, this.width, this.height);
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
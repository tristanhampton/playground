const settings = {
  gap: null,
  cellGapRate: -0.02,
	cellGapRateX: -0.02,
	cellGapRateY: -0.05,
  cellsX: 6,
}

function setup() {
	noLoop();
	settings.width = 3000;
	settings.height = 3000;

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	settings.gap = settings.cellGapRate * width;
	background('#f5f1e6');
}

function draw() {
	
  const houses = []

  // width/height are determined by num of cells, subtracting gaps to allow for space
  const w = width / settings.cellsX - settings.gap - (settings.gap / settings.cellsX);
  const h = height / settings.cellsX - settings.gap - (settings.gap / settings.cellsX);

  for (let i = 0; i < settings.cellsX; i++) {
    for (let j = 0; j < settings.cellsX; j++) {
			const rand = getRandomInt(0, 20);
      const x = settings.gap + (w + settings.gap) * i;
      const y = settings.gap + (h + settings.cellGapRateY * width) * j;
			console.log(rand);

			if (rand) {
				houses.push(new House({x: x, y: y, width: w, height: h}))
			}
    }
  }

	// houses.reverse();

  // Draw each box
  houses.forEach(house => {
    house.draw();
		// house.bound();
  });
}

class House {
	constructor({x, y, width = 500, height = 500}) {
		this.width = width;
		this.height = height;
		this.vOffset = this.height * (getRandomInt(2,4)/10); // Vertical offset for roof
		this.wOffset = (getRandomInt(4,8)/10); // Width offset for walls
		this.sWidth = this.width * this.wOffset; // South facing wall width
		this.sHeight = this.height * this.wOffset; // South facing wall height
		this.wWidth = this.width - this.sWidth; // West facing wall width
		this.wHeight = this.height - this.sHeight; // West facing wall height

		this.x = x;
		this.y = y + (this.height - this.sHeight); // Adjust y to begin drawing house at bottom left corner of width
		this.trueX = x;
		this.trueY = y;
	}

	draw() {
		console.info('Drawing house at', this.x, this.y);
		console.log(this.wOffset);
		// Build the south facing wall
		const sOffset = this.sWidth*0.05;
		const sp1 = {x: this.x, y: this.y};
		const sp2 = {x: this.x + this.sWidth/2, y: this.y - sOffset};
		const sp3 = {x: sp2.x + this.sWidth/2, y: sp2.y + sOffset};
		const sp4 = {x: sp2.x + this.sWidth/2, y: sp2.y + this.sHeight + sOffset};
		// const sp5 = {x: this.x + this.sWidth/2, y: this.y + this.sHeight - sOffset};
		const sp6 = {x: this.x, y: this.y + this.sHeight};

		push();
		stroke(0);
		strokeWeight(3);
		fill('#f5f1e6');
		beginShape();
		vertex(sp1.x, sp1.y);
		vertex(sp2.x, sp2.y);
		vertex(sp3.x, sp3.y);
		vertex(sp4.x, sp4.y);
		// vertex(sp5.x, sp5.y);
		vertex(sp6.x, sp6.y);
		vertex(sp1.x, sp1.y);
		endShape(CLOSE);
		pop();

		// Build the west facing wall
		const wp1 = {x: sp3.x, y: sp3.y};
		const wp2 = {x: sp3.x + this.wWidth, y: sp3.y - this.vOffset};
		const wp3 = {x: sp4.x + this.wWidth, y: sp4.y - this.vOffset};
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
		const rp4 = {x: sp2.x + rXOffset, y: sp2.y - this.vOffset};

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
		const lrp4 = {x: sp1.x + rXOffset, y: sp1.y - this.vOffset};

		push();
		stroke(0);
		strokeWeight(3);
		fill('#f5f1e6');
		quad(lrp1.x, lrp1.y, lrp2.x, lrp2.y, lrp3.x, lrp3.y, lrp4.x, lrp4.y);
		pop();
	}

	bound() {
		push();
		stroke('#f003');
		strokeWeight(2);
		noFill();
		rect(this.trueX, this.trueY, this.width, this.height);
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
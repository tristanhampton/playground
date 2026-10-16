const lines = [];

function setup() {
	// Create and place the canvas
	const canvas = createCanvas(getCanvasWidth(), getCanvasWidth());
	canvas.parent('canvasContainer');
	canvas.mouseClicked(redraw);

	lines.push(new recursiveLine(width * 0.5, height * 0.5, width * 0.3, PI*2));
	lines.push(new recursiveLine(width * 0.5, height * 0.5, width * 0.3, PI));
	background('#f5f1e6');
}

function draw() {
	noStroke();
	strokeWeight(1);
	stroke('#111');
	let done = true;


	lines.forEach(line => {
		line.draw();
	});

	// after drawing the lines, check to see if there are any left to stop 
	lines.forEach(line => {
		if (!line.drawn) {
			done = false;
		}
	});

	if (done) {
		noLoop();
	}
}

class recursiveLine {
	/* 
		The idea of the recursive drawer is to make a function that calls itself for a set period of time.
		It will create new drawings based off of its own current position.

		We also need to know some simple trig here.
		https://stackoverflow.com/questions/3545059/how-to-calculate-the-pointx2-y2-with-the-point-x1-y1-and-the-angle

		soh : sin X = opposite / hypotenuse
		cah : cos X = adjacent / hypotenuse
		toa : tan X = opposite / adjacent

   		       /|
  	        / |
 		       /  |
	        /   |
 		     /    |
 		hyp /     | opp
 		   /      |
	    /       |
 		 /       _|
	  /X      | |
	 *----------+
	*/
	constructor(x, y, length, direction) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.direction = direction;
		this.adjacentPlane = cos(direction) * this.length;
		this.oppositePlane = sin(direction) * this.length;
		this.endX = this.x + this.adjacentPlane;
		this.endY = this.y + this.oppositePlane;
		this.midX1 = this.x + cos(direction) * this.length * 0.66;
		this.midY1 = this.y + sin(direction) * this.length * 0.66;
		this.midX2 = this.x + cos(direction) * this.length * 0.33;
		this.midY2 = this.y + sin(direction) * this.length * 0.33;
		this.drawn = false;
	}

	draw() {
		// stop drawing if too small or already drawn
		if (this.length <= 5 || this.drawn) {
			return
		}

		// draw this line
		line(this.x, this.y, this.endX, this.endY);

		// create a new line
		lines.push(new recursiveLine(this.endX, this.endY, this.length * 0.75, this.direction - PI / 4));

		// create new lines part way through
		lines.push(new recursiveLine(this.midX1, this.midY1, this.length * 0.5, this.direction - PI / 4));
		lines.push(new recursiveLine(this.midX2, this.midY2, this.length * 0.25, this.direction - PI / 4));

		// mark this line as drawn so we don't keep calling it and making new lines
		this.drawn = true;
	}
}
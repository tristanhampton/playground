const settings = {
	width: null,
	height: null,
	radius: 1, // default 1.2
	backgroundColor: '#5a2e01',
	circleColor: '#c6a333',
	audioChannel: 6,
	playing: false,
	scaleMin: 0.01,
	scaleMax: 1.4,
	steps: 60,
};

let audio, audioContext, audioData, sourceNode, analyserNode, fft;
let minDb, maxDb, channels = [];

function preload() {
	audio = loadSound('/mp3/generative/supernormal.mp3');
	audioContext = getAudioContext();
	analyserNode = new p5.FFT(0.9);
}

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();
	
	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	
	for (let i = 0; i < settings.steps; i++) {
		channels.push(getRandomInt(4, 64));
	}
	
}

function draw() {
	noStroke();
	background(settings.backgroundColor);
	strokeWeight(1);
	audioData = analyserNode.analyze();
	
	// If not playing, draw to look like album artwork
	if (!settings.playing) {
		push();
		noStroke();
		fill(settings.circleColor);
		translate(settings.width * 0.89, settings.height * 0.3);
		let circleRadius = settings.width * settings.radius;
		circle(0, 0, circleRadius);
		pop()
	}

	push();
	noStroke();
	fill(settings.circleColor);
	translate(settings.width * 0.88, settings.height * 0.3);

	let bins = [];
	for (let i = 0; i < settings.steps; i++) {
		let channel = mapRange(audioData[channels[i]], 30, 255, settings.scaleMin, settings.scaleMax, true);
		bins.push(channel);
	}

	beginShape();
	let angle = 0;
	let step = TWO_PI / settings.steps + 1;
	let r = settings.width / 2 * settings.radius;
	for (let i = 0; i <= settings.steps; i++) {
		x = r * sin(angle) * bins[i];
		y = r * cos(angle) * bins[i];
		curveVertex(x, y);

		angle += step;
	}
	endShape();
	pop();

	// Text always last so it's on top
	//--- Modern Chemistry
	push();
	fill('white');
	textFont('Helvetica Neue');
	textStyle(BOLD);
	textSize(settings.width * 0.035);
	text('Modern Chemistry', settings.width * 0.03, settings.height * 0.06);
	pop();

	//--- Supernormal..and..Pilot
	push();
	fill('white');
	textFont('Helvetica Neue');
	textSize(settings.width * 0.035);
	text('Supernormal..and..Pilot', settings.width * 0.35, settings.height * 0.06);
	pop();

	//--- Subscript
	push();
	fill('white');
	textFont('Helvetica Neue');
	textSize(settings.width * 0.012);
	let leftMargin = settings.width * 0.03;
	let verticalPosition = settings.height * 0.94;
	let lineHeight = settings.height * 0.013;
	let line1 = 'This song was recorded by Modern Chemistry. Eric Romero engineered and co-produced it with the band. The songs were mixed and mastered';
	let line2 = 'by Adam Cichocki at Timber Studios with the exception of "..and..." being mixed by Tim Panella. Erik played bass and Mike Linardi played drums.';
	let line3 = 'Modern Chemistry is Joe Zorzi and Brendan Hourican. Thank you for listening.';

	text(line1, leftMargin, verticalPosition);
	verticalPosition += lineHeight;
	text(line2, leftMargin, verticalPosition);
	verticalPosition += lineHeight;
	text(line3, leftMargin, verticalPosition);
	pop();
}

/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const playPauseButton = pane.addButton({ title: 'Play/Pause'});

playPauseButton.on('click', function() {
	if(audio.isPlaying()) {
		audio.pause();
		settings.playing = false;
	} else {
		audio.play();
		settings.playing = true;
	}
});
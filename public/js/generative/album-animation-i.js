const settings = {
	width: null,
	height: null,
	radius: 1.2, // percent
	backgroundColor: '#5a2e01',
	circleColor: '#c6a333',
	audioChannel: 6,
	playing: false,
	scaleMin: 0.3,
	scaleMax: 1.9,
};

let audio, audioContext, audioData, sourceNode, analyserNode
let minDb, maxDb;
createAudio();
addListeners();

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
}

function draw() {
	noStroke();
	background(settings.backgroundColor);
	strokeWeight(1);

	analyserNode.getFloatFrequencyData(audioData);

	// If not playing, draw to look like album artwork
	if(!settings.playing) {
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
	translate(settings.width*0.88, settings.height*0.3);

	// Get a mapped number from audio data to apply to circle
	let mapped = mapRange(audioData[settings.audioChannel], minDb, maxDb, settings.scaleMin, settings.scaleMax, true);
	let circleRadius = settings.width * settings.radius * mapped;
	circle(0, 0, circleRadius);
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

/* Other Functions
 * ----------------------------------------------- */
function addListeners() {
	document.querySelector('.container.type--canvas').addEventListener('click', async function() {
		if (audio.paused) {
			audio.play();
			loop();
			settings.playing = true;
		} else {
			audio.pause();
			noLoop();
			settings.playing = false;
		}
	});
}

function createAudio() {
	audio = document.createElement('audio');

	// source file is in generative/audio
	audio.src = '../mp3/supernormal.mp3';

	// Create Audio Context
	audioContext = new AudioContext();
	
	// Create Source Node from adding audio element to Audio Context
	sourceNode = audioContext.createMediaElementSource(audio);
	sourceNode.connect(audioContext.destination);

	// Create Analyser Node to read data from audio and work with it
	analyserNode = audioContext.createAnalyser();

	// Change fft (Fast Fourier Transform) from default. Should be a power of 2 from 0 to 32768.
	analyserNode.fftSize = 32768;

	// Change smoothing constant for smoother effects (default is 0.8)
	analyserNode.smoothingTimeConstant = 0.8;

	// Change min/max defaults for decibels (defaults are -100 and -30 respectively)
	analyserNode.minDecibels = -120;
	analyserNode.maxDecibels = -20;

	minDb = analyserNode.minDecibels;
	maxDb = analyserNode.maxDecibels;

	// Connect the analyser node
	sourceNode.connect(analyserNode);

	// has to be a float array because we're using analyserNode.getFloatFrequencyData in the draw function
	audioData = new Float32Array(analyserNode.frequencyBinCount);
}

/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const folder = pane.addFolder({ title: 'Settings' });
folder.addInput(settings, 'audioChannel', { min: 1, max: 5555, step: 1, label: 'Audio Channel' });
folder.addInput(settings, 'scaleMin', { min: 0.1, max: 0.8, step: 0.1, label: 'Scale Minimum' });
folder.addInput(settings, 'scaleMax', { min: 1.2, max: 4, step: 0.1, label: 'Scale Maximum' });

// const saveButton = pane.addButton({ title: 'Save Image' });

// saveButton.on('click', function () {
// 	saveCanvas('generated-image', 'png');
// });


pane.on('change', function () {
	redraw();
});
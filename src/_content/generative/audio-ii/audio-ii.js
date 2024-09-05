const settings = {
	width: null,
	height: null,
	numCircles: 5,
	numSlices: 9,
	slice: 0,
	radius: 200,
};
settings.slice = Math.PI * 2 / settings.numSlices;

let audio, audioContext, audioData, sourceNode, analyserNode
let bin, bins = [], lineWidth, mapped, minDb, maxDb, lineWidths = [];

function preload() {
	audio = loadSound('../mp3/Apta - Elements 1 - 07 Breath.mp3');
	audioContext = getAudioContext();
	analyserNode = new p5.FFT(0.9);
}

function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);

	audioData = analyserNode.analyze();

	// Create array of random numbers to pull from audioData
	for(i=0; i < settings.numCircles * settings.numSlices; i++) {
		bin = getRandomInt(4,64);
		if(getRandomInt(0,1)==0) bin = 0;
		bins.push(bin);
	}

	// Create an array of varying line widths for visual interest
	for(i=0; i<settings.numCircles; i++) {
		const t = i/ (settings.numCircles - 1);
		lineWidth = quadIn(t) * settings.width/2 + 20;
		lineWidths.push(lineWidth);
	}

	push()
	noFill();
	stroke('black');
	strokeCap(SQUARE);
	translate(settings.width/2, settings.height/2)

	let cradius = settings.radius;
	
	for(let i = 0; i < settings.numCircles; i++) {
		
		push();
		for(let j=0; j < settings.numSlices; j++) {
			// rotate by one slice amount on each slice to make a cicle
			rotate(settings.slice);
			
			// get the bin value. If it's 0, continue
			bin = bins[i*settings.numSlices + j];
			if(!bin) continue;

			// map the audio data to be between 0 and 1
			mapped = mapRange(audioData[bin], 0, 255, 0, 1, true);
			lineWidth = lineWidths[i] * mapped;
			if (lineWidth < 1) continue;

			// Draw the arc! 
			strokeWeight(lineWidth);
			arc(0, 0, cradius + lineWidth/2, cradius + lineWidth/2, 0, settings.slice)
		}

		// increase the radius so that they don't overlap
		cradius += lineWidths[i];
		pop();
	}

	pop()

}

/* Other Functions
 * ----------------------------------------------- */
function addListeners() {
	document.querySelector('audio').addEventListener('play', async function () {
		loop();
		settings.playing = true;
	});

	document.querySelector('audio').addEventListener('pause', async function () {
		noLoop();
		settings.playing = false;
	});
}

function createAudio() {
	audio = document.querySelector('audio');

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
	analyserNode.smoothingTimeConstant = 0.9;

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
const playPauseButton = pane.addButton({ title: 'Play/Pause' });
const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

playPauseButton.on('click', function () {
	if (audio.isPlaying()) {
		audio.pause();
		settings.playing = false;
	} else {
		audio.play();
		settings.playing = true;
	}
});
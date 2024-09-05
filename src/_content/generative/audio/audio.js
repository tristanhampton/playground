const settings = {
	width: null,
	height: null,
};

let audio, audioContext, audioData, sourceNode, analyserNode
let bins;
createAudio();
addListeners();

// createAudio();
function setup() {
	settings.width = getCanvasWidth();
	settings.height = getCanvasWidth();

	// Create and place the canvas
	const canvas = createCanvas(settings.width, settings.height);
	canvas.parent('canvasContainer');
	bins = [2,12,22];
}

function draw() {
	noStroke();
	background('#f5f1e6');
	strokeWeight(1);

	analyserNode.getFloatFrequencyData(audioData);

	for(let i=0; i < bins.length; i++) {
		// Audio data is often in negatives becuase they're in decibal values
		const bin = bins[i];
		const mapped = mapRange(audioData[bin], analyserNode.minDecibels, analyserNode.maxDecibels, 0, 1, true)
		const radius = mapped * settings.width;
	
		push();
		noFill();
		stroke('black')
		strokeWeight(12)
		translate(settings.width/2, settings.height/2)
		circle(0,0, Math.abs(radius))
		pop();
	}

}

/* Other Functions
 * ----------------------------------------------- */
function addListeners() {
	document.querySelector('.container.type--canvas').addEventListener('mouseup', async function() {
		if (audio.paused) {
			audio.play();
			loop();
		} else {
			audio.pause();
			noLoop();
		}
	});
}

function createAudio() {
	audio = document.createElement('audio');
	audio.src = '../mp3/Apta - Elements 1 - 07 Breath.mp3';

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

	// Connect the analyser node
	sourceNode.connect(analyserNode);

	// has to be a float array because we're using analyserNode.getFloatFrequencyData in the draw function
	audioData = new Float32Array(analyserNode.frequencyBinCount);
}

/* Tweakpane Things
* ----------------------------------------------- */
const pane = new Tweakpane.Pane({ title: 'Controls', container: document.querySelector('.project__tweak-settings') })
const saveButton = pane.addButton({ title: 'Save Image' });

saveButton.on('click', function () {
	saveCanvas('generated-image', 'png');
});

pane.on('change', function () {
	redraw();
});
const settings = {
    canvasWidth: null,
    canvasHeight: null,
    frameRate: 15,
    gap: 6,
    stroke: '#000',
    fill: '#f5f1e6',
    crestMultiplier: 0.2,
    valleyMultiplier: 0.6,
    diameterMultiplier: 0.35,
    get circleDiameter() {
        return this.canvasWidth * this.diameterMultiplier;
    }
};

const pane = new Tweakpane.Pane({ title: 'Settings', container: document.querySelector('.project__tweak-settings') })
pane.addInput(settings, 'gap', { min: 1, max: 100, step: 1 });
pane.addInput(settings, 'crestMultiplier', { min: 0.01, max: 1, step: 0.01 });
pane.addInput(settings, 'valleyMultiplier', { min: 0.01, max: 1, step: 0.01 });
pane.addInput(settings, 'diameterMultiplier', { min: 0.05, max: 1, step: 0.05 });
const saveButton = pane.addButton({ title: 'Save Image' });

pane.on('change', function () {
    redraw();
});

saveButton.on('click', function () {
    saveCanvas('generated-image', 'png');
});


function setup() {
    noLoop();
    settings.canvasWidth = getCanvasWidth();
    settings.canvasHeight = getCanvasWidth();

    const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
    canvas.parent('canvasContainer');
    frameRate(settings.frameRate);
    canvas.mouseClicked(redraw);
}

function draw() {
    background(settings.fill);
    stroke(settings.stroke);
    fill(settings.fill);

    // draw lines accross
    for (let i = settings.gap; i < settings.canvasHeight; i += settings.gap) {
        line(0, i, settings.canvasWidth, i);
    }

    // draw circle over top lines
    stroke(settings.fill);
    ellipse(settings.canvasWidth / 2, settings.canvasHeight / 2, settings.circleDiameter);

    // create random paths where the lines touch the circle
    for (let i = settings.gap; i < settings.canvasHeight; i += settings.gap) {
        // get missing x1 and x2 coordinates
        let triangleHeight = settings.canvasHeight / 2 - i;
        let triangleHypotnus = settings.circleDiameter / 2;

        let x1 = settings.canvasWidth / 2 - getTriangleWidth(triangleHeight, triangleHypotnus);
        let x2 = settings.canvasWidth / 2 + getTriangleWidth(triangleHeight, triangleHypotnus);

        let pathType = Math.ceil(random(0, 2));

        if (pathType == 1) {
            randomPathRound(x1, i, x2, i);
        } else {
            randomPathStraight(x1, i, x2, i);
        }
    }
}


function randomPathStraight(x1, y1, x2, y2) {
    strokeWeight(1);
    stroke(settings.stroke);
    const numTurns = Math.ceil(random(1, 4));
    const endDistance = x2 - x1;
    let savedRy;
    let savedRx;

    // Draw a line for each turn
    for (let i = 0; i < numTurns; i++) {
        ry = random(y1 + 30, y1 - 30);

        if (i == 0) {
            // first line in path
            maxDistance = x1 + endDistance / numTurns;
            rx = random(x1 + 10, maxDistance);
            line(x1 - 1, y1, rx, ry);
            savedRy = ry;
            savedRx = rx;
        } else if (i == numTurns - 1) {
            // last line in path
            line(savedRx, savedRy, x2, y2);
        } else {
            // // every other line in the middle
            rx = random(savedRx, x1 + endDistance);
            line(savedRx, savedRy, rx + 1, ry);
            savedRx = rx;
            savedRy = ry;
        }
    }
}

function randomPathRound(x1, y1, x2, y2) {
    strokeWeight(1);
    stroke(settings.stroke);
    noFill();
    let vMin = y1 - settings.canvasHeight * settings.crestMultiplier;
    let vMax = y1 + settings.canvasHeight * settings.valleyMultiplier;
    let cpx1 = Math.ceil(random((x1 - 10), (x2 + 10)));
    let cpy1 = Math.ceil(random(vMin, vMax));
    let cpx2 = Math.ceil(random((x1 - 10), (x2 + 10)));
    let cpy2 = Math.ceil(random(vMin, vMax));

    bezier(x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2);
}

function getTriangleWidth(height, hypotnus) {
    return sqrt(Math.pow(hypotnus, 2) - Math.pow(height, 2))
}
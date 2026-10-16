let files = document.querySelector('#svgFile');
let form = document.querySelector('form')

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // clear images
  document.querySelector('.output.images').innerHTML = '';

  // get path elements
  const paths = await getSVGPaths(files.files);

  // Get aspect ratio
  const cssAspectRatio = await generateAspectRatio(files.files);

  // Display uploaded svg as an image
  generateImg(files.files, '.output.images');

  // Get number of desired density
  const density = document.querySelector('#numberOfPoints').value ? document.querySelector('#numberOfPoints').value : 50

  // Convert path to array of points
  const points = convertSvgPathToPoints(paths, density);

  // Generate CSS code
  const cssClipPath = generateClipPath(points)


  // Display and highlight CSS code
  document.querySelector('.output.code').innerHTML = `img {\n ${cssClipPath}\n ${cssAspectRatio}\n}`;
  document.querySelector('.output.code').setAttribute('data-copy', cssClipPath + '\n' + cssAspectRatio);
  hljs.highlightAll();

  // Generate clipped image
  generateClippedImg(cssClipPath + cssAspectRatio, '.output.images')

  // TODO: Calculate aspect ratio to go with it
});

// Copy css to clipboard
document.querySelector('button.copy').addEventListener('click', copyToClipboard);

function generateClippedImg(css, containerSelector) {
  const imgContainer = document.querySelector(containerSelector);
  const imgEl = document.createElement('img');
  imgEl.src = 'https://picsum.photos/200/200'
  imgEl.setAttribute('style', css);

  imgContainer.appendChild(imgEl);
}

function generateImg(files, containerSelector) {
  const reader = new FileReader();

  reader.onload = async function (e) {
    const imgContainer = document.querySelector(containerSelector);
    const svgData = e.target.result;
    const imgEl = document.createElement('img');

    // imgContainer.innerHTML = '';
    imgEl.src = svgData;
    imgContainer.innerHTML += svgData;
  }

  reader.readAsText(files[0]);
}


function getSVGPaths(files) {
  // example from https://stackoverflow.com/questions/55943199/easiest-way-to-get-path-tag-from-user-uploaded-svg

  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = async function (e) {
      const svgData = e.target.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgData, "image/svg+xml");
      const pathTags = doc.getElementsByTagName("path");

      resolve(pathTags)
    }

    reader.readAsText(files[0]);
  });
}


function convertSvgPathToPoints(paths, density) {
  const path = paths[0];
  const len = path.getTotalLength();
  const points = [];
  let prevPt = [null, null];
  let offset = 0;

  steps = len/density;

  for (var i = 0; i < steps; i++) {
    const pt = path.getPointAtLength(i * len / (steps - 1));

    // get previous point if this isn't the first one, otherwise make the first point
    if (i > 0) {
      prevPt = points[i - 1 - offset];
    } else {
      points.push([pt.x, pt.y]);
    }

    // if points are in a straight line, don't record them.
    if (pt.x != prevPt[0] && pt.y != prevPt[1]) {
      points.push([pt.x, pt.y]);
    } else {
      offset++;
    }
  }

  return points;
}


function getScaledValue(value, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax) {
  var targetRange = targetRangeMax - targetRangeMin;
  var sourceRange = sourceRangeMax - sourceRangeMin;
  return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
}

function generateClipPath(coordinates) {
  let rawNumbersX = [], rawNumbersY = [], largestX, largestY, smallestX, smallestY, clipPath = '';

  // Generate array of numbers to find the largest and smallest values
  coordinates.forEach(array => {
    rawNumbersX.push(array[0]);
    rawNumbersY.push(array[1]);
  });

  largestX = Math.max.apply(0, rawNumbersX);
  largestY = Math.max.apply(0, rawNumbersY);
  smallestX = Math.min.apply(0, rawNumbersX);
  smallestY = Math.min.apply(0, rawNumbersY);

  // Create array of values scaled down between 0 and 100
  coordinates.forEach((coordinate, i) => {
    let scaledX = getScaledValue(coordinate[0], smallestX, largestX, 0, 100).toFixed(4) + '%';
    let scaledY = getScaledValue(coordinate[1], smallestY, largestY, 0, 100).toFixed(4) + '%';
    coordinates[i] = [scaledX, scaledY];
  });

  // turn converted coordinates into string
  for (let i = 0; i < coordinates.length; i++) {
    if (i < coordinates.length - 1) {
      clipPath += `${coordinates[i][0]} ${coordinates[i][1]}, `
    } else {
      clipPath += `${coordinates[i][0]} ${coordinates[i][1]}`
    }
  }

  // Convert string into polygon CSS property
  clipPath = `clip-path: polygon(${clipPath});`;

  return clipPath;
}

function generateAspectRatio(files) {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = async function (e) {
      const svgData = e.target.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgData, "image/svg+xml");
      const svg = doc.querySelector('svg');
      let viewBox = svg.getAttribute('viewBox')
      viewBox = viewBox.split(' ');
      let aspectRatio = `aspect-ratio: ${viewBox[2]} / ${viewBox[3]};`;

      resolve(aspectRatio)
    }

    reader.readAsText(files[0]);
  });
}

function copyToClipboard() {
  const innerText = document.querySelector('.output.code').getAttribute('data-copy');
  navigator.clipboard.writeText(innerText);
}
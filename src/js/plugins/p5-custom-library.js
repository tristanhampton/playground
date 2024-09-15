/* Setup Functions
 * ----------------------------------------------- */

/**
 * Returns the ideal canvas width by getting the current width of the container and subtracting the padding.
 * 
 * @param {type} var Description.
 */
p5.prototype.getCanvasWidth = function () {
  let main = document.querySelector('.site__main');
  let windowHeight = window.innerHeight;
  let width = main.offsetWidth;
  let padding = getStyle(main, 'padding-left');

  if (width > windowHeight)
    return windowHeight - 50;
  else 
    return width - 50;
}

/* Lines
 * ----------------------------------------------- */

/**
 * Creates a line in any direction and applies noise to it.
 * 
 * @param {int} x1 The first X coordinate.
 * @param {int} y1 The first Y coordinate.
 * @param {int} x2 The second X coordinate.
 * @param {int} y2 The second Y coordinate.
 * @param {object} noiseSettings Optional. Handles all settings that will apply to noise.
 */
p5.prototype.noisyLine = function (x1, y1, x2, y2, noiseSettings) {
  // adapted from https://stackoverflow.com/questions/69389189/noisy-line-between-two-specific-points-p5-js
  let segments, noiseScale, noiseFrequency, noiseSpeed, debug, chaos;

  // defaults
  noiseScale = 50;
  noiseFrequency = 0.001;
  noiseSpeed = 0.1;
  segments = 3;
  debug = false;
  chaos = false;

  // If any settings are specified, change them
  // They're all scaled so that setting numbers from 1-100 will have the desired effect
  if (noiseSettings && noiseSettings.scale) {
    noiseScale = noiseSettings.scale * 10;
  }

  if (noiseSettings && noiseSettings.frequency) {
    noiseFrequency = noiseSettings.frequency / 1000;
  }

  if (noiseSettings && noiseSettings.speed) {
    noiseSpeed = noiseSettings.speed / 250;
  }

  if (noiseSettings && noiseSettings.segments) {
    segments = noiseSettings.segments;
  }

  if (noiseSettings && noiseSettings.chaos) {
    chaos = getRandomInt(settings.chaos * -1, settings.chaos);
  }

  if (noiseSettings && noiseSettings.debug) {
    debug = noiseSettings.debug;
  }

  let start = createVector(x1, y1);
  let end = createVector(x2, y2);

  noFill();

  let lineLength = start.dist(end);

  // if linelength is too small, don't do more than 2 segments
  if (lineLength < 30 && segments > 2) {
    segments = 2;
  }

  // Determine how long one segment is
  let segmentLength = lineLength / segments;

  // We need to know the angle of the line so that we can determine the x
  // and y position for each point along the line, and when we offset based
  // on noise we do so perpendicular to the line.
  let angle = atan2(end.y - start.y, end.x - start.x);

  let xInterval = segmentLength * cos(angle);
  let yInterval = segmentLength * sin(angle);

  beginShape();

  // Always start with the start point
  curveVertex(start.x, start.y);
  curveVertex(start.x, start.y);

  // for each point that is neither the start nor end point
  for (let i = 1; i < segments; i++) {
    // determine the x and y positions along the straight line
    let x = start.x + xInterval * i;
    let y = start.y + yInterval * i;

    // calculate the offset distance using noice
    let offset =
      // The bigger this number is the greater the range of offsets will be
      noiseScale *
      (noise(
        // The bigger the value of noiseFrequency, the more erretically
        // the offset will change from point to point.
        i * segmentLength * noiseFrequency,
        // The bigger the value of noiseSpeed, the more quickly the curve
        // fluxuations will change over time.
        (millis() / 1000) * noiseSpeed
      ) - 0.5);

    if (chaos) {
      offset *= chaos;
    }

    // Translate offset into x and y components based on angle - 90°
    // (or in this case, PI / 2 radians, which is equivalent)
    let xOffset = offset * cos(angle - PI / 2);
    let yOffset = offset * sin(angle - PI / 2);

    curveVertex(x + xOffset, y + yOffset);

    if (debug) {
      circle(x + xOffset, y + yOffset, 20);
    }
  }

  curveVertex(end.x, end.y);
  curveVertex(end.x, end.y);
  if (debug) {
    circle(start.x, start.y, 20);
    circle(end.x, end.y, 20)
  }
  endShape();
}


/* Misc.
 * ----------------------------------------------- */

/**
 * Returns a whole integer value that is inclusive of both min and max
 * 
 * @param {int} min The minimum value.
 * @param {int} max The maximum value.
 */
p5.prototype.getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Returns the value of a css property.
 * 
 * @param {object} oElm The query selected element to search for the rule.
 * @param {string} strCssRule The CSS rule that we are searching for the value of.
 */
p5.prototype.getStyle = function (oElm, strCssRule) {
  var strValue = "";
  if (document.defaultView && document.defaultView.getComputedStyle) {
    strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
  }
  else if (oElm.currentStyle) {
    strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase();
    });
    strValue = oElm.currentStyle[strCssRule];
  }

  strValue = strValue.replace('px', '');
  return strValue;
}


p5.prototype.getPointsOnEllipse = function (xCenter, yCenter, points, radius) {
  let angle = 0;
  let coordinates = []

  step = TWO_PI / points; //in radians equivalent of 360/points in degrees

  for (let i = 0; i < points; i++) {
    // get x and y coordinates
    // Adding center coordinates simulates adding a center to the "ellipse"
    x = radius * sin(angle) + xCenter;
    y = radius * cos(angle) + yCenter;

    // save each coordinate as an object to reference later
    coordinates.push(createVector(x, y));

    // increase angle for next loop
    angle = angle + step;
  }

  return coordinates;
}

p5.prototype.mapRange = function(value, inputMin, inputMax, outputMin, outputMax, clamp) {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/
  if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
    return outputMin;
  } else {
    var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;
        else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;
        else if (outVal < outputMin) outVal = outputMin;
      }
    }
    return outVal;
  }
}


/* Colours
 * ----------------------------------------------- */
p5.prototype.risoColors = function(numColors) {
  const allColors = [
    {
      "name": "Black",
      "hex": "#000000",
      "pantone": "BLACK U"
    },
    {
      "name": "Burgundy",
      "hex": "#914e72",
      "pantone": "235 U",
      "zType": "S-4225"
    },
    {
      "name": "Blue",
      "hex": "#0078bf",
      "pantone": "3005 U",
      "zType": "S-4257"
    },
    {
      "name": "Green",
      "hex": "#00a95c",
      "pantone": "354 U",
      "zType": "S-4259"
    },
    {
      "name": "Medium Blue",
      "hex": "#3255a4",
      "pantone": "286 U",
      "zType": "S-4261"
    },
    {
      "name": "Bright Red",
      "hex": "#f15060",
      "pantone": "185 U",
      "zType": "S-4263"
    },
    {
      "name": "RisoFederal Blue",
      "hex": "#3d5588",
      "pantone": "288 U",
      "zType": "S-4265"
    },
    {
      "name": "Purple",
      "hex": "#765ba7",
      "pantone": "2685 U",
      "zType": "S-4267"
    },
    {
      "name": "Teal",
      "hex": "#00838a",
      "pantone": "321 U",
      "zType": "S-4269"
    },
    {
      "name": "Flat Gold",
      "hex": "#bb8b41",
      "pantone": "1245 U",
      "zType": "S-4271"
    },
    {
      "name": "Hunter Green",
      "hex": "#407060",
      "pantone": "342 U",
      "zType": "S-4273"
    },
    {
      "name": "Red",
      "hex": "#ff665e",
      "pantone": "WARM RED U",
      "zType": "S-4275"
    },
    {
      "name": "Brown",
      "hex": "#925f52",
      "pantone": "7526 U",
      "zType": "S-4277"
    },
    {
      "name": "Yellow",
      "hex": "#ffe800",
      "pantone": "YELLOW U",
      "zType": "S-4279"
    },
    {
      "name": "Marine Red",
      "hex": "#d2515e",
      "pantone": "186 U",
      "zType": "S-4281"
    },
    {
      "name": "Orange",
      "hex": "#ff6c2f",
      "pantone": "ORANGE 021 U",
      "zType": "S-4283"
    },
    {
      "name": "Fluorescent Pink",
      "hex": "#ff48b0",
      "pantone": "806 U",
      "zType": "S-4287"
    },
    {
      "name": "Light Gray",
      "hex": "#88898a",
      "pantone": "424 U",
      "zType": "S-4291"
    },
    {
      "name": "Metallic Gold",
      "hex": "#ac936e",
      "pantone": "872 U",
      "zType": " S-2772"
    },
    {
      "name": "Crimson",
      "hex": "#e45d50",
      "pantone": "485 U",
      "zType": "S-4285"
    },
    {
      "name": "Fluorescent Orange",
      "hex": "#ff7477",
      "pantone": "805 U",
      "zType": "S-4289"
    },
    {
      "name": "Cornflower",
      "hex": "#62a8e5",
      "pantone": "292 U",
      "zType": "S-4617"
    },
    {
      "name": "Sky Blue",
      "hex": "#4982cf",
      "pantone": "285U",
      "zType": "S-4618"
    },
    {
      "name": "Sea Blue",
      "hex": "#0074a2",
      "pantone": "307 U",
      "zType": "S-4619"
    },
    {
      "name": "Lake",
      "hex": "#235ba8",
      "pantone": "293 U",
      "zType": "S-4620"
    },
    {
      "name": "Indigo",
      "hex": "#484d7a",
      "pantone": "2758 U",
      "zType": "S-4621"
    },
    {
      "name": "Midnight",
      "hex": "#435060",
      "pantone": "296 U",
      "zType": "S-4622"
    },
    {
      "name": "Mist",
      "hex": "#d5e4c0",
      "pantone": "7485 U",
      "zType": "S-4623"
    },
    {
      "name": "Granite",
      "hex": "#a5aaa8",
      "pantone": "7538 U",
      "zType": "S-4624"
    },
    {
      "name": "Charcoal",
      "hex": "#70747c",
      "pantone": "7540 U",
      "zType": "S-4625"
    },
    {
      "name": "Smoky Teal",
      "hex": "#5f8289",
      "pantone": "5483 U",
      "zType": "S-4626"
    },
    {
      "name": "Steel",
      "hex": "#375e77",
      "pantone": "302 U",
      "zType": "S-4627"
    },
    {
      "name": "Slate",
      "hex": "#5e695e",
      "pantone": "5605 U",
      "zType": "S-4628"
    },
    {
      "name": "Turquoise",
      "hex": "#00aa93",
      "pantone": "3275 U",
      "zType": "S-4629"
    },
    {
      "name": "Emerald",
      "hex": "#19975d",
      "pantone": "355 U",
      "zType": "S-4630"
    },
    {
      "name": "Grass",
      "hex": "#397e58",
      "pantone": "356 U",
      "zType": "S-4631"
    },
    {
      "name": "Forest",
      "hex": "#516e5a",
      "pantone": "357 U",
      "zType": "S-4632"
    },
    {
      "name": "Spruce",
      "hex": "#4a635d",
      "pantone": "567 U",
      "zType": "S-4633"
    },
    {
      "name": "Moss",
      "hex": "#68724d",
      "pantone": "371 U",
      "zType": "S-4634"
    },
    {
      "name": "Sea Foam",
      "hex": "#62c2b1",
      "pantone": "570 U",
      "zType": "S-4635"
    },
    {
      "name": "Kelly Green",
      "hex": "#67b346",
      "pantone": " 368 U",
      "zType": "S-4636"
    },
    {
      "name": "Light Teal",
      "hex": "#009da5",
      "pantone": "320 U",
      "zType": "S-4637"
    },
    {
      "name": "Ivy",
      "hex": "#169b62",
      "pantone": "347 U",
      "zType": "S-4638"
    },
    {
      "name": "Pine",
      "hex": "#237e74",
      "pantone": "3295 U",
      "zType": "S-4639"
    },
    {
      "name": "Lagoon",
      "hex": "#2f6165",
      "pantone": "323 U",
      "zType": "S-4640"
    },
    {
      "name": "Violet",
      "hex": "#9d7ad2",
      "pantone": "265 U",
      "zType": "S-4641"
    },
    {
      "name": "Orchid",
      "hex": "#aa60bf",
      "pantone": "2592 U",
      "zType": "S-4642"
    },
    {
      "name": "Plum",
      "hex": "#845991",
      "pantone": "2603 U",
      "zType": "S-4644"
    },
    {
      "name": "Raisin",
      "hex": "#775d7a",
      "pantone": "519 U",
      "zType": "S-4645"
    },
    {
      "name": "Grape",
      "hex": "#6c5d80",
      "pantone": "2695 U",
      "zType": "S-4646"
    },
    {
      "name": "Scarlet",
      "hex": "#f65058",
      "pantone": "RED 032 U",
      "zType": "S-4647"
    },
    {
      "name": "Tomato",
      "hex": "#d2515e",
      "pantone": "186 U",
      "zType": "S-4648"
    },
    {
      "name": "Cranberry",
      "hex": "#d1517a",
      "pantone": "214 U",
      "zType": "S-4649"
    },
    {
      "name": "Maroon",
      "hex": "#9e4c6e",
      "pantone": "221 U",
      "zType": "S-4650"
    },
    {
      "name": "Raspberry Red",
      "hex": "#d1517a",
      "pantone": "214U",
      "zType": "S-4651"
    },
    {
      "name": "Brick",
      "hex": "#a75154",
      "pantone": "1807 U",
      "zType": "S-4652"
    },
    {
      "name": "Light Lime",
      "hex": "#e3ed55",
      "pantone": "387 U",
      "zType": "S-4653"
    },
    {
      "name": "Sunflower",
      "hex": "#ffb511",
      "pantone": "116 U",
      "zType": "S-4654"
    },
    {
      "name": "Melon",
      "hex": "#ffae3b",
      "pantone": "1235 U",
      "zType": "S-4655"
    },
    {
      "name": "Apricot",
      "hex": "#f6a04d",
      "pantone": "143 U",
      "zType": "S-4656"
    },
    {
      "name": "Paprika",
      "hex": "#ee7f4b",
      "pantone": "158 U",
      "zType": "S-4657"
    },
    {
      "name": "Pumpkin",
      "hex": "#ff6f4c",
      "pantone": "1655 U",
      "zType": "S-4658"
    },
    {
      "name": "Bright Olive Green",
      "hex": "#b49f29",
      "pantone": "103 U",
      "zType": "S-4659"
    },
    {
      "name": "Bright Gold",
      "hex": "#ba8032",
      "pantone": "131 U",
      "zType": "S-4660"
    },
    {
      "name": "Copper",
      "hex": "#bd6439",
      "pantone": "1525 U",
      "zType": "S-4661"
    },
    {
      "name": "Mahogany",
      "hex": "#8e595a",
      "pantone": "491 U",
      "zType": "S-4662"
    },
    {
      "name": "Bisque",
      "hex": "#f2cdcf",
      "pantone": "503 U",
      "zType": "S-4663"
    },
    {
      "name": "Bubble Gum",
      "hex": "#f984ca",
      "pantone": "231 U",
      "zType": "S-4664"
    },
    {
      "name": "Light Mauve",
      "hex": "#e6b5c9",
      "pantone": "7430 U",
      "zType": "S-4665"
    },
    {
      "name": "Dark Mauve",
      "hex": "#bd8ca6",
      "pantone": "687 U",
      "zType": "S-4666"
    },
    {
      "name": "Wine",
      "hex": "#914e72",
      "pantone": "235 U",
      "zType": "S-4674"
    },
    {
      "name": "Gray",
      "hex": "#928d88",
      "pantone": "403 U",
      "zType": "S-4693"
    },
    {
      "name": "White",
      "hex": "#ffffff",
      "zType": "S-4722 "
    },
    {
      "name": "Aqua",
      "hex": "#5ec8e5",
      "pantone": "637 U",
      "zType": "S-4917"
    },
    {
      "name": "Mint",
      "hex": "#82d8d5",
      "pantone": "324 U",
      "zType": "S-6316"
    },
    {
      "name": "Fluorescent Yellow",
      "hex": "#ffe900",
      "pantone": "803 U",
      "zType": "S-7761"
    },
    {
      "name": "Fluorescent Red",
      "hex": "#ff4c65",
      "pantone": "812 U",
      "zType": "S-7762"
    },
    {
      "name": "Fluorescent Green",
      "hex": "#44d62c",
      "pantone": "802 U",
      "zType": "S-7763"
    }
  ];
  const returnedColors = [];

  if (numColors == 'random') {
    let index = Math.floor(Math.random() * allColors.length);

    return allColors[index].hex;
  } else if (numColors) {
    for(i=0; i<numColors; i++) {
      let index = Math.floor(Math.random() * allColors.length);
      returnedColors.push(allColors[index]);
    }
    return returnedColors;
  } else {
    return allColors;
  }
}

/* Easing
 * ----------------------------------------------- */
// Source: https://github.com/mattdesl/eases

p5.prototype.expoOut = function(t) {
  return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
}

p5.prototype.expoIn = function (t) {
  return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
}

p5.prototype.expoInOut = function (t) {
  return (t === 0.0 || t === 1.0)
    ? t
    : t < 0.5
      ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0
}

p5.prototype.quadIn = function (t) {
  return t * t;
}

p5.prototype.quadOut = function (t) {
  return -t * (t - 2.0)
}

p5.prototype.quadInOut = function (t) {
  t /= 0.5
  if (t < 1) return 0.5 * t * t
  t--
  return -0.5 * (t * (t - 2) - 1)
}


/**
 * Point Inside Polygon
 * 
 * point is array [x,y]
 * vs is array of coordinates [[x,y], [x,y]]
 */
p5.prototype.inside = function(point, vs) {
  // https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon

  var x = point[0], y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];

    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Gets a random point along the edge of a circle.
 * Use in a loop to get multiple points.
 * 
 * @param {int} radius - radius of a circle
 * @returns {array} - returns x/y coordinates of a point randomly along a circle's edge
 */
p5.prototype.randomAlongCircle = function(radius) {
  const angle = Math.random() * Math.PI * 2;
  let x = Math.cos(angle) * radius;
  let y = Math.sin(angle) * radius;

  return {x:x,y:y};
}

/**
 * 
 * @param {int} radius - radius of a circle
 * @returns {array} - Returns x/y coordinates of a point randomly inside of a circle
 */
p5.prototype.randomInsideCircle = function (radius) {
  const angle = Math.random() * Math.PI * 2;
  let x = Math.cos(angle) * radius * Math.random();
  let y = Math.sin(angle) * radius * Math.random();

  return {x:x, y:y}
}
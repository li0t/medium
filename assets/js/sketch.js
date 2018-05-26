// Multiplies the tracked color squares by this factor and increase the flock boid by the result.
var STRENGTH_INCREASE_FACTOR = 1.5;

// How many frames does it wait to decrease connection strength
var CONNECTION_STRENGTH_DECAY_RATE = 10;

// How much connection strength is lost each time
var CONNECTION_STRENGTH_DECAY_FACTOR = -1;

// How many frames does it wait to try to spawn another boid
var BOID_SPAWN_RATE = 1000;

// How much strength the flock needs to spawn a new boid
var BOID_SPAWN_MIN_STRENGTH = 120;

// Minimun connection strength to display names
var CONNECTION_STRENGTH_LOWER_BOUND = 25;

// Maximun connection strength to display names
var CONNECTION_STRENGTH_UPPER_BOUND = 130;

// Connection label configuration
var CONNECTION_LABEL_WIDTH = 350;
var CONNECTION_LABEL_COLOR = 255;
var CONNECTION_LABEL_FONT_SIZE = 55;

var BACKGROUND_COLOR = 51;

var PATH_TEXT_FONT = 'assets/fonts/courier-new/cour.ttf';
var PATH_PHRASES = 'assets/phrases.txt';
var PATH_NAMES = 'assets/names.txt';

var VIDEO_ID = "video";

var flock;
var canvas;
var data;
var phrases;
var names;
var words;
var tracker;
var origin;
var spawners = {
  x: [],
  y: [],
};

var curWord = 0;
var curPhrase = 0;
var originPoints = 5;
var connectionFrames = 0;
var connectionLabel = 'Llamando a';

var dash = false;

function updateConnectionLabel() {
  dash = !dash;
  return 'Llamando a ' + (dash ? '_' : '');
}

function getConnectionStatus() {
  updateConnection();

  if (connectionFrames % 10 === 0) {
    connectionLabel = updateConnectionLabel();

    if (flock.strength > CONNECTION_STRENGTH_LOWER_BOUND) {
      connectionLabel = 'Llamando a _' + names[getRandomInt(names.length)];
    }

  }

  return connectionLabel;
}

function updateConnection() {
  connectionFrames++

  if (connectionFrames % CONNECTION_STRENGTH_DECAY_RATE === 0) {
    flock.addStrength(CONNECTION_STRENGTH_DECAY_FACTOR);
  }
}

function printConnectionStatus(status) {
  if (flock.strength >= CONNECTION_STRENGTH_UPPER_BOUND || flock.boids.length > 10) {
    return;
  }

  push();
  translate((width / 2) - CONNECTION_LABEL_WIDTH, height / 2);
  fill(CONNECTION_LABEL_COLOR);
  textSize(CONNECTION_LABEL_FONT_SIZE);
  text(status, 1, 1);
  pop();
}

function tryConnection() {
  var status = getConnectionStatus();
  printConnectionStatus(status);
}

function flocking() {
  mean(flock);
  flock.run();
}

function onColorTracked(rects) {
  var tracks = rects.length;
  flock.addStrength(tracks * STRENGTH_INCREASE_FACTOR);
}

function trackColor(videoId) {
  var video = document.getElementById(videoId);

  video.width = window.width;
  video.height = window.height;

  tracker = new Tracker(videoId)
  tracker.track(onColorTracked);
}

function loadSpawners() {
  for (let i = 1; i < originPoints; i++) {
    spawners.x.push((width / originPoints) * i);
    spawners.y.push((height / originPoints) * i);
  }
}

function initialize() {
  loadStrings(PATH_PHRASES, function (foundPhrases) {
    if (!foundPhrases || !foundPhrases.length) {
      throw new Error('Invalid phrases');
    }

    phrases = foundPhrases;
    words = RiTa.tokenize(phrases.join(' '));

    loadStrings(PATH_NAMES, function (foundNames) {
      if (!foundNames || !foundNames.length) {
        throw new Error('Invalid names');
      }

      names = foundNames;

      loadFont(PATH_TEXT_FONT, function (font) {
        textFont(font);

        loadSpawners();
        trackColor(VIDEO_ID);
        spawnLoop();
        changeOriginLoop();

      });
    });
  });
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  flock = new Flock();
  initialize();
}

function draw() {
  background(BACKGROUND_COLOR);
  flocking();
  tryConnection();
}

function getRandomPos() {
  var random = Math.random() > 0.5;

  var newPos = {
    x: random ? getRandomInt(width) : spawners.x[getRandomInt(spawners.x.length)],
    y: random ? getRandomInt(height) : spawners.y[getRandomInt(spawners.y.length)],
  };

  console.log('Origin changed: ', newPos);
  return newPos;
}

function getScreenCenter() {
  return {
    x: width / 2,
    y: height / 2,
  }
}

function changeOriginLoop() {
  setTimeout(function () {
    origin = Math.random() > 0.25 ? getRandomPos() : getScreenCenter();
    changeOriginLoop();
  }, BOID_SPAWN_RATE * 2);
}

function spawn(x, y) {
  if (curPhrase === phrases.length) {
    curPhrase = 0;
  }

  if (curWord === words.length) {
    curWord = 0;
  }

  if (flock.strength < BOID_SPAWN_MIN_STRENGTH) {
    return;
  }

  var text = Math.random() > 0.5 ? phrases[curPhrase++] : words[curWord++];
  flock.addBoid(new Boid(x, y, text, flock.strength));
}

function spawnLoop() {
  setTimeout(function () {
    if (flock.strength > 1) {
      spawn(origin.x, origin.y);
    }
    spawnLoop();
  }, BOID_SPAWN_RATE);
}

// Add a new boid into the System
function mouseDragged() {
  spawn(mouseX, mouseY);
}

window.onresize = function () {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w, h);
  width = w;
  height = h;
};

window.onclick = function(){
  flock.strength = 0;
}
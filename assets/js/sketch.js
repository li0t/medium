var flock;
var canvas;
var data;
var phrases;
var words;
var tracker;
var curWord = 0;
var curPhrase = 0;
var backgroundColor = 51;
var origin;
var originPoints = 5;
var spawnRate = 1000;
var spawners = {
  x: [],
  y: [],
};

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

    if (flock.strength > 25 && flock.boids.length < 10) {
      connectionLabel = 'Llamando a _' + words[getRandomInt(words.length)];
    }

  }

  return connectionLabel;
}

function updateConnection() {
  connectionFrames++

  if (connectionFrames % 2 === 0) {
    flock.addStrength(-1);
  }
}

function printConnectionStatus(status) {
  if (flock.strength >= 100) {
    return;
  }

  push();
  translate((width / 2) - 200, height / 2);
  fill(255);
  textSize(55);
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
  flock.addStrength(tracks * 1.5);

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
  loadStrings('http://localhost:4443/text.txt', function (text) {
    if (!text || !text.length) {
      throw new Error('Invalid data');
    }

    loadFont('assets/fonts/Montserrat.ttf', function (font) {
      textFont(font);

      words = RiTa.tokenize(text.join(' '));
      phrases = text;

      loadSpawners();
      trackColor("video");
      spawnLoop();
      changeOriginLoop();

    });
  });
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  flock = new Flock();
  initialize();
}

function draw() {
  background(backgroundColor);
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
  }, spawnRate * 2);
}

function spawn(x, y) {
  if (curPhrase === phrases.length) {
    curPhrase = 0;
  }

  if (curWord === words.length) {
    curWord = 0;
  }

  if (flock.strength < 80) {
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
  }, spawnRate);
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
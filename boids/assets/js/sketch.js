var flock;
var canvas;
var data;
var words;
var tracker;
var videoId = 'faceVideo';
var cur = 0;
var backgroundColor = 51;
var origin;
var originPoints = 5;
var spawnRate = 1000;
var spawners = {
  x: [],
  y: [],
};

function onFaceTracked(faces) {
  for (var i = 0; i < faces.length; i++) {
    var face = faces[i];
    
    console.log('Face tracked:', face);
  }
}

function trackFaces(videoId) {
  var video = createCapture(VIDEO);
  video.size(width, height);
  video.elt.id = videoId;
  tracker = new Tracker(videoId);
  tracker.track(onFaceTracked);
}

function loadData() {
  loadStrings('http://localhost:4443/text.txt', function (text) {
    if (!text || !text.length) {
      throw new Error('Invalid data');
    }

    var newText = text.join(' ');

    data = new RiString(newText);
    words = RiTa.tokenize(newText);

    trackFaces(videoId);
    spawnLoop();
    changeOriginLoop();
  });
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  flock = new Flock();
  loadData();

  for (let i = 1; i < originPoints; i++) {
    spawners.x.push((width / originPoints) * i);
    spawners.y.push((height / originPoints) * i);
  }
}

function draw() {
  // background(backgroundColor);
  // mean(flock);
  // flock.run();
}

function spawn(x, y) {
  if (cur === words.length) {
    cur = 0;
  }

  flock.addBoid(new Boid(x, y, words[cur++]));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomPos() {
  var random = Math.random() > 0.5;

  var newPos = {
    x: random ? Math.random(width) : spawners.x[getRandomInt(spawners.x.length)],
    y: random ? Math.random(height) : spawners.y[getRandomInt(spawners.y.length)],
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
    origin = Math.random() > 0.75 ? getRandomPos() : getScreenCenter();
    changeOriginLoop();
  }, spawnRate * 2);
}

function spawnLoop() {
  setTimeout(function () {
    spawn(origin.x, origin.y);
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
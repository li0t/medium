var flock;
var canvas;
var data;
var words;
var tracker;
var cur = 0;
var backgroundColor = 51;
var origin;
var originPoints = 5;
var spawnRate = 1000;
var spawners = {
  x: [],
  y: [],
};


function positionLoop() {
  requestAnimationFrame(positionLoop);
  var positions = tracker.getCurrentPosition();
  // positions = [[x_0, y_0], [x_1,y_1], ... ]
  if(positions){
    var pos = positions[Math.floor(Math.random() * positions.length)];
    spawn(new Boid(pos[0], pos[1]));
    console.log('Spawned in ', pos)
  }
}

function trackFaces(videoId) {
  var video = document.getElementById(videoId);

  video.width = window.width;
  video.height = window.height;

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(video);
  positionLoop();
}

function loadData(flock) {
  loadStrings('http://localhost:4443/text.txt', function (text) {
    if (!text || !text.length) {
      throw new Error('Invalid data');
    }

    var newText = text.join(' ');

    data = new RiString(newText);
    words = RiTa.tokenize(newText);
    startWebcam();
    trackFaces("video");
    spawnLoop();
    changeOriginLoop();
  });
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  flock = new Flock();
  loadData(flock);

  for (let i = 1; i < originPoints; i++) {
    spawners.x.push((width / originPoints) * i);
    spawners.y.push((height / originPoints) * i);
  }
}

function draw() {
  background(backgroundColor);
  mean(flock);
  flock.run();
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

function spawn(x, y) {
  if (cur === words.length) {
    cur = 0;
  }

  flock.addBoid(new Boid(x, y, words[cur++]));
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
var flock;
var canvas;
var data;
var cur = 0;
var backgroundColor = 51;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  flock = new Flock();
  // Add an initial set of boids into the system
  // for (var i = 0; i < 5; i++) {
  // flock.addBoid(new Boid(width / 2, height / 2, i));
  // }

  loadStrings('http://localhost:4443/text.txt', function (text) {
    data = text;
    spawnLoop();
  });
}

function draw() {
  background(backgroundColor);
  flock.run();
  mean(flock);
}


function spawn(x, y) {
  if (!data || !data.length) {
    throw new Error('Invalid text');
  }

  if (cur === data.length) {
    cur = 0;
  }

  flock.addBoid(new Boid(x, y, data[cur++]));
}

function spawnLoop() {
  setTimeout(function () {
    spawn(width / 2, height / 2);
    spawnLoop();
  }, 100);
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
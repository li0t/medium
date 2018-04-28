var flock;
var canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  flock = new Flock();
  // Add an initial set of boids into the system
  // for (var i = 0; i < 5; i++) {
    // flock.addBoid(new Boid(width / 2, height / 2, i));
  // }

  spawn();
}

function draw() {
  background(51);
  flock.run();
  mean(flock);
}

function spawn() {
  setTimeout(function () {
    flock.addBoid(new Boid(width / 2, height / 2, flock.boids.length));
    spawn();
  }, 100);
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY, flock.boids.length));
}

window.onresize = function () {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w, h);
  width = w;
  height = h;
};
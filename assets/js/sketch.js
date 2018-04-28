var flock;

function setup() {
  createCanvas(640, 360);
  createP("Drag the mouse to generate new boids.");

  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 5; i++) {
    flock.addBoid(new Boid(width / 2, height / 2, i));
  }
}

function draw() {
  background(51);
  flock.run();
  mean(flock);
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY, flock.boids.length));
}
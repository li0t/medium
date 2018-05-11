// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  this.boids = [];
  this.maxBoids = 250;
  this.onData = function (positions) {
    var pos = positions[Math.floor(Math.random() * positions.length)];
    this.addBoid(new Boid(pos[0], pos[1]));
    console.log('Spawned in ', pos)
  }
}

Flock.prototype.run = function () {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids); // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function (b) {
  this.boids.push(b);

  if (this.boids.length === this.maxBoids) {
    this.boids.shift();
  }
}
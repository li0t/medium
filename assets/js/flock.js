// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  this.maxStrength = 200;
  this.maxBoids = 100;

  this.strength = 0;
  this.boids = [];
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

Flock.prototype.addStrength = function (newStrength) {
  this.strength += newStrength

  if (this.strength < 0) {
    this.strength = 0;
  }

  if (this.strength > this.maxStrength) {
    this.strength = this.maxStrength;
  }

  // console.log('Flock strength', this.strength);
}
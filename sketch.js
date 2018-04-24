var flock;

function getId() {
  return Math.random().toString(36).substr(2, 7);
}

function mean() {
  var neighbordist = 25;

  if (!flock.boids.length) {
    return;
  }

  var boids = flock.boids;
  var mean = createVector(0, 0);

  var count = 0;

  for (var i = 0; i < boids.length; i++) {
    mean.add(boids[i].position);
  }

  mean.div(boids.length);

  fill(0)
  ellipse(mean.x, mean.y, 5, 5);
  fill(127)

  var slope = 0;
  var num = 0;
  var div = 0;

  for (let i = 0; i < boids.length; i++) {
    var pos = boids[i].position;
    num += (pos.x - mean.x) * (pos.y - mean.y);
    div += (pos.x - mean.x) * (pos.x - mean.x);
  }

  slope = num / div;

  console.log(slope);

  var intercepY = mean.y - (slope * mean.x);
  // Line formula
  function lineFormula(x) {
    return (slope * x) + intercepY;
  }

  // Render

  // Linear regression
  for (let i = 25; i < width; i += 25) {
    ellipse(i, lineFormula(i), 1, 1);
  }

  for (let i = 0; i < boids.length; i++) {
    var boid = boids[i];
    var pos = boid.position;

    // line(pos.x, pos.y, mean.x, mean.y);     // Connected to mean
    // var neighborhood = boid.cohesion(boids);
    // line(pos.x, pos.y, neighborhood.x, neighborhood.y);

    // Connected between
    for (let j = 0; j < boids.length; j++) {
      var boid2 = boids[j];

      if (boid.id !== boid2.id) {

        var d = p5.Vector.dist(boid.position, boid2.position);
        if (d < neighbordist) {
          var pos2 = boid2.position;
          line(pos.x, pos.y, pos2.x, pos2.y);
        }
      }
    }

  }

}

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
  mean();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY, flock.boids.length));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function () {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids); // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function (b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y, id) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  // this.velocity = createVector(-0.01, 0);
  this.position = createVector(x, y);
  this.r = 3.0;
  this.id = id + '-' + getId();

  // Maximum speed
  this.maxspeed = function () {
    // return 3;
    return random(0.5, 3) + (flock.boids.length / 100);
    // return random(0.5, 3) - (flock.boids.length / 10000);
  }

  // Maximum steering force
  this.maxforce = function () {
    // return 0.05;

    return random(0.01, 0.5) + (flock.boids.length / 1000);
    // return random(0.01, 0.5) + (flock.boids.length / 1000);
  }

}

Boid.prototype.kill = function () {
  flock.boids.shift();
}

Boid.prototype.die = function () {
  for (var i = 0; i < flock.boids.length; i++) {
    var boid = flock.boids[i];
    if (this.id === boid.id) {
      flock.boids.splice(i, 1);
      break;
    }
  }
}

Boid.prototype.run = function (boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function (force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function (boids) {
  var sep = this.separate(boids); // Separation
  var ali = this.align(boids); // Alignment
  var coh = this.cohesion(boids); // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);

  // sep.mult(15);
  // ali.mult(10);
  // coh.mult(100);

  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function () {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed());
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function (target) {
  var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed());
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce()); // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function () {
  // line(this.position.x, this.position.y, (this.position.x + this.velocity.x  * 50),  (this.position.y + this.velocity.y  * 50));

  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(127);
  stroke(200);
  push();
  translate(this.position.x, this.position.y);

  var posX = (Math.round(this.position.x) * 100) / 100;
  var posY = (Math.round(this.position.y) * 100) / 100;

  text(this.id, 0, 0, this.r.x, this.r.y);
  // text(posX + ':' + posY, 2, 2, this.r.x, this.r.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r * 2);
  vertex(-this.r, this.r * 2);
  vertex(this.r, this.r * 2);
  endShape(CLOSE);
  pop();
}

Boid.prototype.teleport = function () {

  // Up
  if (this.position.y < -this.r) {
    this.position.y = height + this.r
  };

  // Left
  if (this.position.x < -this.r) {
    this.position.x = width + this.r
  };

  // Bottom
  if (this.position.y > height + this.r) {
    this.position.y = -this.r
  };

  // Right
  if (this.position.x > width + this.r) {
    this.position.x = -this.r
  };
}

Boid.prototype.extinguish = function () {
  if (this.position.x < -this.r ||
    this.position.y < -this.r ||
    this.position.x > width + this.r ||
    this.position.y > height + this.r) {
    this.die();
  }
}


// Wraparound
Boid.prototype.borders = function () {
  if (Math.random(0, 1) > 0.15) {
    this.teleport();
  } else {
    this.extinguish();
  }
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function (boids) {
  var desiredseparation = 25.0;
  var steer = createVector(0, 0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed());
    steer.sub(this.velocity);
    steer.limit(this.maxforce());
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function (boids) {
  var neighbordist = 50;
  var sum = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed());
    var steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce());
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function (boids) {
  var neighbordist = 50;
  var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum); // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}
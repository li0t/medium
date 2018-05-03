var lineColor = 255;

function getId() {
  return Math.random().toString(36).substr(2, 7);
}

function drawMean(mean) {
  fill(0)
  ellipse(mean.x, mean.y, 15, 15);
  fill(127)
}

function drawLinearRegression(lineFormula, steps) {
  for (let i = steps; i < width; i += steps) {
    ellipse(i, lineFormula(i), 1, 1);
  }
}

function getMean(boids) {
  var mean = createVector(0, 0);
  for (var i = 0; i < boids.length; i++) {
    mean.add(boids[i].position);
  }

  mean.div(boids.length);

  drawMean(mean);
  return mean;
}

function getLineFormula(boids) {
  var mean = getMean(boids);

  var count = 0;
  var slope = 0;
  var num = 0;
  var div = 0;

  /**
   * Linear regression formula
   */
  for (let i = 0; i < boids.length; i++) {
    var pos = boids[i].position;
    num += (pos.x - mean.x) * (pos.y - mean.y);
    div += (pos.x - mean.x) * (pos.x - mean.x);
  }

  slope = num / div;

  var intercepY = mean.y - (slope * mean.x);
  // Line formula
  function lineFormula(x) {
    return (slope * x) + intercepY;
  }

  return lineFormula;
}

function drawNeighborhood(boids) {
  var neighbordist = 35;

  for (let i = 0; i < boids.length; i++) {
    var boid = boids[i];
    var pos = boid.position;

    // var neighborhood = boid.cohesion(boids);
    // line(pos.x, pos.y, neighborhood.x, neighborhood.y);

    // Connected between
    // stroke(lineColor);
    for (let j = 0; j < boids.length; j++) {
      var boid2 = boids[j];
      stroke(boid.color);

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

function mean(flock) {
  if (!flock.boids.length) {
    return;
  }

  var boids = flock.boids;

  drawLinearRegression(getLineFormula(boids), 25);
  drawNeighborhood(boids);
}
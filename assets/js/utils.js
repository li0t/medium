
function getId() {
  return Math.random().toString(36).substr(2, 7);
}

function mean(flock) {
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

var flock;
var canvas;
var data;
var words;
var cur = 0;
var backgroundColor = 51;

function loadData() {
  loadStrings('http://localhost:4443/text.txt', function (text) {
    if (!text || !text.length) {
      throw new Error('Invalid data');
    }

    var newText = text.join(' ');

    data =  new RiString(newText);
    words = RiTa.tokenize(newText);

    spawnLoop();
  });
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  flock = new Flock();
  loadData();
}

function draw() {
  background(backgroundColor);
  flock.run();
  mean(flock);
}

function spawn(x, y) {

  if (cur === words.length) {
    cur = 0;
  }

  flock.addBoid(new Boid(x, y, words[cur++]));
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
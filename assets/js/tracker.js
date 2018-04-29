function Tracker(videoId) {
  this.videoId = videoId;
  this._tracker = new tracking.ObjectTracker('face');
}

Tracker.prototype.init = function init() {
  this._tracker.setInitialScale(4);
  this._tracker.setStepSize(2);
  this._tracker.setEdgesDensity(0.1);
}

Tracker.prototype.start = function start() {
  tracking.track('#' + this.videoId, tracker, {
    camera: true
  });
}

Tracker.prototype.track = function track() {
  this.init();
  this.start();
  this._tracker.on('track', function (event) {
    event.data.forEach(function (rect) {});
  });
}

var tracker = new Tracker('video01');
tracker.track();
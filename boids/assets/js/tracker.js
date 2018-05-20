function Tracker(videoId) {
  this.videoId = videoId;
  this._tracker =  new tracking.ColorTracker(['yellow']);
}

Tracker.prototype.start = function start() {
  tracking.track('#' + this.videoId, this._tracker, {
    camera: true
  });
}

Tracker.prototype.track = function track(cb) {
  this.start();
  this._tracker.on('track', function (event) {
    if (event.data.length) {
      cb(event.data);
    }
  });
}
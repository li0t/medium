      //--------------------
      // GET USER MEDIA CODE
      //--------------------
      navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

      var video;
      var webcamStream;

      function startWebcam() {
        if (navigator.getUserMedia) {
          navigator.getUserMedia(

            // constraints
            {
              video: true,
              audio: false
            },

            // successCallback
            function (localMediaStream) {
              video = document.querySelector('video');
              video.src = window.URL.createObjectURL(localMediaStream);
              video.style.width = window.width;
              video.style.height = window.height;
              webcamStream = localMediaStream;
            },

            // errorCallback
            function (err) {
              console.log("The following error occured: " + err);
            }
          );
        } else {
          console.log("getUserMedia not supported");
        }
      }

      function stopWebcam() {
        webcamStream.stop();
      }
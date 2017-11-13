function frameConverter(video, canvas, dispatcher) {

  // Set up our frame converter
  this.video = video;
  this.viewport = canvas.getContext("2d");
  this.width = canvas.width;
  this.height = canvas.height;
  this.screenshot = document.getElementById("screenshot");
  this.dispatcher = dispatcher;

  // Create the frame-buffer canvas
  var newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", "test");
  this.framebuffer = newCanvas;
  this.framebuffer.width = this.width;
  this.framebuffer.height = this.height;
  this.ctx = this.framebuffer.getContext("2d");

  // This variable used to pass ourself to event call-backs
  var self = this;
  // Start rendering when the video is playing
  this.video.addEventListener("play", function() {
      self.render();
    }, false);

  // Change the image effect to be applied
  this.setEffect = function(effect){
    if(effect in JSManipulate){
        this.effect = JSManipulate[effect];
    }
  }

  // Rendering call-back
  this.render = function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.renderFrame();
      var self = this;
      
      var currentSecond = Math.floor(this.video.currentTime);
      if( self.dispatcher[currentSecond] != undefined ){
        var obj = self.dispatcher[currentSecond];
        sched.drawRipple(obj.x, obj.y, obj.r, obj.f);
        self.dispatcher[currentSecond] = undefined;
      }

      console.log(currentSecond);

      setTimeout(function () {
          self.render();
        }, 50);
  };

  // Compute and display the next frame
  this.renderFrame = function() {
      // Acquire a video frame from the video element
      this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth,
                         this.video.videoHeight, 0, 0,
                         this.width, this.height);
      var data = this.ctx.getImageData(0, 0, this.width, this.height);

      // Render to viewport
      this.viewport.putImageData(data, 0, 0);
  return;
  };
};

function scheduler(canvas, dispatcher, editor) {

  this.ctx = canvas.getContext("2d");
  this.dispatcher = dispatcher;
  this.dispatcherCopy = dispatcher;

  this.video = document.getElementById("video");
  this.height = canvas.height;
  this.width = canvas.width;

  this.previousSecond = 0;
  this.currentSecond = 0;

  var self = this;

  this.video.addEventListener("play", function() {
      self.refresh();
    }, false);

  this.refresh = function(f) {
    this.currentSecond = Math.floor(this.video.currentTime);

    /* Video rewinded event */
    if(this.previousSecond > this.currentSecond) {
      this.previousSecond = this.currentSecond;
    }

    if(this.video.paused || this.video.ended) {
      this.dispatcher = this.dispatcherCopy;
    }

    if(this.currentSecond != this.previousSecond && self.dispatcher[this.currentSecond]){
      var obj = self.dispatcher[this.currentSecond];
      self.drawRipple(obj.x, obj.y, obj.r, obj.f);
      editor.gotoLine(obj.line);
      editor.selection.selectLine();

      this.previousSecond = this.currentSecond;
    }


    setTimeout(function () {
        self.refresh();
      }, 50);
  }

  this.drawRipple = function(percX, percY, power, step) {
    var self = this;
    var x = Math.ceil(self.width * (percX / 100));
    var y = Math.ceil(self.height * (percY / 100));

    for(var i = 1; i <= power; i++){
      (function(i){
          setTimeout(function(){
            self.ctx.clearRect(0, 0, self.width, self.height);
            self.drawCircle(x, y, i);

            var wave = step;
            while (wave < power) {
              if (i >= wave && i < (power - wave)) {
                self.drawCircle(x, y, i - wave);
              }
              wave = wave + step;
            }

            if (i >= power - 1) {
              self.ctx.clearRect(0, 0, self.width, self.height);
            }
          }, 20 * i);
      }(i));
    }
  }

  this.drawCircle = function(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.strokeStyle = "#ff9900";
    this.ctx.stroke();
  }

  this.handleFiles = function (file) {
    var reader = new FileReader();
    var self = this;
    reader.onload = function(e) {
      bfile = e.target.result;
      var lines = bfile.split(/[\r\n]+/g);
      lines = lines.filter(function(n){ return n != "" });
      var dispatcher = [];

      for (var i = 0; i < lines.length; i += 2) {
        dispatcher[i] = { radius : 50, frequency : 5 };
      }

      editor.setValue(bfile, 1);
      editor.gotoLine(2);
    }
    reader.readAsText(file);
  }

}

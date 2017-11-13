function scheduler(drawCanvasId) {

  var canvas = document.getElementById(drawCanvasId);
  this.ctx = canvas.getContext("2d");

  this.height = canvas.height;
  this.width = canvas.width;

  this.drawRipple = function(x, y, power, step, canvas) {
    var self = this;
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

      console.log(dispatcher);
      editor.setValue(bfile, 1);
      editor.gotoLine(2);
    }
    reader.readAsText(file);
  }

}

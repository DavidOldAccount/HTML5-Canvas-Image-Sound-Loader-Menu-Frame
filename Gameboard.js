//Created by @davidg0
var Game = new function() {
  var boards = [];


  this.initialize = function(canvasElementId,sprite_data,callback) {
    this.canvas = document.getElementById(canvasElementId)
    this.width = this.canvas.width;
    this.height= this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.setupInput();

    this.loop(); 

    SpriteSheet.load(sprite_data,callback);
  };


  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener('keydown',function(e) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = true;
       e.preventDefault();
      }
    },false);

    window.addEventListener('keyup',function(e) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = false; 
       e.preventDefault();
      }
    },false);
  }


  this.loop = function() { 
    var dt = 30 / 1000;

    for(var i=0,len = boards.length;i<len;i++) {
      if(boards[i]) { 
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }

    setTimeout(Game.loop,30);
  };
  

  this.setBoard = function(num,board) { boards[num] = board; };
};


var SpriteSheet = new function() {
  this.map = { }; 

  this.load = function(spriteData,callback) { 
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
  };

  this.draw = function(ctx,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     x,   y, 
                     s.w, s.h);
  };
}

var TitleScreen = function TitleScreen(title, subtitle, callback){
    this.step = function(dt){
        if(Game.keys['fire'] && callback) callback();
    };
    this.draw = function(ctx){
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.font = "bold 40px bangers";
        ctx.fillText(title, Game.width / 2, Game.height / 2);
        ctx.font = "bold 20px bangers";
        ctx.fillText(subtitle, Game.width / 2, Game.height / 2 + 40);
    };
}


var GameBoard = function(){
    var board = this;
    this.objects = [];
    this.cnt = [];
    this.add = function(obj){
        obj.board = this;
        this.objects.push(obj);
        this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
        return obj;
    };
    
    this.remove = function(obj){
        var wasStillAlive = this.removed.indexOf(obj) != -1;
        if(wasStillAlive){this.removed.push(obj);}
        return wasStillAlive;
    };
    
    this.resetRemoved = function(){this.removed = [];}
    
    this.finalizeRemoved = function(){
        for(var i = 0, len = this.removed.length;i < len;i++){
            var idx = this.objects.indexOf(this.removed[i]);
            if(idx != -1){
                this.cnt[this.removed[i].type]--;
            }
        }
    }
    
    this.iterate = function(funcName){
        var args = Array.prototype.slice.call(arguments, 1);//将argument从第二个元素开始数组,继续传递给每个参数
        for(var i = 0, len = this.objects.length;i < len;i++){
            var obj = this.objects[i];
            obj[funcName].apply(obj, args)
        }
    };
    
    this.detect = function(func){//碰撞检测代码部分
        for(var i = 0, val = null, len = this.objects.length;i < len;i++){
            if(func.call(this.objects[i])) return this.objects[i];
        }
        return false;
    };
    
    this.step = function(dt){
        this.resetRemoved();
        this.iterate('step', dt);
        this.finalizeRemoved();
    };
    
    this.draw = function(ctx){
        this.iterate('draw', ctx);
    };
    
    this.overlap = function(o1, o2){//碰撞处理部分,overlap检查两个对象的边框覆盖情况,如果相交返回真.
        return !((o1.y + o1.h - 1 < o2.y) || (o1.y > o2.y + o2.h - 1) || (o1.x + o1.w - 1 < o2.x) || (o1.x > o2.x + o2.w - 1));
    };
    
    this.collide = function(obj, type){//检查对象列表中其他所有对象的碰撞情况
        return this.detect(function(){
                           if(obj != this){
                           var col = (!type || this.type & type) && board.overlap(obj, this);
                           return col ? this : false;
                           }
                           });
    };
    
}


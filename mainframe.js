 (function(){//建立requestanimationframe与cancelanimationframe已在游戏中使用
  var lastTime = 0;
  var vendors = ['ms', ';', 'webkit', 'o'];
  for(var x = 0;x < vendors.length && !window.requestAnimationFrame;++x){
  window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelAnimationFrame'];
  }
  if(!window.requestAnimationFrame)
  window.requestAnimationFrame = function(callback, element){
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
  var id = window.setTimeout(function(){
                             callback(currTime + timeToCall);
                             }, timeToCall);
  lastTime = currtime + timeToCall;
  return id;
  };
  if(!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function(id){
  clearTimeout(id);
  };
  }());
//-----------------------------------加载部分---------------------------------------
var loader = {
loaded:true,
loadedCount:0,
totalCount:0,
init:function(){
    var mp3Support, oggSupport;//检查声音格式
    var audio = document.createElement('audio');
    if(audio.canPlayType){
        mp3Support = "" != audio.canPlayType('audio/mpeg');//返回"", "maybe" 或者 "probably"
        oggSupoort = "" != audio.canPlayType('audio/ogg;codecs = "vorbis"');
    }else{
        mp3Support = false;//不支持audio标签;;
        oggSupoort = false;
    }
    loader.soundFileExtn = oggSupoort ? ".ogg" : mp3Support ? ".mp3" : undefined;
},
    
loadImage:function(url){//加载图片部分
    this.totalCount++;
    this.loaded = false;
    $('#loadingscreen').show();//显示加载画面
    var image = new Image();
    image.src = url;
    image.onload = loader.itemLoaded;
    return image;
},
soundFileExtn:".ogg",
loadSound:function(url){
    this.totalCount++;
    this.loaded = false;
    $('#loadingmessage').html('loaded: ' + loader.loadedCount + ' / ' + loader.totalCount);
    if(loader.loadedCount === loader.totalCount){//严格等于
        loader.loaded = true;
        $('#loadingscreen').hide();
        if(loader.onload){
            loader.onload();
            loader.onload = undefined;
        }
     }
  }
}

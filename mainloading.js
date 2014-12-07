$(window).load(function(){
               game.init();
               });
var game = {
init:function(){
    loader.init();
    $('.gamelayer').hide();//隐藏开始前内容
    $('#gamestartscreen').show();//显示开始后内容
},
}

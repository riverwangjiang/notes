/**
 * 简单工厂模式，又叫静态工厂模式
 * 原理：由一个工厂对象觉得创建某种产品对象类的实例
 * 用途：主要用来创建同一类对象，对同类的对象进行封装，暴露给别人就一个工厂对象
 */

//篮球类
var Basketball = function () {
     this.name = name;
}
Basketball.prototype ={
    getMember:function(){

    }
}
//篮球类
var Basketball = function () {
    this.name = name;
}
Basketball.prototype ={
   getMember:function(){

   }
}

//足球类
var Football = function () {
    this.name = name;
}
Football.prototype ={
   getMember:function(){

   }
}

//运动工厂
var SportFactory = function(name){
    switch(name){
        case 'NBA':
            return new Basketball();
        case 'woirdCup':
            return new Football();
    }
}

//使用的时候
var football = SportFactory('wordCup');
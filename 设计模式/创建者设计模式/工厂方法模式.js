/**
 * 工厂方法模式
 * 原理：通过对产品类的抽象
 * 用途：用来创建多类产品的实例
 */

 //工厂类
var Factory = function (type, content) {
    if (this instanceof Factory) {
        var a = new this[type](content);
        return a;
    } else {
        return new Factory(type, content)
    }
}
//工厂类原型
Factory.prototype = {
    Java:function(content){

    },
    JavaScript:function(content){
        
    }
}
//这样封装后，每次添加一个新的类，只需要在Factory的原型上添加就行

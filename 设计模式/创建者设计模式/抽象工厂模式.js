/**
 * 抽象工厂模式
 * 原理：通过对类的工厂抽象，基于寄生组合继承
 * 用途：对产品类簇的创建，而不是复责创建某一类产品对象
 */

 //抽象工厂方法

var VehicleFactory = function(subType,superType){
    if(typeof VehicleFactory[superType] === 'function'){
        //缓存类
        function F(){};
        F.prototype = new VehicleFactory[superType]();
        //将子类constructor 指向子类
        subType.constructor = subType;
        //子类原型继承“父类”
        subType.prototype = new F();
    }else{
        throw new Error('为创建该抽象类')
    }
}
// 小汽车抽象类
VehicleFactory.Car = function(){
    this.type = 'car';
};
VehicleFactory.Car.prototype = {
    getPrice: function(){
        return new Error('抽象类方法不能掉用')
    }
}
// 使用
// 宝马汽车子类
var BMW = function(price,speed){
    this.price = perice;
    this.speed = speed;
}
//抽象工厂实现对Car抽象类的继承
VehicleFactory(BMW,'Car');
BMW.prototype.getPrice = function(){
    return this.price;
}


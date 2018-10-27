/**
 * 抽象工厂模式
 * 原理：通过对类的工厂抽象，基于寄生组合继承
 * 用途：对产品类簇的创建，而不是复责创建某一类产品对象
 */

 //抽象工厂方法

var VehicleFactory = function(subType,superType){
    if(typeof VehicleFactory[superType] === 'function'){
        //缓存类
        function F(){}
    }
}

/**
 * javscript设计模式--继承
 */

/**
 * 类式继承，有两个缺点
 * 1.子类通过原型对父类进行了实例化，所以父类共有属性为引用类型时，子类的所有实例共用，在实例中进行修改会相互影响
 * 2.无法向父类传递参数
 */

//声明父类
function SuperClass(){
    this.superValue = true;
}
//为父类添加共有方法
SuperClass.prototype.getSuperValue = function(){
    return this.superValue;
}
//声明子类
function SubClass(){
    this.subValue = false;
}


SubClass.prototype = new SuperClass();
//为子类添加共有方法
SubClass.prototype.getSubValue = function(){
    return this.subValue;
}

/**
 * 构造函数继承
 * 缺点：这种继承不涉及原型链，只继承了构造函数部分，且每个实例都拥有一份数据
 */
//声明父类
function SuperClass(id){
    this.superValue = true;
    this.id = id;
}
//为父类添加共有方法
SuperClass.prototype.getSuperValue = function(){
    return this.superValue;
}
//声明子类
function SubClass(id){
    SuperClass.call(this,id);
}

//为子类添加共有方法
SubClass.prototype.getSubValue = function(){
    return this.subValue;
}
var book = new SubClass(10);
book.getSuperValue()//TypeError

/**
 * 组合继承
 * 结合类式继承和构造继承，缺点实例化了两次父类
 */
//声明父类
function SuperClass(id){
    this.superValue = true;
    this.id = id;
}
//为父类添加共有方法
SuperClass.prototype.getSuperValue = function(){
    return this.superValue;
}
//声明子类
function SubClass(id){
    SuperClass.call(this,id)
}

SubClass.prototype = new SuperClass();
//为子类添加共有方法
SubClass.prototype.getSubValue = function(){
    return this.subValue;
}

/**
 * 寄生式继承，基于原型继承
 * 
 */

//原型继承，就行类继承的一种封装，使用空过渡对象减少消耗
function inheritObject(o){
    //声明一个过渡函数对象
    function F(){}
    //过渡对象的原型继承父对象
    F.prototype = o;
    //返回过渡对象的一个实例，该实例的原型继承了父对象
    return new F();
}
//基类
var Book = {
    name: "js book"
}

function createBook(book){
    //通过原型继承方式创建新对象
    var o = new inheritObject(book);
    //扩展新对象
    o.getName = function(){}    
    return o;
}
var SubClass = createBook(book);

/**
 * 寄生组合式继承
 */

 function inheritPropotype(SubClass,SuperClass){
     //复制一份父类的原型副本
     var p =inheritObject(SuperClass.prototype);
     //修正因为重写子类原型导致子类的constructor属性被修改
     p.constructor = SubClass;
     //设置子类的原型
     SubClass.prototype = p;
 }


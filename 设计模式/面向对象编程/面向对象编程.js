/**
 * 阅读javascript设计模式--面向对象编程
 * 通过Book类来了解js的面向对象
 */

/**
 * 封装：创建类Book
 */
var Book = function (id, bookName, price) {//构造函数，每次实例化对象都会在它上面添加这些
    this.id = id;
    this.bookName = bookName;
    this.price = price;
}
Book.prototype.display = function () {//原型上的方法不会创建，访问时是到原型链上查找
    //展示这本书
}

var book = new Book(10, 'javascript设计模式', 59);
console.log(book.bookName)//javascript设计模式
/**
 * book._proto_ 指向Book.prototype
 * Book.prototype.constructor 类对象
 */


/**
 * 私有属性与私有方法，特权方法，对象公有属性和对象共有方法，构造器
 */
var Book = function (id, name, price) {
    //私有属性  
    var num = 1;
    //私有方法
    function checkId() {

    };
    //特权方法
    this.getNum = function () {
        return num;
    };
    this.setName = function () {
        this.name = name;
    }
    this.setPrice = function () {
        this.price = price;
    }
    //公有属性
    this.id = id;
    //共有方法
    this.copy = function () { };
    //构造器
    this.setName(name);
    this.setPrice(price);
}
//类静态共有属性（对象不能访问）
Book.isChinese = true;
//类静态公有方法（对象不能访问）
Book.resetTime = function () { }
Book.prototype = {
    //公有属性
    idJSBook: true,
    display: function () { }
}
//new 的实质是对实例对象的this进行赋值，把所有构造函数里面的属性和方法进行赋值；然后把实例对象的prototype指向类的prototype对象
var book = new Book(10, 'javascript设计模式', 59);
book instanceof Book === true //判断一个实例对象的原型链上有没有这个类
/**
 * 闭包实现类
 */
var Book = (function () {
    //静态私有变量
    var bookNum = 0;
    //创建类
    function _book(id, name, price) {
        //私有属性  
        var num = 1;
        //私有方法
        function checkId() {

        }
        //特权方法
        this.getNum = function () {
            return num;
        };
        this.setName = function () {
            this.name = name;
        }
        this.setPrice = function () {
            this.price = price;
        }
        //公有属性
        this.id = id;
        //共有方法
        this.copy = function () { };
        //构造器
        this.setName(name);
        this.setPrice(price);
        bookNum++;
    }
    _book.prototype = {
        //公有属性
        idJSBook: true,
        display: function () { }
    }
    return _book;
})();

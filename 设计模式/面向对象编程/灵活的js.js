/**
 * 阅读javascript设计模式--灵活的js
 * 实现一个验证表单的功能，包括用户名、邮箱、密码等
 */


/**
 * 最基本的写法，n个函数;产生了3个全局函数（变量）
 */
function checkName() {
    //验证姓名
}
function checkEmail() {
    //验证邮箱
}
function checkPassword() {
    //验证密码
}

/**
 * 另一种形式，声明变量来存储
 */

var checkName = function () {
    //验证姓名
}
var checkEmail = function () {
    //验证邮箱
}
var checkPassword = function () {
    //验证密码
}

/**
 * 用对象收编变量，减少全局变量，减少函数冲突
 */

var CheckObject = {
    checkName: function () {
        //验证姓名
    },
    checkEmail: function () {
        //验证邮箱
    },
    checkPassword: function () {
        //验证密码
    }
}

/**
 * 对象的另一种形式,使用
 */

var CheckObject = function () { };
//var CheckObject = {} 同上
CheckObject.checkName = function () {
    //验证姓名
}
CheckObject.checkEmail = function () {
    //验证邮箱

}
CheckObject.checkPassword = function () {
    //验证密码
}

/**
 * 真假对象，让别人使用;简单复制，放到函数对象中
 */
var CheckObject = function () {
    return {
        checkName: function () {
            //验证姓名
        },
        checkEmail: function () {
            //验证邮箱
        },
        checkPassword: function () {
            //验证密码
        }
    }
}
//使用方法
var a = CheckObject();
a.checkName();

/**
 * 用类也可以
 */
var CheckObject = function () {
    this.checkName = function () {
        //验证姓名
    }
    this.checkEmail = function () {
        //验证邮箱
    }
    this.checkPassword = function () {
        //验证密码
    }
}
// 使用方法
var a = new CheckObject();
a.checkName();
//缺点：每次new实例化时，实例都会去复制类的this上属性，每个实例的方法是独立的，消耗资源

/**
 * 原型，所有的实例对象会共用原型，少消耗资源
 */
var CheckObject = function () { };
//var CheckObject = {} 同上
CheckObject.prototype.checkName = function () {
    //验证姓名
}
CheckObject.prototype.checkEmail = function () {
    //验证邮箱
}
CheckObject.prototype.checkPassword = function () {
    //验证密码
}
//下面这样更好，一次性赋值
CheckObject.prototype = {
    checkName: function () {
        //验证姓名
    },
    checkEmail: function () {
        //验证邮箱
    },
    checkPassword: function () {
        //验证密码
    }
}
// 使用方法
var a = new CheckObject();
a.checkName();
a.checkEmail();
a.checkPassword();
//缺点调用多个方法时，要多次调用对象，可以让方法返回当前对象，进行链式调用
CheckObject.prototype = {
    checkName: function () {
        //验证姓名
        return this;
    },
    checkEmail: function () {
        //验证邮箱
        return this;
    },
    checkPassword: function () {
        //验证密码
        return this;
    }
}
var a = new CheckObject();
a.checkName().checkEmail().checkPassword();

/**
 * 参考prototype.js修改对象添加方法,函数调用方式
 */
Function.prototype.addMethod = function(name,fn){
    this[name] = fn;
    return this;
}
var methods = function(){}
methods.addMethod('checkName',function(){
    //验证姓名
    return this;
}).addMethod('checkEmail',function(){
    //验证邮箱
    return this;
}).addMethod('checkPassword',function(){
    //验证密码
    return this;
});

/**
 * 类调用方式
 */
Function.prototype.addMethod = function(name,fn){
    this.prototype[name] = fn;
    return this;
}
var methods = function(){};
methods.addMethod('checkName',function(){
    //验证姓名
    return this;
}).addMethod('checkEmail',function(){
    //验证邮箱
    return this;
}).addMethod('checkPassword',function(){
    //验证密码
    return this;
});
var m = new methods();
m.checkEmail();
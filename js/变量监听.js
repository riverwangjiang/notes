

//监听对象，vue的数据双向绑定原理
var o = {}; // 创建一个新对象

// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(o, "a", {
  value : 37,
  writable : true,
  enumerable : true,
  configurable : true
});

// 对象o拥有了属性a，值为37

// 在对象中添加一个属性与存取描述符的示例
var bValue;
Object.defineProperty(o, "b", {
  get : function(){
    return bValue;
  },
  set : function(newValue){
    bValue = newValue;
    // 检测b变量改变，做出相应的改变
    console.log(123)
  },
  enumerable : true,
  configurable : true
});

o.b = 38;

// 当对象o的b属性改变的时候会触发打印123

// 对于一般的全局变量，a就是window



var cValue;

Object.defineProperty(window, "c", {
    get: function() {
        return cValue;
    },
    set: function(newValue) {
        cValue = newValue;
        console.log("key变量改变了");
    },
    enumerable : true,
    configurable : true
});

var c = 2;

 c = 3;
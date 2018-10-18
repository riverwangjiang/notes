# 在 JavaScript 中， (a == 1 && a == 2 && a==3) 是否有可能为 true ？



## 方法1、利用松散相等运算符 == 的原理，自定义 toString 和 valueOf 返回对应值



```

const a = {

  i: 1,

  toString: function () {

    return a.i++;

  }

}

if(a == 1 && a == 2 && a == 3) {

  console.log('Hello World!');

}

// Hello World!
```



**松散相等的运算符 "=="**，默认触发类型转换







# String转换

### toString

每个对象都有一个`toString()`方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()`方法被每个`Object`对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object *type*]"，其中`type`是对象的类型。

### valueOf

JavaScript调用`valueOf`方法将对象转换为原始值。你很少需要自己调用`valueOf`方法；当遇到要预期的原始值的对象时，JavaScript会自动调用它。

默认情况下，`valueOf`方法由[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)后面的每个对象继承。 每个内置的核心对象都会覆盖此方法以返回适当的值。如果对象没有原始值，则`valueOf`将返回对象本身。

JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的valueOf()方法的返回值和返回值类型均可能不同。

**具体规则如下**：

1. 如果`toString`方法存在并且返回“原始类型”，返回toString的结果。
2. 如果toString方法不存在或者返回的不是“原始类型”，调用`valueOf`方法，如果valueOf方法存在，并且返回“原始类型”数据，返回valueOf的结果。
3. 其他情况，抛出错误。



下面我们尝试证明如果toString()方法不可用的时候系统会调用valueOf()方法

```
var a={
    toString:function(){
        console.log('调用了 a.toString');
        return '111';
    },
    valueOf:function(){
        console.log('调用了 a.valueOf');
        return '111';
    }
}
alert(a);

//调用了 a.toString
```

对于对象的操作，当toString不可用的时候，系统会再尝试valueOf方法

```
var a={
    toString:function(){
        console.log('调用了 a.toString');
        return {};
    },
    valueOf:function(){
        console.log('调用了 a.valueOf');
        return {};
    }
}
alert(a);

// 调用了 a.toString
// 调用了 a.valueOf
//  Uncaught TypeError: Cannot convert object to primitive value
```

**可以发现，如果toString和valueOf方法均不可用的情况下，系统会直接返回一个错误。**





# Number转换

下面说说Number转换，同理，当需要使用Number时，（ 如Math.sin() ）等，解释器会尝试将对象转换成Number对象。

**转换规则如下：**

1. 如果valueOf存在，且返回“原始类型”数据，返回valueOf的结果。
2. 如果toString存在，且返回“原始类型”数据，返回toString的结果。
3. 报错。

可以参考String转换的方法进行验证，这里只列出一种典型的方法，其他的可以自己动手来修改

```
var a={
    toString:function(){
        console.log('调用了 a.toString');
        return 12;
    },
    valueOf:function(){
        console.log('调用了 a.valueOf');
        return {};
    }
}
a+1
//调用了 a.valueOf
//调用了 a.toString
//13
```



# Boolean转换

在进行布尔比较的时候，比如 **if(obj) , while(obj)**等等，会进行布尔转换，**布尔转换遵循如下规则：**

| 值              | 布尔值                                 |
| -------------- | ----------------------------------- |
| true/false     | true/false                          |
| undefined,null | false                               |
| Number         | 0,NaN 对应 false, 其他的对应 true          |
| String         | ""对应false,其他对应true（**'0'对应的是true**） |
| Object         | true,空对象也会返回true                    |







## 方法2、劫持 JS 对象的 getter



```
var val = 0;

Object.defineProperty(window, 'a', {

  get: function() {

    return ++val;

  }

});

if (a == 1 && a == 2 && a == 3) {

  console.log('yay');

}
```







## 问题

### parseInt(0.0000004)  // 4

> 重写parseInt方法

### ![]==[] //true

> 引用类型，在堆内从中指向的位置不一样就不相同
>
> 计算步骤，先计算![]结果为false；（对象[]默认转换为true，取反就是false）
>
> []对象需要默认转换，调用toString方法得到的是“”
>
> 结果就是false == “”，结果为真
>
> 
>
> ![] === [] // 返回的结果是false

### ['x','y'] == 'x,y' //true

> 默认调用toString方法（对象先调用toString），返回“x,y”;
>
> 如果调用valueOf方法，返回原始值 ["x", "y"]

### alert({name:'mofei'})  //"[object Object]"

> 默认调用toString方法
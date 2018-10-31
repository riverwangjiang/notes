/**
 * 建造者模式
 * 原理：将一个复杂对象的构建层与其表示层相互分离，同样的构建过程可采用不同的表示
 * 使用场景：当需要创建一个复杂类，可以把该类分成多个类的组合而成的一个符复合类
 */

/**
 * 应聘者建造者
 * @param {string} naem 姓名
 * @param {string} work 职位
 */
var Person = function(name,work){
    // 创建应聘者缓存对象
    var _person = new Human();
    //创建应聘者姓名解析对象
    _person.name = new Named(name);
    //创建应聘者期望z职位
    _person.work = new Worker(work);
    return _person;
}

//创建一个人类
var Human = function(){
    this.skill = param && param.skill || '保密';
    this.hobby = param && param.hobby || '保密';
}
Human.prototype = {
    getSkill: function(){
        return this.skill;
    },
    getHobby: function(){
        return this.hobby;
    }
}
//创建Name和Work同理

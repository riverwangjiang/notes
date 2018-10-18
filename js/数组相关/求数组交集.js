// 求数组的交集
Array.prototype.interset = function (b) {
    var flip = {};
    var res = [];
    for(var i = 0; i<b.length; i++){
        flip[b[i]] = i;
    }
    for(i=0;i<this.length;i++){
        if(flip[this[i]] !=undefined){
            res.push(this[i])
            return res;
        }
    }
}
/**
 * 生成16进制数字组成的字符串,规则可以任意
 * @return {String} 
 */
function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;//向下取整，利用位运算只不支持浮点数，默认转为整数
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    })
}


/**
 * 延迟函数执行，对于频繁事件触发起到很好的作用，提高性能
 * @param {Function} func 回调函数
 * @param {Number} wait 延迟时间
 * @param {Boolean} immediate 是否延迟
 * @return {Function}
 */
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this;
        var args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    }
}

/**
 * 获取cookie
 * @param {String} n 获取的key 
 * @return {String} 对应的value
 */
function getCookie(n) {
    var a, r = new RegExp("(^| )" + n + "=([^;]*)(;|$)");
    if (a = document.cookie.match(r)) {
        return decodeURIComponent(a[2]);
    }
    return null;
}
/**
 * 获取query
 * @param {String} n 获取的key 
 * @return {String} 对应的value
 */
function getQuery(n) {
    var a, r = new RegExp("(\\?|\\&)" + n + "=([^\\&]*)(\\&|$)");
    if (a = window.location.href.match(r)) {
        return decodeURIComponent(a[2]);
    }
    return null;
}

/**
 * 按照指定格式格式化指定时间
 * 
 * @param {Date} t 时间对象 
 * @param {String} str 需要的日期格式
 * @return {String} 格式化后的日期字符串
 */
function formatDate(t, str) {
    var obj = {
        yyyy: t.getFullYear(),//返回年份
        yy: ("" + t.getFullYear()).slice(-2),//返回四位年份的后两位
        M: t.getMonth() + 1,//返回月份，需要加1
        MM: ("0" + (t.getMonth() + 1)).slice(-2),//机智，如果本来就是两位就会变成三位，截取后两位，依然是两位表示。
        d: t.getDate(),//返回是几号
        dd: ("0" + t.getDate()).slice(-2),
        H: t.getHours(),//返回小时数，24小时计算
        HH: ("0" + t.getHours()).slice(-2),
        h: t.getHours() % 12,//返回十二小时计
        hh: ("0" + t.getHours() % 12).slice(-2),
        m: t.getMinutes(),//返回分钟数
        mm: ("0" + t.getMinutes()).slice(-2),
        s: t.getSeconds(),//返回秒数
        ss: ("0" + t.getSeconds()).slice(-2),
        w: ['日', '一', '二', '三', '四', '五', '六'][t.getDay()] //这里的getDay()方法返回的是0到6表示的数字，所以可以这样来表示星期几。
    };
    return str.replace(/([a-z]+)/ig, function ($1) { return obj[$1] }); //依次更改匹配到的连着的字符串
}
/**
 * 加入收藏夹函数
 * 这个方法能兼容IE和FF，其他浏览器中会提示Ctrl+D收藏当前页面
 * @param {String} url 收藏目标url
 * @param {String} title 收藏夹中显示的名称
 * @return null
 */
function AddFavorite(url, title) {
    try {
        window.external.addFavorite(url, title);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}

/** 
 * 设置首页函数
 * 
 * @param {String} url 设置为浏览器首页的目标站点URL
 * @return null
*/
function setHomepage(url) {
    if (!url) {
        url = "http://" + document.location.host + "/";
    }
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage(url);
    } else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            }
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        prefs.setCharPref('browser.startup.homepage', url);
    } else {
        alert("设置首页失败，请手动进行设置!");
    }
}
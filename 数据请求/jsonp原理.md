

## jsonp的原理
Web页面上调用js文件时则不受是否跨域的影响（不仅如此，我们还发现凡是拥有"src"这个属性的标签都拥有跨域的能力，比如<script>、<img>、<iframe>）；


因为原页面用 form 提交到另一个域名之后，原页面的脚本无法获取新页面中的内容。所以浏览器认为这是安全的。而 AJAX 是可以读取响应内容的，因此浏览器不能允许你这样做。如果你细心的话你会发现，其实请求已经发送出去了，你只是拿不到响应而已。所以浏览器这个策略的本质是，一个域名的 JS ，在未经允许的情况下，不得读取另一个域名的内容。但浏览器并不阻止你向另一个域名发送请求。

跨域是浏览器行为，不是ecma的（这个不确定）。而且具体行为是，你的请求可以发送，浏览器也能收到正常的响应，只是返回给你的时候，浏览器检查了是不是跨域，是对话就阻止了。

所以form表单的发送请求是没有影响的。


所谓的跨域问题只是浏览器强加给js的规则而已，世界本无跨域限制。是浏览器强制不允许js访问别的域，但是浏览器却没有限制它自己。比如说img标签可以加载任何域的图片，script可以加载任何域的js。


再比如说你不能从前端js去调淘宝的接口获取ip对应的城市地址信息，，但是你可以手敲在浏览器地址栏，直接打开。不允许程序去做操作。

因为浏览器安全策略限制的是脚本，而并不限制src，form提交之类的请求。

另外ajax是提交了的（调试工具中很容易看到请求已经发出），只是脚本无法获得结果。

form的控制权在浏览器手里，ajax在你的手里。

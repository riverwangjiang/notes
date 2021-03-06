## 从输入url到页面解析过程的主干流程

1. 从浏览器接收**url到开启网络请求线程**（这一部分可以展开**浏览器的机制**以及**进程与线程**之间的关系）；
2. **开启网络线程**到发出一个**完整的http请求**（这一部分涉及到dns查询，tcp/ip请求，五层因特网协议栈等知识）；
3. 从服务器接收到请求到**对应后台接收到请求**（这一部分可能涉及到负载均衡，安全拦截以及后台内部的处理等等）；
4. 后台和前台的**http交互**（这一部分包括http头部、响应码、报文结构、cookie等知识，可以提下静态资源的cookie优化，以及编码解码，如gzip压缩等）；
5. 单独拎出来的**缓存问题**，http的缓存（这部分包括http缓存头部，etag，catch-control等）；
6. **浏览器接收到http数据包后的解析流程**（**解析html-词法分析然后解析成dom树**、解析css生成css规则树、**合并成render树**，然后layout、painting渲染、复合图层的合成、GPU绘制、外链资源的处理、loaded和domcontentloaded等）；
7. CSS的**可视化格式模型**（元素的渲染规则，如包含块，控制框，BFC，IFC等概念）
8. **JS引擎解析过程**（JS的解释阶段，预处理阶段，执行阶段生成执行上下文，VO，作用域链、回收机制等等）
9. 其它（可以拓展不同的知识模块，如跨域，web安全，hybrid模式等等内容）

https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651553818&idx=1&sn=3ce840113d28ee2b2cafe4c7fc48ef91&chksm=802557dbb752decd2118e3ad7a3ea803a0c41c6594f539fc54830dae9bbc2242b2fc03e7fb1c&scene=0#rd

### 简化说明：

1. 用户输入地址;
2. 地址解析；
3. 浏览器根据uri来加载HTML/CSS/JS，图片等资源；
4. 浏览器将代码解析，构建cssom树，构建dom树，页面呈现；
5. html交互操作等；

### 资源下载到解析执行的流程:

- 下载HTML文档；
- 解析HTML文档，生成DOM；
- 下载文档中引用的CSS、JS、img等；
- **解析CSS样式表**，生成CSSOM；
- **将JS代码交给JS引擎执行；**
- 合并DOM树和CSS规则树，生成Render Tree；
- 根据Render Tree进行**布局layout**（**为每个元素计算尺寸和位置信息**）；
- **绘制（Paint）每个层中的元素**（**绘制每个瓦片**，瓦片这个词与GIS中的瓦片含义相同）；
- **执行图层合并（Composite Layers）。**

使用Chrome的**DevTools – Timing**，可以很容易的获取一个页面的渲染情况，比如在Event Log页签上，我们可以看到每个阶段的耗时细节。Devtools中有一个选项：Rendering - Layers Borders，打开这个选项之后，你可以看到每个层，每个瓦片的边界。浏览器可能会启动多个线程来绘制不同的层/瓦片。

### 针对浏览器的解析的优化

1. 分割css；
   CSS规则越复杂，在构建Render Tree时，浏览器花费的时间越长。CSS规则有自己的优先级，**不同的写法对效率也会有影响**，特别是当规则很多的时候。**不要多层嵌套，减少嵌套层级**。

2. 针对图形的GPU加速执行；

3. 异步JAvaScript；

   > js会修改render树，因此浏览器会等等待JS引擎的执行，执行结束之后，再恢复DOM的构建。但是并不是所有的JavaScript都会设计DOM操作，比如审计信息，WebWorker等，对于这些脚本，我们可以显式地指定该脚本是不阻塞DOM渲染的。
   >
   > > <script src="worker.js" async></script>

4. 除了上边的两种之外，有一些特别的属性**可以在不同的层中单独绘制，然后再合并图层**。对这种属性的访问（如果正确使用了CSS）不会触发Layout - Paint，而是直接进行Compsite Layers:  transform, opacity。

## 1. 从浏览器接收url到开启网络请求线程

**浏览器进程/线程模型，JS的运行机制。**

浏览器是多进程的，有一个**主控进程**，以及每一个tab页面都会新开一个进程（某些情况下多个tab会合并进程）。

### 多进程的浏览器（进程，查看任务管理器）

> 进程（process）：进程是一个具有一定独立功能的程序关于某个数据集合的一次运行活动。它是操作系统动态执行的基本单元，在传统的操作系统中，进程既是基本的分配单元，也是基本的执行单元。就像是一个工厂（cpu）中的一个生产车间（process），里边有若干工人（thread）。一个进程的内存空间是共享的，每个线程够可以使用，足够大的话可以同时使用。互斥锁，保证当前的内容使用占有，多个的信号量。

**进程可能包括主控进程，插件进程，GPU，tab页（浏览器内核）等等。**

- 有一个主进程控制Browser进程浏览器的主进程（负责协调、主控）；


- 每个tab**单独一个进程**（某些情况下会合并，比如两个一模一样的页面）；
- GPU进程，最多一个，用于**3D绘制**；
- 第三方插件的进程；
- 浏览器渲染进程（内核）：**默认每个Tab页面一个进程，互不影响，控制页面渲染，脚本执行，事件处理等**（有时候会优化，如多个空白tab会合并成一个进程）

### 多线程的浏览器内核（浏览器UI多线程）

> 线程（thread）：线程，有时被称为轻量级进程(Lightweight Process，LWP），是程序执行流的最小单元。就是工厂的工人，且仅有一个叫js引擎线程的。

每一个**tab页面可以看作是浏览器内核进程**，然后**这个进程是多线程**的，它有几大类子线程：

- JS引擎线程（处理脚本），主控线程
- GUI线程（渲染页面）
- 事件触发线程
- 定时器线程
- 网络请求线程（异步http请求线程）

**可以看到，里面的JS引擎是内核进程中的一个线程，这也是为什么常说JS引擎是单线程的。**

- JS引擎线程是浏览器渲染的**主线程**，**与GUI不能同时工作，因为它们都要影响DOM**，如果js线程想要某个DOM的样式，渲染引擎必须停止工作。
- 虽然H5提出了Web Worker，但是它不能够操作DOM，还是要委托给大哥js主线程解决 。

### 解析URL

URL一般包括几大部分：

- `protocol`，协议头，譬如有http，ftp等
- `host`，主机域名或IP地址
- `port`，端口号
- `path`，目录路径
- `query`，即查询参数
- `fragment`，即 `#`后的hash值，一般用来定位到某个位置

## 2. 开启网络线程到发出一个完整的http请求

 **dns查询， tcp/ip请求构建， 五层因特网协议栈。**

### DNS查询得到IP

- **它首先去找本地的hosts文件**，检查在该文件中是否有相应的域名、IP对应关系，如果有，则向其IP地址发送请求，如果没有，**再去找DNS服务器**。一般用户很少去编辑修改hosts文件。
- 域名系统作为一个层次结构和分布式数据库，包含各种类型的数据，包括主机名和域名。


### 网络请求都是单独的线程（在tcp连接之上的单独请求线程）

**每次网络请求时都需要开辟单独的线程进行**，譬如如果URL解析到http协议，就会新建一个网络线程去处理资源下载。因此浏览器会根据解析出得协议，开辟一个网络线程，前往请求资源。

- 建立tcp链接（三次握手）；
- 发送http请求；
- tcp/ip的并发限制2-10个；

握手过程中传送的包里不包含数据，**三次握手完毕后，客户端与服务器才正式开始传送数据。理想状态下，TCP连接一旦建立，在通信双方中的任何一方主动关闭连 接之前**，TCP 连接都将被一直保持下去。断开连接时服务器和客户端均可以主动发起断开TCP连接的请求，断开过程需要经过“**四次握手**”。

#### HTTP请求

HTTP连接最显著的特点是客户端发送的**每次请求都需要服务器回送响应**，**在请求结束后，会主动释放连接**。从建立连接到关闭连接的过程称为“一次连接”。

1）在HTTP 1.0中，客户端的每次请求都要求建立一次单独的连接，在处理完本次请求后，就自动释放连接。
2）在HTTP 1.1中则**可以在一次连接中处理多个请求，并且多个请求可以重叠进行**，不需要等待一个请求结束后再发送下一个请求。
由 于HTTP在每次请求结束后都会主动释放连接，**因此HTTP连接是一种“短连接”**，要保持客户端程序的在线状态，需要不断地向服务器发起连接请求。通常的做法是即时不需要获得任何数据，**客户端也保持每隔一段固定的时间向服务器发送一次“保持连接”的请求**，服务器在收到该请求后对客户端进行回复，表明知道客 户端“在线”。若服务器长时间无法收到客户端的请求，则认为客户端“下线”，若客户端长时间无法收到服务器的回复，则认为网络已经断开。

### GET与POST在请求发送上的区别

get和post虽然本质都是tcp/ip，但两者除了在http层面外，在tcp/ip层面也有区别。

**get会产生一个tcp数据包，post两个。**

具体就是：

- get请求时，浏览器会把 `headers`和 `data`一起发送出去，服务器响应200（返回数据），
- post请求时，**浏览器先发送 `headers`**，服务器响应 `100continue`，**浏览器再发送 `data`**，服务器响应200（返回数据）。

再说一点，这里的区别是 `specification`（规范）层面，而不是 `implementation`（对规范的实现）

### 五层因特网协议栈

对于一次http请求简括就是：从应用层的发送http请求，到传输层通过三次握手建立tcp/ip连接，再到网络层的ip寻址，再到数据链路层的封装成帧，最后到物理层的利用物理介质传输。

**五层因特尔协议栈其实就是：**

1.应用层(dns,http) DNS解析成IP并发送http请求

2.传输层(tcp,udp) 建立tcp连接（三次握手）

3.网络层(IP,ARP) IP寻址

4.**数据链路层(PPP) 封装成帧**

5.物理层(利用物理介质传输比特流) 物理传输（然后传输的时候通过双绞线，电磁波等各种介质）

## 3. 从服务器接收到请求到对应后台接收到请求

### 负载均衡

用户发起的请求都**指向调度服务器**（反向代理服务器，譬如安装了nginx控制负载均衡），然后调度服务器根据实际的调度算法，**分配不同的请求给对应集群中的服务器执行**，然后**调度器等待实际服务器的HTTP响应，并将它反馈给用户。**

### 后端响应

一般后台都是部署到容器中的，所以一般为：

- 一般有的后端是有统一的验证的，如安全拦截，跨域验证；
- 如果这一步不符合规则，就直接返回了相应的http报文（如拒绝请求等）；
- 然后当验证通过后，才会进入实际的后台代码，此时是程序接收到请求，然后执行（譬如查询数据库，大量计算等等）；
- 等程序执行完毕后，就会返回一个http响应包（一般这一步也会经过多层封装）；
- 然后就是将这个包从后端发送到前端，完成交互。

### http报文结构

`通用头部`， `请求/响应头部`， `请求/响应体`。

#### 通用头部

这也是开发人员见过的最多的信息，包括如下：

- Request Url: 请求的web服务器地址
- **Request Method: 请求方式（Get、POST、OPTIONS、PUT、HEAD、DELETE、CONNECT、TRACE）（OPTIONS请求，会在get，post之前发送，确认身份，cors前提，预检请求，请求服务器配置的，跨域请求是发布出去的，但是这个可以）**
- Status Code: **请求的返回状态码**，如200代表成功
- Remote Address: 请求的远程服务器地址（会转为IP）

#### 请求/响应头部

常用的响应头部（部分）：

- Access-Control-Allow-Headers: 服务器端允许的请求Headers
- Access-Control-Allow-Methods: 服务器端允许的请求方法
- **Access-Control-Allow-Origin: 服务器端允许的请求Origin头部（譬如为*）**
- Content-Type：服务端返回的实体内容的类型
- Date：数据从服务器发送的时间
- Cache-Control：告诉浏览器或其他客户，什么环境可以安全的缓存文档
- Last-Modified：请求资源的最后修改时间
- Expires：应该在什么时候认为文档已经过期,从而不再缓存它
- Max-age：客户端的本地资源应该缓存多少秒，开启了Cache-Control后有效
- ETag：请求变量的实体标签的当前值
- Set-Cookie：设置和页面关联的cookie，服务器通过这个头部把cookie传给客户端
- Keep-Alive：如果客户端有keep-alive，服务端也会有响应（如timeout=38）
- Server：服务器的一些相关信息

**请求/响应实体**

http请求时，除了头部，还有消息实体，一般来说，**请求实体中会将一些需要的参数都放入进入（用于post请求）。**譬如实体中可以放参数的序列化形式（ `a=1&b=2`这种），或者直接放表单对象（ `FormData`对象，上传时可以夹杂参数以及文件）。

### cookie以及优化

cookie是浏览器的一种本地存储方式，**一般用来帮助客户端和服务端通信的，常用来进行身份校验，结合服务端的session使用。**

- 一般来说，cookie是不允许存放敏感信息的（千万不要明文存储用户名、密码），因为非常不安全，如果一定要强行存储。
- 首先，一定要在**cookie中设置 `httponly`（这样就无法通过js操作了）**，另外可以考虑rsa等非对称加密（因为实际上，浏览器本地也是容易被攻克的，并不安全）。
- **由于在同域名的资源请求时，浏览器会默认带上本地的cookie，针对这种情况，在某些场景下是需要优化的。**

**针对这种场景，是有优化方案的（多域名拆分）。具体做法就是：**

- 将静态资源分组，分别放到**不同的子域名下；**
- 而子域名请求时，是不会带上父级域名的cookie的，所以就避免了浪费。

### gzip压缩

明确 `gzip`是一种压缩格式，需要浏览器支持才有效（不过一般现在浏览器都支持），而且gzip压缩效率很好（高达70%左右）。**然后gzip一般是由 `apache`、 `tomcat`等web服务器开启。**

### 长连接与短连接

首先看 `tcp/ip`层面的定义：

- 长连接：一个tcp/ip连接上可以连续发送多个数据包，**在tcp连接保持期间**，如果没有数据包发送，需要**双方发检测包以维持此连接(心跳链接)**，一般需要自己做在线维持（类似于心跳包）。
- 短连接：通信双方有数据交互时，就建立一个tcp连接，数据发送完成后，则断开此tcp连接。

然后在http层面：

- `http1.0`中，**默认使用的是短连接**，也就是说，**浏览器每进行一次http操作，就建立一次连接，任务结束就中断连接，譬如每一个静态资源请求时都是一个单独的连接；**
- http1.1起，**默认使用长连接，使用长连接会有这一行 `Connection:keep-alive`，**在长连接的情况下，当一个网页打开完成后，客户端和服务端之间**用于传输http的tcp连接不会关闭**，**如果客户端再次访问这个服务器的页面，会继续使用这一条已经建立的连接。**

### http2.0

**http2.0不是https**，它相当于是http的下一代规范（譬如https的请求可以是http2.0规范的）。

然后简述下http2.0与http1.1的**显著不同点**：

- http1.1中，每请求一个资源，都是需要开启一个tcp/ip连接的，所以对应的结果是，每一个资源对应一个tcp/ip请求，由于tcp/ip本身有并发数限制，所以当资源一多，速度就显著慢下来
- **http2.0中，一个tcp/ip请求可以请求多个资源，也就是说，只要一次tcp/ip请求，就可以请求若干个资源，分割成更小的帧请求，速度明显提升**。多个请求合成一个。
- 如果http2.0全面应用，**很多http1.1中的优化方案就无需用到了**（譬如打包成精灵图，静态资源多域名拆分等）。


**然后简述下http2.0的一些特性：**（感觉还需要很久啊）

- 多路复用（即一个tcp/ip连接可以请求多个资源）href||src；
- 首部压缩（http头部压缩，减少体积）；
- 二进制分帧（**在应用层跟传送层之间增加了一个二进制分帧层**，改进传输性能，实现低延迟和高吞吐量）；
- 服务器端推送（服务端可以**对客户端的一个请求发出多个响应，可以主动通知客户端websocket替代**）；
- 请求优先级（如果流**被赋予了优先级**，**它就会基于这个优先级来处理**，由服务器决定需要多少资源来处理该请求。）

### https

简单来看，https与http的区别就是： **在请求前，会建立ssl链接，确保接下来的通信都是加密的，无法被轻易截取分析。**

**如果要将网站升级成https，需要后端支持（后端需要申请证书等），然后https的开销也比http要大（因为需要额外建立安全链接以及加密等），**所以一般来说http2.0配合https的体验更佳（因为http2.0更快了）。

### http缓存

缓存可以简单的划分成两种类型： 强缓存（ 200fromcache）与 协商缓存（ 304）。

**区别简述如下：**

- 强缓存（ 200 from cache）时，浏览器如果判断本地缓存未过期，就直接使用，无需发起http请求。与强缓存有关的：
  1. `（http1.1）Cache-Control/Max-Age`
  2. `（http1.0）Pragma/Expires`
- 协商缓存（ 304）时，浏览器会向服务端发起http请求，然后服务端告诉浏览器文件未改变，让浏览器使用本地缓存。与协商缓存有关的：
  1. `（http1.1）If-None-Match/E-tag`
  2. `（http1.0）If-Modified-Since/Last-Modified`

**刷新机制：**

- 对于协商缓存，使用 `Ctrl+F5`强制刷新可以使得缓存无效。
- 但是对于**强缓存**，**在未过期时，必须更新资源路径才能发起新的请求**（更改了路径相当于是另一个资源了，这也是前端工程化中常用到的技巧）。

其实HTML页面中也有一个meta标签可以控制缓存方案- `Pragma`。这种方案还是比较少用到，因为支持情况不佳，譬如缓存代理服务器肯定不支持，所以不推荐。

```
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
```

### 相关的头部

**http1.0中的缓存控制：**

- parama：页面声明，它不属于专门的缓存控制头部，但是它设置 `no-cache`时可以让本地强缓存失效（属于编译控制，来实现特定的指令，主要是因为兼容http1.0，所以以前又被大量应用）。
- Expires：服务端配置的，控制在规定的时间之前，浏览器不会发出请求，而直接使用本地缓存。其时间来自于服务端，于本地时间无关。
- If-Modified-Since/Last-Modified： 成对出现，协商缓存的内容。

**http1.1中的缓存控制：**

- cache-control：缓存控制头部，有no-cache、max-age等多种取值；

`Expires`使用的是服务器端的时间，但是有时候会有这样一种情况-客户端时间和服务端不同步。那这样，可能就会出问题了，造成了浏览器本地的缓存无用或者一直无法过期，所以一般http1.1后不推荐使用 `Expires`。而 `Max-Age`使用的是客户端本地时间的计算，因此不会有这个问题，因此推荐使用 `Max-Age`。

![缓存头部](D:\learn-space\blog\浏览器原理\浏览器缓存\缓存头部.png)

## 解析页面的流程

浏览器内核拿到内容后，渲染步骤大致可以分为以下几步：

1. 解析HTML，构建**DOM树**
2. 解析CSS，生成**CSS规则树（cssom）**
3. 合并DOM树和CSS规则，**生成render树**（这里的结果应该就是computedStyle的结果）
4. **布局**render树（Layout/reflow），负责**各元素尺寸、位置的计算**
5. **绘制**render树（paint），绘制页面**像素信息**
6. 浏览器会**将各层的信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上**



#### 什么会触发回流（reflow）？

1.页面渲染初始化
2.DOM结构改变，比如删除了某个节点
3.render树变化，比如减少了padding
4.窗口resize
5.最复杂的一种：获取某些属性，引发回流。当获取一些属性时，浏览器为了获得正确的值也会触发回流，这样使得浏览器优化无效，比如offset/scroll等。

#### 简单层与复合层

上述中的渲染中止步于绘制，但实际上绘制这一步也没有这么简单，它可以结合复合层和简单层的概念来讲。这里不展开，进简单介绍下：

- 可以认为默认只有一个复合图层，所有的DOM节点都是在这个复合图层下的
- 如果开启了硬件加速功能，可以将某个节点变成复合图层
- 复合图层之间的绘制互不干扰，由GPU直接控制
- 而简单图层中，就算是absolute等布局，变化时不影响整体的回流，但是由于在同一个图层中，仍然是会影响绘制的，因此做动画时性能仍然很低。而复合层是独立的，所以一般做动画推荐使用硬件加速

### 资源外链的下载

**静态资源分为一下几大类:**

- CSS样式资源
- JS脚本资源
- img图片类资源

**遇到外链时的处理**

当遇到上述的外链时，会单独开启一个下载线程去下载资源（http1.1中是每一个资源的下载都要开启一个http请求，对应一个tcp/ip链接）。

**遇到CSS样式资源**

CSS资源的处理有几个特点：

- CSS下载时异步，不会阻塞浏览器构建DOM树
- 但是会**阻塞渲染**，也就是在构建render时，会等到css下载解析完毕后才进行（这点与浏览器优化有关，防止css规则不断改变，避免了重复的构建）
- 有例外， `media query`声明的CSS是不会阻塞渲染的

**遇到JS脚本资源**

JS脚本资源的处理有几个特点：

- 阻塞浏览器的解析，也就是说发现一个外链脚本时，需等待脚本下载完成并执行后才会继续解析HTML
- 浏览器的优化，一般现代浏览器有优化，**在脚本阻塞时，也会继续下载其它资源**（当然有并发上限），但是虽然脚本可以并行下载，解析过程仍然是阻塞的，也就是说必须这个脚本执行完毕后才会接下来的解析，并行下载只是一种优化而已
- defer与async，普通的脚本是会阻塞浏览器解析的，但是可以加上defer或async属性，这样脚本就变成异步了，可以等到解析完毕后再执行

注意，defer和async是有区别的： **defer是延迟执行，而async是异步执行。**简单的说（不展开）：

- `async`是异步执行，**异步下载完毕后就会执行，不确保执行顺序**，一定在 `onload`前，但**不确定在 `DOMContentLoaded`事件的前或后**

- `defer`是延迟执行，**在浏览器看起来的效果像是将脚本放在了 `body`后面一样（**虽然按规范应该是在 `DOMContentLoaded`事件前，但实际上不同浏览器的优化效果不一样，也有可能在它后面


### loaded和domcontentloaded

  简单的对比：

  - DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片(譬如如果有async加载的脚本就不一定完成)，（ready）
  - load 事件触发时，页面上所有的DOM，样式表，脚本，图片都已经加载完成了，window.onload

### JS引擎解析过程

JS是解释型语音，所以它无需提前编译，而是由解释器实时运行
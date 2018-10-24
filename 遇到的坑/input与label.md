## 使用label与input
   一定要注意，坑了自己一天的时间排查
### 场景：
   使用label来自定义input样式，通过label的for属性或者包裹input
### 问题：
   委托在外层的点击事件会被触发两次，特别是在使用react等框架时会重复渲染，而且通过input触发的事件还没办法阻止冒泡
### 代码：
   ```
   <!DOCTYPE html>
   <html lang="en>
   <head>
      <meta chartset="UTF-8">
      <title>label+input</title>
   </head>
   <body onclick="clickBody(event)">
       <input name="1" id="1" onclick="clickInput(event)"></input>
       <label for="1" onclick="clickLabel(event)">111111<i onclick="clicki(event)">iiiiii</i></label>
       <script>
       function clickBody(e){
          console.log('click body');
          console.log(e.target);
       }
       function clicki(e){
          e.stopPropagation();
          console.log('click i');
          console.log(e.target);
       }
       function clickInput(e){
          e.stopPropagation();
          console.log('click input');
          console.log(e.target);
       }
       function clickLabel(e){
          e.stopPropagation();
          console.log('click label');
          console.log(e.target);
       }
       </script>
   </body>

   </html>
   <!--如果不阻止冒泡，先是label的事件冒泡到body，然后是input事件触发，最后input冒泡触发body；就算所有事件都阻止冒泡，通过label触发到input的事件都阻止不了，body都能收到。 -->
   ```
   
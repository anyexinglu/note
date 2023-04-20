## React 的渲染流程以及 ssr（renderToString 和 hydrate）

### React 的渲染流程（render function 和 reconcile）

jsx 编译后会变成类似 React.createElement 这种代码，叫做 render function，render function 执行的结果是 React Element 即 vdom。

react 会把 vdom 转成 fiber 的结构，这个过程叫做 reconcile。在这样的循环里，依次处理 vdom 转 fiber，包括：

- beginWork 处理不同 React Element 转 fiber
- completeWork 按顺序创建元素、更新属性，组装成一个 dom 树。

### React SSR（renderToString 和 hydrate）

React SSR 是服务端通过 renderToString 把组件树渲染成 html 字符串，浏览器通过 hydrate 把 dom 关联到 fiber 树，加上交互逻辑和再次渲染。

- 服务端 renderToString 就是递归拼接字符串的过程，遇到组件会传入参数执行，遇到标签会拼接对应的字符串，最终返回一段 html 给浏览器。

- 浏览器端 hydrate 是在 reconcile 的 beginWork 阶段，依次判断 dom 是否可以复用到当前 fiber，可以的话就设置到 fiber.stateNode，然后在 completeWork 阶段就可以跳过节点的创建。

[React SSR 实现原理：从 renderToString 到 hydrate](https://mp.weixin.qq.com/s/MA6onW57f5LsntgF5mrSHQ)
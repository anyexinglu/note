## 渲染方式

### 流式渲染


## React 17 改变了什么
[React 17](https://reactjs.org/blog/2020/10/20/react-v17.html)

### 事件机制

```js
const rootNode = document.getElementById('root');
ReactDOM.render(<App />, rootNode);
```
React 16 及之前, React 会通过 document.addEventListener() 挂载事件，而 React 17 会通过 rootNode.addEventListener() 挂载。

![](./event.jpg)

### 新的 JSX transform

这段 jsx：
```jsx
import React from 'react';
function App() {
  return <h1>Hello World</h1>;
}
```
之前会转化为：
```js
import React from 'react';
function App() {
  return React.createElement('h1', null, 'Hello world');
}
```
而新的 JSX transform 会转为：
```js
// Inserted by a compiler (don't import it yourself!)
import {jsx as _jsx} from 'react/jsx-runtime';
function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

## React 18 改变了什么
[React 18](https://reactjs.org/blog/2022/03/29/react-v18.html)

### Automatic Batching
```js
// Before: only React events were batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

### Transitions

以查询（输入框 + 结果列表）为例，输入框是 urgent，结果列表不是 urgent 而且希望展示最终一次的查询结果，就可以将结果部分用 startTransition 包裹：

```js
import {startTransition} from 'react';

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});
```
useTransition 和 startTransition：
```jsx
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

### Suspense

[suspense in React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)

```jsx
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

<!-- 
JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 document 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。

另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 event.stopPropagation 是无效的，而应该调用 event.preventDefault。

实现合成事件的目的如下：

- 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力；
- 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。 -->

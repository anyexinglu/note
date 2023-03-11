
## 约束

Client component 不能直接用 Server component，但可以作为 children props 使用：

错误写法：

```tsx
function AClient() {
  return (
    <div>
      <BServer />
      xxx
    </div>
  )
}

function App() {
  return <AClient />
}
```

正确写法：
```tsx
function AClient(props) {
  return (
    <div>
      {props.children}
      xxx
    </div>
  )
}
function App() {
  return (
    <AClient>
      <BServer />
    </AClient>
  )
}
```

主要原因是：如果 AClient 自身 state 变化触发 rerender，错误写法中，BServer 势必因此 rerender（这样 server 组件也成了 client 组件了）。正确写法中，只有 App rerender 才会触发 BServer rerender。
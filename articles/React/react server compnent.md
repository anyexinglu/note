
## 约束

Client component 不能直接用 server component，但可以作为 children props 使用：

错误写法：

```tsx
// 
function AClient() {
  return (
    <div>
      <BServer>
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
      <BServer>
    </AClient>
  )
}
```
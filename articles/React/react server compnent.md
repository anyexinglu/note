
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

## Twitter: ask me about rsw

> [ask me anything about React Server Components](https://twitter.com/dan_abramov/status/1631641431742857216)


1、提问：每次作为父组件的 client 组件 rerender，作为子组件的 server 组件都会 rerender，那网络来回的开销是否会高于 UI rerender 的开销？

[if parent re-renders, so does the server child. Network round-trips are even more costly than UI renders. You will probably wrap some children with memo knowing they are server](https://twitter.com/the_spyke/status/1633940587719061511)

回答: 

（1）作为父组件的 client 组件 rerender，会跳过更新作为子组件的 server 组件，因为 server 组件已经是预先渲染好的静态内容了。

> client parent re-rendering will “skip over” any child server bits. because by then they’re already static

（2）唯一更新 server 组件内容的方法是主动显性地触发，通过路由跳转或者修改（比如表单提交）。state 变更这种普通的 rerender 不会重新请求 server。

> the only way to refresh the server content is to ask for that explicit. by a router navigation or a mutation (like form submission). normal re-renders from state updates won’t refetch the server.

（3）这就是为何你不能在 client 组件里直接 import server 组件。可以用一个公共的父组件来 render 它们，这样就无法让这个 client 组件传递 props 给 server 组件了。不过可以保证 render 的方向只会是 server > client。

> this is btw why you can’t *import* server components from client ones. you can render them when passed from another parent — sure — but this ensures you can’t try to pass any new props *to* them from the client. this ensures it only renders in one direction: server -> client.

2、提问：如何实现 —— 当 client 交互行为发生时（比如在某些文字上面悬停时），才去使用 server 组件（如 `<Tweet />` ，在悬停时才请求数据并渲染）。Next 是通过 router 路由段，但不知道它是如何实现的

[Question: say I want to use an RSC <Tweet /> component. But I only want to show it to the user after a client-side interaction occurred - say inside a tooltip when hovering over some text. I know with Next this is done via the router segments but it's unclear *how* it's done](https://twitter.com/lmatteis/status/1633581263817789447)

回答：

我们目前还未支持任意的延迟渲染，未来会支持。最常见的实现方式（但更受限制）是 route navigations，比如切换一个标签，router 重新请求 RSC 树的一片段。

> makes sense. we don’t have built-in support for arbitrary lazy rendering yet. would need to add in the future. the most common case (but more limited) is route navigations. like changing a tab. for that, the router requests a part of RSC tree for the refetched segment.

3、提问：我正在开始一个新建项目，并试图在 Remix 和 Next 之间做出决定。你所描述的让我觉得我可能也不需要。这样说公平吗？

[Question: say I want to use an RSC <Tweet /> component. But I only want to show it to the user after a client-side interaction occurred - say inside a tooltip when hovering over some text. I know with Next this is done via the router segments but it's unclear *how* it's done](https://twitter.com/lmatteis/status/1633581263817789447)

回答：

我认为 Remix 和 Next 都是今天非常好的选择。至于 RSC，它更面向未来，但您可以在 Next 13 beta app router 中尝试。

> I think both Remix and Next are really good options today. as for RSC it’s a bit more future-oriented but you can try it in Next 13 beta app router.
[Try RSC in Next 13 beta app router](https://twitter.com/dan_abramov/status/1632058882720776195)


TODO 

https://twitter.com/dan_abramov/status/1633574036767662080

Upvote for state machine

 [ask me anything about React Server Components](https://twitter.com/dan_abramov/status/1631641431742857216)


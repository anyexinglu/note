
[Visualizing nextTick and Promise Queues in Node.js Event Loop](https://www.builder.io/blog/NodeJS-visualizing-nextTick-and-promise-queues)

### 一、验证 Demo：

1、执行代码
```js
process.nextTick(() => console.log("this is process.nextTick 1"));
process.nextTick(() => {
  console.log("this is process.nextTick 2");
  process.nextTick(() =>
    console.log("this is the inner next tick inside next tick")
  );
});
process.nextTick(() => console.log("this is process.nextTick 3"));

Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
Promise.resolve().then(() => {
  console.log("this is Promise.resolve 2");
  process.nextTick(() =>
    console.log("this is the inner next tick inside Promise then block")
  );
});
Promise.resolve().then(() => console.log("this is Promise.resolve 3"));
```
执行结果为：
```js
this is process.nextTick 1
this is process.nextTick 2
this is process.nextTick 3
this is the inner next tick inside next tick
this is Promise.resolve 1
this is Promise.resolve 2
this is Promise.resolve 3
this is the inner next tick inside Promise then block
```

（1）nextTick 队列中的所有回调都在 promise 队列中的所有回调之前执行。所以如果 nextTick 队列执行过程中，新出现 nextTick 任务，也会先执行完再执行 promise 队列。

原文解释：

> All callbacks in the nextTick queue are executed before all callbacks in promise queue.

（2）promise 队列执行过程中，不会被新出现的 nextTick 抢占优先级

其中，在输出 this is Promise.resolve 2 之后，其中的 nextTick 推入 nextTick 队列。

因为此时顺序仍然是 promise 队列，所以会先执行 this is Promise.resolve 3，直到 promise 队列清空了。

Node 会再次检查，微队列有没有新的 callback，发现还有一个 nextTick，于是输出了 this is the inner next tick inside Promise then block。

原文解释：

> First, “Promise.resolve 1” is logged, followed by “Promise.resolve 2”. However, a function is added to the nextTick queue with a call to process.nextTick(). Despite this, control remains in the promise queue and continues executing other callback functions. We then get Promise.resolve 3, and at this point, the promise queue is empty.
Node will once again check if there are new callbacks in the microtask queues. Since there is one in the nextTick queue, it executes that, which results in our last log statement.

此外，使用 process.nextTick() 时要谨慎。过度使用此方法可能会导致事件循环中断，从而阻止队列的其余部分运行。即使使用大量的 nextTick() 调用，I/O 队列也不能执行自己的回调。

官方文档建议使用 process.nextTick() 有两个主要原因：处理错误或允许回调在调用堆栈展开后但事件循环继续之前运行。在使用 process.nextTick() 时，请确保明智地使用它。
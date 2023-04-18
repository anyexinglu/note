
[Visualizing the I/O Queue in the Node.js Event Loop](https://www.builder.io/blog/visualizing-nodejs-io-queue)

### 一、验证 Demo：

1、执行代码

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
```

结果为：

```js
this is process.nextTick 1
this is Promise.resolve 1
this is readFile 1
```

说明顺序为：nextTick、promise、I/O

2、执行代码

```js
const fs = require("fs");

setTimeout(() => console.log("this is setTimeout 1"), 0);

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});
```

结果为：

```js
// 第一次：
this is setTimeout 1
this is readFile 1

// 继续输出四次：readFile 可能在前也可能在后
this is readFile 1
this is setTimeout 1
```

说明该情况下，顺序不稳定：timer 队列、I/O

如果传递时间为0毫秒，则间隔设置为 max(1,0)，即 1。这将导致延迟 1 毫秒的 setTimeout。Node.js 似乎遵循类似的实现。当您设置 0 毫秒的延迟时，它将被覆盖为 1 毫秒的延迟。

> This means that if we pass in 0 milliseconds, the interval is set to max(1,0), which is 1. This will result in setTimeout with a 1 millisecond delay. It seems that Node.js follows a similar implementation. When you set a 0 millisecond delay, it is overwritten to a 1 millisecond delay.

在事件循环开始时，Node.js 需要确定 1ms 计时器是否已经结束。如果事件循环在 0.05ms 进入计时器队列，而 1ms 回调还没有排队，则控制转移到 I/O 队列，执行 readFile() 回调。在事件循环的下一次迭代中，将执行计时器队列回调。

反之，如果 CPU 很忙，并且在 1.01 ms 进入计时器队列，计时器将已经过去，回调函数将被执行。控制将继续到 I/O 队列，并且将执行 readFile() 回调。

由于 CPU 繁忙程度的不确定性以及 0ms 延迟被重写为 1ms 延迟，我们永远无法保证 0ms 定时器和 I/O 回调之间的执行顺序。

3、执行代码

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

for (let i = 0; i < 2000000000; i++) {}
```

结果为：

```js
this is process.nextTick 1
this is Promise.resolve 1
this is setTimeout 1
this is readFile 1
```

模拟 CPU 很忙的情况，微任务执行完毕后，先执行了 0ms 定时器然后才是 I/O。

因为当控制进入计时器队列时，setTimeout() 计时器已经结束，并且回调已经准备好执行了。

I/O 队列回调在微任务队列回调和定时器队列回调之后执行。

### 二、结论

实验表明，Input/Output Queue 中的回调是在 Microtask Queue 和 Timer Queue 中的回调之后执行的。当以 0 毫秒的延迟和 I/O 异步方法运行 setTimeout() 时，执行顺序取决于 CPU 的繁忙程度。

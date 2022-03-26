#### 1、以下输出什么？

```js
try {
    Promise.reject('111')
} catch(err) {
    console.log(err)
}
```

<details><summary><b>Answer</b></summary>
<p>

```
Uncaught (in promise) 111
```
啥都 catch 不到。所以要用 promise 的 catch。
如果在 promise.reject 前加上 await 呢？那就会 catch 到（输出 111）。
</p>
</details>
<br/>

#### 2、以下输出什么？

```js
await Promise.reject('111')
console.log(222)
```

<details><summary><b>Answer</b></summary>
<p>

```
Uncaught 111 // console.log(222) 不会执行
```
如果去掉 await 呢？

```
222
Uncaught (in promise) 111
```
</p>
</details>
<br/>

#### 3、以下几个 case 分别输出什么？

```js
// case 1
const x = Promise.reject('111')
x.catch(e => console.warn(`caught on x: ${e}`));

// case 2
async function fn () {
  throw new Error("111");
}
const x = fn()
x.catch(e => console.warn(`caught on x: ${e}`));

// case 3
async function fn () {
  throw new Error("111");
}
const x = await fn()
x.catch(e => console.warn(`caught on x: ${e}`));
```

<details><summary><b>Answer</b></summary>
<p>

case 1:
```
caught on x: 111
```
case 2:
```
caught on x: Error: 111
```
case 3:
```
Uncaught Error: 111
```
</p>
</details>
<br/>

#### 4、输出什么？

```js
async function fn () {
  await new Promise(r => setTimeout(r, 200));
  throw new Error("111");
}

const x = fn()
x.catch(e => console.warn(`caught on x: ${e.message}`));
await x;
```
<details><summary><b>Answer</b></summary>

```
caught on x: 111
Uncaught Error: 111
```

因为每次 await x 都会抛错，去掉 await x 就只会输出caught on x: 111。
</details>
<br/>

#### 5、输出什么？

```js
// window 环境下：
// window.addEventListener("unhandledrejection", event => {
//   console.warn(`unhandledRejection: ${event.reason.message}`);
// });
  
// node 环境下：
const process = require('process')
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', 'reason:', reason)
})

async function main() {
  const p1 = Promise.reject(new Error("111!")); 
  await Promise.resolve();  // 这行代码，注意
  await p1;
}

main().catch(e => console.warn(`caught on main: ${e.message}`));
```

<details><summary><b>Answer</b></summary>
<p>

```
caught on main: 111!
```
为什么？因为 `await Promise.resolve()` 是微任务。

</p>
</details>

题目中的 `await Promise.resolve();  // 这行代码，注意`，分别改成以下，按顺序输出什么？

```js

await Promise.resolve(r => queueMicrotask(r));
await new Promise(r => process.nextTick(r));
await new Promise(r => setTimeout(r, 0));
await new Promise(r => setImmediate(r, 0));
```

<details><summary><b>Answer</b></summary>
<p>

```
caught on main: 111!
caught on main: 111!
先是 Unhandled Rejection at: reason: Error: 111! 然后 Uncaught (in promise) Error: 111!
先是 Unhandled Rejection at: reason: Error: 111! 然后 Uncaught (in promise) Error: 111!
```
每次 Tick 完成后，会触发 Tick 的回调，检查是不是有未处理的错误的 Promise，如果有，则会触发 unhandledRejection 事件。
而微任务都是 Tick 没执行完就由 main catch 住，所以没到 unhandledRejection。

更多细节，详见：[Node.js内部是如何捕获异步错误的？](https://zhuanlan.zhihu.com/p/62210238)。

理解微任务宏任务：[jsv9000](https://www.jsv9000.app/?continueFlag=c5873e6868c78e95e688cf10f05ff5fb)

</p>
</details>

#### 6、输出什么？

```js
window.addEventListener("unhandledrejection", event => {
  console.warn(`unhandledRejection: ${event.reason.message}`);
});

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fn() {
  await delay(100);
  throw new Error("111");
}

async function main() {
  try {
    const p1 = await fn();
    await delay(200);
  }
  catch(e) {
    console.warn(`caught inside main: ${e.message}`);
  }
}

main().catch(e => console.warn(`caught on main: ${e.message}`));
```

<details><summary><b>Answer</b></summary>
<p>

```
caught inside main: 111
```

</p>
</details>

#### 7、输出什么？

```js
Promise.resolve().then(() => console.log('p1'))
Promise.reject()
Promise.resolve().then(() => {
    console.log('p2');
    process.nextTick(() => {
        console.log('t3')
        Promise.resolve().then(() => console.log('p3'))
    })
})
process.on('unhandledRejection', () => {
    console.log('unhandledRejection')
})
```

<details><summary><b>Answer</b></summary>
<p>

```
p1
p2
t3
p3
unhandledRejection
```
每次 Tick 完成后，会执行并清空 Tock 队列，然后检查有没有异步错误，再触发 unhandledRejection 事件的回调。也就是说 unhandledRejection 的回调是在 Tick 和 Tock 队列都被清空之后进行。
</p>
</details>
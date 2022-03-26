#### 1、以下几个 case 分别输出什么？

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

#### 2、输出什么？

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

#### 3、输出什么？

```js
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

```
await Promise.resolve(r => queueMicrotask(r));
await new Promise(r => process.nextTick(r));
await new Promise(r => setTimeout(r, 0));
await new Promise(r => setImmediate(r, 0))
```

<details><summary><b>Answer</b></summary>
<p>

```
caught on main: 111!
caught on main: 111!
Uncaught (in promise) Error: 111!
Uncaught (in promise) Error: 111!
```
为什么？因为前两个是微任务，后两个是宏任务。

</p>
</details>

#### 4、输出什么？

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


[Visualizing the Check Queue in the Node.js Event Loop](https://www.builder.io/blog/visualizing-nodejs-check-queue)

### 一、验证 Demo：

1、执行代码

```js
// index.js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
  setImmediate(() => console.log("this is setImmediate 1"));
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
this is setImmediate 1
```

2、执行代码

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
  setImmediate(() => console.log("this is setImmediate 1"));
	process.nextTick(() =>
	  console.log("this is inner process.nextTick inside readFile")
	);
	Promise.resolve().then(() =>
	  console.log("this is inner Promise.resolve inside readFile")
	);
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
this is inner process.nextTick inside readFile
this is inner Promise.resolve inside readFile
this is setImmediate 1
```

3、执行代码

```js
setImmediate(() => console.log("this is setImmediate 1"));
setImmediate(() => {
  console.log("this is setImmediate 2");
  process.nextTick(() => console.log("this is process.nextTick 1"));
  Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
});
setImmediate(() => console.log("this is setImmediate 3"));
```

结果为：

```js
this is setImmediate 1
this is setImmediate 2
this is process.nextTick 1
this is Promise.resolve 1
this is setImmediate 3
```

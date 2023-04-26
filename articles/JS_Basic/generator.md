[JavaScript 中的 Generator 有什么用？](https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247497274&idx=1&sn=1d1eb44efece94e60b409dbfa73fc927&chksm=c2e10311f5968a073d20e79d7ac8b096f8d9ae54892af2ee379860081ccd36e4fb183b31b6a3&token=236307061&lang=zh_CN#rd)

### 基础用法

1、yield* 表达式

Generator 函数 bar() 中的 yield* foo() 表达式会调用 foo() 函数并将其迭代结果依次返回给 bar() 函数。

```js
function* foo() {
  yield 1;
  yield 2;
}

function* bar() {
  yield* foo(); // Attention 
  yield 3;
}

for (let value of bar()) {
  console.log(value); // 输出 1, 2, 3
}
```


2、数据交互

```js
function* foo() {
  let x = yield;  // 接受外部输入值
  yield x * 2;
}

let gen = foo();
gen.next(); // 启动生成器
gen.next(10); // 传递参数 10，输出 20
```

foo() 函数会在第一次调用 next() 方法时停止在第一个 yield 语句处，等待外部传入的数据。然后，第二次调用 next() 方法时将外部传入的数据作为 yield 表达式的值，再向下执行，直到遇到下一个 yield 表达式返回数据。

### 几种作用

做一些复杂的控制流、状态机的处理时， Generator 还是非常好用的，可以让我们的流程更加清晰。

1、异步编程

执行代码：

```js
function* myGenerator() {
  const result1 = yield new Promise((resolve) => setTimeout(() => resolve('first'), 1000));
  console.log(result1);
  const result2 = yield new Promise((resolve) => setTimeout(() => resolve('second'), 2000));
  console.log(result2);
  const result3 = yield new Promise((resolve) => setTimeout(() => resolve('third'), 3000));
  console.log(result3);
}

generator = myGenerator();
promise = generator.next().value;
promise.then((result) => {console.log('...result1', result); return generator.next(result).value})
  .then((result) => {console.log('...result2', result); return generator.next(222).value})
  .then((result) => {console.log('...result3', result); return generator.next(result).value})
```

结果为：

```js
...result1 first
first
...result2 second
222
...result3 third
third
```

可以看出：result1/2/3 不是 promise 返回的结果，而是 next 的时候赋给他的值


2、控制异步流程

串行执行多个异步任务

```js
function* fetchAllData() {
  const data1 = yield fetch('api1');
  const data2 = yield fetch('api2');
  const data3 = yield fetch('api3');
  return [data1, data2, data3];
}

function run(generator) {
  const iterator = generator();

  function handle(iteratorResult) {
    if (iteratorResult.done) {
      return Promise.resolve(iteratorResult.value);
    }

    return Promise.resolve(iteratorResult.value)
      .then(res => handle(iterator.next(res)));
  }

  return handle(iterator.next());
}

run(fetchAllData).then(data => {
  // 处理所有数据
  console.log(data);
});
```

3、处理大数据节省内存

```js
function* dataGenerator() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

function* processData(data, processFn) {
  for (let item of data) {
    yield processFn(item);
  }
}

const data = dataGenerator();

const processedData = processData(data, item => item * 2);

for (let i = 0; i < 500; i++) {
  console.log(processedData.next().value);
}
```

在处理大的数据集时，如果一次性将所有数据加载到内存中，会造成内存浪费和程序性能下降的问题。使用 Generator 函数可以实现将数据按需处理，逐个读取和转换数据，减少内存占用和提高程序性能。

4、实现状态机

```js
function* stateMachine() {
  let state = 'start';

  while (true) {
    switch (state) {
      case 'start':
        console.log('Enter start state');
        state = yield 'start';
        break;

      case 'middle':
        console.log('Enter middle state');
        state = yield 'middle';
        break;

      case 'end':
        console.log('Enter end state');
        state = yield 'end';
        break;
    }
  }
}

const sm = stateMachine();

console.log(sm.next().value); // Enter start state
console.log(sm.next('middle').value); // Enter middle state
console.log(sm.next('end').value); // Enter end state
```
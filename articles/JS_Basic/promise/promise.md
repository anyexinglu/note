实现 Promise 各种 API

## Promise.resolve

```js
PromiseResolve = (arg) => {
  if (arg instanceOf Promise) {
    return arg
  }
  return new Promise((resolve, reject) => {
    resolve(arg)
  })
}
```

## Promise.reject

```js
PromiseResolve = (arg) => {
  return new Promise((_, reject) => {
    reject(arg)
  })
}
```

## Promise.all

实现方法：

```js
// 方法一：使用 async await
PromiseAll = fns => {
    return new Promise(async (resolve, reject) => {
        const results = []
        for (let i = 0; i < fns.length; i++) {
            const fn = fns[i]
            try {
                // 注意使用注意入参的特殊情况，比如传入包含常量和同步方法。
                // 由于 await 1 = 1, await (() => 1)() = 1，所以没问题。
                results.push(await fn)
            } catch(e) {
                reject(e)
            }
        }
       resolve(results)
    })
}

// 方法二：不使用 async await
PromiseAll = fns => {
    return new Promise((resolve, reject) => {
        const results = []
        fns.forEach((fn) => {
            Promise.resolve(fn).then(res => {
                results[i] = res
                if (results.length === fns.length) resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    })
}
```

用法：

```js
// PromiseAll 用法大概如下：
PromiseAll([promise1, promise2]).then(results => {
    const [result1, result2] = results
    console.log(result1, result2)
}).catch((err) => {})

// 准备一些可能用到的入参：
const resolveTrue = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, 1000)
    })
}
const resolveFalse = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(false)
        }, 1500)
    })
}
const reject111 = () => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(111)
        }, 1500)
    })
}

// Case1: PromiseAll 接收到的 promise 都顺利 resolve，则 resolve 并吐出所有 promise 的返回值
PromiseAll([resolveTrue(), resolveFalse()]).then(console.log)
=> 输出 [true, false]

// Case2: PromiseAll 接收到的 promise 有任何一个 reject，则 reject。
PromiseAll([resolveTrue(), reject111()]).then(console.log)
=> 输出 Uncaught (in promise) 111
```

## PromiseRace

Promise.race() 总是返回第一个结果值（resolved/reject)

```js
PromiseRace = (fns) => {
  return new Promise((resolve, reject) => {
    fns.forEach(fn => {
        Promise.resolve(fn).then(resolve).catch(reject)
    })
  })
}
```

## PromiseAny

Promise.any() 返回的是第一个「成功」的值，这个方法将会忽略掉所有被拒绝的 promise，直到第一个 promise 成功。
如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和 [AggregateError](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 类型的实例。

AggregateError：当多个错误​​需要包装在一个错误中时，该对象表示一个错误。

```js
PromiseAny = (fns) => {
  return new Promise((resolve, reject) => {
      const errors = []
    fns.forEach((fn, i) => {
        fn.then(result => {
            resolve(result)
        }).catch(e => {
            errors.push(e)
            if (i === fns.length -1) {
                reject(new AggregateError(errors, "All promises were rejected"))
            }
        })
    })
  })
}
```

## PromiseAllSettled

Promise.allSettled() 返回所有给定的 promise 都已经 fulfilled 或 rejected 后 的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。

对于每个结果对象，都有一个 status 字符串：
- 如果它的值为 fulfilled，则结果对象上存在一个 value。
- 如果值为 rejected，则存在一个 reason 。value（或 reason ）反映了每个 promise 决议（或拒绝）的值。

如 `Array [Object { status: "fulfilled", value: 3 }, Object { status: "rejected", reason: "foo" }]`。

```js
// 方法一：使用 async await
PromiseAllSettled = fns => {
  const results = []
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < fns.length; i++) {
        try {
            const result = await fns[i]
            results.push({
                status: 'fulfilled',
                value: result
            })
        } catch (e) {
            results.push({
                status: 'rejected',
                reason: e
            })
        }
    }
    resolve(results)
  })
}

// 方法二：不使用 async await
PromiseAllSettled = fns => {
  const results = []
  return new Promise((resolve, reject) => {
    for (let i = 0; i < fns.length; i++) {
        fns[i].then(result => {
            results.push({
                status: 'fulfilled',
                value: result
            })
            if (results.length === fns.length) {
                resolve(results)
            }
        }).catch(e => {
            console.log('...e', e)
            results.push({
                status: 'rejected',
                reason: e
            })
            if (results.length === fns.length) {
                resolve(results)
            }
        })
    }
  })
}
```

## refer

[Promise.resolve](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

今天前同事说有个 flat 的题目让我玩下，我一听就不高兴了，这不是很简单，一个 reduce 递归，把一层层数组都铺开就行（我忘了 flat 有 depth）—— 用校招题考我这许多年的老江湖，是在侮辱我。

对方说题目给你，你试试嘛，于是有了如下题目：

题目：实现一个 flat 方法，接收参数 array 和 depth（默认为 1），按 depth 层级要求拍平数组。
用例如下：
- flat([1, 2, 3, [4, 5]]) // [1,2,3,4,5]
- flat([1, 2, 3, [[4, 5]]]) // [1,2,3,[4,5]]
- flat([1, 2, 3, [[4, 5]]], 2) // [1,2,3,4,5]

由于平时没用到 flat 的 depth，看到这个有点慌，不过缓缓神，我还是实现了 v1 版本代码：

```js
// v1: 借助新函数递归
function flat(array, depth = 1) {
    return help(array, depth, [])
}
function help(array, depth, result) {
    for (let i = 0; i < array.length; i++) {
        let item = array[i]
        if (depth > 0 && Array.isArray(item)) {
            result = result.concat(flat(item, depth - 1))
        } else {
            result.push(item)
        }
    }
    return result
}
```

这同事说，很多社招同学第一个版本就是这样。提示下还有更简单的，我想可以通过 while 来决定，只要拍平的层级没达到 depth 就不终止循环，于是改成了 v2 版本：

```js
// v2: 借助 while 遍历，用 count 来数，当 count 达到 depth 就终止循环
function flat(array, depth = 1) {
    let count = 0
    let result = array
    while (count < depth) {
        for (let i = 0; i < result.length; i++) {
            const item = result[i]
            // 如果是数组，则将此项拍平
            if (Array.isArray(item)) {
                result.splice(i, 1)
                result = [...result, ...item]
            }
        }
        count++
    }
    return result
}

```

同事看完继续说，还有更简单的。我一想那不还是得 reduce 么，可以递归 flat 自己。于是有了 v3 版本：

```js
// v3: 用 reduce，每次递归就将 depth 减 1，如果 depth 大于 0 表示数组项要拍平。
function flat(array, depth = 1) {
    return array.reduce((result, item) => {
        if (depth > 0 && Array.isArray(item)) {
            result = [
                ...result,
                ...flat(item, depth - 1)
            ]
        } else {
            result.push(item)
        }
        return result
    }, [[]])
}
```

同事说很好很好，太优秀了。我以为已经很完美了，追问是不是你心目中的代码？对方说不是，最后给了我 v4 版本：

```js
// v4: 用 reduce
function flat(array, depth = 1) {
    return depth > 0 ? array.reduce((acc, item) => {
        return acc.concat(Array.isArray(item) ? flat(item, depth - 1) : item)
    }, []) : array.slice()
}
```

看来我还是飘了。

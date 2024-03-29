// 1 微任务 cb、2 timer cb、3 微任务cb、4 I/O cb
const fs = require('fs')

Promise.resolve().then(() => console.log('this is Promise.resolve'))

setTimeout(() => {
  console.log('this is setTimeOut cb1')
  Promise.resolve().then(() => console.log('this is Promise.resolve 1'))
}, 0);

setTimeout(() => {
  console.log('this is setTimeOut cb2')
  Promise.resolve().then(() => console.log('this is Promise.resolve 2'))
}, 0);

// /Users/baoerjie/Documents/duoduo/note/articles/node/cbs.webp
fs.readFile('/Users/yangxiayan/Documents/code/note/articles/node/cbs.webp', (err, data) => {
  console.log('this is readFile cb', err, data)
})

// this is Promise.resolve
// this is setTimeOut cb1
// this is Promise.resolve 1
// this is setTimeOut cb2
// this is Promise.resolve 2
// this is readFile cb null。。。
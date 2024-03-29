// 1 微任务 cb、2 timer cb、3 微任务cb

setTimeout(() => console.log('this is setTimeout 1'), 0)
setTimeout(() => {
  console.log('this is setTimeout 2')
  Promise.resolve().then(() => console.log('inner this is Promise.resolve 2'))
}, 0)
setTimeout(() => {
  console.log('this is setTimeout 3')
  Promise.resolve().then(() => console.log('inner this is Promise.resolve 3'))
}, 0)

Promise.resolve().then(() => console.log('this is Promise.resolve 1'))
Promise.resolve().then(() => {
  console.log('this is Promise.resolve 2')
})
Promise.resolve().then(() => console.log('this is Promise.resolve 3'))

// this is Promise.resolve 1
// this is Promise.resolve 2
// this is Promise.resolve 3
// this is setTimeout 1
// this is setTimeout 2
// inner this is Promise.resolve 2
// this is setTimeout 3 // attention
// inner this is Promise.resolve 3
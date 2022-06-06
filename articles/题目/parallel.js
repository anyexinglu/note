// 比如有 100 个任务，需要并发执行（请求接口），最多 5 个，一个完成后安排下一个。
// 当 allTasks 有任务执行完毕后，自动补充任务，始终保持正在执行的任务有 `limitCount`个

// v1 版本（这个版本不满足要求，该版本是五个一起，不是一个个自动补上）
function parallel(allTasks, limitCount) {
  const firstBatchTasks = allTasks.slice(0, limitCount)
  const restBatchTasks = allTasks.slice(limitCount)
  const run = (batchTasks) => {
    const nextBatchTasks = []
    batchTasks.forEach((task) => {
      task().then((res) => {
        console.log('...res', res)
        return res
      }).finally(() => {
        if (restBatchTasks.length) {
          nextBatchTasks.push(restBatchTasks.shift())
          if (nextBatchTasks.length === limitCount || restBatchTasks.length === 0) {
            run(nextBatchTasks)
          }
        }
      })
    })
  }
  run(firstBatchTasks)
}

// v2 版本
function parallel(allTasks, limitCount) {
  const clonedAllTasks = allTasks.map(task => {
    return () => {
      task().then((res) => {
        console.log('...res', res)
        return res
      }).finally(() => {
        if (clonedAllTasks.length) {
          clonedAllTasks.shift()()
        }
      })
    }
  })
  for (let i = 0; i < limitCount; i++) {
    clonedAllTasks.shift()()
  }
}

const start = Date.now()
allTasks = (new Array(7)).fill().map((item, index) => {
    return () => new Promise((resolve) => {
        setTimeout(() => {
            resolve([index, Date.now() - start])
        }, 1000)
    })
})
parallel(allTasks, 5)
// 结果
// ...res (2) [0, 1000]
// ...res (2) [1, 1001]
// ...res (2) [2, 1002]
// ...res (2) [3, 1002]
// ...res (2) [4, 1002]
// ...res (2) [5, 2007] // 可以看出是新的一批了
// ...res (2) [6, 2007]
// 状态定义
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

const isFunction = fn => typeof fn === 'function'

class MyPromise {
  value
  status
  resolveCallbacks = []
  rejectCallbacks = []

  constructor(callback) {
    this.status = STATUS.PENDING
    let called = false

    const resolve = value => {
      if (called) return
      called = true
      this.value = value
      this.status = STATUS.FULFILLED

      setTimeout(() => {
        this.resolveCallbacks.forEach(cb => {
          cb(this.value)
        })
      })
    }

    const reject = reason => {
      if (called) return
      called = true
      this.value = reason
      this.status = STATUS.REJECTED

      setTimeout(() => {
        this.rejectCallbacks.forEach(cb => {
          cb(this.value)
        })
      })
    }

    try {
      callback(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  // static resolve(val) {
  //   return new MyPromise((resolve, reject) => {
  //     resolve(val)
  //   })
  // }

  // static reject(val) {
  //   return new MyPromise((resolve, reject) => {
  //     // console.error('Uncaught (in promise)', val)
  //     reject(val)
  //   })
  // }

  then(onfulfilled, onrejected) {
    // if (!)
    const resolveCallbacks = this.resolveCallbacks
    const rejectCallbacks = this.rejectCallbacks

    if (this.status === STATUS.PENDING) {
      return new MyPromise((resolve, reject) => {
        // 解决值穿透
        onfulfilled = isFunction(onfulfilled)
          ? onfulfilled
          : value => {
              return value
            }
        onrejected = isFunction(onrejected)
          ? onrejected
          : reason => {
              throw reason
            }
        resolveCallbacks.push(innerValue => {
          try {
            const value = onfulfilled(innerValue)
            resolve(value)
          } catch (e) {
            reject(e)
          }
        })
        rejectCallbacks.push(innerValue => {
          try {
            const value = onrejected(innerValue)
            resolve(value)
          } catch (e) {
            reject(e)
          }
        })
      })
    } else {
      const isFullFilled = this.status === STATUS.FULFILLED
      const innerValue = this.value
      return new MyPromise((resolve, reject) => {
        try {
          if (isFullFilled && !isFunction(onfulfilled)) {
            return resolve(innerValue)
          }
          if (!isFullFilled && !isFunction(onrejected)) {
            return reject(innerValue)
          }
          setTimeout(() => {
            if (isFullFilled) {
              resolve(onfulfilled(innerValue))
            } else {
              reject(onrejected(innerValue))
            }
          })
        } catch (e) {
          reject(e)
        }
      })
    }
  }

  catch(onrejected) {
    if (this.status === STATUS.PENDING) {
      this.rejectCallbacks.push(onrejected)
    } else {
    }
  }

  finally(fn) {
    fn()
  }

  all() {}
}

const Reject = (val) => {
  return new MyPromise((resolver, reject) => {
       reject(val)
   })
}

module.exports = { MyPromise }

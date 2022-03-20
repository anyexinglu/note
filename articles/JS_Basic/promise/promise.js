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
      const newPromise = new MyPromise((resolve, reject) => {
        // 2.2.1 Both onFulfilled and onRejected are optional arguments
        if (isFullFilled && !isFunction(onfulfilled)) {
          return resolve(innerValue)
        }
        if (!isFullFilled && !isFunction(onrejected)) {
          return reject(innerValue)
        }
        setTimeout(() => {
          try {
            const x = isFullFilled ? onfulfilled(innerValue) : onrejected(innerValue)
            // 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
            if (x === newPromise) {
              reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
            }
            // 2.3.2 If x is a promise, adopt its state.
            if (x instanceof MyPromise) {
              if (x.status === STATUS.FULFILLED) {
                resolve(x.value)
              } else if (x.status === STATUS.REJECTED) {
                reject(x.value)
              } else {
                x.then(resolve, reject)
              }
            } else {
              // 2.3.3 Otherwise, if x is an object or function.
              if (['object', 'function'].includes(typeof x)) {
                let xThen = x.then
                if (typeof xThen === 'function') {
                  // 2.3.3.3 If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise
                  const newResolve = y => {
                    let called = false
                    try {
                      let yThen = y && y.then
                      // `y` is a thenable
                      if (typeof yThen === 'function') {
                        return yThen.call(y, (val) => { called = true; resolve(val) }, reject)
                      } else {
                        resolve(y)
                      }
                    } catch(e) {
                        if (!called) {
                          reject(e)
                        }
                    }
                  }
                  return xThen.call(x, newResolve, reject)
                }
              }
              resolve(x)
            }
          } catch (e) {
            reject(e)
          }
        })
      })
      return newPromise
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
  return new MyPromise((resolve, reject) => {
       reject(val)
   })
}

const Resolve = (val) => {
  return new MyPromise((resolve, reject) => {
      resolve(val)
   })
}

module.exports = { MyPromise }

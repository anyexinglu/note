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
        const resolve = (value) => {
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
        const reject = (reason) => {
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

    then(onfulfilled, onrejected) {
        // 解决值穿透
        onfulfilled = isFunction(onfulfilled) ? onfulfilled : reason => { throw reason }
        onrejected = isFunction(onrejected) ? onrejected : value => { return value }
        const resolveCallbacks = this.resolveCallbacks
        const rejectCallbacks = this.rejectCallbacks

        if (this.status === STATUS.PENDING) {
            return new MyPromise((resolve, reject) => {
                resolveCallbacks.push((innerValue) => {
                    try {
                        const value = onfulfilled(innerValue)
                        resolve(value)
                    } catch (e) {
                        reject(e)
                    }
                })
                rejectCallbacks.push((innerValue) => {
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
                    const value = isFullFilled ? onfulfilled(innerValue) : onrejected(innerValue)
                    resolve(value)
                } catch (e) {
                    reject(e)
                }
            })
        }
    }

    catch(onrejected) {
        if (this.status === STATUS.PENDING) {
            this.rejectCallbacks.push(onrejected)
        }
        else {

        }
    }

    finally(fn) {
        fn()
    }

    all() {

    }
}


let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(111)
    }, 1500)
})

p.catch(console.log) // 输出 111

let e = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(222)
    }, 1500)
})
e.then(console.log) // 打印：Uncaught (in promise) 222


// https://juejin.cn/post/6945319439772434469
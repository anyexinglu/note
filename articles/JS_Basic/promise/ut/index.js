// z = {
//     then: function (onFulfilled, onRejected) {
//         setTimeout(() => {
//             onFulfilled(1212);
//         }, 10)
//     }
// }
// x = {
//     then: function (onFulfilled, onRejected) {
//        onFulfilled(z);
//        // onFulfilled(33);
//         throw 55
//     }
// }

const { MyPromise } = require("../promise")

// p = Resolve(12).then(res => {
//     return x
// })
// p.then(function (val) {
//     console.log(val)
// });


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

// MyPromise 中 resolveCallbacks、rejectCallbacks 的设计为什么需要是数组？
// 因为 pending 状态下，promise 多次 .then 会推进数组里去
const p = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve(true)
    }, 2000)
});
    
const timesCalled = [0, 0, 0];
const dummy = { dummy: "dummy" }

const strictEqual = (a,b) => console.log(a === b)

p.then(function onFulfilled() {
    strictEqual(++timesCalled[0], 1);
});

setTimeout(function () {
    p.then(function onFulfilled() {
        strictEqual(++timesCalled[1], 1);
    });
}, 50);

setTimeout(function () {
    p.then(function onFulfilled() {
        strictEqual(++timesCalled[2], 1);
    });
}, 100);

setTimeout(function () {
    MyPromise.resolve(dummy);
}, 150);
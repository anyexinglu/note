// https://juejin.cn/post/7061588533214969892#heading-37

let obj = {
  value: "vortesnail",
};
function fn(...args) {
  console.log(this.value, ...args);
}
// 实现手写 apply 方法
Function.prototype.myBind = function (context, ...args1) {
  // 判断调用对象
  if (typeof this !== "function") {
    throw new Error("Type error");
  }
  let ctx = context || globalThis
  let self = this
  return function Fn(...args2) {
    let args = [...args1, ...args2]
    // this 是 Fn 的实例，说明是 new 出来的
    return self.apply(this instanceof Fn ? this : ctx, args)
  }
}


//   // 判断调用对象
//   if (typeof this !== "function") {
//     throw new Error("Type error");
//   }
//   // 首先获取参数
//   let result = null;
//   // 判断 context 是否传入，如果没有传就设置为 window
//   context = context || window;
//   // 将被调用的方法设置为 context 的属性，用 Symbol 的原因：防止与提供新的 this 值的属性重复
//   let fn = Symbol('fn')
//   // this 即为我们要调用的方法
//   context[fn] = this
//   // 执行要被调用的方法
//   result = context[fn](...args)
//   // 删除手动增加的属性方法
//   delete context[fn]
//   // 将执行结果返回
//   return result;
// }
fn.bind(obj, 1, 2)(3) // "vortesnail 1 2"

fn.myBind(obj, 1, 2)(3) // "vortesnail 1 2 3"

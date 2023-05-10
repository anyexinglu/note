// https://juejin.cn/post/7061588533214969892#heading-41

function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

function newOperator(self, ...args) {
    if (typeof self !== 'function') {
        return console.error('type error')
    }
    const obj = new Object();
    obj.__proto__ = self.prototype;

    const result = self.apply(obj, args)
    return result && (typeof result === 'object' || typeof result === 'function') ? result : obj
}
// 验证
// newOperator(构造函数，初始化参数) 如：
x = newOperator(Car, 'Eagle', 'Talon TSi', 1993);   // 获到 Car {make: 'Eagle', model: 'Talon TSi', year: 1993}

console.log(x)
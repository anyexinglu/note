
const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      fn(...args)
    }, ms);
  };
}

// 试验：
let person = {
  name: 'John',
  age: 23,
  getName: debounce(function() {
    console.log(this, this.name); // globalThis undefined
  }, 50)
}
person.getName();
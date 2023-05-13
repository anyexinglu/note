function debounce(fn, delay) {
  let timer = null;
  console.log('this1', this, this.name);
  return function() {
    let context = this,
      args = arguments;
    console.log('this2',  this,this.name);
    clearTimeout(timer);
    timer = setTimeout(function() {
       console.log('this3', this, this.name);
       fn.apply(context, args);
      //  fn(...args);
    }, delay);
  }
}

// 试验：
let person = {
  name: 'John',
  age: 23,
  getName: debounce(function() {
    console.log(this, this.name); // Timeout undefined
  }, 50)
}
person.getName();
person.getName();
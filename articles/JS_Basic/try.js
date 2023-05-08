var obj = {
  value: "vortesnail",
};

function fn() {
  console.log(this.value);
}

// fn.call(obj); // vortesnail

Function.prototype.myCall = function myCall(obj) {
  obj.fn = this
  let result = obj.fn()
  delete obj.fn
}

fn.myCall(obj)
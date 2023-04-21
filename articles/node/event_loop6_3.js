//index.js
setImmediate(() => console.log("this is setImmediate 1"));
setImmediate(() => {
  console.log("this is setImmediate 2");
  process.nextTick(() => console.log("this is process.nextTick 1"));
  Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
});
setImmediate(() => console.log("this is setImmediate 3"));

// this is setImmediate 1
// this is setImmediate 2
// this is process.nextTick 1
// this is Promise.resolve 1
// this is setImmediate 3
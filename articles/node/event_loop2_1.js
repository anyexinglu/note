// index.js
process.nextTick(() => console.log("this is process.nextTick 1"));
process.nextTick(() => {
  console.log("this is process.nextTick 2");
  process.nextTick(() =>
    console.log("this is the inner next tick inside next tick")
  );
});
process.nextTick(() => console.log("this is process.nextTick 3"));

Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
Promise.resolve().then(() => {
  console.log("this is Promise.resolve 2");
  process.nextTick(() =>
    console.log("this is the inner next tick inside Promise then block")
  );
});
Promise.resolve().then(() => console.log("this is Promise.resolve 3"));


// this is process.nextTick 1
// this is process.nextTick 2
// this is process.nextTick 3
// this is the inner next tick inside next tick
// this is Promise.resolve 1
// this is Promise.resolve 2
// this is Promise.resolve 3
// this is the inner next tick inside Promise then block

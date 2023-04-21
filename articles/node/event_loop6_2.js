const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
  setImmediate(() => console.log("this is setImmediate 1"));
	process.nextTick(() =>
	  console.log("this is inner process.nextTick inside readFile")
	);
	Promise.resolve().then(() =>
	  console.log("this is inner Promise.resolve inside readFile")
	);
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

for (let i = 0; i < 2000000000; i++) {}


// this is process.nextTick 1
// this is Promise.resolve 1
// this is setTimeout 1
// this is readFile 1
// this is inner process.nextTick inside readFile
// this is inner Promise.resolve inside readFile
// this is setImmediate 1

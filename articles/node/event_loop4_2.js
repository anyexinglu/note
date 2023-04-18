
// index.js
const fs = require("fs");

setTimeout(() => console.log("this is setTimeout 1"), 0);

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

// 第一次：
// this is setTimeout 1
// this is readFile 1

// 继续输出四次：
// this is readFile 1
// this is setTimeout 1
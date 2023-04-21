// index.js
setTimeout(() => console.log("this is setTimeout 1"), 0);
setImmediate(() => console.log("this is setImmediate 1"));

// 结果的顺序不稳定

// Due to the uncertainty of CPU usage, we can never guarantee the execution order between a 0ms timer and a check queue callback. For a more in-depth explanation, refer to experiment 7.
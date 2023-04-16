setTimeout(() => console.log("this is setTimeout 1"), 1000);
setTimeout(() => console.log("this is setTimeout 2"), 500);
setTimeout(() => console.log("this is setTimeout 3"), 0);

// this is setTimeout 3
// this is setTimeout 2
// this is setTimeout 1

// Timer queue callbacks are executed in a first-in, first-out (FIFO) order.

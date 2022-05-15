console.log(1)
new Promise(function(resolve){
    console.log(2);
    resolve(3);
    console.log(4);
}).then(res => {
    console.log(res)
    process.nextTick(() => {
        console.log('in nextTick')
    });
    Promise.resolve(5).then(res => {
        console.log(res)
    })
    setImmediate(() => {
        console.log('in setImmediate');
    });
})
setTimeout(() => {
    console.log('in setTimeout')
}, 0)
console.log(6)
  
// const process = require('process')
// process.on('unhandledRejection', (reason, promise) => {
//   console.log('Unhandled Rejection at:', 'reason:', reason)
// })

//   function delay(ms) {
//     return new Promise(r => setTimeout(r, ms));
//   }
  
//   async function fn() {
//     await delay(100);
//     throw new Error("111");
//   }
  
//   async function main() {
//     try {
//       const p1 = await fn();
//       await delay(200);
//     }
//     catch(e) {
//       console.warn(`caught inside main: ${e.message}`);
//     }
//   }
  
//   main().catch(e => console.warn(`caught on main: ${e.message}`));
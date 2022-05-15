setImmediate(function(){
  console.log(1);
},0);
setTimeout(function(){
  console.log(2);
},0);
new Promise(function(resolve){
  console.log(3);
  resolve();
  console.log(4);
}).then(function(){
  console.log(5);
});
console.log(6);
console.log(8);
  
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
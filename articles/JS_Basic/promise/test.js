const { MyPromise } = require('./promise')
const promisesAplusTests = require('promises-aplus-tests')

const adapter = {
  deferred() {
    const did = {}
    did.promise = new MyPromise((resolver, reject) => {
      did.resolve = resolver
      did.reject = reject
    })
    return did
  }
}
promisesAplusTests(adapter, function (err) {
  // All done; output is in the console. Or check `err` for number of failures.
})

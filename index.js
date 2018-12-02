const fs = require('fs')
const {NodeVM, VMScript} = require('vm2')

module.exports = {
  require: (modulePath, functionName, {console, context} = {}) => {
    const vm = new NodeVM({sandbox: {console, context}})
    const requiredModule = vm.run(new VMScript(fs.readFileSync(modulePath)))
    return functionName ? requiredModule[functionName] : requiredModule
  }
}
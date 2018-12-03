const fs = require('fs')
const {NodeVM, VMScript} = require('vm2')

const scriptCache = {}

const getScript = modulePath => {
  if (!scriptCache[modulePath]) {
    scriptCache[modulePath] = new VMScript(fs.readFileSync(modulePath))
  }

  return scriptCache[modulePath]
}

module.exports = {
  require: (modulePath, functionName, {console, context} = {}) => {
    const vm = new NodeVM({
      sandbox: {
        console,
        context,
      },
      require: {
        external: true,
        context: 'sandbox'
      }
    })
    const requiredModule = vm.run(getScript(modulePath), modulePath)
    return functionName ? requiredModule[functionName] : requiredModule
  }
}
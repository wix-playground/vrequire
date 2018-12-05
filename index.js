const fs = require('fs')
const {NodeVM, VMScript, VMError} = require('vm2')

const scriptCache = {}

const getScript = modulePath => {
  if (!scriptCache[modulePath]) {
    scriptCache[modulePath] = new VMScript(fs.readFileSync(modulePath))
  }

  return scriptCache[modulePath]
}

const wrappedError = (error, modulePath) => {
  if (error instanceof VMError) {
    const [,requiredModuleName] = error.message.match(/The module '(.+)' is not whitelisted in VM/)
    throw new Error(`Cannot find module '${requiredModuleName}' from '${modulePath}'`)
  } else {
    error
  }
}

module.exports = {
  require: (modulePath, {console, context, whitelistedNodeModules} = {}) => {
    const vm = new NodeVM({
      sandbox: {
        console,
        context,
      },
      require: {
        external: whitelistedNodeModules || true,
        context: 'sandbox'
      }
    })
    try {
      return vm.run(getScript(modulePath), modulePath)
    } catch (error) {
      throw wrappedError(error, modulePath)
    }
  }
}
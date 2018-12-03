const moduleWithContextUse = require('./module-with-context-use')

module.exports = {
  getContextKeyNested: contextKey => moduleWithContextUse.getContextKey(contextKey)
}
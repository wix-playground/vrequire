
module.exports = {
  getContextKey: key => Promise.resolve(context[key])
}
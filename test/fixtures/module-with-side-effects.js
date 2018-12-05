module.exports = {
  setContextKey: (key, value) => {
    context[key] = value
  },
  getContextKey: key => context[key]
}

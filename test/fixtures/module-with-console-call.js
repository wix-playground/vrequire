
module.exports = {
  func: returnValue => {
    console.log(returnValue)

    return Promise.resolve(returnValue)
  }
}
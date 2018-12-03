const path = require('path')
const fs = require('fs')
const vrequire = require('../')
const randomString = require('randomstring')

const modulePath = name => path.join(__dirname, './fixtures', name)

describe('vrequire', () => {
  test('requiring a module exporting a function', () => {
    const randomValue = randomString.generate()

    const fn = vrequire.require(modulePath('module-exporting-a-function.js'))

    expect(fn(randomValue)).toEqual(randomValue)
  })

  test('requiring a module exporting an object', () => {
    const randomValue = randomString.generate()

    const fn = vrequire.require(modulePath('module-exporting-an-object.js'), 'func')

    expect(fn(randomValue)).toEqual(randomValue)
  })

  test('requiring a module exporting an object, passing alternative console implementation', () => {
    const randomValue = randomString.generate()
    const alternativeConsole = {log: jest.fn()}

    const fn = vrequire.require(modulePath('module-with-console-call.js'), 'func', {console: alternativeConsole})

    expect(fn(randomValue)).toEqual(randomValue)
    expect(alternativeConsole.log).toHaveBeenCalledWith(randomValue)
  })

  test('requiring a module exporting an object, passing context', () => {
    const aKey = randomString.generate()
    const aValue = randomString.generate()
    const fn = vrequire.require(modulePath('module-with-context-use.js'), 'getContextKey', {context: {[aKey]: aValue}})

    expect(fn(aKey)).toEqual(aValue)
  })

  test('requiring a module exporting an async function', () => {
    const aValue = randomString.generate()
    const fn = vrequire.require(modulePath('module-with-async-function.js'), 'getPromise')

    expect(fn(aValue)).resolves.toEqual(aValue)
  })

  test('a module is compiled only once and cached', () => {
    const aValue = randomString.generate()
    const moduleToBeChangedPath = modulePath('module-to-be-changed.js')

    fs.writeFileSync(moduleToBeChangedPath, 'module.exports = value => value')
    const fn1 = vrequire.require(moduleToBeChangedPath)

    fs.writeFileSync(moduleToBeChangedPath, 'module.exports = value => value.repeat(2)')
    const fn2 = vrequire.require(moduleToBeChangedPath)

    expect(fn1(aValue)).toEqual(fn2(aValue))
  })

  test('a module requiring other modules', () => {
    const aKey = randomString.generate()
    const aValue = randomString.generate()
    const fn = vrequire.require(modulePath('module-requiring-another.js'), 'getContextKeyNested', {context: {[aKey]: aValue}})

    expect(fn(aKey)).toEqual(aValue)
  })
})

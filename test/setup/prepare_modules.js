const fs = require('fs-extra')
const path = require('path')

const fakeModuleDirs = ['test-module', 'test-module-2'].map(p => path.join(__dirname, '..', '..', 'node_modules', p))

fakeModuleDirs.forEach(dir => {
  if (fs.existsSync(dir)){
    fs.removeSync(dir)
  }
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'index.js'), 'module.exports = value => ({[value]: value})')
})
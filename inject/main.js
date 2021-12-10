const path = require('path'),
  fs = require('fs')
const vm = require('vm'),
  v8 = require('v8')
v8.setFlagsFromString('--no-lazy')
v8.setFlagsFromString('--no-flush-bytecode')

delete process.env.NODE_OPTIONS

const main_locs = [
  path.join('app.asar', 'main.js'), // Official Krunker.io Client
  path.join('app.asar', 'app', 'main.js'), // idkr lol
]

global.__moddirname = __dirname
const Module = require('module')
;((_compile) => {
  Module.prototype._compile = function (content, filename) {
    let is_main = main_locs.some((p) => filename.endsWith(p))
    if (is_main) {
      let hook_content = fs.readFileSync(
        path.join(__dirname, 'main_hook.js'),
        'utf8'
      )
      content = hook_content + '\n' + content
      Module.prototype._compile = _compile // hide ourselves after we do our hook
    }
    return _compile.apply(this, arguments)
  }
})(Module.prototype._compile)

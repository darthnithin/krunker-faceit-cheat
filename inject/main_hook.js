;(() => {
  // BrowserWindow inject code taken from powercord
  // commit linked is before they switched from GPLv3 because they were upset their code was used in another project LOL
  // true open-source pioneers
  // adapted from https://github.com/powercord-org/powercord/blob/aef81ef2f8a46b0ca2e9228bf5af264a713eda1a/src/patcher.js#L58-L104

  const log = console.log.bind(null, '[steaminj]')
  const electron = require('electron')
  const electronPath = require.resolve('electron')
  const fs = require('fs')
  const path = require('path')
  const os = require('os')

  const { BrowserWindow } = electron

  class BrowserWindow_ extends BrowserWindow {
    constructor(params, ...args) {
      params.webPreferences.devTools = true
      if (!!params.webPreferences.preload) {
        let origPreloadPath = params.webPreferences.preload

        let preload =
          fs.readFileSync(path.join(__moddirname, 'renderer.js'), 'utf8') +
          `\n\nrequire('${origPreloadPath
            .replace(/\\/gi, '\\\\')
            .replace(/'/gi, "\\'")}');`

        let p = fs.mkdtempSync(path.join(os.tmpdir(), 'inj'))
        let prPa = path.join(p, 'preload.js')
        fs.writeFileSync(prPa, preload, 'utf8')
        params.webPreferences.preload = prPa
      }

      let win = super(params, ...args)

      /*win.on('ready-to-show', () => {
        win.webContents.openDevTools({ mode: 'undocked' })
      })*/ // for devtools

      return win
    }
  }

  const electronExports = new Proxy(electron, {
    get(target, prop) {
      switch (prop) {
        case 'BrowserWindow':
          return BrowserWindow_
        default:
          return target[prop]
      }
    },
  })

  delete require.cache[electronPath].exports
  require.cache[electronPath].exports = electronExports
})()
